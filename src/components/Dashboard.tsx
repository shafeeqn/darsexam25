"use client";
import { useEffect, useState } from "react";
import students from "../data/students.json";
import subjects from "../data/subjects.json";
import { useRouter } from "next/navigation";

type Student = {
  "Registration Number": string;
  Name: string;
  "Subject 1 Code": string;
  "Subject 2 Code": string;
  Institution: string;
};

export default function Dashboard() {
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


  const router = useRouter();
  const [student, setStudent] = useState<Student | undefined>();

  // Helper to normalize subject code
  const normalizeSubjectCode = (code: string | undefined): string => {
    if (!code) return "";
    return code.replace("-0", "").replace("-", "");
  };

  const getCategory = (student: Student | undefined) => {
    if (!student) return "";
    const s1 = normalizeSubjectCode(student["Subject 1 Code"]);
    if (s1) return s1.charAt(0);
    return "";
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");

      if (!user || user === "") {
        router.push("/login");
        return;
      }

      // Note: user from localStorage might be a plain string or JSON string. 
      // Existing code used JSON.parse. If it's a number/string, JSON.parse works.
      // Assuming user is Registration Number.
      let registrationNumber: string | null = null;
      try {
        const parsed = JSON.parse(user);
        registrationNumber = String(parsed);
      } catch (e) {
        registrationNumber = user;
      }

      if (registrationNumber) {
        const found = (students as unknown as Student[]).find(
          (s) => s["Registration Number"] == registrationNumber
        );
        setStudent(found);
      }
    }
  }, []);

  return (
    // <div className="flex justify-center items-center">
    //   <div>
    //     <h1>Dashboard</h1>
    //     <p>Student Details</p>
    //     <p>Name: {student?.Name}</p>
    //     <p>RegNo: {student?.RegNo}</p>
    //     <p>DarsCode: {student?.DarsCode}</p>
    //     <p>Dars: {student?.Dars}</p>
    //     <p>Place: {student?.Place}</p>
    //     <p>
    //       Category:{" "}
    //       {categories.map((category) => {
    //         if (category.shortName === student?.Category) {
    //           return category.fullName;
    //         }
    //       })}
    //     </p>
    //     <p>
    //       Subject1:{" "}
    //   {subjects.map((subject) => {
    //     if (subject.Id === student?.Subject1) {
    //       return subject.Name;
    //     }
    //   })}
    //     </p>
    //     <p>
    //       Subject2:{" "}
    //       {subjects.map((subject) => {
    //         if (subject.Id === student?.Subject2) {
    //           return subject.Name;
    //         }
    //       })}
    //     </p>
    //   </div>
    // </div>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-4 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          /> */}
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Student Details
        </h2>
      </div>

      <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
        <div>
          <label
            htmlFor="regno"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Exam Register Number{" "}
          </label>
          <div className="mt-0.5">
            <input
              type="text"
              value={student?.["Registration Number"] || ""}
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              disabled
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Name{" "}
          </label>
          <div className="mt-0.5">
            <input
              type="text"
              value={student?.Name || ""}
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              disabled
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="dars"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Dars{" "}
          </label>
          <div className="mt-0.5">
            <input
              type="text"
              value={student?.Institution || ""}
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              disabled
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Category{" "}
          </label>
          <div className="mt-0.5">
            <input
              type="text"
              value={
                categories.find((category) => {
                  return category.shortName === getCategory(student);
                })?.fullName || ""
              }
              className=" uppercase block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              disabled
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="subj1"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Subject 1{" "}
          </label>
          <div className="mt-0.5">
            <input
              type="text"
              value={
                subjects.find((subject) => {
                  return subject.Id === normalizeSubjectCode(student?.["Subject 1 Code"]);
                })?.Name || ""
              }
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              disabled
              dir="rtl"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="subj2"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Subject 2{" "}
          </label>
          <div className="mt-0.5">
            <input
              type="text"
              value={
                subjects.find((subject) => {
                  return subject.Id === normalizeSubjectCode(student?.["Subject 2 Code"]);
                })?.Name || ""
              }
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              disabled
              dir="rtl"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="mt-3 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Download HallTicket{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
