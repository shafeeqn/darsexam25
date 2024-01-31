"use client";
import React from 'react'

const Login = () => {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

  return (
    <div>
        <form onSubmit={handleSubmit} >
            <p>Username</p>
            <input type="text" name="" id=""  />
            <p>Password</p>
            <input type="text" name="" id=""  />
        </form>
    </div>
  )
}

export default Login