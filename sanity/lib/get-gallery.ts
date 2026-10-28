import "server-only";

import type { SanityImageSource } from "@sanity/image-url";
import type { GalleryAlbum } from "@/features/gallery/types";

import {
  isGalleryProgramme,
  inferLegacyProgramme,
  inferLegacyYear,
} from "@/features/gallery/data/programmes";
import { sanityClient } from "./client";
import { urlFor } from "./image";
import { galleryAlbumsQuery } from "./queries";

type SanityGalleryPhoto = {
  id: string;
  title: string;
  alt: string;
  description: string;
  image: SanityImageSource;
};

type SanityGalleryAlbum = {
  programme?: string;
  year?: number;
  legacySlug: string;
  id: string;
  label: string;
  description: string;
  photos: SanityGalleryPhoto[];
};

export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  const albums = await sanityClient.fetch<SanityGalleryAlbum[]>(
    galleryAlbumsQuery,
    {},
    {
      next: {
        revalidate: 60,
      },
    },
  );

  return albums
    .filter((album) => album.photos.length > 0)
    .flatMap((album): GalleryAlbum[] => {
      const programme = isGalleryProgramme(album.programme)
        ? album.programme
        : inferLegacyProgramme(album.legacySlug);
      if (!programme) return [];
      const year =
        Number.isInteger(album.year) &&
        album.year! >= 1900 &&
        album.year! <= 2100
          ? album.year!
          : inferLegacyYear(album.legacySlug);
      return [
        {
          programme,
          year,
          id: album.id,
          label: album.label,
          description: album.description,

          photos: album.photos.map((photo) => ({
            id: `${album.id}:${photo.id}`,
            title: photo.title,
            alt: photo.alt,
            description: photo.description,

            src: urlFor(photo.image)
              .width(1600)
              .fit("max")
              .quality(80)
              .auto("format")
              .url(),
          })),
        },
      ];
    });
}
