"use client";

import { ArrowRight, CirclePlay } from "lucide-react";
import CurvedImage from "@/components/ui/CurvedImage";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import LinkButton from "@/components/ui/LinkButton";
import type { HomeAboutContent } from "../types";

const copy: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const defaultContent: HomeAboutContent = {
  label: "About Us",
  headingStart: "Born Out of",
  headingHighlight: "Deep Calling.",
  headingEnd: "to Serve",
  description:
    "Beloved Kindness Maxcare is a nonprofit organization committed to restoring dignity and creating lasting opportunities for vulnerable individuals and communities across Nigeria. We believe that every person deserves hope, support, and the chance to thrive.",
  buttonLabel: "Our Story",
  image: "/images/about/aboutImg.jpg",
  imageAlt: "Beloved Kindness Maxcare community outreach",
};

export default function AboutSection({
  content,
}: {
  content?: HomeAboutContent | null;
}) {
  const about = content ?? defaultContent;
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <motion.div
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
              <SectionLabel>{about.label}</SectionLabel>
            </motion.div>

            <motion.h2
              variants={copy}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-serif text-3xl leading-[1.08] font-black tracking-tight uppercase sm:text-4xl lg:text-5xl"
            >
              {about.headingStart}
              <span className="text-primary block">
                {about.headingHighlight}
              </span>{" "}
              {about.headingEnd}
            </motion.h2>

            <motion.p
              variants={copy}
              transition={{ duration: 0.65 }}
              className="mt-7 max-w-xl text-base leading-8 text-slate-600 lg:text-lg"
            >
              {about.description}
            </motion.p>

            <motion.div
              variants={copy}
              transition={{ duration: 0.6 }}
              className="mt-9 flex flex-wrap items-center gap-7"
            >
              <LinkButton
                href="/about/story"
                icon={ArrowRight}
                iconPosition="right"
              >
                {about.buttonLabel}
              </LinkButton>

              <button
                type="button"
                disabled
                title="Video coming soon"
                className="hover:text-primary group flex w-fit items-center gap-1 rounded-md border border-gray-300 px-2 py-1 transition-all duration-300 hover:border-primary md:py-2"
              >
                Watch Our Video
                <CirclePlay
                  className="group-hover:text-primary mt-1 text-gray-500 transition-all duration-200 group-hover:translate-x-0.5"
                  size={18}
                  aria-hidden="true"
                />
              </button>
            </motion.div>
          </motion.div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-[490px]">
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
            >
              <CurvedImage
                src={about.image}
                alt={about.imageAlt}
                sizes="(min-width: 1140px) 490px, (min-width: 1024px) calc((100vw - 160px) / 2), (min-width: 560px) 512px, calc(100vw - 48px)"
              />
            </motion.div>
          </div>
        </div>
      </Container>

      <div className="bg-tertiary/5 pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full blur-3xl" />
    </section>
  );
}
