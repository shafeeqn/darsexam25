"use client";
import React, { useEffect, useState } from "react";
import Students from "../../data/students.json";
import Subjects from "../../data/subjects.json";

const page = () => {
  const [username, setUsername] = useState<string>("");
  const [isStudent, setIsStudent] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    setUsername(JSON.parse(localStorage.getItem("user") as string));
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

  return (
    <div>
      {/* <div className="w-full flex justify-between">

          <img src="/Logo.png" alt="login" className="h-16" />
        
        <div className="flex gap-4">

        <button onClick={() => setIsStudent(true)}>Students</button>
        <button onClick={() => setIsStudent(false)}>Subjects</button>
        </div>

        <div className="flex gap-4">
          <button>Download All</button>
          </div>

      </div> */}

      <nav className="block w-full mt-2 max-w-screen-xl px-4 py-2 mx-auto text-white bg-white border shadow-md rounded-xl border-white/80 bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4">
        <div className="container flex items-center justify-between mx-auto text-blue-gray-900">
          <img src="/Logo.png" alt="login" className="h-8" />
          <div className="hidden lg:block">
            <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              <li
                onClick={() => {
                  setIsStudent(false), setQuery("");
                }}
                className="flex items-center cursor-pointer p-1 font-sans text-sm antialiased font-medium leading-normal gap-x-2 text-blue-gray-900"
              >
                <svg
                  width="16"
                  height="15"
                  viewBox="0 0 16 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 0.5C4.73478 0.5 4.48043 0.605357 4.29289 0.792893C4.10536 0.98043 4 1.23478 4 1.5C4 1.76522 4.10536 2.01957 4.29289 2.20711C4.48043 2.39464 4.73478 2.5 5 2.5H11C11.2652 2.5 11.5196 2.39464 11.7071 2.20711C11.8946 2.01957 12 1.76522 12 1.5C12 1.23478 11.8946 0.98043 11.7071 0.792893C11.5196 0.605357 11.2652 0.5 11 0.5H5ZM2 4.5C2 4.23478 2.10536 3.98043 2.29289 3.79289C2.48043 3.60536 2.73478 3.5 3 3.5H13C13.2652 3.5 13.5196 3.60536 13.7071 3.79289C13.8946 3.98043 14 4.23478 14 4.5C14 4.76522 13.8946 5.01957 13.7071 5.20711C13.5196 5.39464 13.2652 5.5 13 5.5H3C2.73478 5.5 2.48043 5.39464 2.29289 5.20711C2.10536 5.01957 2 4.76522 2 4.5ZM0 8.5C0 7.96957 0.210714 7.46086 0.585786 7.08579C0.960859 6.71071 1.46957 6.5 2 6.5H14C14.5304 6.5 15.0391 6.71071 15.4142 7.08579C15.7893 7.46086 16 7.96957 16 8.5V12.5C16 13.0304 15.7893 13.5391 15.4142 13.9142C15.0391 14.2893 14.5304 14.5 14 14.5H2C1.46957 14.5 0.960859 14.2893 0.585786 13.9142C0.210714 13.5391 0 13.0304 0 12.5V8.5Z"
                    fill="#90A4AE"
                  ></path>
                </svg>
                <p className="flex items-center text-slate-500">Subjects</p>
              </li>
              <li
                onClick={() => {
                  setIsStudent(true), setQuery("");
                }}
                className="flex items-center p-1 cursor-pointer font-sans text-sm antialiased font-medium leading-normal gap-x-2 text-blue-gray-900"
              >
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16 8.5C16 10.6217 15.1571 12.6566 13.6569 14.1569C12.1566 15.6571 10.1217 16.5 8 16.5C5.87827 16.5 3.84344 15.6571 2.34315 14.1569C0.842855 12.6566 0 10.6217 0 8.5C0 6.37827 0.842855 4.34344 2.34315 2.84315C3.84344 1.34285 5.87827 0.5 8 0.5C10.1217 0.5 12.1566 1.34285 13.6569 2.84315C15.1571 4.34344 16 6.37827 16 8.5ZM10 5.5C10 6.03043 9.78929 6.53914 9.41421 6.91421C9.03914 7.28929 8.53043 7.5 8 7.5C7.46957 7.5 6.96086 7.28929 6.58579 6.91421C6.21071 6.53914 6 6.03043 6 5.5C6 4.96957 6.21071 4.46086 6.58579 4.08579C6.96086 3.71071 7.46957 3.5 8 3.5C8.53043 3.5 9.03914 3.71071 9.41421 4.08579C9.78929 4.46086 10 4.96957 10 5.5ZM8 9.5C7.0426 9.49981 6.10528 9.77449 5.29942 10.2914C4.49356 10.8083 3.85304 11.5457 3.454 12.416C4.01668 13.0706 4.71427 13.5958 5.49894 13.9555C6.28362 14.3152 7.13681 14.5009 8 14.5C8.86319 14.5009 9.71638 14.3152 10.5011 13.9555C11.2857 13.5958 11.9833 13.0706 12.546 12.416C12.147 11.5457 11.5064 10.8083 10.7006 10.2914C9.89472 9.77449 8.9574 9.49981 8 9.5Z"
                    fill="#90A4AE"
                  ></path>
                </svg>
                <p className="flex items-center text-slate-500">Students</p>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-x-1">
            <button
              className="hidden select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block"
              type="button"
            >
              <span>Download All</span>
            </button>
          </div>
          <button
            className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden"
            type="button"
          >
            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </nav>

      <p>{username}</p>

      {/*  */}

      <div className="flex items-center">
        <div className="relative w-full">
          <input
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            className=" border border-slate-500 text-gray-900 text-sm rounded-lg block w-4/5 p-2.5 mx-auto"
            placeholder={`Search ${isStudent ? "Students" : "Subjects"}`}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center">
        {isStudent
          ? students
              .filter(
                (student) =>
                  student.Name.toLowerCase().includes(query.toLowerCase()) ||
                  student.StudentId.toString().includes(query)
              )
              .map((student) => {
                return (
                  // <div className="flex gap-5">
                  //   <p>{student.Name}</p>
                  //   <p>{student.StudentId}</p>
                  //   <button>Download</button>
                  // </div>
                  <div className="relative flex m-2  flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-1/5">
                    <div className="p-6">
                      <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                        {student.StudentId}
                      </h5>
                      <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
                        {student.Name}
                      </p>
                    </div>
                    <div className="p-6 pt-0">
                      <button
                        className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                        type="button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })
          : subjects
              .filter(
                (subject) =>
                  subject.Name.includes(query) ||
                  subject.Id.toLowerCase().includes(query)
              )
              .map((subject) => {
                return (
                  // <div className="flex gap-5">
                  //   <p>{subject.Id}</p>
                  //   <p>{subject.Name}</p>
                  //   <button>Download</button>
                  // </div>

                  <div className="relative flex m-2  flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-1/5">
                    <div className="p-6">
                      <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                        {subject.Id}
                      </h5>
                      <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
                        {subject.Name}
                      </p>
                    </div>
                    <div className="p-6 pt-0">
                      <button
                        className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                        type="button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
      </div>
    </div>
  );
};

export default page;
