import {
  defaultStoriesIntro,
  type StoriesIntro,
} from "@/features/home/data/stories-intro";

export type ImpactContent = {
  hero: {
    label: string;
    heading: string;
    headingHighlight: string;
    description: string;
    donateButtonLabel: string;
    volunteerButtonLabel: string;
    image: string;
    imageAlt: string;
  };
  storiesIntro: StoriesIntro;
};

export const defaultImpactContent: ImpactContent = {
  hero: {
    label: "Be the turning point",
    heading: "Help Write the",
    headingHighlight: "Next Chapter.",
    description:
      "Every transformation begins with someone who chooses to care. Your support to educate, protect, and empower more children, women, and families across the globe starts right here.",
    donateButtonLabel: "Donate Now",
    volunteerButtonLabel: "Get Involved",
    image: "/images/impact/next-chapter.png",
    imageAlt: "Beloved Kindness Maxcare community outreach",
  },
  storiesIntro: defaultStoriesIntro,
};
