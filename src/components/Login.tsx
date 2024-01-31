"use client";
import React from 'react'
import Students from '../data/students.json'
import Dars from '../data/dars.json'

const Login = () => {

    const [username, setUsername] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const [error, setError] = React.useState<string>("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
       
        // check the username that matches from students data on studentId
        // if matches then check the password is 123

        const student = Students.find((student)=>student.StudentId === parseInt(username))
        const dars =   Dars.find((dars)=>dars.DarsCode === username)
        const admin = username === "JMADMIN" ? true : false
        if(student){
            password === "123" ? 
            localStorage.setItem("user", JSON.stringify(student.StudentId)) :
            setError("Invalid Password")
        }else if(dars){
            password === "123" ? 
            localStorage.setItem("user", JSON.stringify(dars.DarsCode)) :
            setError("Invalid Password")
        }else if(admin){
            password === "123" ? 
            localStorage.setItem("user", JSON.stringify("JMADMIN")) :
            setError("Invalid Password")
        }
        else{
            setError("Invalid Username")
        }

    }

  return (
    <div>
        <form onSubmit={handleSubmit} >
            <p>Username</p>
            <input onChange={(e)=>setUsername(e.target.value)}  type="text" name="" id=""  />
            <p>Password</p>
            <input onChange={(e)=>setPassword(e.target.value)}  type="text" name="" id=""  />
        </form>
    </div>
  )
}

export default Login