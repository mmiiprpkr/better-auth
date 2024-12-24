import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthService } from "./lib/auth";

export async function middleware(request: NextRequest) {
   const isAuth: boolean = await AuthService.verifySession();
   const authPaths: string[] = ["/login", "/register"];
   const publicPaths: string[] = [];
   const pathname: string = request.nextUrl.pathname;

   const isPublicRouts = publicPaths.includes(pathname);
   const isAuthRoutes = authPaths.includes(pathname);

   if (isAuthRoutes) {
      if (isAuth) {
         return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
   }

   if (!isAuth && !isPublicRouts) {
      return NextResponse.redirect(new URL("/login", request.url));
   }

   return NextResponse.next();
}

export const config = {
   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
