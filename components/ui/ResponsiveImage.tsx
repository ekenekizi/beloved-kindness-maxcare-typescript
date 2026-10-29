"use client";

import Image, { type ImageProps } from "next/image";
import { isSanityImage, sanityImageLoader } from "@/lib/sanity-image-loader";

// Local assets keep Next's optimizer. CMS images use Sanity's own image CDN.
export default function ResponsiveImage({ src, alt, loader, ...props }: ImageProps) {
  return <Image {...props} src={src} alt={alt} loader={isSanityImage(src) ? sanityImageLoader : loader} />;
}
