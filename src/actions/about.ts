"use server";

import { db } from "@/db";
import { about } from "@/db/schema";
import { aboutSchema, AboutSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type AboutState = {
  error?: string;
  success?: boolean;
  fieldErrors?: {
    [K in keyof AboutSchema]?: string[];
  };
};

export async function getAbout() {
  try {
    const data = await db.select().from(about).limit(1);
    // If no data, return null or a default empty structure
    if (!data.length) return { success: true, data: null };
    
    const aboutData = data[0];
    
    // Parse JSON fields if they're strings (from database)
    let coreValues: any[] = [];
    let interests: string[] = [];
    
    try {
      if (aboutData.coreValues) {
        coreValues = typeof aboutData.coreValues === 'string' 
          ? JSON.parse(aboutData.coreValues) 
          : Array.isArray(aboutData.coreValues) 
          ? aboutData.coreValues 
          : [];
      }
    } catch (e) {
      console.error("Error parsing coreValues:", e);
      coreValues = [];
    }
    
    try {
      if (aboutData.interests) {
        interests = typeof aboutData.interests === 'string' 
          ? JSON.parse(aboutData.interests) 
          : Array.isArray(aboutData.interests) 
          ? aboutData.interests 
          : [];
      }
    } catch (e) {
      console.error("Error parsing interests:", e);
      interests = [];
    }
    
    const parsedData = {
      ...aboutData,
      coreValues,
      interests,
    };
    
    return { success: true, data: parsedData };
  } catch (error) {
    console.error("Error fetching about data:", error);
    return { success: false, error: "Failed to fetch about data" };
  }
}

export async function updateAbout(data: AboutSchema) {
  const validatedFields = aboutSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Validation failed. Please check your inputs.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const existing = await db.select().from(about).limit(1);

    if (existing.length > 0) {
      await db
        .update(about)
        .set(validatedFields.data)
        .where(eq(about.id, existing[0].id));
    } else {
      await db.insert(about).values(validatedFields.data);
    }

    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (error) {
    console.error("Error updating about data:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
