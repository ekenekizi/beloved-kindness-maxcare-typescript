import "server-only";
import type { SanityImageSource } from "@sanity/image-url";
import {
  defaultOurStoryContent,
  type OurStoryContent,
  type StoryCard,
} from "@/features/about/data/our-story-content";
import { sanityClient } from "./client";
import { urlFor } from "./image";
import { ourStoryPageQuery } from "./queries";

type SanityStory = {
  hero: Omit<OurStoryContent["hero"], "image"> & { image: SanityImageSource };
  work: Omit<OurStoryContent["work"], "cards"> & {
    cards: (Omit<StoryCard, "image"> & { image: SanityImageSource })[];
  };
};

export async function getOurStory(): Promise<OurStoryContent> {
  const content = await sanityClient.fetch<SanityStory | null>(
    ourStoryPageQuery,
    {},
    { next: { revalidate: 60 } },
  );
  if (!content?.work || content.work.cards.length !== 3)
    return defaultOurStoryContent;
  return {
    hero: {
      ...content.hero,
      image: urlFor(content.hero.image)
        .width(1200)
        .height(1200)
        .fit("crop")
        .quality(80)
        .auto("format")
        .url(),
    },
    work: {
      ...content.work,
      cards: content.work.cards.map((card) => ({
        ...card,
        image: urlFor(card.image)
          .width(1200)
          .fit("max")
          .quality(80)
          .auto("format")
          .url(),
      })),
    },
  };
}
