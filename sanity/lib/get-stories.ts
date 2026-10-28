import "server-only";

import type { SanityImageSource } from "@sanity/image-url";
import type { TransformationStory } from "@/features/home/data/transformation-stories";

import { sanityClient } from "./client";
import { urlFor } from "./image";
import { transformationStoriesQuery } from "./queries";

type SanityStory = Omit<TransformationStory, "image"> & {
  image: SanityImageSource;
};

export async function getTransformationStories(): Promise<
  TransformationStory[]
> {
  const stories = await sanityClient.fetch<SanityStory[]>(
    transformationStoriesQuery,
    {},
    {
      next: {
        revalidate: 60,
      },
    },
  );

  return stories.map((story) => ({
    ...story,
    image: urlFor(story.image)
      .width(1200)
      .fit("max")
      .quality(80)
      .auto("format")
      .url(),
  }));
}
