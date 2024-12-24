"use client";
import { create } from "zustand";
import { User as UserPrisma } from "@prisma/client";

// Create a new type excluding the 'password' field
export type User = Omit<UserPrisma, 'password'>;
 
 export type Session = {
   user: User | null;
   isLoading: boolean;
   error: string | null;
 };

interface SessionStore {
   session: Session;
   setSession: (session: Session) => void;
   refreshSession: () => Promise<void>;
   clearSession: () => void;
}

export const useSession = create<SessionStore>((set) => ({
   session: {
      user: null,
      isLoading: true,
      error: null,
   },
   setSession: (session) => set({ session }),
   refreshSession: async () => {
      try {
         set((state) => ({
            session: { ...state.session, isLoading: true, error: null }
         }));

         const response = await fetch("/api/auth/session");
         if (!response.ok) throw new Error("Failed to fetch session");

         const data = await response.json();
         set({
            session: {
               user: data.user,
               isLoading: false,
               error: null
            }
         })
      } catch (error) {
         set((state) => ({
            session: {
               ...state.session,
               isLoading: false,
               error: error instanceof Error ? error.message : "Something went wrong"
            }
         }))
      }
   },
   clearSession: () => set({
      session: {
         user: null,
         isLoading: false,
         error: null,
      }
   })
}))