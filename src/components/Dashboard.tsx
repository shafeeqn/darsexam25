"use client";
import { useEffect, useState } from "react";
import students from "../data/students.json";
import subjects from "../data/subjects.json";
import { useRouter } from "next/navigation";

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
  const [student, setStudent] = useState<{
    StudentId: number;
    RegNo: string;
    Name: string;
    Dars: string;
    Place: string;
    DarsCode: string;
    Category: string;
    Subject1: string;
    Subject2: string;
  }>();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    
    if (!user || user === "") {
      router.push("/login");
    }
    // console.log(
    //   students.find((student) => student?.StudentId === parseInt(user as string))
    // );
    setStudent(
      students.find(
        (student) => (student.StudentId as any) === parseInt(user as string)
      ) as any
    );
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
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Exam Register Number{" "}
          </label>
          <div className="mt-0.5">
            <input
              type="text"
              value={student?.RegNo}
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              disabled
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Student Id{" "}
          </label>
          <div className="mt-0.5">
            <input
              type="text"
              value={student?.StudentId}
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              disabled
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Name{" "}
          </label>
          <div className="mt-0.5">
            <input
              type="text"
              value={student?.Name}
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              disabled
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Dars{" "}
          </label>
          <div className="mt-0.5">
            <input
              type="text"
              value={student?.Dars}
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              disabled
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Category{" "}
          </label>
          <div className="mt-0.5">
            <input
              type="text"
              value={
                categories.find((category) => {
                  return category.shortName === student?.Category;
                })?.fullName as any
              }
              className=" uppercase block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              disabled
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Subject 1{" "}
          </label>
          <div className="mt-0.5">
            <input
              type="text"
              value={
                subjects.find((subject) => {
                  return subject.Id === student?.Subject1;
                })?.Name as any
              }
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              disabled
              dir="rtl"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Subject 2{" "}
          </label>
          <div className="mt-0.5">
            <input
              type="text"
              value={
                subjects.find((subject) => {
                  return subject.Id === student?.Subject2;
                })?.Name as any
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
