"use client";
import React from "react";
import Students from "../data/students.json";
import Dars from "../data/dars.json";
import { useRouter } from "next/navigation";

const Login = () => {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const Router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // check the username that matches from students data on studentId
    // if matches then check the password is 123

    const student = Students.find(
      (student) => student.StudentId === parseInt(username)
    );
    const dars = Dars.find((dars) => dars.DarsCode === username);
    const admin = username === "JMADMIN" ? true : false;
    if (student) {
      password === "123"
        ? (localStorage.setItem("user", JSON.stringify(student.StudentId)),
          Router.push("/dashboard"))
        : (setError("Invalid Password"),
          setTimeout(() => {
            setError("");
          }, 3000));
    } else if (dars) {
      password === "123"
        ? (localStorage.setItem("user", JSON.stringify(dars.DarsCode)),
          Router.push("/dars"))
        : (setError("Invalid Password"),
          setTimeout(() => {
            setError("");
          }, 3000));
    } else if (admin) {
      password === "123"
        ? (localStorage.setItem("user", JSON.stringify("JMADMIN")),
          Router.push("/admin"))
        : (setError("Invalid Password"),
          setTimeout(() => {
            setError("");
          }, 3000));
    } else {
      setError("Invalid Username");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p>{error}</p>
        <p>Username</p>
        <input
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          name=""
          id=""
        />
        <p>Password</p>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="text"
          name=""
          id=""
        />
        <input type="submit" />
      </form>
    </div>
  );
};

export default Login;
