'use client'
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import studentsData from "../../data/students.json";
import subjects from "../../data/subjects.json";
import institutionsData from "../../data/institutions.json";
import darsAuthData from "../../data/dars.json";

// Define Types
type Student = {
  "Registration Number": string;
  Name: string;
  Section: string;
  "Subject 1 Code": string;
  "Subject 2 Code": string;
  Institution: string;
  Place: string;
  "Mark 1"?: string | number;
  "Mark 2"?: string | number;
};

type DarsAuth = {
  Dars: string;
  Place: string;
  DarsCode: string;
};

const students = studentsData as unknown as Student[];
const institutions = institutionsData as unknown as string[];
const darsAuth = darsAuthData as unknown as DarsAuth[];

const page = () => {
  const [username, setUsername] = useState<string>("");
  const [isStudent, setIsStudent] = useState<boolean>(true);
  const [selectedSubject, setSelectedSubject] = useState<string>("I1");
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("I");
  const [selectedDars, setSelectedDars] = useState<string>("");
  const darsesToSubject: any = [];
  const categories = [
    {
      shortName: "I",
      fullName: "Ibthidaiyya",
    },
    {
      shortName: "M",
      fullName: "Muthawassitwa",
      startId: "M1",
    },
    {
      shortName: "A",
      fullName: "Aliya",
      startId: "A1",
    },
  ];

  const sectionMap: { [key: string]: string } = {
    I: "المرحلة الإبتدائية",
    M: "المرحلة المتوسطة",
    A: "المرحلة العالية",
  };

  useEffect(() => {
    // localStorage might not be present on server
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) setUsername(JSON.parse(user));
    }
  }, []);

  const componentPDF = useRef();

  const generatePDF = useReactToPrint({
    content: () => componentPDF?.current || null,
    documentTitle: "PDF",
  });

  // Helper to normalize subject code (e.g. "I-07" -> "I7", "I-11" -> "I11")
  const normalizeSubjectCode = (code: string | undefined) => {
    if (!code) return "";
    return code.replace("-0", "").replace("-", "");
  };

  const getDarsCode = (institution: string, place: string) => {
    // Try to find by direct match or partial match in darsAuth (for codes)
    const found = darsAuth.find(d =>
      d.Dars === institution ||
      d.Dars.toLowerCase() === institution.toLowerCase() ||
      (d.Place && place && d.Place.toLowerCase() === place.toLowerCase())
    );
    return found ? found.DarsCode : "";
  }

  const currentDars = darsAuth.find(d => d.DarsCode === username);

  const filteredStudents = students.filter(student => {
    // 1. Filter by Section
    const sectionMatch = student.Section === sectionMap[category];

    // 2. Filter by Institution
    // If logged in as Dars, strictly filter by that Dars.
    // Otherwise, check if a Dars is selected in the dropdown.
    let institutionMatch = true;
    if (currentDars) {
      institutionMatch = student.Institution === currentDars.Dars;
    } else if (selectedDars) {
      institutionMatch = student.Institution === selectedDars;
    }

    return sectionMatch && institutionMatch;
  });

  function getDarsesToSubject() {
    darsesToSubject.length = 0;
    filteredStudents
      .map((student) =>
        darsesToSubject.includes(student.Institution)
          ? null
          : darsesToSubject.push(student.Institution)
      );
    return darsesToSubject;
  }

  return (
    <div
      className="flex flex-col my-5 items-center uppercase"
      ref={componentPDF as any}
    >
      <div className="flex flex-col justify-center items-center  uppercase print:hidden">
        <img src="/Logo.png" alt="" className="w-[30%]" />
      </div>
      <div className="flex flex-col justify-center items-center border-2 border-dotted border-black p-1 rounded-lg mt-5">

        {!currentDars && (
          <select
            className="text-center text-md text-black font-semibold rounded-lg p-1 font-arabic border-b-2 border-dotted border-black mb-2 remove-arrow w-full"
            onChange={(e) => setSelectedDars(e.target.value)}
            value={selectedDars}
          >
            <option value="">All Dars</option>
            {institutions.map((dars, index) => (
              <option key={index} value={dars}>
                {dars}
              </option>
            ))}
          </select>
        )}

        <select
          className="text-center text-2xl text-black font-semibold rounded-lg p-1 font-arabic remove-arrow"
          onChange={(e) => setSelectedSubject(e.target.value)}
          value={selectedSubject}
        >
          {subjects
            .filter((subject) => subject.Id.startsWith(category))
            .map((subject) => (
              <option key={subject.Id} value={subject.Id} dir="rtl">
                {subject.Name}
              </option>
            ))}
        </select>
        <div className="flex w-full justify-center gap-2 text-xs font-semibold print:hidden mt-3">
          {categories.map((ctgry) => (
            <button
              key={ctgry.shortName}
              onClick={() => {
                setCategory(ctgry.shortName);
                if (ctgry.shortName === "I") setSelectedSubject("I1");
                else if (ctgry.shortName === "M") setSelectedSubject("M1");
                else if (ctgry.shortName === "A") setSelectedSubject("A1");
              }}
              className={`uppercase border-black border-2 p-1 border-dotted rounded-md ${category === ctgry.shortName && `bg-black text-white`
                }`}
            >
              {ctgry.fullName}
            </button>
          ))}
        </div>
        <div className="flex flex-col justify-center items-center uppercase">
          <p className="text-center text-black font-semibold rounded-t-lg border-dotted p-1 text-2xl">
            {
              categories.find((ctgry) => {
                return ctgry.shortName === category;
              })?.fullName as any
            }
          </p>
        </div>
        <div className="flex flex-col justify-center items-center uppercase">
          <p className="flex justify-center items-center text-base font-semibold  uppercase border-black bg-white text-black border-2 px-1 py-0.5 border-dotted rounded-md gap-1">
            students:
            {
              filteredStudents.length
            }{" "}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center uppercase mt-2">
          <p className="flex justify-center items-center text-base font-semibold  uppercase border-black bg-white text-black border-2 px-1 py-0.5 border-dotted rounded-md gap-1">
            Dars:{getDarsesToSubject().length}
          </p>
        </div>
        <div className="flex w-full justify-center gap-2 text-xs font-semibold print:hidden mt-2">
          <button
            onClick={() => generatePDF()}
            className={`flex justify-center items-center  uppercase border-white bg-black text-white border-2 p-1.5 border-dotted rounded-md gap-1`}
          >
            Download
          </button>
        </div>
      </div>
      <div className="flex w-full justify-center mt-5">
        <p className="w-20 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
          SL NO
        </p>
        <p className="w-32 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
          Reg No
        </p>
        <p className="w-96 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
          Name
        </p>
     
        <p className="w-28 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
          Mark
        </p>
      </div>
      {filteredStudents
        .map((student, index) => (
          <div key={index} className="flex w-full justify-center">
            <p className="w-20 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              {index + 1}
            </p>
            <p className="w-32 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              {student["Registration Number"]}
            </p>
            <p className="w-96 text-left line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              {student.Name}
            </p>
            <p className="w-28 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              {normalizeSubjectCode(student["Subject 1 Code"]) === selectedSubject ? student["Mark 1"] : student["Mark 2"]}
            </p>
          </div>
        ))}
    </div>
  );
};

export default page;
