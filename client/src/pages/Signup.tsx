import axios from "axios";
import { FormEvent, useRef, useState } from "react";
import { Input } from "../components/Input";
import { useAuth } from "../context/AuthContext";

export const Signup = () => {
  const { signup } = useAuth()
  const usernameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [imageURL, setImageURL] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (signup.isLoading) return
    
    const username = usernameRef.current?.value || ""
    const name = nameRef.current?.value || ""
    const image = (imageRef.current?.files?.[0]);
    const password = passwordRef.current?.value || ""
    const formData = new FormData();
    if (image) {
      formData.append('file', image);
      formData.append('public_id', "" + username)
      formData.append('upload_preset', 'user_profile');
      await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then((response)=>{
        setImageURL(response.data.secure_url)
        if (username===null || name ===null || username.trim()==="" || name.trim()==="") {
          return
        }
        signup.mutate({ id: username, name: name, image: imageURL, password })
      })
      .catch(err=>console.log(err))
    }
  }
  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <h1 className="card-title">Sign Up</h1>
      <div className="form-control w-full">
        <label htmlFor="image" className="label">
          <span className="label-text">Profile Picture</span>
        </label>
        <input ref={imageRef} id="image" type="file" accept="image/*" />
      </div>
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
        id="name"
        placeholder="Enter your full name"
        type="text"
        ref={nameRef}
        required
      >
        Full Name
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

      <button disabled={signup.isLoading} className="btn btn-primary w-full">
        {signup.isLoading ? "Loading..." : "Sign up"}
      </button>
    </form>
  );
};
