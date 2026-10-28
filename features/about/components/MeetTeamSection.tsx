"use client";

import { Reveal } from "@/components/animation/HomepageMotion";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { TeamContent } from "../data/team-content";

export default function MeetTeamSection({ content }: { content: TeamContent }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sectionId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const reducedMotion = useReducedMotion();
  const member = content.members.find((item) => item.id === activeId);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!member) {
      if (element.open) element.close();
      return;
    }
    // Native modal dialogs handle focus containment, Escape and background inertness.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!element.open) element.showModal();
    return () => {
      if (element.open) element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [member]);

  return (
    <section
      aria-labelledby={sectionId + "-heading"}
      className="relative bg-background py-20 font-sans lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <Reveal
          as="header"
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-12"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-6 shrink-0 bg-primary sm:w-10"
            />
            <p className="text-[10px] font-semibold tracking-[0.18em] text-primary uppercase sm:text-xs sm:tracking-[0.25em]">
              {content.label}
            </p>
            <span
              aria-hidden="true"
              className="h-px w-6 shrink-0 bg-primary sm:w-10"
            />
          </div>
          <h1
            id={sectionId + "-heading"}
            className="font-serif text-[2rem] leading-[1.05] font-black tracking-tight text-foreground sm:text-5xl"
          >
            {content.heading}
            <span className="mt-1 block text-primary">
              {content.headingHighlight}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            {content.description}
          </p>
        </Reveal>

        <div className="flex flex-wrap items-stretch justify-center gap-6">
          {content.members.map((person, index) => (
            <Reveal
              as="article"
              key={person.id}
              delay={Math.min(index * 0.06, 0.24)}
              hover
              className="flex w-full min-w-0 flex-col rounded-[1.4rem] border border-slate-200 bg-white p-3 shadow-[0_8px_30px_-15px_rgba(15,39,71,0.12)] sm:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                <Image
                  src={person.image}
                  alt={person.imageAlt}
                  fill
                  unoptimized={person.image.startsWith(
                    "https://cdn.sanity.io/",
                  )}
                  sizes="(min-width: 1280px) 359px, (min-width: 1024px) calc((100vw - 200px) / 3), (min-width: 640px) calc((100vw - 120px) / 2), calc(100vw - 64px)"
                  loading={index === 0 ? "eager" : "lazy"}
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-1 flex-col px-2 pt-5 pb-3 sm:px-3">
                <h2 className="font-serif text-xl leading-tight font-bold break-words text-foreground sm:text-2xl">
                  {person.name}
                </h2>
                <p className="mt-2 text-[11px] font-bold tracking-[0.12em] text-primary uppercase">
                  {person.role}
                </p>
                <p className="mt-5 text-[10px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
                  Contribution
                </p>
                <p className="mt-2 mb-6 text-sm leading-6 text-slate-600">
                  {person.contribution}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveId(person.id)}
                  aria-label={"Read biography of " + person.name}
                  aria-haspopup="dialog"
                  aria-controls={sectionId + "-bio-dialog"}
                  className="mt-auto flex min-h-11 w-fit items-center gap-2 rounded-md text-sm font-semibold text-primary transition hover:gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
                >
                  Read bio <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
        {content.members.length === 0 && (
          <p className="py-12 text-center text-slate-600">
            Our team profiles are coming soon.
          </p>
        )}
      </div>

      <dialog
        ref={dialog}
        id={sectionId + "-bio-dialog"}
        aria-labelledby={sectionId + "-bio-name"}
        aria-describedby={sectionId + "-bio-role"}
        onCancel={() => setActiveId(null)}
        onClose={() => setActiveId(null)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            setActiveId(null);
        }}
        className="fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-3xl overflow-y-auto overscroll-contain rounded-3xl border-0 bg-background p-0 text-foreground shadow-2xl backdrop:bg-slate-950/60"
      >
        {member && (
          <motion.div
            key={member.id}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="relative p-5 sm:p-8"
          >
            <button
              type="button"
              onClick={() => setActiveId(null)}
              aria-label="Close biography"
              className="absolute top-3 right-3 z-10 flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-foreground hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary sm:top-4 sm:right-4"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <div className="grid gap-6 pt-10 sm:grid-cols-[0.75fr_1.25fr] sm:gap-8 sm:pt-7">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[220px] self-start overflow-hidden rounded-2xl bg-slate-100 sm:mx-0 sm:max-w-none">
                <Image
                  src={member.image}
                  alt={member.imageAlt}
                  fill
                  unoptimized={member.image.startsWith(
                    "https://cdn.sanity.io/",
                  )}
                  sizes="(min-width: 640px) 260px, 220px"
                  className="object-cover object-top"
                />
              </div>
              <div>
                <h2
                  id={sectionId + "-bio-name"}
                  className="pr-3 font-serif text-2xl leading-tight font-bold sm:text-3xl"
                >
                  {member.name}
                </h2>
                <p
                  id={sectionId + "-bio-role"}
                  className="mt-2 text-xs font-bold tracking-wider text-primary uppercase"
                >
                  {member.role}
                </p>
                <h3 className="mt-7 font-serif text-xl font-bold">Biography</h3>
                <div className="mt-3 space-y-4 text-sm leading-7 text-slate-600">
                  {member.bio
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p key={index} className="whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                </div>
                <div className="mt-6 border-t border-slate-200 pt-5">
                  <h3 className="font-serif text-xl font-bold">Contribution</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {member.contribution}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </dialog>
    </section>
  );
}
