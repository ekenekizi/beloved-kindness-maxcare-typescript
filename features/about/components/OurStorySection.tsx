"use client";

import Image from "next/image";
import { useId } from "react";
import { ArrowDown, HeartHandshake, MapPin } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import type { OurStoryContent } from "../data/our-story-content";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import LinkButton from "@/components/ui/LinkButton";

const copy: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function OurStorySection({
  content,
}: {
  content: OurStoryContent["hero"];
}) {
  const reduceMotion = useReducedMotion();
  const clipId = `story-heart-${useId().replace(/:/g, "")}`;

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
        className="absolute"
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d="M 0.5 0.95 C 0.43 0.88, 0.02 0.59, 0.02 0.30 C 0.02 0.04, 0.34 -0.03, 0.5 0.20 C 0.66 -0.03, 0.98 0.04, 0.98 0.30 C 0.98 0.59, 0.57 0.88, 0.5 0.95 Z" />
          </clipPath>
        </defs>
      </svg>

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            className="min-w-0 lg:order-1"
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ staggerChildren: 0.13 }}
          >
            <motion.div
              variants={copy}
              transition={{ duration: 0.55 }}
              className="mb-7"
            >
              <SectionLabel>{content.label}</SectionLabel>
            </motion.div>

            <motion.h1
              variants={copy}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-serif text-4xl leading-[0.95] font-black tracking-tight uppercase sm:text-5xl"
            >
              {content.heading}
              <span className="text-primary block">
                {content.headingHighlight}
              </span>
            </motion.h1>

            <motion.p
              variants={copy}
              transition={{ duration: 0.65 }}
              className="mt-7 max-w-xl text-base leading-8 text-slate-600 lg:text-lg"
            >
              {content.description} The charity aspect is geared towards a
              sustainable livelihood for the orphans, widows, less privileged
              and the low lives.
            </motion.p>

            <motion.div
              variants={copy}
              transition={{ duration: 0.65 }}
              className="bg-primary/20 mt-7 flex w-fit max-w-full items-start gap-2.5 rounded-md px-3 py-2 sm:items-center"
            >
              <div className="mt-0.5 flex shrink-0 flex-col items-center gap-1 sm:mt-0">
                <MapPin aria-hidden="true" className="text-primary size-4" />
                <span
                  aria-hidden="true"
                  className="bg-primary h-0.5 w-5 rounded-full"
                />
              </div>

              <p className="max-w-xl text-xs leading-5 font-semibold">
                <span className="block sm:inline">{content.location}</span>

                <span className="hidden sm:inline"> • </span>

                <span className="block sm:inline">{content.serviceArea}</span>
              </p>
            </motion.div>

            <motion.div
              variants={copy}
              transition={{ duration: 0.6 }}
              className="mt-9 flex flex-wrap items-center gap-7"
            >
              <LinkButton
                href="#our-work"
                icon={ArrowDown}
                iconPosition="right"
              >
                {content.discoverButtonLabel}
              </LinkButton>

              <LinkButton
                href="/get-involved/volunteer"
                variant="secondary"
                icon={HeartHandshake}
              >
                {content.volunteerButtonLabel}
              </LinkButton>
            </motion.div>
          </motion.div>

          <div className="relative mx-auto w-full max-w-xl lg:order-2">
            <motion.div
              initial={
                reduceMotion ? false : { opacity: 0, y: 35, scale: 0.97 }
              }
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="drop-shadow-[0_18px_28px_rgba(15,39,71,0.16)]"
            >
              <div
                style={{ clipPath: `url(#${clipId})` }}
                className="bg-primary relative aspect-square w-full overflow-hidden"
              >
                <Image
                  src={content.image}
                  unoptimized={content.image.startsWith(
                    "https://cdn.sanity.io/",
                  )}
                  alt={content.imageAlt}
                  fill
                  sizes="(min-width: 1280px) 560px, (min-width: 1024px) calc((100vw - 160px) / 2), (min-width: 624px) 576px, calc(100vw - 48px)"
                  loading="eager"
                  className="object-cover object-center"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="bg-tertiary/5 pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full blur-3xl"
      />
    </section>
  );
}
