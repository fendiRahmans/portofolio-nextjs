"use server";

import { db } from "@/db";
import { techStack } from "@/db/schema";
import { techStackSchema } from "@/lib/validations";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type TechStackState = {
  error?: string;
  success?: boolean;
  fieldErrors?: {
    title?: string[];
    description?: string[];
    iconName?: string[];
    iconColor?: string[];
    bgColor?: string[];
  };
};

export async function getTechStacks() {
  try {
    const data = await db.select().from(techStack).orderBy(desc(techStack.createdAt));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching tech stacks:", error);
    return { success: false, error: "Failed to fetch tech stacks" };
  }
}

export async function createTechStack(prevState: TechStackState, formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    iconName: formData.get("iconName") as string,
    iconColor: formData.get("iconColor") as string,
    bgColor: formData.get("bgColor") as string,
  };

  const validatedFields = techStackSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Validation failed. Please check your inputs.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await db.insert(techStack).values(validatedFields.data);
    revalidatePath("/admin/tech-stack");
    return { success: true };
  } catch (error) {
    console.error("Error creating tech stack:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function updateTechStack(
  id: number,
  prevState: TechStackState,
  formData: FormData
) {
  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    iconName: formData.get("iconName") as string,
    iconColor: formData.get("iconColor") as string,
    bgColor: formData.get("bgColor") as string,
  };

  const validatedFields = techStackSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Validation failed. Please check your inputs.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await db
      .update(techStack)
      .set(validatedFields.data)
      .where(eq(techStack.id, id));
    revalidatePath("/admin/tech-stack");
    return { success: true };
  } catch (error) {
    console.error("Error updating tech stack:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function deleteTechStack(id: number) {
  try {
    await db.delete(techStack).where(eq(techStack.id, id));
    revalidatePath("/admin/tech-stack");
    return { success: true };
  } catch (error) {
    console.error("Error deleting tech stack:", error);
    return { success: false, error: "Failed to delete tech stack" };
  }
}

export async function getTechStackCount() {
  try {
    const data = await db.select().from(techStack);
    return data.length;
  } catch (error) {
    console.error("Error counting tech stacks:", error);
    return 0;
  }
}
