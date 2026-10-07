import type { BetterAuthOptions } from "better-auth";
import { admin } from "better-auth/plugins";

import { siteConfig } from "@/config/site";

export const authOptions = {
  appName: siteConfig.name,

  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
  },

  plugins: [admin()],
} satisfies BetterAuthOptions;
