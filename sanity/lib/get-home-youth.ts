import "server-only";

import type { SanityImageSource } from "@sanity/image-url";
import type { HomeYouthContent } from "@/features/home/types";
import { defaultHomeYouth, isHttpUrl } from "@/features/home/data/home-youth";
import { sanityClient } from "./client";
import { urlFor } from "./image";
import { homeYouthQuery } from "./queries";

type SanityHomeYouth = Omit<HomeYouthContent, "image"> & {
  image: SanityImageSource;
};

export async function getHomeYouth(): Promise<HomeYouthContent> {
  const content = await sanityClient.fetch<SanityHomeYouth | null>(
    homeYouthQuery,
    {},
    { next: { revalidate: 60 } },
  );

  if (!content || !isHttpUrl(content.partnerUrl)) return defaultHomeYouth;

  return {
    ...content,
    image: urlFor(content.image)
      .width(1200)
      .height(1056)
      .fit("crop")
      .quality(80)
      .auto("format")
      .url(),
  };
}
