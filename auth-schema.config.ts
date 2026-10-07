import { loadEnvConfig } from "@next/env";
import { betterAuth } from "better-auth";

import { authOptions } from "./lib/auth-options";

loadEnvConfig(process.cwd(), true);

const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;

if (!secret || !baseURL) {
  throw new Error("BETTER_AUTH_SECRET and BETTER_AUTH_URL must be configured.");
}

export const auth = betterAuth({
  ...authOptions,
  secret,
  baseURL,
});
