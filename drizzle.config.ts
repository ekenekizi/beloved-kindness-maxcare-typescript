import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd(), true);

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing.");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema/index.ts",
  out: "./drizzle",

  dbCredentials: {
    url: databaseUrl,
  },
});
