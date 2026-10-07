import type { StaticImageData } from "next/image";

import schoolVisit from "@/public/images/hero/heroGallery-3.jpg";
import orphanageVisit from "@/public/images/hero/heroGallery-5.png";
import communityService from "@/public/images/hero/heroGallery-4.jpg";
import streetOutreach from "@/public/images/hero/heroGallery-2.jpg";
import communityGroup from "@/public/images/hero/heroGallery-1.jpg";

export type HeroPhoto = {
  id: string;
  title: string;
  src: StaticImageData;
  alt: string;
  rotation: string;
};

export const HERO_IMAGE_SIZES = [
  "(min-width: 1889px) 324px",
  "(min-width: 1024px) calc(18vw - 16px)",
  "(min-width: 527px) 284px",
  "calc(57vw - 16px)",
].join(", ");

export const heroPhotos: HeroPhoto[] = [
  {
    id: "school-visit",
    title: "School visitation",
    src: schoolVisit,
    alt: "Beloved Kindness Maxcare school visitation",
    rotation: "-6deg",
  },
  {
    id: "orphanage-visit",
    title: "Orphanage visitation",
    src: orphanageVisit,
    alt: "Beloved Kindness Maxcare orphanage outreach",
    rotation: "2deg",
  },
  {
    id: "community-service",
    title: "Community service",
    src: communityService,
    alt: "Beloved Kindness Maxcare community service",
    rotation: "-3deg",
  },
  {
    id: "street-outreach",
    title: "Outdoor charity",
    src: streetOutreach,
    alt: "Beloved Kindness Maxcare outdoor charity outreach",
    rotation: "5deg",
  },
  {
    id: "community-group",
    title: "Together in kindness",
    src: communityGroup,
    alt: "Beloved Kindness Maxcare community group",
    rotation: "-4deg",
  },
];
