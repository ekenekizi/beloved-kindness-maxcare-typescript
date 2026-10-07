import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing.");
}

const globalForDb = globalThis as typeof globalThis & {
  databasePool?: Pool;
};

function createPool() {
  const pool = new Pool({
    connectionString,
    max: 5,
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 10000,
  });

  pool.on("error", (error) => {
    console.error("Unexpected database pool error:", error.message);
  });

  return pool;
}

const pool = globalForDb.databasePool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForDb.databasePool = pool;
}

export const db = drizzle({
  client: pool,
  schema,
});
