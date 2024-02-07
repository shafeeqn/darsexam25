"use client";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Students from "../../data/students.json";
import Subjects from "../../data/subjects.json";
import dars from "../../data/dars.json";
import { useRouter } from "next/navigation";

const page = () => {
  const [username, setUsername] = useState<string>("");
  const [isStudent, setIsStudent] = useState<boolean>(true);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("I");
  const router = useRouter();
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
    setUsername(JSON.parse(localStorage.getItem("user") as string));
    !localStorage.getItem("user") && router.push("/login");
  }, []);

  const students = Students.filter((student) => student.DarsCode == username);
  console.log(students);
  const subjectId: any = [];
  students.map((student) => {
    if (!subjectId.includes(student.Subject1 as never)) {
      subjectId.push(student.Subject1 as never);
    }
    if (!subjectId.includes(student.Subject2 as never)) {
      subjectId.push(student.Subject2 as never);
    }
  });
  console.log(subjectId);

  const subjects = Subjects.filter((subject) => subjectId.includes(subject.Id));
  console.log(subjects);

  const componentPDF = useRef();

  const generatePDF = useReactToPrint({
    content: () => componentPDF?.current || null,
    documentTitle: "PDF",
  });

  return (
    <div
      className="flex flex-col my-5 items-center uppercase"
      ref={componentPDF as any}
    >
      <div className="flex flex-col justify-center items-center  uppercase print:hidden">
        <img src="/Logo.png" alt="" className="w-[30%]" />
      </div>
      <div className="flex flex-col justify-center items-center border-2 border-dotted border-black p-1 rounded-lg mt-5">
        <p className="text-center text-3xl text-black font-semibold rounded-lg p-1">
          {dars.find((drs) => drs.DarsCode === username)?.Dars}
        </p>
        <p className="text-center text-xl text-black font-semibold rounded-t-lg p-1 -mt-2">
          {dars.find((drs) => drs.DarsCode === username)?.Place}
        </p>
        <p className="text-center text-lg text-white bg-black font-semibold rounded-lg p-1 border-dotted border-2 border-white -mt-1">
          {dars.find((drs) => drs.DarsCode === username)?.DarsCode}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center mt-3 uppercase print:opacity-100 opacity-0">
        <p className="text-center text-black font-semibold rounded-t-lg border-dotted p-1 text-2xl">
          {category === "all"
            ? "ALL CATEGORIES"
            : (categories.find((ctgry) => {
                return ctgry.shortName === category;
              })?.fullName as any)}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center  uppercase print:hidden -mt-7">
        <p className="text-center text-black font-semibold rounded-t-lg border-dotted p-1 text-2xl">
          Student Details
        </p>
      </div>
      <div className="flex w-full justify-center gap-2 text-xs font-semibold print:hidden">
        <button
          onClick={() => setCategory("all")}
          className={`uppercase border-black border-2 p-1 border-dotted rounded-md ${
            category === "all" && `bg-black text-white`
          }`}
        >
          ALL
        </button>
        {categories.map((ctgry) => (
          <button
            onClick={() => setCategory(ctgry.shortName)}
            className={`uppercase border-black border-2 p-1 border-dotted rounded-md ${
              category === ctgry.shortName && `bg-black text-white`
            }`}
          >
            {ctgry.fullName}
          </button>
        ))}
        <button
          onClick={() => generatePDF()}
          className={`uppercase border-black border-2 p-1 border-dotted rounded-md `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 font-bold"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </button>
      </div>
      {students.filter(
        category === "all"
          ? (student) => student
          : (student) => student.Category === category
      ).length > 0 ? (
        <>
          <div className="flex w-full justify-center mt-3">
            <p className="w-[70px] text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              Reg No
            </p>
            <p className="w-60 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              Name
            </p>
            <p className="w-10 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-xs">
              Cat
            </p>
            <p className="w-60 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              Subject 1
            </p>
            <p className="w-12 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-xs">
              Haj 1
            </p>
            <p className="w-60 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              Subject 2
            </p>
            <p className="w-12 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-xs">
              Haj 2
            </p>
          </div>
          {students
            .filter(
              category === "all"
                ? (student) => student
                : (student) => student.Category === category
            )
            .map((student, index) => (
              <div key={index} className="flex w-full justify-center">
                <p className="w-[70px] text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
                  {student.StudentId}
                </p>
                <p className="w-60 text-left line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
                  {student.Name}
                </p>
                <p className="w-10 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
                  {student.Category}
                </p>
                <p
                  className="w-60 text-right line-clamp-1 font-semibold pr-2 border-[1px] border-black text-md font-arabic"
                  dir="rtl"
                >
                  {subjects.map((subject) => {
                    if (subject.Id === student.Subject1) {
                      return subject.Name;
                    }
                  })}{" "}
                </p>
                <p className="w-12 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm"></p>
                <p
                  className="w-60 text-right line-clamp-1 font-semibold pr-2 border-[1px] border-black text-md font-arabic"
                  dir="rtl"
                >
                  {subjects.map((subject) => {
                    if (subject.Id === student.Subject2) {
                      return subject.Name;
                    }
                  })}{" "}
                </p>
                <p className="w-12 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm"></p>
              </div>
            ))}
        </>
      ) : (
        <p className="text-center text-black mt-3 font-semibold">
          No Students Found in{" "}
          {
            categories.find((ctgry) => {
              return ctgry.shortName === category;
            })?.fullName as any
          }{" "}
          category
        </p>
      )}
    </div>
  );
};

export default page;
