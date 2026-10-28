import "server-only";
import type { SanityImageSource } from "@sanity/image-url";
import {
  defaultProgrammeContent,
  type ProgrammeContent,
  type ProgrammeKey,
} from "@/features/programs/data/programme-content";
import { sanityClient } from "./client";
import { urlFor } from "./image";
import { programmePageQuery } from "./queries";

type SanityProgrammeContent = Omit<ProgrammeContent, "hero"> & {
  hero: Omit<ProgrammeContent["hero"], "image"> & { image: SanityImageSource };
};
const documents = {
  orphanage: {
    documentType: "orphanagePage",
    documentId: "orphanage-page",
    supportCount: 4,
  },
  widow: {
    documentType: "widowPage",
    documentId: "widow-page",
    supportCount: 3,
  },
  party: {
    documentType: "partyPage",
    documentId: "party-page",
    supportCount: 4,
  },
} as const;

export async function getProgrammeContent(
  key: ProgrammeKey,
): Promise<ProgrammeContent> {
  const { documentType, documentId, supportCount } = documents[key];
  const content = await sanityClient.fetch<SanityProgrammeContent | null>(
    programmePageQuery,
    { documentType, documentId },
    { next: { revalidate: 60 } },
  );
  if (
    !content ||
    content.supportAreas.length !== supportCount ||
    !content.purpose?.paragraphs.length ||
    !content.donation ||
    !content.gallery ||
    !content.invitation ||
    (key !== "party" && !content.schedule) ||
    (key === "party" && !content.hero.video)
  )
    return defaultProgrammeContent[key];
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
