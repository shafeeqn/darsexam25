"use client";
import React, { useEffect, useState } from "react";
import Students from "../../data/students.json";
import Subjects from "../../data/subjects.json";

const page = () => {
  const [username, setUsername] = useState<string>("");
  const [isStudent, setIsStudent] = useState<boolean>(true);

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

      <div className="w-full flex justify-between">

    {/* login img */}

          <img src="/Logo.png" alt="login" className="h-16" />
        
        <div className="flex gap-4">

        <button onClick={() => setIsStudent(true)}>Students</button>
        <button onClick={() => setIsStudent(false)}>Subjects</button>
        </div>

        <div className="flex gap-4">
          <button>Download All</button>
          </div>

      </div>

      
      <p>{username}</p>

      {/*  */}


      <div className="flex flex-wrap ">
      {
        isStudent ? students.map((student) => {
          return (
            // <div className="flex gap-5">
            //   <p>{student.Name}</p>
            //   <p>{student.StudentId}</p>
            //   <button>Download</button>
            // </div>
            <div className="relative m-2 flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96">
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
                type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>

              </button>
            </div>
          </div>
          );
        }) : subjects.map((subject) => {
          return (
            // <div className="flex gap-5">
            //   <p>{subject.Id}</p>
            //   <p>{subject.Name}</p>
            //   <button>Download</button>
            // </div>

<div className="relative flex m-2 flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96">
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
    type="button">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>

  </button>
</div>
</div>
          );
        })
      }
      </div>
      




    </div>
  );
};

export default page;
