import { Reveal } from "@/components/animation/HomepageMotion";
import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarDays,
  Heart,
  HeartHandshake,
  Package,
  Sprout,
  Utensils,
} from "lucide-react";

import CurvedImage from "@/components/ui/CurvedImage";
import LinkButton from "@/components/ui/LinkButton";
import SectionLabel from "@/components/ui/SectionLabel";
import PhotoCarousel from "@/features/gallery/components/PhotoCarousel";
import { getLatestProgrammeAlbum } from "@/features/gallery/data/album-selection";
import { getGalleryAlbums } from "@/sanity/lib/get-gallery";
import { getProgrammeContent } from "@/sanity/lib/get-programme-content";

export const metadata: Metadata = {
  title: "Widows Feeding & Empowerment",
  description:
    "Support Beloved Kindness Maxcare’s widow empowerment programme through food provisions, household essentials and small business support.",
  alternates: {
    canonical: "/programs/widow",
  },
};

const donationHref = "/get-involved/donate?cause=widows";

const supportIcons = [Utensils, Package, Sprout];

export default async function WidowPage() {
  const [content, galleryCategories] = await Promise.all([
    getProgrammeContent("widow"),
    getGalleryAlbums(),
  ]);
  const supportAreas = content.supportAreas.map((area, index) => ({
    ...area,
    icon: supportIcons[index],
  }));

  const widowGallery = getLatestProgrammeAlbum(galleryCategories, "widow");

  return (
    <div className="bg-background pt-24 text-foreground">
      {/* Hero */}
      <header className="mx-auto max-w-[1120px] px-5 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.03fr_1fr] lg:gap-12">
          <Reveal as="div" className="min-w-0">
            <SectionLabel>{content.hero.label}</SectionLabel>

            <h1 className="mt-5 font-serif text-[clamp(2.2rem,4.6vw,3.7rem)] leading-[1.04] font-black tracking-[-0.055em] uppercase">
              {content.hero.headingLines.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
              <span className="text-primary block">
                {content.hero.highlightLines.map((line, index) => (
                  <span key={index} className="block">
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
                href={donationHref}
                icon={ArrowRight}
                iconPosition="right"
              >
                {content.hero.donateButtonLabel}
              </LinkButton>

              <a
                href="#widow-gallery"
                className="rounded-sm border-b border-slate-200 py-2 text-sm text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {content.hero.galleryLinkLabel} ↓
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

      {/* Seasonal gatherings and support areas */}
      <section
        aria-label="Our gatherings and ways to support widows"
        className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-10"
      >
        <Reveal
          as="div"
          className="mb-7 flex w-fit max-w-full items-start gap-3 rounded-2xl bg-amber-100 px-5 py-4 sm:items-center"
        >
          <CalendarDays
            size={24}
            aria-hidden="true"
            className="mt-1 shrink-0 text-primary sm:mt-0"
          />

          <div>
            <p className="text-sm leading-6 font-semibold">
              {content.schedule?.heading}
            </p>

            <p className="mt-1 text-xs leading-5 text-muted">
              {content.schedule?.description}
            </p>
          </div>
        </Reveal>

        <div className="grid gap-7 border-t border-slate-200 py-10 md:grid-cols-3">
          {supportAreas.map(({ id, title, description, icon: Icon }) => (
            <Reveal
              as="article"
              hover
              key={id}
              className="grid min-w-0 grid-cols-[25px_1fr] gap-x-4 md:block"
            >
              <Icon
                size={23}
                aria-hidden="true"
                className="row-span-2 mt-1 text-primary md:mt-0"
              />

              <h2 className="font-serif text-xl leading-tight font-bold tracking-tight md:mt-4">
                {title}
              </h2>

              <p className="col-start-2 mt-3 text-sm leading-7 text-muted">
                {description}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Programme explanation */}
      <section
        aria-labelledby="widow-purpose-heading"
        className="bg-[#f7f5ef] py-12 sm:py-14"
      >
        <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <Reveal as="div">
              <SectionLabel>{content.purpose.label}</SectionLabel>

              <h2
                id="widow-purpose-heading"
                className="mt-5 font-serif text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
              >
                {content.purpose.headingLines.map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </h2>

              <p className="mt-6 border-l-4 border-accent pl-5 font-serif text-xl leading-8 font-bold">
                {content.purpose.quote}
              </p>
            </Reveal>

            <Reveal
              as="div"
              className="space-y-5 text-base leading-8 text-muted"
            >
              {content.purpose.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </Reveal>
          </div>

          <Reveal
            as="aside"
            className="mt-10 grid items-center gap-6 rounded-2xl bg-[#132e53] p-6 text-white sm:p-8 lg:grid-cols-[1.3fr_1fr]"
          >
            <div>
              <h3 className="font-serif text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
                {content.donation.heading}
              </h3>

              <p className="mt-3 max-w-lg text-sm leading-7 text-blue-100">
                {content.donation.description}
              </p>
            </div>

            <div className="lg:justify-self-end">
              <LinkButton href={donationHref} icon={Heart} iconPosition="right">
                {content.donation.buttonLabel}
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Existing carousel with widow empowerment photos */}
      {widowGallery && (
        <section
          id="widow-gallery"
          aria-labelledby="widow-gallery-heading"
          className="scroll-mt-28 py-12 sm:py-16"
        >
          <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-10">
            <Reveal as="header" className="mx-auto max-w-xl text-center">
              <SectionLabel align="center">
                {content.gallery.label}
                {widowGallery.year ? " · " + widowGallery.year : ""}
              </SectionLabel>

              <h2
                id="widow-gallery-heading"
                className="mt-5 font-serif text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
              >
                {content.gallery.headingLines.map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted">
                {content.gallery.description || widowGallery.description}
              </p>
            </Reveal>

            <div className="mt-8">
              <PhotoCarousel
                photos={widowGallery.photos}
                label="Widow empowerment photos"
                description={widowGallery.description}
              />
            </div>
          </div>
        </section>
      )}

      {/* Final invitation */}
      <section className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-10">
        <Reveal
          as="div"
          className="flex flex-col items-start gap-6 border-t border-slate-200 py-10 md:flex-row md:items-center md:justify-between"
        >
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
              {content.invitation.heading}
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted">
              {content.invitation.description}
            </p>
          </div>

          <LinkButton
            href={donationHref}
            icon={ArrowRight}
            iconPosition="right"
          >
            {content.invitation.buttonLabel}
          </LinkButton>
        </Reveal>
      </section>
    </div>
  );
}
