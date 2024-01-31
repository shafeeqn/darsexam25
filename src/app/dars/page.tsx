"use client";
import React, { useEffect, useState } from "react";
import Students from "../../data/students.json";
import Subjects from "../../data/subjects.json";

const page = () => {
  const [username, setUsername] = useState<string>("");

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
      <p>{username}</p>
      {students.map((student) => {
        return (
          <div className="flex gap-5">
            <p>{student.Name}</p>
            <p>{student.StudentId}</p>
            <button>Download</button>
          </div>
        );
      })}

{subjects.map((subject) => {
        return (
          <div className="flex gap-5">
            <p>{subject.Id}</p>
            <p>{subject.Name}</p>
            <button>Download</button>
          </div>
        );
      })}
    </div>
  );
};

export default page;
