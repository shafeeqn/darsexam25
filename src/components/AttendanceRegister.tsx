'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { motion, AnimatePresence } from 'framer-motion';
import { getStudentsForInstitution, type Student } from '@/app/admin/attendance/actions';
import { Loader2, Printer, Search, Building2, Layers, MapPin, ChevronDown, X } from 'lucide-react';

type Institution = {
  institution: string;
  place?: string;
};

interface AttendanceRegisterProps {
  institutions: Institution[];
}

export default function AttendanceRegister({ institutions }: AttendanceRegisterProps) {
  // --- Core State ---
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [selectedSection, setSelectedSection] = useState('');
  
  // --- Data State ---
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Search/Combobox State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const componentRef = useRef<HTMLDivElement>(null);

  // --- 1. Sort Institutions Alphabetically ---
  const sortedInstitutions = useMemo(() => {
    return [...institutions].sort((a, b) => 
      a.institution.localeCompare(b.institution)
    );
  }, [institutions]);

  // --- 2. Filter Suggestions based on Search ---
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return sortedInstitutions;
    const lowerQuery = searchQuery.toLowerCase();
    return sortedInstitutions.filter(
      (inst) =>
        inst.institution.toLowerCase().includes(lowerQuery) ||
        inst.place?.toLowerCase().includes(lowerQuery)
    );
  }, [sortedInstitutions, searchQuery]);

  // --- Click Outside to Close Dropdown ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        // If user typed something but didn't select, revert to currently selected or clear
        if (selectedInstitution && searchQuery !== selectedInstitution.institution) {
            setSearchQuery(selectedInstitution.institution);
        } else if (!selectedInstitution) {
            setSearchQuery('');
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedInstitution, searchQuery]);

  // --- Handlers ---

  const handleSelectInstitution = async (inst: Institution) => {
    setSelectedInstitution(inst);
    setSearchQuery(inst.institution);
    setIsDropdownOpen(false);
    setSelectedSection('');
    setAllStudents([]);
    setFilteredStudents([]);
    setLoading(true);
    setError(null);

    try {
      const data = await getStudentsForInstitution(inst.institution);
      setAllStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      console.error(err);
      setError('Could not load student data.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedInstitution(null);
    setSearchQuery('');
    setAllStudents([]);
    setFilteredStudents([]);
    setSelectedSection('');
    setIsDropdownOpen(true); // Re-open dropdown so they can pick another
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const section = e.target.value;
    setSelectedSection(section);
    if (!section) {
      setFilteredStudents(allStudents);
    } else {
      setFilteredStudents(allStudents.filter((s) => s.Section === section));
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Attendance_${selectedInstitution?.institution.replace(/\s+/g, '_')}_${selectedSection || 'All'}`,
  });

  const availableSections = useMemo(
    () => Array.from(new Set(allStudents.map((s) => s.Section))).filter(Boolean).sort(),
    [allStudents]
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 text-gray-800 font-sans">
      
      {/* ================= CONTROL PANEL ================= */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-end justify-between">
          
          <div className="flex flex-col md:flex-row gap-6 w-full lg:w-3/4">
            
            {/* --- SMART COMBOBOX (Institution) --- */}
            <div className="w-full relative z-50" ref={searchWrapperRef}>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                <Building2 className="w-3 h-3" /> Select Institution
              </label>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-4 h-4" />
                </div>
                
                <input
                  type="text"
                  placeholder="Type to search institution..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                    if (!e.target.value) setSelectedInstitution(null);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all shadow-sm"
                />

                {/* Clear Button (only shows if something is typed/selected) */}
                {searchQuery && (
                    <button 
                        onClick={handleClearSelection}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full text-gray-400 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                {/* DROPDOWN MENU */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto divide-y divide-gray-50"
                    >
                      {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((inst, idx) => (
                          <button
                            key={`${inst.institution}-${idx}`}
                            onClick={() => handleSelectInstitution(inst)}
                            className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors flex flex-col"
                          >
                            <span className="text-sm font-medium text-gray-800">
                                {inst.institution}
                            </span>
                            {inst.place && (
                                <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3" /> {inst.place}
                                </span>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-sm text-gray-400">
                          No institutions found matching "{searchQuery}"
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* --- SECTION SELECTOR --- */}
            <div className="w-full md:w-1/2 relative z-10">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                <Layers className="w-3 h-3" /> Filter Section
              </label>
              
              <div className="relative">
                <select
                    value={selectedSection}
                    onChange={handleSectionChange}
                    disabled={!selectedInstitution || availableSections.length === 0}
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                    <option value="">All Sections</option>
                    {availableSections.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* --- PRINT ACTION --- */}
          <div className="w-full lg:w-auto flex justify-end">
            <AnimatePresence>
                {filteredStudents.length > 0 && !loading && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 font-medium transition-all active:scale-95"
                >
                    <Printer className="w-4 h-4" />
                    <span>Print Register</span>
                </motion.button>
                )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ================= STATES ================= */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
            <span className="text-sm font-medium">Fetching student records...</span>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-center text-sm">
          {error}
        </div>
      )}

      {!selectedInstitution && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 opacity-40" />
            </div>
            <p className="text-sm font-medium">Search for an institution above to view the register</p>
        </div>
      )}

      {/* ================= PAPER PREVIEW ================= */}
      {!loading && filteredStudents.length > 0 && (
        <div className="flex justify-center pb-20 overflow-x-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-2xl border border-gray-200 relative"
            style={{ width: '210mm', minHeight: '297mm' }}
          >
            {/* Print Area */}
            <div ref={componentRef} className="p-[15mm]">
              <style jsx global>{`
                @media print {
                  @page { size: A4; margin: 10mm; }
                  body { background: white; -webkit-print-color-adjust: exact; }
                  /* Hide web interface elements when printing */
                  nav, header, footer, .no-print { display: none !important; }
                }
              `}</style>

              <div className="text-center mb-8 pb-4 border-b-2 border-gray-900">
                <div className="flex flex-col items-center">
                    <img src="/logo.png" alt="Logo" className="h-20 w-auto mb-4 object-contain" />
                    <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                    {selectedInstitution?.institution}
                    </h1>
                    <p className="text-gray-600 font-medium mt-1">
                    {selectedInstitution?.place}
                    </p>

                    <div className="w-full flex justify-between items-end mt-6">
                        <div className="text-left">
                            {selectedSection && (
                                <div className="inline-block px-4 py-1 border-2 border-gray-900 font-bold text-sm">
                                    SECTION: {selectedSection}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold uppercase tracking-wider mb-1">Dars Code</span>
                            <div className="h-10 w-32 border-2 border-gray-900 bg-gray-50/50"></div>
                        </div>
                    </div>
                </div>
              </div>

              <table className="w-full border-collapse border border-gray-900 text-sm">
                <thead>
                  <tr className="bg-gray-100 print:bg-gray-100">
                    <th className="border border-gray-900 p-2 text-center w-12 font-bold">No</th>
                    <th className="border border-gray-900 p-2 text-left font-bold">Reg No</th>
                    <th className="border border-gray-900 p-2 text-left font-bold">Student Name</th>
                    <th className="border border-gray-900 p-2 text-center w-24 text-xs font-bold uppercase">Subject 1</th>
                    <th className="border border-gray-900 p-2 text-center w-24 text-xs font-bold uppercase">Subject 2</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s, i) => (
                    <tr key={s['Registration Number'] || i}>
                      <td className="border border-gray-900 p-2 text-center">{i + 1}</td>
                      <td className="border border-gray-900 p-2 font-mono font-medium">{s['Registration Number']}</td>
                      <td className="border border-gray-900 p-2 font-medium uppercase">{s['Name']}</td>
                      <td className="border border-gray-900 p-2 h-10" />
                      <td className="border border-gray-900 p-2 h-10" />
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-12 flex justify-between items-end text-sm text-gray-600">
                <div>
                  <p className="font-medium">Total Candidates: <span className="text-black font-bold text-lg">{filteredStudents.length}</span></p>
                </div>
                <div className="text-right">
                  <div className="h-px w-48 bg-gray-900 mb-2" />
                  <p className="font-bold text-xs uppercase tracking-wider">Invigilator Signature</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}