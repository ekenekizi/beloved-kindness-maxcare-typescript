"use client";

import { ArrowRight, Heart } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import HeroGallery from "./HeroGallery";
import LinkButton from "@/components/ui/LinkButton";
import { heroPhotos } from "../data/hero-photos";
import "./HomePage.css";

const rise = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function HeroSection() {
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
          Small acts. Lasting change.
        </motion.p>

        <motion.h1
          id="hero-title"
          className="hero-title font-sans"
          variants={rise}
          initial={initial}
          animate="visible"
          transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
        >
          Restoring hope.
          <br />
          <span>Transforming</span> lives.
        </motion.h1>

        <motion.p
          className="hero-description"
          variants={rise}
          initial={initial}
          animate="visible"
          transition={{ duration: 0.6, delay: 0.28 }}
        >
          Supporting vulnerable communities through compassion, education,
          empowerment, and sustainable humanitarian action across Nigeria.
        </motion.p>

        <motion.div
          className="hero-actions"
          variants={rise}
          initial={initial}
          animate="visible"
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <LinkButton href="/get-involved/donate" icon={Heart}>Donate</LinkButton>

          <LinkButton href="/get-involved/volunteer" icon={ArrowRight} variant="secondary">
            Become a Volunteer
          </LinkButton>
        </motion.div>
      </div>

      <HeroGallery photos={heroPhotos} />

      <motion.div
        className="hero-footnote"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <span aria-hidden="true" />
        Compassion in action. Hope in every community.
        <span aria-hidden="true" />
      </motion.div>
    </section>
  );
}

export default HeroSection;
