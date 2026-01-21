"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, verifyPassword, deleteSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export type LoginState = {
  error?: string;
  success?: boolean;
  token?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
};

export async function login(prevState: LoginState, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      error: "Validation failed. Please check your inputs.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedFields.data.email));

    if (!user) {
      return { error: "Invalid email or password" };
    }

    const isValid = await verifyPassword(validatedFields.data.password, user.password);

    if (!isValid) {
      return { error: "Invalid email or password" };
    }

    const token = await createSession(user.id);
    return { success: true, token };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
