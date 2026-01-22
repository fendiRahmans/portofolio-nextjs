"use server";

import { db } from "@/db";
import { contact } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getContacts() {
  try {
    const data = await db.select().from(contact).orderBy(desc(contact.createdAt));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return { success: false, error: "Failed to fetch contacts" };
  }
}

export async function updateContactStatus(id: number, status: string) {
  try {
    await db
      .update(contact)
      .set({ status })
      .where(eq(contact.id, id));
    revalidatePath("/admin/contact");
    return { success: true };
  } catch (error) {
    console.error("Error updating contact status:", error);
    return { success: false, error: "Failed to update contact status" };
  }
}

export async function deleteContact(id: number) {
  try {
    await db.delete(contact).where(eq(contact.id, id));
    revalidatePath("/admin/contact");
    return { success: true };
  } catch (error) {
    console.error("Error deleting contact:", error);
    return { success: false, error: "Failed to delete contact" };
  }
}
