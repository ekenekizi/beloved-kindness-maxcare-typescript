"use client";

import { ArrowRight, CirclePlay } from "lucide-react";
import CurvedImage from "@/components/ui/CurvedImage";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import LinkButton from "@/components/ui/LinkButton";

const copy: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutSection() {
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
              <SectionLabel>About Us</SectionLabel>
            </motion.div>

            <motion.h2
              variants={copy}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-serif text-5xl leading-[0.95] font-black tracking-tight uppercase sm:text-6xl lg:text-7xl"
            >
              Born Out of
              <span className="text-primary block">Deep Calling.</span> to Serve
            </motion.h2>

            <motion.p
              variants={copy}
              transition={{ duration: 0.65 }}
              className="mt-7 max-w-xl text-base leading-8 text-slate-600 lg:text-lg"
            >
              Beloved Kindness Maxcare is a nonprofit organization committed to
              restoring dignity and creating lasting opportunities for
              vulnerable individuals and communities across Nigeria. We believe
              that every person deserves hope, support, and the chance to
              thrive.
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
                Our Story
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
                src="/images/about/aboutImg.jpg"
                alt="Beloved Kindness Maxcare community outreach"
                sizes="(min-width: 1280px) 560px, (min-width: 1024px) calc(50vw - 80px), calc(100vw - 48px)"
              />
            </motion.div>
          </div>
        </div>
      </Container>

      <div className="bg-tertiary/5 pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full blur-3xl" />
    </section>
  );
}
