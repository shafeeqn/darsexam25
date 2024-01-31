"use client";
import { useEffect, useState } from "react";
import students from "../data/students.json";
import subjects from "../data/subjects.json";

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
    localStorage.setItem("user", "244841");
    console.log(localStorage.getItem("user"));
    console.log(
      students.find(
        (student) =>
          student.StudentId === parseInt(localStorage.getItem("user") as string)
      )
    );
    setStudent(
      students.find(
        (student) =>
          student.StudentId === parseInt(localStorage.getItem("user") as string)
      ) as any
    );
  }, []);
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Student Details</p>
      <p>Name: {student?.Name}</p>
      <p>RegNo: {student?.RegNo}</p>
      <p>DarsCode: {student?.DarsCode}</p>
      <p>Dars: {student?.Dars}</p>
      <p>Place: {student?.Place}</p>
      <p>
        Category:{" "}
        {categories.map((category) => {
          if (category.shortName === student?.Category) {
            return category.fullName;
          }
        })}
      </p>
      <p>
        Subject1:{" "}
        {subjects.map((subject) => {
          if (subject.Id === student?.Subject1) {
            return subject.Name;
          }
        })}
      </p>
      <p>
        Subject2:{" "}
        {subjects.map((subject) => {
          if (subject.Id === student?.Subject2) {
            return subject.Name;
          }
        })}
      </p>
    </div>
  );
}
