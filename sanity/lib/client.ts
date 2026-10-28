import "server-only";

import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error("Sanity project ID and dataset must be configured.");
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2025-02-19",
  perspective: "published",
  useCdn: false,
});
