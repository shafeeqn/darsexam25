"use client";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import students from "../../data/students.json";
import subjects from "../../data/subjects.json";
import dars from "../../data/dars.json";

type Student = {
  "Registration Number": string;
  Name: string;
  "Subject 1 Code": string;
  "Subject 2 Code": string;
  Institution: string;
  "Institution Place": string;
  "Mark 1"?: string | number;
  "Mark 2"?: string | number;
};

type DarsEntry = {
  Dars: string;
  Place: string;
  DarsCode: string;
};

const page = () => {
  const [username, setUsername] = useState<string>("");
  const [isStudent, setIsStudent] = useState<boolean>(true);
  const [selectedSubject, setSelectedSubject] = useState<string>("I1");
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("I");
  const darsesToSubject: any = [];
  const categories = [
    {
      shortName: "I",
      fullName: "Ibthidaiyya",
    },
    {
      shortName: "M",
      fullName: "Muthawassitha",
    },
    {
      shortName: "A",
      fullName: "Aliya",
    },
  ];

  useEffect(() => {
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

  // Helper to normalize subject code
  const normalizeSubjectCode = (code: string | undefined): string => {
    if (!code) return "";
    return code.replace("-0", "").replace("-", "");
  };

  const getDarsCode = (institution: string, place: string) => {
    type NewType_1 = DarsEntry;

    type NewType = NewType_1;

    const found = (dars as NewType[]).find(d =>
      d.Dars === institution ||
      d.Dars.toLowerCase() === institution.toLowerCase() ||
      (d.Place && place && d.Place.toLowerCase() === place.toLowerCase())
    );
    return found ? found.DarsCode : "";
  }

  function getDarsesToSubject() {
    (students as Student[])
      .filter(
        (student) =>
          normalizeSubjectCode(student["Subject 1 Code"]) === selectedSubject ||
          normalizeSubjectCode(student["Subject 2 Code"]) === selectedSubject
      )
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
              (students as Student[]).filter(
                (student) =>
                  normalizeSubjectCode(student["Subject 1 Code"]) === selectedSubject ||
                  normalizeSubjectCode(student["Subject 2 Code"]) === selectedSubject
              ).length
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
            className={`uppercase border-black border-2 p-1 border-dotted rounded-md gap-1`}
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
        <p className="w-60 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
          Name
        </p>
        <p className="w-20 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
          Dars
        </p>
        <p className="w-28 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
          Mark
        </p>
      </div>
      {(students as Student[])
        .filter(
          (student) =>
            normalizeSubjectCode(student["Subject 1 Code"]) === selectedSubject ||
            normalizeSubjectCode(student["Subject 2 Code"]) === selectedSubject
        )
        .map((student, index) => (
          <div key={index} className="flex w-full justify-center">
            <p className="w-20 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              {index + 1}
            </p>
            <p className="w-32 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              {student["Registration Number"]}
            </p>
            <p className="w-60 text-left line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              {student.Name}
            </p>
            <p className="w-20 text-left line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              {getDarsCode(student.Institution, student["Institution Place"])}
            </p>
            <p className="w-28 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              {" "}
            </p>
          </div>
        ))}
    </div>
  );
};

export default page;
