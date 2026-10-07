"use client";
import Image, { getImageProps } from "next/image";
import { preload } from "react-dom";
import { HERO_IMAGE_SIZES } from "../data/hero-photos";
import type { CSSProperties, UIEvent } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { HeroPhoto } from "../data/hero-photos";
import { motion, useReducedMotion } from "motion/react";

function getRopeY(x: number, width: number, sag: number) {
  const t = Math.max(0, Math.min(1, x / width));
  return 18 + 4 * sag * t * (1 - t);
}

type AnimatedPhotoProps = {
  item: HeroPhoto;
  offsets: number[];
  ropeOffsets: number[];
  desktop: boolean;
  reduceMotion: boolean | null;
  index: number;
  imageWidth: number;
};

function AnimatedPhoto({
  item,
  offsets,
  ropeOffsets,
  desktop,
  reduceMotion,
  index,
  imageWidth,
}: AnimatedPhotoProps) {
  const [entered, setEntered] = useState(false);

  // Capture the entrance path only when this card first mounts.
  const [entrance] = useState(() => ({
    offsets,
    ropeOffsets,
    desktop,
  }));

  return (
    <motion.div
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              x: entrance.offsets[0],
              y: entrance.ropeOffsets[0],
            }
      }
      animate={
        reduceMotion || entered
          ? { opacity: 1, x: 0, y: 0 }
          : {
              opacity: [0, 1, 1, 1, 1],
              x: entrance.offsets,
              y: entrance.ropeOffsets,
            }
      }
      transition={
        entered || reduceMotion
          ? { duration: 0 }
          : {
              duration: entrance.desktop ? 1.1 : 0.8,
              delay: entrance.desktop ? 0.7 + index * 0.15 : 0.7,
              ease: "easeOut",
              times: [0, 0.25, 0.5, 0.75, 1],
            }
      }
      onAnimationComplete={() => setEntered(true)}
    >
      <figure className="hero-photo-card">
        <span className="hero-photo-tab" aria-hidden="true">
          <span />
        </span>
        <Image
          src={item.src}
          alt={item.alt}
          sizes={index === 2 ? HERO_IMAGE_SIZES : `${imageWidth}px`}
          loading={desktop || index === 2 ? "eager" : "lazy"}
          fetchPriority={index === 2 ? "high" : "auto"}
          draggable={false}
        />
        <figcaption>{item.title}</figcaption>
      </figure>
    </motion.div>
  );
}

function HeroGallery({ photos }: { photos: HeroPhoto[] }) {
  const initialPhoto = photos[2];

  if (initialPhoto) {
    const { props } = getImageProps({
      src: initialPhoto.src,
      alt: initialPhoto.alt,
      sizes: HERO_IMAGE_SIZES,
    });

    preload(props.src, {
      as: "image",
      imageSrcSet: props.srcSet,
      imageSizes: props.sizes,
      fetchPriority: "high",
    });
  }
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const activeRef = useRef(2);
  const [activeIndex, setActiveIndex] = useState(2);
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const [scrollLeft, setScrollLeft] = useState(0);
  const desktop = layout.width >= 1024;
  const minimumGap = desktop ? 28 : 22;
  const sag = desktop
    ? Math.min(125, layout.width * 0.075)
    : Math.min(42, layout.height * 0.14);
  // Reserve space for the rope, caption, rotation and shadow before sizing photos.
  const cardWidth = desktop
    ? Math.min(340, layout.width * 0.18)
    : Math.max(
        100,
        Math.min(layout.width * 0.57, (layout.height - sag - 92) * 1.12, 300),
      );
  const gap = desktop ? layout.width * 0.2175 - cardWidth : minimumGap;
  const padding = desktop
    ? (layout.width - (cardWidth * 5 + gap * 4)) / 2
    : (layout.width - cardWidth) / 2;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      setLayout({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || layout.width === 0) return;

    // Set the position before the browser paints the measured layout.
    track.scrollLeft = desktop ? 0 : activeRef.current * (cardWidth + gap);

    // updateActiveCard synchronizes scroll state through the scroll event.
  }, [layout.width, cardWidth, gap, desktop]);

  function updateActiveCard(event: UIEvent<HTMLUListElement>) {
    const offset = event.currentTarget.scrollLeft;
    setScrollLeft(offset);
    const index = Math.max(
      0,
      Math.min(photos.length - 1, Math.round(offset / (cardWidth + gap))),
    );
    if (!desktop) {
      activeRef.current = index;
      setActiveIndex(index);
    }
  }

  function goToCard(index: number) {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    trackRef.current?.scrollTo({
      left: index * (cardWidth + gap),
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }

  return (
    <motion.div
      className="hero-gallery"
      role="region"
      aria-label="Our community in pictures"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.55 }}
    >
      <div className="hero-gallery-stage" ref={stageRef}>
        <svg
          className="hero-gallery-line"
          width="100%"
          height="100%"
          aria-hidden="true"
        >
          <path
            d={`M 0 18 Q ${layout.width / 2} ${18 + sag * 2} ${layout.width} 18`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <ul
          ref={trackRef}
          onScroll={updateActiveCard}
          className="hero-gallery-track"
          style={
            {
              "--card-width": `${cardWidth}px`,
              "--desktop-photo-height": `${Math.max(80, Math.min(cardWidth - 16, layout.height - sag - 94))}px`,
              gap,
              paddingInline: desktop ? 0 : Math.max(0, padding),
            } as CSSProperties
          }
          aria-label="Community photographs; scroll to explore"
          tabIndex={desktop ? -1 : 0}
        >
          {layout.width > 0 &&
            photos.map((item, index) => {
              const x =
                padding +
                cardWidth / 2 +
                index * (cardWidth + gap) -
                (desktop ? 0 : scrollLeft);

              const t = Math.max(0, Math.min(1, x / (layout.width || 1)));
              const ropeY = getRopeY(x, layout.width || 1, sag);

              // How far to the right the card begins.
              const travel = desktop ? 120 : 55;

              // Sample the rope as the card moves from right to left.
              const offsets = [
                travel,
                travel * 0.75,
                travel * 0.5,
                travel * 0.25,
                0,
              ];
              const ropeOffsets = offsets.map(
                (offset) =>
                  getRopeY(x + offset, layout.width || 1, sag) - ropeY,
              );

              return (
                <li
                  key={item.id}
                  className="hero-card-slot"
                  style={
                    {
                      marginTop: ropeY + 16,
                      left: desktop ? x - cardWidth / 2 : undefined,
                      "--card-rotation": desktop
                        ? `${(Math.atan((4 * sag * (1 - 2 * t)) / layout.width) * 180) / Math.PI}deg`
                        : item.rotation,
                    } as CSSProperties
                  }
                >
                  <AnimatedPhoto
                    item={item}
                    index={index}
                    offsets={offsets}
                    ropeOffsets={ropeOffsets}
                    desktop={desktop}
                    reduceMotion={reduceMotion}
                    imageWidth={Math.max(1, Math.round(cardWidth - 16))}
                  />
                </li>
              );
            })}
        </ul>
      </div>
      <div
        className="hero-gallery-dots"
        role="group"
        aria-label="Choose a photograph"
      >
        {photos.map((item, index) => (
          <button
            type="button"
            key={item.id}
            aria-label={`Show ${item.title}`}
            aria-pressed={index === activeIndex}
            onClick={() => goToCard(index)}
          >
            <span />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default HeroGallery;
