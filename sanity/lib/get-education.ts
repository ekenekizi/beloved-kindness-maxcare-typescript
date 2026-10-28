import "server-only";
import type { SanityImageSource } from "@sanity/image-url";
import {
  defaultEducationContent,
  type EducationContent,
} from "@/features/programs/data/education-content";
import { sanityClient } from "./client";
import { urlFor } from "./image";
import { educationPageQuery } from "./queries";

type SanityEducationContent = Omit<EducationContent, "hero"> & {
  hero: Omit<EducationContent["hero"], "image"> & { image: SanityImageSource };
};

export async function getEducationContent(): Promise<EducationContent> {
  const content = await sanityClient.fetch<SanityEducationContent | null>(
    educationPageQuery,
    {},
    { next: { revalidate: 60 } },
  );
  if (
    !content ||
    content.supportAreas.length !== 4 ||
    !content.purpose?.paragraphs.length ||
    !content.donation ||
    !content.gallery ||
    !content.partners
  )
    return defaultEducationContent;
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
