import type { HeroPhoto } from "./data/hero-photos";

export type HomeYouthContent = {
  label: string;
  headingStart: string;
  headingHighlight: string;
  description: string;
  buttonLabel: string;
  partnerUrl: string;
  image: string;
  imageAlt: string;
};

export type HomeProgramsContent = {
  label: string;
  headingStart: string;
  headingHighlight: string;
  description: string;
  cards: {
    id: string;
    category: string;
    title: string;
    description: string;
    buttonLabel: string;
    href: string;
    image: string;
    imageAlt: string;
  }[];
};

export type HomeHeroContent = {
  eyebrow: string;
  headingFirstLine: string;
  headingHighlight: string;
  headingEnding: string;
  description: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  footnote: string;
  photos: HeroPhoto[];
};

export type HomeAboutContent = {
  label: string;
  headingStart: string;
  headingHighlight: string;
  headingEnd: string;
  description: string;
  buttonLabel: string;
  image: string;
  imageAlt: string;
};

export type HomeImpactContent = {
  label: string;
  headingStart: string;
  headingHighlight: string;
  headingEnd: string;
  description: string;
  galleryButtonLabel: string;
  partnerButtonLabel: string;
  stats: {
    id: string;
    number: number;
    label: string;
  }[];
};
