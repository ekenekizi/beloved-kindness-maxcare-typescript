export const galleryProgrammes = [
  { value: "education", title: "Education" },
  { value: "orphanage", title: "Orphanage Support" },
  { value: "widow", title: "Widow Empowerment" },
  { value: "party", title: "Christmas Party" },
] as const;

export type GalleryProgramme = (typeof galleryProgrammes)[number]["value"];

export function isGalleryProgramme(value: unknown): value is GalleryProgramme {
  return galleryProgrammes.some((programme) => programme.value === value);
}

// Compatibility for existing albums; explicit Studio fields take precedence.
export function inferLegacyProgramme(slug: string): GalleryProgramme | null {
  if (slug.includes("education")) return "education";
  if (slug.includes("orphanage")) return "orphanage";
  if (slug.includes("widow")) return "widow";
  if (slug.includes("christmas") || slug.includes("christmass")) return "party";
  return null;
}

export function inferLegacyYear(slug: string): number | null {
  const match = slug.match(/(?:^|-)((?:19|20)\d{2})(?:-|$)/);
  return match ? Number(match[1]) : null;
}
