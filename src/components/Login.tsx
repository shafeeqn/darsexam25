"use client";
import React from 'react'
import Students from '../data/students.json'

const Login = () => {

    const [username, setUsername] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
       
        // check the username that matches from students data on studentId
        // if matches then check the password is 123

        const student = Students.find((student)=>student.StudentId === parseInt(username))
        if(student){
           
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