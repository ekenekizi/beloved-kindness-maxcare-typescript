import { loadEnvConfig } from "@next/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { authOptions } from "./lib/auth-options";
import * as schema from "./db/schema";

loadEnvConfig(process.cwd(), true);

const { DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL } = process.env;

if (!DATABASE_URL || !BETTER_AUTH_SECRET || !BETTER_AUTH_URL) {
  throw new Error(
    "DATABASE_URL, BETTER_AUTH_SECRET, and BETTER_AUTH_URL are required.",
  );
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 1,
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 1000,
  allowExitOnIdle: true,
});

pool.on("error", (error) => {
  console.error("Admin setup database error:", error.message);
});

const db = drizzle({
  client: pool,
  schema,
});

export const auth = betterAuth({
  ...authOptions,

  secret: BETTER_AUTH_SECRET,
  baseURL: BETTER_AUTH_URL,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
});
