import nextEnv from "@next/env";
import pg from "pg";

const { loadEnvConfig } = nextEnv;
const { Pool } = pg;

// Load environment files using Next.js development conventions.
loadEnvConfig(process.cwd(), true);

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is missing. Check your .env.local file.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  max: 1,
  connectionTimeoutMillis: 15000,
});

try {
  await pool.query("SELECT 1 AS connected");

  console.log("Database connection successful.");
} catch (error) {
  console.error(
    "Database connection failed:",
    error instanceof Error ? error.message : "Unknown error",
  );

  process.exitCode = 1;
} finally {
  await pool.end();
}
