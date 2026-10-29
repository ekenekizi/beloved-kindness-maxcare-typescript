import type { ImageLoaderProps } from "next/image";

export function isSanityImage(src: unknown): src is string {
  return typeof src === "string" && src.startsWith("https://cdn.sanity.io/images/");
}

// Sanity delivers the responsive variants directly, avoiding a second image proxy.
export function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!isSanityImage(src)) return src;
  const url = new URL(src);
  const originalWidth = Number(url.searchParams.get("w"));
  const originalHeight = Number(url.searchParams.get("h"));
  url.searchParams.set("w", String(width));
  if (originalWidth > 0 && originalHeight > 0) {
    url.searchParams.set("h", String(Math.max(1, Math.round(originalHeight * width / originalWidth))));
  }
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  return url.toString();
}
