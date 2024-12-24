"use client";

import { useSession } from "@/hooks/use-session";
import { useEffect } from "react";

export const SessionProvider = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const { refreshSession } = useSession();

   useEffect(() => {
      refreshSession();
   }, [refreshSession]);

   return <>{children}</>;
}