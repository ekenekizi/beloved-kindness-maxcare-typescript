export type SocialLinks = {
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  xUrl?: string;
};

// Published content is still validated at the rendering boundary.
export function socialUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}
