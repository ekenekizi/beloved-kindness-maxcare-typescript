"use client";

import Image from "@/components/ui/ResponsiveImage";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "motion/react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";

import type { GalleryPhoto } from "../types";

type PhotoCarouselProps = {
  photos: GalleryPhoto[];
  label?: string;
  description?: string;
};

type VisiblePhoto = {
  photo: GalleryPhoto;
  index: number;
};

type CarouselPhotoProps = {
  photo: GalleryPhoto;
  index: number;
  count: number;
  position: MotionValue<number>;
  stageWidth: MotionValue<number>;
  isActive: boolean;
  onSelect: () => void;
};

const arrowClasses =
  "flex size-11 shrink-0 items-center justify-center rounded-full " +
  "border border-slate-200 text-slate-700 transition-colors " +
  "hover:border-primary hover:text-primary " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 " +
  "focus-visible:outline-primary";

function wrap(value: number, count: number) {
  return ((value % count) + count) % count;
}

function getVisiblePhotos(
  photos: GalleryPhoto[],
  activeIndex: number,
): VisiblePhoto[] {
  const count = photos.length;

  if (!count) return [];

  if (count === 1) {
    return [{ photo: photos[0], index: 0 }];
  }

  const offsets = count === 2 ? [0, 1] : [-1, 0, 1];

  return offsets.map((offset) => {
    const index = wrap(activeIndex + offset, count);

    return { photo: photos[index], index };
  });
}

function CarouselPhoto({
  photo,
  index,
  count,
  position,
  stageWidth,
  isActive,
  onSelect,
}: CarouselPhotoProps) {
  const step = (Math.PI * 2) / Math.max(count, 3);

  const transform = useTransform(() => {
    const angle = (index - position.get()) * step;
    const width = stageWidth.get();

    const radius = (width * (width < 480 ? 0.46 : 0.35)) / Math.sin(step);

    const depth = (1 - Math.cos(angle)) / 2;

    const x = Math.sin(angle) * radius;
    const y = depth * 14;
    const z = depth * -170;
    const rotation = Math.sin(angle) * -25;
    const scale = 1 - depth * 0.13;

    return [
      "translateX(-50%)",
      `translate3d(${x}px, ${y}px, ${z}px)`,
      `rotateY(${rotation}deg)`,
      `scale(${scale})`,
    ].join(" ");
  });

  const zIndex = useTransform(position, (value) => {
    const angle = (index - value) * step;

    return Math.round((Math.cos(angle) + 1) * 50);
  });

  const opacity = useTransform(position, (value) => {
    const angle = (index - value) * step;
    const distance = Math.abs(Math.atan2(Math.sin(angle), Math.cos(angle)));
    const fadeEnd = Math.min(Math.PI, step * 1.5);

    if (distance <= step) {
      return 1 - (distance / step) * 0.15;
    }

    return 0.85 * Math.max(0, (fadeEnd - distance) / (fadeEnd - step));
  });

  return (
    <motion.button
      type="button"
      tabIndex={isActive ? 0 : -1}
      aria-label={
        isActive ? `Expand photo: ${photo.title}` : `Show photo: ${photo.title}`
      }
      onClick={onSelect}
      style={{ transform, zIndex, opacity }}
      className="border-background bg-section-muted focus-visible:outline-primary absolute top-0 left-1/2 h-64 w-[72%] overflow-hidden rounded-2xl border-4 text-left shadow-xl [backface-visibility:hidden] focus-visible:outline-2 focus-visible:outline-offset-4 sm:h-80 sm:w-[48%] lg:h-[360px]"
    >
      <Image
        src={photo.src}
        
        alt={photo.alt}
        fill
        sizes="(min-width: 1104px) 492px, (min-width: 640px) 48vw, 72vw"
        loading={isActive ? "eager" : "lazy"}
        draggable={false}
        className="pointer-events-none object-cover select-none"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent"
      />

      <span
        aria-hidden="true"
        className="absolute bottom-4 left-4 text-xs font-medium tracking-widest text-white"
      >
        {String(index + 1).padStart(2, "0")}
        {" / "}
        {String(count).padStart(2, "0")}
      </span>

      {isActive && (
        <span
          aria-hidden="true"
          className="absolute right-4 bottom-3 flex size-9 items-center justify-center rounded-full border border-white/50 bg-black/20 text-white"
        >
          <Expand size={16} />
        </span>
      )}
    </motion.button>
  );
}

export default function PhotoCarousel({
  photos,
  label = "Photo gallery",
  description = "",
}: PhotoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [settledIndex, setSettledIndex] = useState(0);
  const [expandedPhoto, setExpandedPhoto] = useState<GalleryPhoto | null>(null);

  const dialogTitleId = useId();
  const stageRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const animationRef = useRef<{ stop: () => void } | null>(null);

  const targetRef = useRef(0);
  const dragStartRef = useRef(0);
  const ignoreClickRef = useRef(false);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPanActiveRef = useRef(false);
  const isTransitioningRef = useRef(false);

  const position = useMotionValue(0);
  const stageWidth = useMotionValue(0);
  const reduceMotion = useReducedMotion();

  const count = photos.length;
  const currentIndex = count ? wrap(activeIndex, count) : 0;
  const activePhoto = photos[currentIndex];

  const settledPhotos = getVisiblePhotos(photos, settledIndex);
  const destinationPhotos = getVisiblePhotos(photos, currentIndex);

  const visiblePhotos = [
    ...new Map(
      [...settledPhotos, ...destinationPhotos].map(
        (item) => [item.photo.id, item] as const,
      ),
    ).values(),
  ];

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) return;

    const observer = new ResizeObserver(([entry]) => {
      stageWidth.set(entry.contentRect.width);
    });

    observer.observe(stage);

    return () => observer.disconnect();
  }, [stageWidth, count]);

  useEffect(() => {
    return () => {
      animationRef.current?.stop();
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (expandedPhoto && dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [expandedPhoto]);

  function goTo(destination: number) {
    if (count < 2 || isTransitioningRef.current) return;

    animationRef.current?.stop();

    const nextIndex = wrap(destination, count);
    const target = count === 2 ? nextIndex : destination;

    targetRef.current = target;
    setActiveIndex(nextIndex);

    if (reduceMotion) {
      position.set(target);
      setSettledIndex(nextIndex);
      return;
    }

    isTransitioningRef.current = true;

    animationRef.current = animate(position, target, {
      type: "spring",
      stiffness: 170,
      damping: 27,
      mass: 1,
      onComplete: () => {
        setSettledIndex(nextIndex);
        isTransitioningRef.current = false;
        animationRef.current = null;
      },
    });
  }

  function selectPhoto(index: number) {
    let distance = index - wrap(targetRef.current, count);

    if (distance > count / 2) distance -= count;
    if (distance < -count / 2) distance += count;

    goTo(targetRef.current + distance);
  }

  function handlePanStart() {
    isPanActiveRef.current = false;

    if (count < 2 || isTransitioningRef.current) return;

    animationRef.current?.stop();
    dragStartRef.current = position.get();
    isPanActiveRef.current = true;
  }

  function handlePan(_event: PointerEvent, info: PanInfo) {
    if (!isPanActiveRef.current) return;

    ignoreClickRef.current = true;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => { ignoreClickRef.current = false; }, 400);

    const dragDistance = Math.max(stageWidth.get() * 0.42, 1);
    const progress = info.offset.x / dragDistance;
    const limitedProgress = Math.max(-1, Math.min(1, progress));

    position.set(dragStartRef.current - limitedProgress);
  }

  function handlePanEnd(event: PointerEvent, info: PanInfo) {
    if (!isPanActiveRef.current) return;

    isPanActiveRef.current = false;
    ignoreClickRef.current = true;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => { ignoreClickRef.current = false; }, 400);

    const threshold = stageWidth.get() * 0.12;
    const isSwipe =
      Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > 450;

    const cancelled = event.type === "pointercancel";
    const direction = isSwipe && !cancelled ? (info.offset.x < 0 ? 1 : -1) : 0;

    goTo(Math.round(dragStartRef.current) + direction);
  }

  function handlePhotoClick(index: number) {
    if (isTransitioningRef.current) return;
    if (ignoreClickRef.current) return;

    if (index === currentIndex) {
      setExpandedPhoto(photos[index]);
    } else {
      selectPhoto(index);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (expandedPhoto || count < 2) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(targetRef.current + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(targetRef.current - 1);
    }
  }

  if (!activePhoto) {
    return (
      <p className="py-12 text-center text-sm text-slate-600">
        Photos from this program will be added soon.
      </p>
    );
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="mx-auto w-full min-w-0 max-w-5xl"
    >
      <motion.div
        ref={stageRef}
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        className="relative isolate h-[280px] overflow-x-clip touch-pan-y select-none [perspective:1100px] sm:h-[344px] lg:h-[384px]"
      >
        <div
          aria-hidden="true"
          className="bg-section-muted absolute inset-x-0 top-12 bottom-8 -z-10"
        />

        {visiblePhotos.map(({ photo, index }) => (
          <CarouselPhoto
            key={photo.id}
            photo={photo}
            index={index}
            count={count}
            position={position}
            stageWidth={stageWidth}
            isActive={index === currentIndex}
            onSelect={() => handlePhotoClick(index)}
          />
        ))}
      </motion.div>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="mx-auto min-h-28 max-w-lg px-4 pt-5 text-center"
      >
        <span className="sr-only">
          Photo {currentIndex + 1} of {count}.
        </span>

        <h2 className="font-serif text-2xl font-bold text-slate-950">
          {activePhoto.title}
        </h2>

        {(activePhoto.description || description) && (
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {activePhoto.description || description}
          </p>
        )}
      </div>

      {count > 1 && (
        <>
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => goTo(targetRef.current - 1)}
              className={arrowClasses}
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>

            <div className="flex min-w-[92px] flex-col items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 tabular-nums">
                {String(currentIndex + 1).padStart(2, "0")}
                <span className="mx-1.5 text-slate-400">/</span>
                {String(count).padStart(2, "0")}
              </span>

              <div
                aria-hidden="true"
                className="h-1 w-20 overflow-hidden rounded-full bg-slate-200"
              >
                <div
                  className="bg-primary h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none"
                  style={{
                    width: `${((currentIndex + 1) / count) * 100}%`,
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              aria-label="Next photo"
              onClick={() => goTo(targetRef.current + 1)}
              className={arrowClasses}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-slate-600">
            Swipe or drag to explore · Tap the centre photo to expand
          </p>
        </>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby={dialogTitleId}
        onClose={() => setExpandedPhoto(null)}
        className="bg-background fixed inset-0 m-auto max-h-[90dvh] w-[min(92vw,960px)] overflow-auto rounded-2xl p-4 backdrop:bg-black/70"
      >
        {expandedPhoto && (
          <>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 id={dialogTitleId} className="font-serif text-xl font-bold">
                {expandedPhoto.title}
              </h2>

              <button
                type="button"
                aria-label="Close expanded photo"
                onClick={() => dialogRef.current?.close()}
                className={arrowClasses}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="relative h-[70dvh] w-full">
              <Image
                src={expandedPhoto.src}
                
                alt={expandedPhoto.alt}
                fill
                sizes="(min-width: 1044px) 928px, 92vw"
                loading="eager"
                className="rounded-xl object-contain"
              />
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
