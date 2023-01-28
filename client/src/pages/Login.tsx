import { FormEvent, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { Input } from "../components/Input";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const { login, user } = useAuth()
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  if(user!=null) return <Navigate to='/' />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (login.isLoading) return
    
    const username = usernameRef.current?.value || ""
    const password = passwordRef.current?.value || ""
    if (username===null || username.trim()==="" || password===null || password.trim()==="") {
        return
    }
    login.mutate({ id: username, password })
  }
  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <h1 className="card-title">Login</h1>
      <Input
        id="username"
        placeholder="Create a username"
        type="text"
        pattern="\S*"
        ref={usernameRef}
        required
      >
        Username
      </Input>
      <Input
        id="password"
        placeholder="Enter a strong password"
        type="password"
        ref={passwordRef}
        pattern="\S*"
        required
      >
        Password
      </Input>

      <button disabled={login.isLoading} className="btn btn-primary w-full">
        {login.isLoading ? "Loading..." : "Login"}
      </button>
    </form>
  );
};
