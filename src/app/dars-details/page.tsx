"use client";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Students from "../../data/students.json";
import Subjects from "../../data/subjects.json";
import dars from "../../data/dars.json";
import { useRouter } from "next/navigation";

const page = () => {
  const [username, setUsername] = useState<string>("");
  const [admin, setAdmin] = useState<string>("")
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
    // localStorage check
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedCtx = JSON.parse(user);
        setUsername(parsedCtx);
        setAdmin(parsedCtx);
      } else {
        router.push("/login");
      }
    }
  }, []);

  // Helper to normalize subject code (e.g. "I-07" -> "I7")
  const normalizeSubjectCode = (code: string | undefined): string => {
    if (!code) return "";
    return code.replace("-0", "").replace("-", "");
  };

  const getCategory = (student: any) => {
    const s1 = normalizeSubjectCode(student["Subject 1 Code"]);
    if (s1) return s1.charAt(0);
    return "";
  }

  // Find the dars object for the current username (DarsCode)
  const currentDars = dars.find((d) => d.DarsCode === username);

  // Filter students based on Institution matching the current Dars
  // Note: Matching might be tricky if names differ. Using direct match for now as per admin page logic.
  const students = (Students as any[]).filter((student) => {
    if (!currentDars) return false;
    return student.Institution === currentDars.Dars;
  });

  // console.log(students);
  const subjectId: string[] = [];
  students.forEach((student) => {
    const s1 = normalizeSubjectCode(student["Subject 1 Code"]);
    const s2 = normalizeSubjectCode(student["Subject 2 Code"]);
    if (s1 && !subjectId.includes(s1)) {
      subjectId.push(s1);
    }
    if (s2 && !subjectId.includes(s2)) {
      subjectId.push(s2);
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
          {currentDars?.Dars}
        </p>
        {
          admin === 'JMADMIN' && <select
            id="my-select"
            value={username}
            onChange={
              (e) => {
                setUsername(e.target.value)
              }
            }
            style={{ marginLeft: "10px", padding: "5px" }}
            className="
        "
          >
            <option value="" disabled>
              Select an option
            </option>
            {dars?.map((option) => (
              <option key={option.DarsCode} value={option.DarsCode}>
                {option.DarsCode} {option.Dars}
              </option>
            ))}
          </select>
        }
        <p className="text-center text-xl text-black font-semibold rounded-t-lg p-1 -mt-2">
          {currentDars?.Place}
        </p>
        <p className="text-center text-lg text-white bg-black font-semibold rounded-lg p-1 border-dotted border-2 border-white -mt-1">
          {currentDars?.DarsCode}
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
          className={`uppercase border-black border-2 p-1 border-dotted rounded-md ${category === "all" && `bg-black text-white`
            }`}
        >
          ALL
        </button>
        {categories.map((ctgry) => (
          <button
            key={ctgry.shortName}
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
      {students.filter(
        category === "all"
          ? (student) => student
          : (student) => getCategory(student) === category
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
              Hajar
            </p>
            <p className="w-60 text-center line-clamp-1 font-semibold border-[1px] border-black text-sm">
              Subject 2
            </p>
            <p className="w-12 text-center line-clamp-1 font-semibold pt-1 border-[1px] border-black text-xs">
              Hajar
            </p>
          </div>
          {students
            .filter(
              category === "all"
                ? (student) => student
                : (student) => getCategory(student) === category
            )
            .map((student, index) => (
              <div key={index} className="flex w-full justify-center h-6">
                <p className="w-[70px] text-center line-clamp-1 font-semibold border-[1px] border-black text-sm">
                  {student["Registration Number"]}
                </p>
                <p className="w-60 text-left line-clamp-1 font-semibold pl-1 border-[1px] border-black text-sm">
                  {student.Name}
                </p>
                <p className="w-10 text-center line-clamp-1 font-semibold border-[1px] border-black text-sm">
                  {getCategory(student)}
                </p>
                <p
                  className="w-60 text-right line-clamp-1 font-semibold pr-1 border-[1px] border-black text-sm font-arabic"
                  dir="rtl"
                >
                  {subjects.map((subject) => {
                    if (subject.Id === normalizeSubjectCode(student["Subject 1 Code"])) {
                      return subject.Name;
                    }
                  })}{" "}
                </p>
                <p className="w-12 text-center line-clamp-1 font-semibold border-[1px] border-black text-sm"></p>
                <p
                  className="w-60 text-right line-clamp-1 font-semibold pr-1 border-[1px] border-black text-sm font-arabic"
                  dir="rtl"
                >
                  {subjects.map((subject) => {
                    if (subject.Id === normalizeSubjectCode(student["Subject 2 Code"])) {
                      return subject.Name;
                    }
                  })}{" "}
                </p>
                <p className="w-12 text-center line-clamp-1 font-semibold border-[1px] border-black text-sm"></p>
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
