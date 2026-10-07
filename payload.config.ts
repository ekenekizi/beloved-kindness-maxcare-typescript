import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Stories } from "./collections/Stories";

const projectDirectory = path.dirname(fileURLToPath(import.meta.url));

const databaseUrl = process.env.PAYLOAD_DATABASE_URL;
const secret = process.env.PAYLOAD_SECRET;

if (!databaseUrl || !secret) {
  throw new Error(
    "PAYLOAD_DATABASE_URL and PAYLOAD_SECRET must be configured.",
  );
}

export default buildConfig({
  secret,

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: projectDirectory,
    },
  },

  collections: [Users, Stories],

  editor: lexicalEditor(),

  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl,
      max: 5,
      connectionTimeoutMillis: 15_000,
      idleTimeoutMillis: 10_000,
    },
    disableCreateDatabase: true,
  }),

  sharp,

  typescript: {
    outputFile: path.resolve(projectDirectory, "payload-types.ts"),
  },
});
