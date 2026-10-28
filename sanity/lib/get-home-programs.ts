import "server-only";

import type { SanityImageSource } from "@sanity/image-url";
import type { HomeProgramsContent } from "@/features/home/types";
import {
  defaultHomePrograms,
  programDestinations,
} from "@/features/home/data/home-programs";
import { sanityClient } from "./client";
import { urlFor } from "./image";
import { homeProgramsQuery } from "./queries";

type SanityProgramCard = Omit<HomeProgramsContent["cards"][number], "image"> & {
  image: SanityImageSource;
};

type SanityHomePrograms = Omit<HomeProgramsContent, "cards"> & {
  cards: SanityProgramCard[];
};

export async function getHomePrograms(): Promise<HomeProgramsContent> {
  const content = await sanityClient.fetch<SanityHomePrograms | null>(
    homeProgramsQuery,
    {},
    { next: { revalidate: 60 } },
  );

  if (
    !content ||
    content.cards.length !== 3 ||
    content.cards.some(
      (card) => !programDestinations.some((route) => route.value === card.href),
    )
  ) {
    return defaultHomePrograms;
  }

  return {
    ...content,
    cards: content.cards.map((card) => ({
      ...card,
      image: urlFor(card.image)
        .width(1000)
        .height(1100)
        .fit("crop")
        .quality(80)
        .auto("format")
        .url(),
    })),
  };
}
