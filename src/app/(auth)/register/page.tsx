"use client";

import { useState, useTransition } from "react";
import { signUpActions } from "../../../../actions/auth";

const RegisterPage = () => {
   const [isPending, startTransition] = useTransition();
   const [form, setForm] = useState({
      email: '',
      password: '',
      name: '',
      role: '',
   });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({
         ...form,
         [e.target.name]: e.target.value,
      });
   };

   const onSubmit = async () => {
      startTransition(async () => {
         await signUpActions({
            email: form.email,
            password: form.password,
            name: form.name,
         })
      })
   }

   return ( 
      <div className="flex items-center justify-center max-w-[600px] mx-auto w-full">
         <div className="w-full space-y-5">
            <input 
               name="email"
               placeholder="Email"
               value={form.email}
               onChange={handleChange}
               disabled={isPending}
            />
            <input 
               name="password"
               placeholder="Password"
               value={form.password}
               onChange={handleChange}
               type="password"
               disabled={isPending}
            />
            <input 
               name="name"
               placeholder="Name"
               value={form.name}
               onChange={handleChange}
               disabled={isPending}
            />
         </div>
         <button onClick={onSubmit} disabled={isPending}>
            {isPending ? 'Loading...' : 'Register'}
         </button>
      </div>
    );
}
 
export default RegisterPage;