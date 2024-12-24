"use server";

import { z } from "zod";
import { AuthService } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { compareSync, hashSync } from "bcryptjs";

const UserSchema = z.object({
   email: z.string().email(),
   password: z.string().min(6),
   name: z.string().optional(),
});

export async function signUpActions(
   values: z.infer<typeof UserSchema>
): Promise<{ success: boolean; error?: string }> {
   try {
      const validations = UserSchema.safeParse(values);

      if (!validations.success) {
         return { success: false, error: "Invalid Request" };
      }

      const existingUser = await db.user.findUnique({
         where: { email: values.email },
      });

      if (existingUser) {
         return { success: false,  error: "User already exists" };
      }

      const hashedPassword = hashSync(values.password, 10);
      const user = await db.user.create({
         data: {
            email: values.email,
            password: hashedPassword,
            name: values.name ?? "",
            emailVerified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
         },
      });

      await AuthService.createSessionCookies(user.id);
      revalidatePath("/");
      return { success: true };
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Something went wrong',
       };
   }
}

export async function login(
   email: string,
   password: string,
): Promise<{ success: boolean; error?: string }> {
   try {
      const { success, data } = UserSchema.safeParse({ email, password });

      if (!success) {
         return { success: false, error: "Invalid Request" };
      }

      const user = await db.user.findUnique({ where: { email: data.email } });
      if (!user || !compareSync(data.password, user.password)) {
         return { success: false, error: "Invalid Credentials" };
      }

      await AuthService.createSessionCookies(user.id);
      revalidatePath("/");
      return { success: true };
   } catch (error) {
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Something went wrong',
      }
   }
}

export async function logout() {
   await AuthService.clearSession();
   revalidatePath("/");
}