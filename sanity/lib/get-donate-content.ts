import "server-only";
import type { SanityImageSource } from "@sanity/image-url";
import {
  defaultDonateContent,
  type DonateContent,
} from "@/features/get-involved/data/donate-content";
import { sanityClient } from "./client";
import { urlFor } from "./image";
import { donatePageQuery } from "./queries";
type SanityDonateContent = Omit<DonateContent, "hero"> & {
  hero: Omit<DonateContent["hero"], "image"> & { image: SanityImageSource };
};
export async function getDonateContent(): Promise<DonateContent> {
  const content = await sanityClient.fetch<SanityDonateContent | null>(
    donatePageQuery,
    {},
    { next: { revalidate: 60 } },
  );
  if (
    !content?.formIntro ||
    !content.closing ||
    content.care?.cards.length !== 3
  )
    return defaultDonateContent;
  return {
    ...content,
    hero: {
      ...content.hero,
      image: urlFor(content.hero.image)
        .width(1200)
        .height(800)
        .fit("crop")
        .quality(80)
        .auto("format")
        .url(),
    },
  };
}
