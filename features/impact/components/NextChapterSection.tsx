"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import type { ImpactContent } from "../data/impact-content";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import LinkButton from "@/components/ui/LinkButton";
import CurvedImage from "@/components/ui/CurvedImage";

const copy: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function NextChapterSection({
  content,
}: {
  content: ImpactContent["hero"];
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
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
              <SectionLabel>{content.label}</SectionLabel>
            </motion.div>

            <motion.h1
              variants={copy}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-serif text-[2.3rem] leading-[0.95] font-black tracking-tight uppercase sm:text-6xl"
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
              {content.description}
            </motion.p>

            <motion.div
              variants={copy}
              transition={{ duration: 0.6 }}
              className="mt-9 flex flex-wrap items-center gap-7"
            >
              <LinkButton
                href="/get-involved/donate"
                icon={ArrowRight}
                iconPosition="right"
              >
                {content.donateButtonLabel}
              </LinkButton>

              <LinkButton
                href="/get-involved/volunteer"
                variant="secondary"
                icon={ArrowRight}
              >
                {content.volunteerButtonLabel}
              </LinkButton>
            </motion.div>
          </motion.div>

          <div className="relative">
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
                src={content.image}
                alt={content.imageAlt}
                sizes="(min-width: 1280px) 560px, (min-width: 1024px) calc((100vw - 160px) / 2), calc(100vw - 48px)"
                loading="eager"
              />
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
