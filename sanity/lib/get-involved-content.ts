import "server-only";
import type { SanityImageSource } from "@sanity/image-url";
import {
  defaultPartnerContent,
  defaultVolunteerContent,
  type InvolvementHero,
  type PartnerContent,
  type VolunteerContent,
} from "@/features/get-involved/data/involvement-content";
import { sanityClient } from "./client";
import { urlFor } from "./image";
import { partnerPageQuery, volunteerPageQuery } from "./queries";
type SanityHero = Omit<InvolvementHero, "image"> & { image: SanityImageSource };
function heroImage(hero: SanityHero): InvolvementHero {
  return {
    ...hero,
    image: urlFor(hero.image)
      .width(1200)
      .height(1056)
      .fit("crop")
      .quality(80)
      .auto("format")
      .url(),
  };
}
export async function getPartnerContent(): Promise<PartnerContent> {
  const content = await sanityClient.fetch<
    (Omit<PartnerContent, "hero"> & { hero: SanityHero }) | null
  >(partnerPageQuery, {}, { next: { revalidate: 60 } });
  if (!content || content.partnership?.steps.length !== 3)
    return defaultPartnerContent;
  return { ...content, hero: heroImage(content.hero) };
}
export async function getVolunteerContent(): Promise<VolunteerContent> {
  const content = await sanityClient.fetch<
    (Omit<VolunteerContent, "hero"> & { hero: SanityHero }) | null
  >(volunteerPageQuery, {}, { next: { revalidate: 60 } });
  if (!content || content.waysToHelp.length !== 3)
    return defaultVolunteerContent;
  return { ...content, hero: heroImage(content.hero) };
}
