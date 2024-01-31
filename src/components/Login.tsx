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
    // <div>
    //   <form onSubmit={handleSubmit}>
    //     <h1>Login</h1>
    //     <p>{error}</p>
    //     <p>Username</p>
    //     <input
    //       onChange={(e) => setUsername(e.target.value)}
    //       type="text"
    //       name=""
    //       id=""
    //     />
    //     <p>Password</p>
    //     <input
    //       onChange={(e) => setPassword(e.target.value)}
    //       type="text"
    //       name=""
    //       id=""
    //     />
    //     <input type="submit" />
    //   </form>
    // </div>

    <div className="flex w-screen h-screen bg-smoke items-center justify-center bg">
    <form onSubmit={handleSubmit} className="bg-white flex flex-col h-fit w-96 p-10 rounded-xl gap-3 items-center">
      <div className='w-20'>
        <img onClick={()=>{
          Router.push('/')
        }} className='object-contain cursor-pointer' src="/logo/logo-only.png" alt="Logo" />
      </div>
      <h1 className="text-center font-semibold text-2xl">Login to <span className="font-extrabold text-primary">Exam Portal</span></h1>
      <p>
        {error && <span className="text-red-500">{error}</span>}
      </p>
      <input
        type="text"
        placeholder="Username"
        onChange={(e: any) => setUsername(e.target.value)}
        className="px-3 py-2 rounded-lg border focus:border-primary"
        required
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e: any) => setPassword(e.target.value)}
        className="px-3 py-2 rounded-lg border focus:border-primary"
        required
      />
      <button type="submit" className="hover:bg-light border-primary border rounded-lg text-white px-3 py-1 bg-primary">
        Login
      </button>
    </form>

    <div className="mt-4">
    </div>
  </div>
  );
};

export default Login;
