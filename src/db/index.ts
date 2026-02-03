import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

let dbInstance: any = null;

function getDb() {
  if (!dbInstance) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    const connection = mysql.createPool(process.env.DATABASE_URL);
    dbInstance = drizzle(connection, { schema, mode: 'default' });
  }
  return dbInstance;
}

export const db = new Proxy({} as any, {
  get(target, prop) {
    return getDb()[prop];
  },
});