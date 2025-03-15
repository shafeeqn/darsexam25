"use client";

import subjects from "../../data/subjects.json";
import students from "../../data/students.json";
import dars from "../../data/dars.json";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/navigation";

export default function Page() {
    const [category, setCategory] = useState("I");
    const [username, setUsername] = useState<string>("");
    const router = useRouter();
    const componentPDF = useRef(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setUsername(JSON.parse(user));
        } else {
            router.push("/login");
        }
    }, [router]);

    const darsStudents = students.filter(
        (student) => student.DarsCode === username
    );

    function calculateFinalGrade(mark1: number, mark2: number) {
        const calculateGrade = (mark: number) => {
            if (mark >= 97 && mark <= 100) return "TOP PLUS";
            if (mark >= 80 && mark <= 96) return "DISTINCTION";
            if (mark >= 60 && mark <= 79) return "FIRST CLASS";
            if (mark >= 50 && mark <= 59) return "SECOND CLASS";
            if (mark >= 25 && mark <= 49) return "THIRD CLASS";
            return "NOT PROMOTED";
        };

        return mark1 <= mark2 ? calculateGrade(mark1) : calculateGrade(mark2);
    }

    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: "PDF",
    });

    const categories = [
        { shortName: "I", fullName: "Ibthidaiyya" },
        { shortName: "M", fullName: "Muthawassitha" },
        { shortName: "A", fullName: "Aliya" },
    ];

    return (
        <div className="flex flex-col justify-center items-center my-5" ref={componentPDF}>
            <div className="flex flex-col justify-center items-center uppercase print:hidden">
                <img src="/Logo.png" alt="Logo" className="w-[30%]" />
            </div>
            <div className="flex flex-col justify-center items-center border-2 border-dotted border-black p-1 rounded-lg mt-5">
                <p className="text-center text-lg text-black font-semibold rounded-lg p-1">
                    {dars.find((drs) => drs.DarsCode === username)?.Dars}
                </p>
                <p className="text-center text-md text-black font-semibold rounded-t-lg p-1 -mt-2">
                    {dars.find((drs) => drs.DarsCode === username)?.Place}
                </p>
                <p className="text-center text-sm text-white bg-black font-semibold rounded-lg p-1 border-dotted border-2 border-white -mt-1">
                    {dars.find((drs) => drs.DarsCode === username)?.DarsCode}
                </p>
            </div>
            <div className="flex w-full justify-center gap-2 text-xs font-semibold print:hidden">
                <button
                    onClick={() => setCategory("all")}
                    className={`uppercase border-black border-2 p-1 border-dotted rounded-md ${category === "all" ? "bg-black text-white" : ""}`}
                >
                    ALL
                </button>
                {categories.map((ctgry) => (
                    <button
                        key={ctgry.shortName}
                        onClick={() => setCategory(ctgry.shortName)}
                        className={`uppercase border-black border-2 p-1 border-dotted rounded-md ${category === ctgry.shortName ? "bg-black text-white" : ""}`}
                    >
                        {ctgry.fullName}
                    </button>
                ))}
                <button onClick={generatePDF} className="uppercase border-black border-2 p-1 border-dotted rounded-md">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 font-bold"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </button>
            </div>
            {darsStudents.filter(student => category === "all" || student.Category === category).length > 0 ? (
                <>
                    <div className="flex w-full justify-center mt-3 h-6">
                        <p className="w-[70px] text-center font-semibold border-[1px] border-black text-sm">Reg No</p>
                        <p className="w-60 text-center font-semibold border-[1px] border-black text-sm">Name</p>
                        <p className="w-10 text-center font-semibold border-[1px] border-black text-xs">Cat</p>
                        <p className="w-36 text-center font-semibold border-[1px] border-black text-xs">Grade</p>
                    </div>
                    {darsStudents.filter(student => category === "all" || student.Category === category).map((student, index) => (
                        <div key={index} className="flex w-full justify-center h-6">
                            <p className="w-[70px] text-center font-semibold border-[1px] border-black text-sm">{student.StudentId}</p>
                            <p className="w-60 text-left font-semibold pl-1 border-[1px] border-black text-sm">{student.Name}</p>
                            <p className="w-10 text-center font-semibold border-[1px] border-black text-sm">{student.Category}</p>
                            <p className="w-36 text-left pl-2 font-semibold border-[1px] border-black text-xs">
                                {calculateFinalGrade(parseInt(student["Mark 1"]?.toString() || "0"), parseInt(student["Mark 2"]?.toString() || "0"))}
                            </p>
                        </div>
                    ))}
                </>
            ) : (
                <p className="text-center text-black mt-3 font-semibold">
                    No Students Found in {categories.find(ctgry => ctgry.shortName === category)?.fullName || ""} category
                </p>
            )}
        </div>
    );
}
