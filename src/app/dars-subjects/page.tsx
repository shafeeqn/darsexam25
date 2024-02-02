"use client";

import subjects from "../../data/subjects.json";
import students from "../../data/students.json";
import dars from "../../data/dars.json";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
export default function page() {
  const [selectedDars, setSelectedDars] = useState("MLP01");
  const [selectedDistrict, setSelectedDistrict] = useState("MLP");
  const [category, setCategory] = useState("I");
  const darsStudents = students.filter(
    (student) => student.DarsCode === selectedDars
  );

  const componentPDF = useRef();

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
      ref={componentPDF as any}
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
          >
            {dars
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
            className={`uppercase border-black border-2 p-1 border-dotted rounded-md ${
              category === "all" && `bg-black text-white`
            }`}
          >
            ALL
          </button>
          {categories.map((ctgry) => (
            <button
              onClick={() => {
                setCategory(ctgry.shortName);
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
        <div className="flex w-full justify-center gap-2 text-xs font-semibold print:hidden">
          <button
            onClick={() => generatePDF()}
            className={`flex justify-center items-center  uppercase border-white bg-black text-white border-2 p-1.5 border-dotted rounded-md gap-1`}
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
      {subjects
        .filter(
          category === "all"
            ? (subject) => subject
            : (subject) => subject.Id[0] === category
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
                    student.Subject1 === subject.Id ||
                    student.Subject2 === subject.Id
                ).length > 0 ?  darsStudents.filter(
                  (student) =>
                    student.Subject1 === subject.Id ||
                    student.Subject2 === subject.Id
                ).length : "-"
              }
            </p>
          </div>
        ))}
    </div>
  );
}
