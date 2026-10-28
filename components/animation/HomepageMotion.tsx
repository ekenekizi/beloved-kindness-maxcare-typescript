"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

type RevealProps = Pick<
  HTMLAttributes<HTMLElement>,
  "id" | "role" | "aria-label" | "aria-labelledby" | "aria-describedby"
> & {
  children: ReactNode;
  className?: string;
  delay?: number;
  image?: boolean;
  hover?: boolean;
  as?: "div" | "article" | "header" | "aside" | "figure" | "section" | "nav";
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
  image = false,
  hover = false,
  as = "div",
  ...attributes
}: RevealProps) {
  const reducedMotion = useReducedMotion();
  const Component = {
    div: motion.div,
    article: motion.article,
    header: motion.header,
    aside: motion.aside,
    figure: motion.figure,
    section: motion.section,
    nav: motion.nav,
  }[as];

  return (
    <Component
      {...attributes}
      className={className}
      // Keep server-rendered content visible before JavaScript loads.
      initial={false}
      whileInView={
        reducedMotion
          ? { opacity: 1, y: 0, scale: 1 }
          : {
              opacity: [0, 1],
              y: [20, 0],
              scale: image ? [0.97, 1] : 1,
            }
      }
      viewport={{ once: true, amount: "some" }}
      transition={{
        duration: reducedMotion ? 0 : image ? 0.75 : 0.6,
        delay: reducedMotion ? 0 : delay,
        ease,
      }}
      whileHover={
        hover && !reducedMotion
          ? {
              y: -4,
              transition: { duration: 0.2, ease: "easeOut" },
            }
          : undefined
      }
    >
      {children}
    </Component>
  );
}

type GroupProps = {
  children: ReactNode;
  className?: string;
};

export function Stagger({ children, className }: GroupProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={false}
      whileInView="visible"
      viewport={{ once: true, amount: "some" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: reducedMotion ? 0 : 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: GroupProps) {
  const reducedMotion = useReducedMotion();

  const variants: Variants = {
    visible: reducedMotion
      ? {
          opacity: 1,
          y: 0,
          transition: { duration: 0 },
        }
      : {
          opacity: [0, 1],
          y: [18, 0],
          transition: { duration: 0.55, ease },
        },
  };

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
