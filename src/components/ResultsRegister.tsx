'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { motion, AnimatePresence } from 'framer-motion';
import { getResultsForInstitution, type ResultRecord } from '@/app/admin/results/actions';
import { Loader2, Printer, Search, Building2, Layers, MapPin, ChevronDown, X } from 'lucide-react';

type Institution = {
    institution: string;
    place?: string;
};

interface ResultsRegisterProps {
    institutions: Institution[];
}

export default function ResultsRegister({ institutions }: ResultsRegisterProps) {
    // --- Core State ---
    const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
    const [selectedSection, setSelectedSection] = useState('');

    // --- Data State ---
    const [allRecords, setAllRecords] = useState<ResultRecord[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<ResultRecord[]>([]);
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
                (inst.place && inst.place.toLowerCase().includes(lowerQuery))
        );
    }, [sortedInstitutions, searchQuery]);

    // --- Click Outside to Close Dropdown ---
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
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
        setAllRecords([]);
        setFilteredRecords([]);
        setLoading(true);
        setError(null);

        try {
            const data = await getResultsForInstitution(inst.institution);
            setAllRecords(data);
            setFilteredRecords(data);
        } catch (err) {
            console.error(err);
            setError('Could not load result data.');
        } finally {
            setLoading(false);
        }
    };

    const handleClearSelection = () => {
        setSelectedInstitution(null);
        setSearchQuery('');
        setAllRecords([]);
        setFilteredRecords([]);
        setSelectedSection('');
        setIsDropdownOpen(true);
    };

    const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const section = e.target.value;
        setSelectedSection(section);
        if (!section) {
            setFilteredRecords(allRecords);
        } else {
            setFilteredRecords(allRecords.filter((r) => r.Section === section));
        }
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current || null,
        documentTitle: `Results_${selectedInstitution?.institution.replace(/\s+/g, '_')}_${selectedSection || 'All'}`,
    });

    const availableSections = useMemo(
        () => Array.from(new Set(allRecords.map((r) => r.Section))).filter(Boolean).sort(),
        [allRecords]
    );

    return (
        <div className="bg-white/50 rounded-2xl p-2 md:p-6 font-sans">

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

                                {/* Clear Button */}
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
                            {filteredRecords.length > 0 && !loading && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 font-medium transition-all active:scale-95"
                                >
                                    <Printer className="w-4 h-4" />
                                    <span>Print Results</span>
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
                    <span className="text-sm font-medium">Fetching result records...</span>
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
                    <p className="text-sm font-medium">Search for an institution above to view the results</p>
                </div>
            )}

            {/* ================= PAPER PREVIEW ================= */}
            {!loading && filteredRecords.length > 0 && (
                <div className="flex justify-center pb-20 overflow-x-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white shadow-2xl border border-gray-200 relative"
                        style={{ width: '297mm', minHeight: '210mm' }}
                    >
                        {/* Print Area */}
                        <div ref={componentRef} className="p-[10mm]">
                            <style jsx global>{`
                @media print {
                  @page { size: A4 landscape; margin: 10mm; }
                  body { background: white; -webkit-print-color-adjust: exact; }
                  nav, header, footer, .no-print { display: none !important; }
                }
              `}</style>

                            <div className="text-center mb-4 pb-2 border-b-2 border-gray-900">
                                <div className="flex flex-col items-center">
                                    <img src="/Logo.png" alt="Logo" className="h-16 w-auto mb-2 object-contain" />
                                    <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                                        {selectedInstitution?.institution}
                                    </h1>

                                    <div className="w-full flex justify-between items-end mt-4">
                                        <div className="text-left">
                                            {selectedSection && (
                                                <div className="inline-block px-4 py-1 border-2 border-gray-900 font-bold text-sm">
                                                    SECTION: {selectedSection}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end text-sm">
                                            <span className="font-bold text-lg">EXAMINATION RESULTS 2025</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <table className="w-full border-collapse border border-gray-900 text-[10px] sm:text-[11px] leading-tight">
                                <thead>
                                    <tr className="bg-gray-100 print:bg-gray-100">
                                        <th className="border border-gray-900 p-1 md:p-1.5 text-center w-8 font-bold">No</th>
                                        <th className="border border-gray-900 p-1 md:p-1.5 text-left font-bold w-16">Reg No</th>
                                        <th className="border border-gray-900 p-1 md:p-1.5 text-left font-bold w-48">Student Name</th>
                                        <th className="border border-gray-900 p-1 md:p-1.5 text-center font-bold w-12">Sub 1 Code</th>
                                        <th className="border border-gray-900 p-1 md:p-1.5 text-right font-bold w-48" dir="rtl">Subject 1</th>
                                        <th className="border border-gray-900 p-1 md:p-1.5 text-center font-bold w-10">Mark 1</th>
                                        <th className="border border-gray-900 p-1 md:p-1.5 text-center font-bold w-12">Sub 2 Code</th>
                                        <th className="border border-gray-900 p-1 md:p-1.5 text-right font-bold w-48" dir="rtl">Subject 2</th>
                                        <th className="border border-gray-900 p-1 md:p-1.5 text-center font-bold w-10">Mark 2</th>
                                        <th className="border border-gray-900 p-1 md:p-1.5 text-center font-bold w-10">Total</th>
                                        <th className="border border-gray-900 p-1 md:p-1.5 text-center font-bold w-16">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecords.map((r, i) => (
                                        <tr key={r['Register No'] || i}>
                                            <td className="border border-gray-900 p-1 text-center">{i + 1}</td>
                                            <td className="border border-gray-900 p-1 font-mono font-medium">{r['Register No']}</td>
                                            <td className="border border-gray-900 p-1 font-medium uppercase">{r['Name of student']}</td>
                                            <td className="border border-gray-900 p-1 text-center font-mono">{r['Subject 1 Code']}</td>
                                            <td className="border border-gray-900 p-1 text-right font-arabic" dir="rtl">{r['Subject 1']}</td>
                                            <td className="border border-gray-900 p-1 text-center font-medium">{r['Mark 1'] ?? '-'}</td>
                                            <td className="border border-gray-900 p-1 text-center font-mono">{r['Subject 2 Code']}</td>
                                            <td className="border border-gray-900 p-1 text-right font-arabic" dir="rtl">{(r as Record<string, any>)['Subject 2 '] || (r as Record<string, any>)['Subject 2'] || '-'}</td>
                                            <td className="border border-gray-900 p-1 text-center font-medium">{r['Mark 2'] ?? '-'}</td>
                                            <td className="border border-gray-900 p-1 text-center font-bold bg-gray-50 print:bg-gray-50">{r['Total'] ?? '-'}</td>
                                            <td className="border border-gray-900 p-1 text-center font-bold">{r['Status']}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
