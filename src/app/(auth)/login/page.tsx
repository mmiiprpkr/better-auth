"use client";

import { useTransition } from "react";
import { login } from "../../../../actions/auth";

const LoginPage = () => {
   const [isPending, startTransition] = useTransition();
   const handleLogin = async () => {
      startTransition(async () => {
         login("mmiiprpkr@gmail.com", "2002Prpkr").then((data) => {
            if (!data.success) {
               console.error("[Login Error]", data.error);
            }

            if (data.success) {
               console.log("Login Success");
               window.location.reload();
            }
         });
      });
   };

   return (
      <div>
         login page
         <button onClick={handleLogin} disabled={isPending}>
            Login
         </button>
      </div>
   );
};

export default LoginPage;
