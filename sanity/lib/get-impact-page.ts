import "server-only";
import type { SanityImageSource } from "@sanity/image-url";
import {
  defaultImpactContent,
  type ImpactContent,
} from "@/features/impact/data/impact-content";
import { sanityClient } from "./client";
import { urlFor } from "./image";
import { impactPageQuery } from "./queries";

type SanityImpactContent = Omit<ImpactContent, "hero"> & {
  hero: Omit<ImpactContent["hero"], "image"> & { image: SanityImageSource };
};
export async function getImpactPageContent(): Promise<ImpactContent> {
  const content = await sanityClient.fetch<SanityImpactContent | null>(
    impactPageQuery,
    {},
    { next: { revalidate: 60 } },
  );
  if (!content?.storiesIntro) return defaultImpactContent;
  return {
    ...content,
    hero: {
      ...content.hero,
      image: urlFor(content.hero.image)
        .width(1200)
        .height(1056)
        .fit("crop")
        .quality(80)
        .auto("format")
        .url(),
    },
  };
}
