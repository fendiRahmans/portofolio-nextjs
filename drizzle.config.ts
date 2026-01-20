import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'mysql', // Ubah ke mysql
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});