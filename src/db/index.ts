import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

let dbInstance: any = null;

function getDb() {
  if (!dbInstance) {
    // Construct DATABASE_URL from individual env vars if not provided
    const dbUrl = process.env.DATABASE_URL || 
      `mysql://${process.env.DB_USER || 'root'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || '127.0.0.1'}/${process.env.DB_NAME || 'portofolio'}`;
    
    if (!dbUrl) {
      throw new Error('Database configuration is required. Set DATABASE_URL or DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
    }
    const connection = mysql.createPool(dbUrl);
    dbInstance = drizzle(connection, { schema, mode: 'default' });
  }
  return dbInstance;
}

export const db = new Proxy({} as any, {
  get(target, prop) {
    return getDb()[prop];
  },
});