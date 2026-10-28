import type { HomeYouthContent } from "../types";

export const defaultHomeYouth: HomeYouthContent = {
  label: "Partnership & Youth Development",
  headingStart: "Connection to",
  headingHighlight: "G-Role Africa",
  description:
    "Through enlightening, counselling, creating awareness and shading light into the lives of children and young adults in the society, we will re-orient their minds towards the right and core values of good citizenship and leadership by restoring their dignity and sanity for the betterment of the people of Africa.",
  buttonLabel: "Visit G-Role Africa",
  partnerUrl: "https://thegroleafrica.org/",
  image: "/images/partners/G-Role.png",
  imageAlt: "Young people participating in G-Role Africa",
};

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
