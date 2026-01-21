import "dotenv/config";
import { db } from "./index"; // Assuming db instance is exported from index.ts or similar
import { users } from "./schema";
// import { hashPassword } from "../lib/auth"; 
import { eq } from "drizzle-orm";

// Make sure to handle the case where db import might differ. 
// If `../lib/auth` uses `next/headers` (cookies), it might fail in a standalone script.
// So let's use bcrypt directly here to be safe and avoid Next.js context issues.
import bcrypt from "bcryptjs";

// Standalone hash function for seed
async function hash(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  console.log("Seeding admin user...");

  const existingUser = await db.select().from(users).where(eq(users.email, "admin@example.com"));

  if (existingUser.length > 0) {
    console.log("Admin user already exists.");
    return;
  }

  const passwordHash = await hash("admin123");

  await db.insert(users).values({
    name: "Admin User",
    email: "admin@example.com",
    password: passwordHash,
  });

  console.log("Admin user created.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
