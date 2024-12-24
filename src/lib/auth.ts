import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";

const SECRET_KEY = new TextEncoder().encode("o1Is/Xjg3m0ia2vNiTgKOfYzJLOTTO7pfeNIXAcp3nM=");
const SESSION_COOKIE = "auth_session";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export class AuthService {
   static async createSessionCookies(userId: string) {
      const token = await new SignJWT({ userId })
         .setProtectedHeader({ alg: "HS256" })
         .setExpirationTime("30d")
         .sign(SECRET_KEY);

      const expires = new Date();
      expires.setSeconds(expires.getSeconds() + COOKIE_MAX_AGE);

      await db.session.create({
         data: {
            token,
            expiresAt: expires,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
         },
      });

      (await cookies()).set(SESSION_COOKIE, token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "lax",
         expires,
         path: "/",
      });
   }

   static async getCurrentUser() {
      try {
         const token = (await cookies()).get(SESSION_COOKIE)?.value;
         if (!token) return null;

         const { payload } = await jwtVerify(token, SECRET_KEY);

         if (!payload.userId) return null;

         const session = await db.session.findFirst({
            where: {
               token,
               expiresAt: { gt: new Date() },
            },
            include: { user: true },
         });

         if (!session) return null;

         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         const { password, ...res } = session.user;
         return res;
      } catch (error) {
         console.log("[Get Current User Service Error]", error);
         return null;
      }
   }

   static async clearSession() {
      const token = (await cookies()).get(SESSION_COOKIE)?.value;
      if (token) {
         await db.session.delete({ where: { token } });
         (await cookies()).delete(SESSION_COOKIE);
      }
   }

   static async verifySession() {
      const token = (await cookies()).get(SESSION_COOKIE)?.value;
      if (!token) return false;

      try {
         await jwtVerify(token, SECRET_KEY);
         return true;
      } catch (error) {
         console.log("[Verify Session Service Error]", error);
         return false;
      }
   }
}
