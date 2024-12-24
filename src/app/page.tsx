"use client";

import { useSession } from "@/hooks/use-session";
import { logout } from "../../actions/auth";
import { useTransition } from "react";

export default function Home() {
   const [isPending, startTransition] = useTransition();
   const { session } = useSession();

   const handleLogout = async () => {
      startTransition(async () => {
         await logout().then(() => {
            window.location.reload();
         });
      });
   };

   return (
      <div className="flex items-center justify-center max-w-[600px] mx-auto p-4 rounded shadow">
         {session?.isLoading ? (
            <div className="text-center">
               <p>Loading...</p>
            </div>
         ) : (
            <div>
               {!session?.user ? (
                  <div className="text-center">
                     <h1 className="text-2xl font-bold">Home Page</h1>
                     <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                        Login
                     </button>
                  </div>
               ) : (
                  <div className="text-center">
                     <h1 className="text-2xl font-bold">
                        Welcome {session.user.name}
                     </h1>
                     <div className="mt-2">
                        <pre>{JSON.stringify(session.user, null, 2)}</pre>
                     </div>
                     <button disabled={isPending} onClick={handleLogout}>
                        Logout
                     </button>
                  </div>
               )}
            </div>
         )}
      </div>
   );
}
