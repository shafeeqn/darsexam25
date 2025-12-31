"use client";

import subjects from "../../data/subjects.json";
import students from "../../data/students.json";
import dars from "../../data/dars.json";
import subjectsData from "../../data/subjects.json";
import studentsData from "../../data/students.json";
import darsData from "../../data/dars.json";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

interface Student {
  DarsCode: string;
  Institution: string;
  "Subject 1 Code"?: string;
  "Subject 2 Code"?: string;
  // Add other properties of a student if needed
}

interface Dars {
  DarsCode: string;
  Dars: string; // The full name of the Dars institution
  // Add other properties of a Dars if needed
}

interface Subject {
  Id: string;
  Name: string;
  // Add other properties of a subject if needed
}

export default function page() {
  const [selectedDars, setSelectedDars] = useState("MLP01");
  const [selectedDistrict, setSelectedDistrict] = useState("MLP");
  const [category, setCategory] = useState("I");

  // Helper to normalize subject code (e.g. "I-07" -> "I7")
  const normalizeSubjectCode = (code: string | undefined): string => {
    if (!code) return "";
    return code.replace("-0", "").replace("-", "");
  };

  const currentDarsObj = (darsData as Dars[]).find(d => d.DarsCode === selectedDars);

  const darsStudents = (studentsData as unknown as Student[]).filter(
    (student) => currentDarsObj && student.Institution === currentDarsObj.Dars
  );

  const componentPDF = useRef<HTMLDivElement>(null);

  const generatePDF = useReactToPrint({
    content: () => componentPDF?.current || null,
    documentTitle: "PDF",
  });

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

  const districts = [
    {
      shortName: "MLP",
      fullName: "Malappuram",
    },
    {
      shortName: "PKD",
      fullName: "Palakkad",
    },
    {
      shortName: "TSR",
      fullName: "Trissur",
    },
    {
      shortName: "KSD",
      fullName: "Kasargod",
    },
    {
      shortName: "CLT",
      fullName: "Kozhikode",
    },
    {
      shortName: "KNR",
      fullName: "Kannur",
    },
  ];

  return (
    <div
      className="flex flex-col justify-center items-center my-5"
      ref={componentPDF}
    >
      <div className="flex flex-col justify-center items-center  uppercase print:hidden">
        <img src="/Logo.png" alt="" className="w-[30%]" />
      </div>
      <div className="flex flex-col justify-center items-center border-2 border-dotted border-black p-1 rounded-lg mt-5">
        <div className="flex w-full gap-2">
          <select
            className=" text-center text-lg text-black font-semibold rounded-lg p-1 remove-arrow w-1/4 border-2 border-dotted border-black uppercase"
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              console.log(e.target.value);

              setSelectedDars(e.target.value + "01");
            }}
            value={selectedDistrict}
          >
            {districts.map((district, index) => (
              <option
                key={index}
                value={district.shortName}
                className="uppercase"
              >
                {district.fullName}
              </option>
            ))}
          </select>
          <select
            className=" text-center text-lg text-black font-semibold rounded-lg p-1 remove-arrow w-3/4 border-2 border-dotted border-black uppercase"
            onChange={(e) => setSelectedDars(e.target.value)}
            value={selectedDars}
          >
            {(darsData as Dars[])
              .filter((drs) => drs.DarsCode.slice(0, 3) === selectedDistrict)
              .map((drs, index) => (
                <option key={index} value={drs.DarsCode} className="uppercase">
                  {drs.Dars}
                </option>
              ))}
          </select>
        </div>
        <div className="flex w-full justify-center gap-2 text-xs font-semibold print:hidden mt-3">
          <button
            onClick={() => setCategory("all")}
            className={`uppercase border-black border-2 p-1 border-dotted rounded-md ${category === "all" && `bg-black text-white`
              }`}
          >
            ALL
          </button>
          {categories.map((ctgry) => (
            <button
              key={ctgry.shortName}
              onClick={() => {
                setCategory(ctgry.shortName);
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
              })?.fullName
            }
          </p>
        </div>
        <div className="flex w-full justify-center gap-2 text-xs font-semibold print:hidden">
          <button
            onClick={() => generatePDF()}
            className={`uppercase border-black border-2 p-1 border-dotted rounded-md gap-1`}
          >
            Download
          </button>
        </div>
      </div>
      <div className="flex w-full justify-center mt-3">
        <p className="w-40 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
          Subject Code
        </p>
        <p className="w-80 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
          Name
        </p>
        <p className="w-32 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
          count
        </p>
      </div>
      {(subjectsData as Subject[])
        .filter(
          category === "all"
            ? (subject) => subject
            : (subject) => subject.Id.startsWith(category)
        )
        .map((subject, index) => (
          <div className="flex w-full justify-center" key={index}>
            <p className="w-40 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              {subject.Id}
            </p>
            <p className="w-80 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm font-arabic">
              {subject.Name}
            </p>
            <p className="w-32 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              {
                darsStudents.filter(
                  (student) =>
                    normalizeSubjectCode(student["Subject 1 Code"]) === subject.Id ||
                    normalizeSubjectCode(student["Subject 2 Code"]) === subject.Id
                ).length > 0 ? darsStudents.filter(
                  (student) =>
                    normalizeSubjectCode(student["Subject 1 Code"]) === subject.Id ||
                    normalizeSubjectCode(student["Subject 2 Code"]) === subject.Id
                ).length : "-"
              }
            </p>
          </div>
        ))}
    </div>
  );
}
