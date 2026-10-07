import Image from "next/image";
import { useId, type CSSProperties } from "react";

type CurvedImageProps = {
  src: string;
  alt: string;
  sizes: string;
  loading?: "eager" | "lazy";
};

export default function CurvedImage({
  src,
  alt,
  sizes,
  loading = "lazy",
}: CurvedImageProps) {
  const clipId = `image-curve-${useId().replace(/:/g, "")}`;

  const imageStyle = {
    "--image-clip": `url(#${clipId})`,
  } as CSSProperties;

  return (
    <>
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
        className="absolute"
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path
              d="
                M 0.07 0.08
                C 0.38 0.08, 0.72 0.05, 0.91 0.01
                Q 1 -0.01, 1 0.06
                L 1 0.84
                Q 1 0.89, 0.94 0.91
                C 0.68 0.97, 0.32 1, 0.07 1
                Q 0 1, 0 0.93
                L 0 0.15
                Q 0 0.08, 0.07 0.08
                Z
              "
            />
          </clipPath>
        </defs>
      </svg>

      <div
        style={imageStyle}
        className="relative aspect-[4/5] overflow-hidden [clip-path:var(--image-clip)] lg:aspect-[648/570] lg:rounded-[2rem] lg:[clip-path:none]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={loading}
          className="object-cover"
        />
      </div>
    </>
  );
}
