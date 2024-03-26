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

    function calculateFinalGrade(mark1: number, mark2: number) {
        const calculateGrade = (mark: any) => {
            if (mark >= 97 && mark <= 100) {
                return "Top Plus";
            } else if (mark >= 80 && mark <= 96) {
                return "Distinction";
            } else if (mark >= 60 && mark <= 79) {
                return "First Class";
            } else if (mark >= 50 && mark <= 59) {
                return "Second Class";
            } else if (mark >= 35 && mark <= 49) {
                return "Third Class";
            } else {
                return "Not Promoted";
            }
        };
        const grade1 = calculateGrade(mark1);
        const grade2 = calculateGrade(mark2);

        // if (grade1 === grade2) {
        //     return grade1;
        // } else if (grade1 === "Not Promoted" || grade2 === "Not Promoted") {
        //     return "Not Promoted";
        // } else {
        //     const order = ["Top Plus", "Distinction", "First Class", "Second Class", "Third Class"];
        //     return order.indexOf(grade1) < order.indexOf(grade2) ? grade2 : grade1;
        // }
        if (mark1 === mark2) {
            return grade1;
        } else if (mark1 < mark2) {
            return grade1;
        } else if (mark2 < mark1) {
            return grade2;
        } else {
            return "Not Promoted"
        }
    }

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
            <div className="flex flex-col justify-center items-center border-2 border-dotted border-black p-1 rounded-lg mt-5 print:hidden">
                <div className="flex w-full gap-2 ">
                    <select
                        className=" text-center text-md text-black font-semibold rounded-lg p-1 remove-arrow w-1/4 border-2 border-dotted border-black uppercase"
                        onChange={(e) => {
                            setSelectedDistrict(e.target.value);
                            console.log(e.target.value);

                            setSelectedDars(e.target.value === "TSR" || e.target.value === "KSD" ? e.target.value + "02" : e.target.value + "01");
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
                        className=" text-center text-md text-black font-semibold rounded-lg p-1 remove-arrow w-3/4 border-2 border-dotted border-black uppercase"
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
            </div>
            <div className="flex flex-col justify-center items-center border-2 border-dotted border-black p-1 rounded-lg mt-5">
                <p className="text-center text-lg text-black font-semibold rounded-lg p-1">
                    {dars.find((drs) => drs.DarsCode === selectedDars)?.Dars}
                </p>
                <p className="text-center text-md text-black font-semibold rounded-t-lg p-1 -mt-2">
                    {dars.find((drs) => drs.DarsCode === selectedDars)?.Place}
                </p>
                <p className="text-center text-sm text-white bg-black font-semibold rounded-lg p-1 border-dotted border-2 border-white -mt-1">
                    {dars.find((drs) => drs.DarsCode === selectedDars)?.DarsCode}
                </p>
            </div>
            <div className="flex flex-col justify-center items-center  uppercase print:hidden">
                <p className="text-center text-black font-semibold rounded-t-lg border-dotted p-1 text-2xl">
                    Result Page
                </p>
            </div>
            <div className="flex w-full justify-center gap-2 text-xs font-semibold print:hidden">
                <button
                    onClick={() => setCategory("all")}
                    className={`uppercase border-black border-2 p-1 border-dotted rounded-md ${category === "all" && `bg-black text-white`
                        }`}
                >
                    ALL
                </button>
                {categories.map((ctgry) => (
                    <button
                        onClick={() => setCategory(ctgry.shortName)}
                        className={`uppercase border-black border-2 p-1 border-dotted rounded-md ${category === ctgry.shortName && `bg-black text-white`
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
            {darsStudents
                .filter(
                    category === "all"
                        ? (student) => student
                        : (student) => student.Category === category
                ).length > 0 ? (
                <>
                    <div className="flex w-full justify-center mt-3 h-6">
                        <p className="w-[70px] text-center line-clamp-1 font-semibold border-[1px] border-black text-sm">
                            Reg No
                        </p>
                        <p className="w-60 text-center line-clamp-1 font-semibold border-[1px] border-black text-sm">
                            Name
                        </p>
                        <p className="w-10 text-center line-clamp-1 font-semibold pt-1 border-[1px] border-black text-xs">
                            Cat
                        </p>
                        <p className="w-60 text-center line-clamp-1 font-semibold border-[1px] border-black text-sm">
                            Subject 1
                        </p>
                        <p className="w-12 text-center line-clamp-1 font-semibold pt-1 border-[1px] border-black text-xs">
                            Mark 1
                        </p>
                        <p className="w-60 text-center line-clamp-1 font-semibold border-[1px] border-black text-sm">
                            Subject 2
                        </p>
                        <p className="w-12 text-center line-clamp-1 font-semibold pt-1 border-[1px] border-black text-xs">
                            Mark 2
                        </p>
                        <p className="w-36 text-center line-clamp-1 font-semibold pt-1 border-[1px] border-black text-xs">
                            Grade
                        </p>
                    </div>
                    {darsStudents
                        .filter(
                            category === "all"
                                ? (student) => student
                                : (student) => student.Category === category
                        )
                        .map((student, index) => (
                            <div key={index} className="flex w-full justify-center h-6">
                                <p className="w-[70px] text-center line-clamp-1 font-semibold border-[1px] border-black text-sm">
                                    {student.StudentId}
                                </p>
                                <p className="w-60 text-left line-clamp-1 font-semibold pl-1 border-[1px] border-black text-sm">
                                    {student.Name}
                                </p>
                                <p className="w-10 text-center line-clamp-1 font-semibold border-[1px] border-black text-sm">
                                    {student.Category}
                                </p>
                                <p
                                    className="w-60 text-right line-clamp-1 font-semibold pr-1 border-[1px] border-black text-sm font-arabic"
                                    dir="rtl"
                                >
                                    {subjects.map((subject) => {
                                        if (subject.Id === student.Subject1) {
                                            return subject.Name;
                                        }
                                    })}{" "}
                                </p>
                                <p className="w-12 text-center line-clamp-1 font-semibold border-[1px] border-black text-sm">{student["Mark 1"] as string}</p>
                                <p
                                    className="w-60 text-right line-clamp-1 font-semibold pr-1 border-[1px] border-black text-sm font-arabic"
                                    dir="rtl"
                                >
                                    {subjects.map((subject) => {
                                        if (subject.Id === student.Subject2) {
                                            return subject.Name;
                                        }
                                    })}{" "}
                                </p>
                                <p className="w-12 text-center line-clamp-1 font-semibold border-[1px] border-black text-sm">{student["Mark 2"] as string}</p>
                                <p className="w-36 text-left pl-2 line-clamp-1 font-semibold pt-1 border-[1px] border-black text-xs">
                                    {calculateFinalGrade(parseInt(student["Mark 1"]), parseInt(student["Mark 2"]))}
                                </p>
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
}
