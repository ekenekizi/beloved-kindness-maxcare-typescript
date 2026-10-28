import "server-only";

import type { HomeImpactContent } from "@/features/home/types";

import { sanityClient } from "./client";
import { homeImpactQuery } from "./queries";

export async function getHomeImpact(): Promise<HomeImpactContent | null> {
  const content = await sanityClient.fetch<HomeImpactContent | null>(
    homeImpactQuery,
    {},
    {
      next: {
        revalidate: 60,
      },
    },
  );

  if (!content || content.stats.length !== 4) {
    return null;
  }

  return content;
}
