import "server-only";

import type { SanityImageSource } from "@sanity/image-url";
import type { HomeHeroContent } from "@/features/home/types";

import { sanityClient } from "./client";
import { urlFor } from "./image";
import { homeHeroQuery } from "./queries";

type SanityHeroPhoto = {
  id: string;
  title: string;
  alt: string;
  image: SanityImageSource;
};

type SanityHomeHero = Omit<HomeHeroContent, "photos"> & {
  photos: SanityHeroPhoto[];
};

const rotations = ["-6deg", "2deg", "-3deg", "5deg", "-4deg"];

export async function getHomeHero(): Promise<HomeHeroContent | null> {
  const content = await sanityClient.fetch<SanityHomeHero | null>(
    homeHeroQuery,
    {},
    {
      next: {
        revalidate: 60,
      },
    },
  );

  if (!content || content.photos.length !== 5) {
    console.warn(
      "Homepage hero needs a published document with five available photos.",
    );

    return null;
  }

  return {
    ...content,

    photos: content.photos.map((photo, index) => ({
      id: photo.id,
      title: photo.title,
      alt: photo.alt,
      rotation: rotations[index],
      width: 1000,
      height: 800,

      src: urlFor(photo.image)
        .width(1000)
        .height(800)
        .fit("crop")
        .quality(80)
        .auto("format")
        .url(),
    })),
  };
}
