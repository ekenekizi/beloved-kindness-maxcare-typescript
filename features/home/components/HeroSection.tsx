"use client";

import { ArrowRight, Heart } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import HeroGallery from "./HeroGallery";
import LinkButton from "@/components/ui/LinkButton";
import { heroPhotos } from "../data/hero-photos";
import "./HomePage.css";
import type { HomeHeroContent } from "../types";
const rise = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const defaultContent: HomeHeroContent = {
  eyebrow: "Small acts. Lasting change.",
  headingFirstLine: "Restoring hope.",
  headingHighlight: "Transforming",
  headingEnding: "lives.",
  description:
    "Supporting vulnerable communities through compassion, education, empowerment, and sustainable humanitarian action across Nigeria.",
  primaryButtonLabel: "Donate",
  secondaryButtonLabel: "Become a Volunteer",
  footnote: "Compassion in action. Hope in every community.",
  photos: heroPhotos,
};

function HeroSection({ content }: { content?: HomeHeroContent | null }) {
  const hero = content ?? defaultContent;
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";

  return (
    <section className="home-hero mb-20" aria-labelledby="hero-title">
      <div className="hero-copy">
        <motion.p
          className="hero-eyebrow"
          variants={rise}
          initial={initial}
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <Heart size={15} aria-hidden="true" />
          {hero.eyebrow}
        </motion.p>

        <motion.h1
          id="hero-title"
          className="hero-title font-sans"
          variants={rise}
          initial={initial}
          animate="visible"
          transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
        >
          {hero.headingFirstLine}
          <br />
          <span>{hero.headingHighlight}</span> {hero.headingEnding}
        </motion.h1>

        <motion.p
          className="hero-description"
          variants={rise}
          initial={initial}
          animate="visible"
          transition={{ duration: 0.6, delay: 0.28 }}
        >
          {hero.description}
        </motion.p>

        <motion.div
          className="hero-actions"
          variants={rise}
          initial={initial}
          animate="visible"
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <LinkButton href="/get-involved/donate" icon={Heart}>
            {hero.primaryButtonLabel}
          </LinkButton>

          <LinkButton
            href="/get-involved/volunteer"
            icon={ArrowRight}
            variant="secondary"
          >
            {hero.secondaryButtonLabel}
          </LinkButton>
        </motion.div>
      </div>

      <HeroGallery photos={hero.photos} />

      <motion.div
        className="hero-footnote"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <span aria-hidden="true" />
        {hero.footnote}
        <span aria-hidden="true" />
      </motion.div>
    </section>
  );
}

export default HeroSection;
