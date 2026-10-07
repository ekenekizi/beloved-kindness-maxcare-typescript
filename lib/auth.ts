import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { authOptions } from "./auth-options";

const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;

if (!secret || !baseURL) {
  throw new Error("BETTER_AUTH_SECRET and BETTER_AUTH_URL must be configured.");
}

export const auth = betterAuth({
  ...authOptions,

  secret,
  baseURL,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
});
