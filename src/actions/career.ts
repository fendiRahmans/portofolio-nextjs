"use server";

import { db } from "@/db";
import { career } from "@/db/schema";
import { careerSchema } from "@/lib/validations";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type CareerState = {
  error?: string;
  success?: boolean;
  fieldErrors?: {
    year?: string[];
    title?: string[];
    subtitle?: string[];
    description?: string[];
    icon?: string[];
    color?: string[];
    techStack?: string[];
    keyProjects?: string[];
  };
};

export async function getCareers() {
  try {
    const data = await db.select().from(career).orderBy(desc(career.createdAt));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching careers:", error);
    return { success: false, error: "Failed to fetch careers" };
  }
}

export async function createCareer(prevState: CareerState, formData: FormData) {
  const data = {
    year: formData.get("year") as string,
    title: formData.get("title") as string,
    subtitle: formData.get("subtitle") as string,
    description: formData.get("description") as string,
    icon: formData.get("icon") as string,
    color: formData.get("color") as any,
    techStack: formData.getAll("techStack") as string[],
    keyProjects: formData.getAll("keyProjects") as string[],
  };

  // If arrays are empty, they might not be in formData or come as empty strings depending on client handling.
  // We'll clean them up.
  if (data.techStack.length === 1 && data.techStack[0] === "") data.techStack = [];
  if (data.keyProjects.length === 1 && data.keyProjects[0] === "") data.keyProjects = [];

  const validatedFields = careerSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Validation failed. Please check your inputs.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await db.insert(career).values(validatedFields.data);
    revalidatePath("/admin/career");
    return { success: true };
  } catch (error) {
    console.error("Error creating career:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function updateCareer(
  id: number,
  prevState: CareerState,
  formData: FormData
) {
  const data = {
    year: formData.get("year") as string,
    title: formData.get("title") as string,
    subtitle: formData.get("subtitle") as string,
    description: formData.get("description") as string,
    icon: formData.get("icon") as string,
    color: formData.get("color") as any,
    techStack: formData.getAll("techStack") as string[],
    keyProjects: formData.getAll("keyProjects") as string[],
  };

  // Clean up arrays if needed
  if (data.techStack.length === 1 && data.techStack[0] === "") data.techStack = [];
  if (data.keyProjects.length === 1 && data.keyProjects[0] === "") data.keyProjects = [];

  const validatedFields = careerSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Validation failed. Please check your inputs.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await db
      .update(career)
      .set(validatedFields.data)
      .where(eq(career.id, id));
    revalidatePath("/admin/career");
    return { success: true };
  } catch (error) {
    console.error("Error updating career:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function deleteCareer(id: number) {
  try {
    await db.delete(career).where(eq(career.id, id));
    revalidatePath("/admin/career");
    return { success: true };
  } catch (error) {
    console.error("Error deleting career:", error);
    return { success: false, error: "Failed to delete career" };
  }
}
