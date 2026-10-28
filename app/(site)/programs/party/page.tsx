import { Reveal } from "@/components/animation/HomepageMotion";
import type { Metadata } from "next";
import {
  ArrowRight,
  Film,
  Gift,
  Heart,
  HeartHandshake,
  Music,
  Utensils,
} from "lucide-react";

import LinkButton from "@/components/ui/LinkButton";
import SectionLabel from "@/components/ui/SectionLabel";
import PhotoCarousel from "@/features/gallery/components/PhotoCarousel";
import { getLatestProgrammeAlbum } from "@/features/gallery/data/album-selection";
import { getGalleryAlbums } from "@/sanity/lib/get-gallery";
import { getProgrammeContent } from "@/sanity/lib/get-programme-content";

export const metadata: Metadata = {
  title: "Christmas Party",
  description:
    "Celebrate kindness with Beloved Kindness Maxcare through Christmas gatherings, shared meals, gifts and community support.",
  alternates: {
    canonical: "/programs/party",
  },
};

const donationHref = "/get-involved/donate?cause=community";

const supportIcons = [Utensils, Gift, Music, HeartHandshake];

export default async function ChristmasPartyPage() {
  const [content, galleryCategories] = await Promise.all([
    getProgrammeContent("party"),
    getGalleryAlbums(),
  ]);
  const celebrationAreas = content.supportAreas.map((area, index) => ({
    ...area,
    icon: supportIcons[index],
  }));

  const christmasGallery = getLatestProgrammeAlbum(galleryCategories, "party");

  return (
    <div className="bg-background pt-24 text-foreground">
      {/* Hero */}
      <header className="mx-auto max-w-[1120px] px-5 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.08fr] lg:gap-12">
          <Reveal as="div" className="min-w-0">
            <SectionLabel>{content.hero.label}</SectionLabel>

            <h1 className="mt-5 font-serif text-[clamp(2.3rem,5vw,3.7rem)] leading-[1.04] font-black tracking-[-0.055em] uppercase">
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
                href="#christmas-gallery"
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
            className="mx-auto w-full max-w-xl"
          >
            <div className="mb-3 flex items-center gap-2 text-xs leading-6 text-muted">
              <Film
                size={17}
                aria-hidden="true"
                className="shrink-0 text-primary"
              />

              <span>{content.hero.videoLabel}</span>
            </div>

            <div className="overflow-hidden rounded-[28px] bg-[#132c40]">
              <video
                controls
                playsInline
                preload="none"
                poster={content.hero.image}
                aria-label={content.hero.videoDescription}
                className="block aspect-[576/320] w-full object-contain"
              >
                <source src={content.hero.video} type="video/mp4" />
                Your browser does not support video playback.
                <a href={content.hero.video}>
                  Open the Christmas celebration video.
                </a>
              </video>
            </div>

            <figcaption className="relative mx-auto flex w-[94%] items-center gap-3 rounded-b-2xl border border-t-0 border-slate-200 bg-white px-4 py-5 shadow-[0_14px_35px_rgba(19,44,64,0.08)] sm:px-5">
              <div className="min-w-0">
                <strong className="block text-sm leading-6 font-bold">
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

      {/* What the celebration brings */}
      <section
        aria-label="What the celebration brings"
        className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-10"
      >
        <div className="grid grid-cols-2 gap-7 border-t border-slate-200 py-10 lg:grid-cols-4">
          {celebrationAreas.map(({ id, title, description, icon: Icon }) => (
            <Reveal as="article" hover key={id} className="min-w-0">
              <Icon size={23} aria-hidden="true" className="text-primary" />

              <h2 className="mt-4 font-serif text-xl leading-tight font-bold tracking-tight">
                {title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Programme explanation */}
      <section
        aria-labelledby="christmas-purpose-heading"
        className="bg-section-muted py-12 sm:py-14"
      >
        <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <Reveal as="div">
              <SectionLabel>{content.purpose.label}</SectionLabel>

              <h2
                id="christmas-purpose-heading"
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

      {/* Existing carousel, Christmas photos only */}
      {christmasGallery && (
        <section
          id="christmas-gallery"
          aria-labelledby="christmas-gallery-heading"
          className="scroll-mt-28 py-12 sm:py-16"
        >
          <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-10">
            <Reveal as="header" className="mx-auto max-w-xl text-center">
              <SectionLabel align="center">
                {content.gallery.label}
                {christmasGallery.year ? " · " + christmasGallery.year : ""}
              </SectionLabel>

              <h2
                id="christmas-gallery-heading"
                className="mt-5 font-serif text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
              >
                {content.gallery.headingLines.map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted">
                {content.gallery.description || christmasGallery.description}
              </p>
            </Reveal>

            <div className="mt-8">
              <PhotoCarousel
                photos={christmasGallery.photos}
                label={`${christmasGallery.label} photos`}
                description={christmasGallery.description}
              />
            </div>
          </div>
        </section>
      )}

      {/* Ways to get involved */}
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

          <div className="flex flex-wrap items-center gap-4">
            <LinkButton href="/get-involved/partner" icon={HeartHandshake}>
              {content.invitation.buttonLabel}
            </LinkButton>

            <LinkButton
              href="/get-involved/volunteer"
              variant="secondary"
              icon={ArrowRight}
            >
              {content.invitation.secondaryButtonLabel}
            </LinkButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
