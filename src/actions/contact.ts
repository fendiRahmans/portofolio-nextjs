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

export async function getContactCount() {
  try {
    const data = await db.select().from(contact);
    return data.length;
  } catch (error) {
    console.error("Error counting contacts:", error);
    return 0;
  }
}

export async function getRecentContacts(limit: number = 3) {
  try {
    const data = await db
      .select()
      .from(contact)
      .orderBy(desc(contact.createdAt))
      .limit(limit);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching recent contacts:", error);
    return { success: false, data: [] };
  }
}

export async function getContactCountThisWeek() {
  try {
    const now = new Date();
    const firstDayOfWeek = new Date(now);
    firstDayOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    firstDayOfWeek.setHours(0, 0, 0, 0);

    const data = await db.select().from(contact);
    const thisWeekData = data.filter(item => {
      if (!item.createdAt) return false;
      const createdDate = new Date(item.createdAt);
      return createdDate >= firstDayOfWeek;
    });

    return thisWeekData.length;
  } catch (error) {
    console.error("Error counting contacts this week:", error);
    return 0;
  }
}
