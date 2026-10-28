import type { StaticImageData } from "next/image";

export type GalleryPhoto = {
  id: string;
  src: string | StaticImageData;
  alt: string;
  title: string;
  description?: string;
};

import type { GalleryProgramme } from "./data/programmes";

export type GalleryAlbum = GalleryCategory & {
  programme: GalleryProgramme;
  year: number | null;
};

export type GalleryCategory = {
  id: string;
  label: string;
  description: string;
  photos: GalleryPhoto[];
};
