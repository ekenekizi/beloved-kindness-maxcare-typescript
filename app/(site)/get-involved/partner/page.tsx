import { Reveal } from "@/components/animation/HomepageMotion";
import type { Metadata } from "next";
import { getPartnerContent } from "@/sanity/lib/get-involved-content";

import { ArrowRight, HeartHandshake } from "lucide-react";

import CurvedImage from "@/components/ui/CurvedImage";
import SectionLabel from "@/components/ui/SectionLabel";
import LinkButton from "@/components/ui/LinkButton";
import PartnershipForm from "@/features/get-involved/components/PartnershipForm";

import "@/features/get-involved/components/PartnershipPage.css";

export const metadata: Metadata = {
  title: "Partner With Us",
  description:
    "Partner with Beloved Kindness Maxcare to support orphanage homes and widow empowerment through education, essential supplies, and practical assistance.",
  alternates: {
    canonical: "/get-involved/partner",
  },
};

export default async function PartnershipPage() {
  const content = await getPartnerContent();
  return (
    <div className="bg-background text-foreground pt-20">
      <header className="mx-auto max-w-[1120px] px-5 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <Reveal as="div" className="min-w-0">
            <SectionLabel>{content.hero.label}</SectionLabel>

            <h1 className="mt-5 font-serif text-[clamp(2.4rem,4.8vw,3.7rem)] leading-[1.03] font-black tracking-[-0.055em] uppercase">
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

            <p className="text-muted mt-6 max-w-[430px] text-base leading-8">
              {content.hero.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-6">
              <LinkButton
                href="#partnership-form"
                icon={ArrowRight}
                iconPosition="right"
              >
                {content.hero.primaryButtonLabel}
              </LinkButton>

              <a
                href="#partnership-areas"
                className="text-muted hover:text-primary rounded-sm border-b border-slate-200 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
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
                className="text-primary shrink-0"
              />

              <div className="min-w-0">
                <strong className="block text-sm leading-5 font-bold">
                  {content.hero.captionTitle}
                </strong>

                <span className="text-muted mt-1 block text-xs leading-5">
                  {content.hero.captionDescription}
                </span>
              </div>
            </figcaption>
          </Reveal>
        </div>
      </header>

      <PartnershipForm content={content.partnership} />
    </div>
  );
}
