"use server";

import { db } from "@/db";
import { setting } from "@/db/schema";
import { settingSchema } from "@/lib/validations";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type SettingState = {
  error?: string;
  success?: boolean;
  fieldErrors?: {
    name?: string[];
    value?: string[];
  };
};

export async function getSettings() {
  try {
    const data = await db.select().from(setting).orderBy(desc(setting.createdAt));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return { success: false, error: "Failed to fetch settings" };
  }
}

export async function createSetting(prevState: SettingState, formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    value: formData.get("value") as string,
  };

  const validatedFields = settingSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Validation failed. Please check your inputs.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await db.insert(setting).values(validatedFields.data);
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Error creating setting:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function updateSetting(
  id: number,
  prevState: SettingState,
  formData: FormData
) {
  const data = {
    name: formData.get("name") as string,
    value: formData.get("value") as string,
  };

  const validatedFields = settingSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Validation failed. Please check your inputs.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await db
      .update(setting)
      .set(validatedFields.data)
      .where(eq(setting.id, id));
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating setting:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function deleteSetting(id: number) {
  try {
    await db.delete(setting).where(eq(setting.id, id));
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Error deleting setting:", error);
    return { success: false, error: "Failed to delete setting" };
  }
}

export async function getAvailableForHire() {
  try {
    const result = await db
      .select()
      .from(setting)
      .where(eq(setting.name, "available_for_hire"))
      .limit(1);

    if (result.length === 0) return false;
    return result[0].value === "true";
  } catch (error) {
    console.error("Error fetching available_for_hire setting:", error);
    return false;
  }
}

export async function toggleAvailableForHire(isAvailable: boolean) {
  try {
    const existing = await db
      .select()
      .from(setting)
      .where(eq(setting.name, "available_for_hire"))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(setting)
        .set({ value: String(isAvailable) })
        .where(eq(setting.name, "available_for_hire"));
    } else {
      await db.insert(setting).values({
        name: "available_for_hire",
        value: String(isAvailable),
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error toggling available_for_hire:", error);
    return { success: false, error: "Failed to update setting" };
  }
}
