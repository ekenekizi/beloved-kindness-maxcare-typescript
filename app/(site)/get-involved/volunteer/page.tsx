import { getMembershipContent } from "@/sanity/lib/get-membership-content";
import { Reveal } from "@/components/animation/HomepageMotion";
import type { Metadata } from "next";
import { getVolunteerContent } from "@/sanity/lib/get-involved-content";
import {
  ArrowRight,
  Clock,
  Heart,
  HeartHandshake,
  Lightbulb,
} from "lucide-react";

import CurvedImage from "@/components/ui/CurvedImage";
import SectionLabel from "@/components/ui/SectionLabel";
import LinkButton from "@/components/ui/LinkButton";
import MembershipSection from "@/features/get-involved/components/MembershipSection";

export const metadata: Metadata = {
  title: "Volunteer With Us",
  description:
    "Give your time, skills, and compassion to support Beloved Kindness Maxcare and help restore hope and dignity.",
  alternates: {
    canonical: "/get-involved/volunteer",
  },
};

const helpStyles = [
  { icon: Clock, iconClassName: "bg-blue-50 text-primary" },
  { icon: Lightbulb, iconClassName: "bg-amber-100 text-amber-700" },
  { icon: Heart, iconClassName: "bg-purple-100 text-purple-700" },
];

export default async function VolunteerPage() {
  const [content, membershipContent] = await Promise.all([
    getVolunteerContent(),
    getMembershipContent(),
  ]);
  const waysToHelp = content.waysToHelp.map((way, index) => ({
    ...way,
    ...helpStyles[index],
  }));
  return (
    <div className="bg-background pt-24 text-foreground">
      <header className="mx-auto max-w-[1120px] px-5 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.03fr_1fr] lg:gap-12">
          <Reveal as="div" className="min-w-0">
            <SectionLabel>{content.hero.label}</SectionLabel>

            <h1 className="mt-5 font-serif text-[clamp(2.6rem,5vw,3.75rem)] leading-[1.03] font-black tracking-[-0.055em] uppercase">
              {content.hero.heading}
              <br />
              <span className="text-primary">
                {content.hero.highlightLines.map((line, index) => (
                  <span className="block" key={index}>
                    {line}
                  </span>
                ))}
              </span>
            </h1>

            <p className="mt-6 max-w-[430px] text-base leading-8 text-muted">
              {content.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <LinkButton
                href="#join-us"
                icon={ArrowRight}
                iconPosition="right"
              >
                {content.hero.primaryButtonLabel}
              </LinkButton>

              <a
                href="#ways-to-help"
                className="rounded-sm border-b border-slate-200 py-2 text-sm text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {content.hero.secondaryButtonLabel} ↓
              </a>
            </div>
          </Reveal>

          <Reveal
            as="figure"
            image
            delay={0.12}
            className="relative isolate mx-auto w-full max-w-lg pb-8"
          >
            <CurvedImage
              src={content.hero.image}
              alt={content.hero.imageAlt}
              sizes="(min-width: 1120px) 484px, (min-width: 1024px) 45vw, (min-width: 560px) 512px, calc(100vw - 40px)"
              loading="eager"
            />

            <figcaption className="absolute bottom-0 left-0 flex max-w-[calc(100%-1rem)] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_14px_35px_rgba(19,44,64,0.08)] sm:-left-4 sm:px-5">
              <HeartHandshake
                size={24}
                aria-hidden="true"
                className="shrink-0 text-primary"
              />

              <div className="min-w-0">
                <strong className="block text-sm leading-5 font-bold">
                  {content.hero.captionTitle}
                </strong>

                <span className="mt-1 block text-xs leading-5 text-muted">
                  {content.hero.captionDescription}
                </span>
              </div>
            </figcaption>
          </Reveal>
        </div>
      </header>

      <section
        id="ways-to-help"
        aria-label="Ways to volunteer"
        className="mx-auto max-w-[1120px] scroll-mt-28 px-5 sm:px-6 lg:px-10"
      >
        <div className="grid gap-8 border-t border-slate-200 py-10 md:grid-cols-3 md:gap-6">
          {waysToHelp.map(
            ({ id, title, description, icon: Icon, iconClassName }) => (
              <Reveal as="article" key={id} className="flex items-start gap-4">
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
                >
                  <Icon size={20} aria-hidden="true" />
                </span>

                <div className="min-w-0">
                  <h2 className="font-serif text-xl leading-tight font-bold tracking-tight">
                    {title}
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-muted">
                    {description}
                  </p>
                </div>
              </Reveal>
            ),
          )}
        </div>
      </section>

      <div className="border-t border-slate-200 bg-section-muted">
        <MembershipSection content={membershipContent} />
      </div>
    </div>
  );
}
