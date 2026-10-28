import "server-only";

import type { SanityImageSource } from "@sanity/image-url";
import type { HomeAboutContent } from "@/features/home/types";

import { sanityClient } from "./client";
import { urlFor } from "./image";
import { homeAboutQuery } from "./queries";

type SanityHomeAbout = Omit<HomeAboutContent, "image"> & {
  image: SanityImageSource;
};

export async function getHomeAbout(): Promise<HomeAboutContent | null> {
  const content = await sanityClient.fetch<SanityHomeAbout | null>(
    homeAboutQuery,
    {},
    {
      next: {
        revalidate: 60,
      },
    },
  );

  if (!content) return null;

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
