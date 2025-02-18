"use client";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import students from "../../data/students.json";
import subjects from "../../data/subjects.json";
import darscode from "../../data/dars.json";

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
      fullName: "Muthawassitwa",
    },
    {
      shortName: "A",
      fullName: "Aliya",
    },
  ];

  useEffect(() => {
    setUsername(JSON.parse(localStorage.getItem("user") as string));
  }, []);

  const componentPDF = useRef();

  const generatePDF = useReactToPrint({
    content: () => componentPDF?.current || null,
    documentTitle: "PDF",
  });

  function getDarsesToSubject() {
    students
      .filter(
        (student) =>
          student.Subject1 === selectedSubject ||
          student.Subject2 === selectedSubject
      )
      .map((student) =>
        darsesToSubject.includes(student.Dars)
          ? null
          : darsesToSubject.push(student.Dars)
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
        >
          {subjects
            .filter((subject) => subject.Id[0] === category)
            .map((subject) => (
              <option key={subject.Id} value={subject.Id} dir="rtl">
                {subject.Name}
              </option>
            ))}
        </select>
        <div className="flex w-full justify-center gap-2 text-xs font-semibold print:hidden mt-3">
          {categories.map((ctgry) => (
            <button
              onClick={() => {
                setCategory(ctgry.shortName);
                setSelectedSubject(ctgry.shortName + "1");
              }}
              className={`uppercase border-black border-2 p-1 border-dotted rounded-md ${
                category === ctgry.shortName && `bg-black text-white`
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
              students.filter(
                (student) =>
                  student.Subject1 === selectedSubject ||
                  student.Subject2 === selectedSubject
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
        <p className="w-60 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
          Name
        </p>
        <p className="w-80 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
          DarsCode
        </p>
        <p className="w-28 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
          Mark
        </p>
      </div>
      {students
        .filter(
          (student) =>
            student.Subject1 === selectedSubject ||
            student.Subject2 === selectedSubject
        )
        .map((student, index) => (
          <div key={index} className="flex w-full justify-center">
            <p className="w-20 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              {index + 1}
            </p>
            <p className="w-32 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              {student.StudentId}
            </p>
            <p className="w-60 text-left line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              {student.Name}
            </p>
            <p className="w-80 text-left line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              {student.DarsCode}
            </p>
            <p className="w-28 text-center line-clamp-1 font-semibold pl-2 border-[1px] border-black text-sm">
              {student.Subject1 === selectedSubject ? student["Mark 1"] : student["Mark 2"] }
            </p>
          </div>
        ))}
    </div>
  );
};

export default page;
