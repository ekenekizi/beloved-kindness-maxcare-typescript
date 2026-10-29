import CounsellingForm from "@/features/programs/components/CounsellingForm";
import { Reveal } from "@/components/animation/HomepageMotion";
import type { Metadata } from "next";
import {
  ArrowRight,
  Backpack,
  BookOpen,
  GraduationCap,
  Heart,
  Shirt,
} from "lucide-react";

import CurvedImage from "@/components/ui/CurvedImage";
import LinkButton from "@/components/ui/LinkButton";
import SectionLabel from "@/components/ui/SectionLabel";
import PhotoCarousel from "@/features/gallery/components/PhotoCarousel";
import { getLatestProgrammeAlbum } from "@/features/gallery/data/album-selection";
import { getGalleryAlbums } from "@/sanity/lib/get-gallery";
import { getEducationContent } from "@/sanity/lib/get-education";
import { educationDonationHref } from "@/features/programs/data/education-content";

export const metadata: Metadata = {
  title: "Education & Child Counselling",
  description:
    "Education support and child counselling with qualified counsellors. Request an initial conversation for your child or support learning essentials.",
  alternates: {
    canonical: "/programs/education",
  },
};

const supportIcons = [GraduationCap, BookOpen, Shirt, Backpack];

export default async function EducationPage() {
  const [content, galleryCategories] = await Promise.all([
    getEducationContent(),
    getGalleryAlbums(),
  ]);
  const supportAreas = content.supportAreas.map((area, index) => ({
    ...area,
    icon: supportIcons[index],
  }));

  const educationGallery = getLatestProgrammeAlbum(
    galleryCategories,
    "education",
  );

  return (
    <div className="min-w-0 w-full bg-background pt-24 text-foreground">
      {/* Programme hero */}
      <header className="mx-auto max-w-[1120px] px-5 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="grid min-w-0 grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.03fr)_minmax(0,1fr)] lg:gap-12">
          <Reveal as="div" className="min-w-0">
            <SectionLabel>Education & Child Counselling</SectionLabel>

            <h1 className="mt-5 font-serif text-[clamp(2.2rem,5vw,3.7rem)] leading-[1.04] font-black tracking-[-0.055em] uppercase">
              {content.hero.heading}
              <br />
              <span className="text-primary">
                {content.hero.highlightFirstLine}
                <br />
                {content.hero.highlightSecondLine}
              </span>
            </h1>

            <p className="mt-6 max-w-[430px] text-base leading-8 text-muted">
              {content.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <LinkButton
                href={educationDonationHref}
                icon={ArrowRight}
                iconPosition="right"
              >
                {content.hero.donateButtonLabel}
              </LinkButton>

              <a
                href="#child-counselling"
                className="rounded-sm border-b border-slate-200 py-2 text-sm text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                Request child counselling ↓
              </a>
            </div>
          </Reveal>

          <Reveal
            as="figure"
            image
            delay={0.12}
            className="relative isolate mx-auto w-full min-w-0 max-w-lg pb-8"
          >
            <CurvedImage
              src={content.hero.image}
              alt={content.hero.imageAlt}
              sizes="(min-width: 1120px) 484px, (min-width: 1024px) 45vw, (min-width: 560px) 512px, calc(100vw - 40px)"
              loading="eager"
            />

            <figcaption className="absolute bottom-0 left-0 flex max-w-[calc(100%-1rem)] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_14px_35px_rgba(19,44,64,0.08)] sm:-left-4 sm:px-5">
              <GraduationCap
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

      {/* Types of education support */}
      <section
        aria-label="How we support education"
        className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-10"
      >
        <div className="grid grid-cols-2 gap-7 border-t border-slate-200 py-10 lg:grid-cols-4">
          {supportAreas.map(({ id, title, description, icon: Icon }) => (
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
        aria-labelledby="education-purpose-heading"
        className="bg-section-muted py-12 sm:py-14"
      >
        <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-10">
          <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
            <Reveal as="div">
              <SectionLabel>{content.purpose.label}</SectionLabel>

              <h2
                id="education-purpose-heading"
                className="mt-5 font-serif text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
              >
                {content.purpose.heading}
                <br />
                {content.purpose.headingSecondLine}
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
            className="mt-10 grid min-w-0 grid-cols-1 items-center gap-6 rounded-2xl bg-[#132e53] p-6 text-white sm:p-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
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
              <p className="mb-4 text-xs leading-6 text-blue-100">
                Suggested gift · ₦25,000 for education
              </p>

              <LinkButton
                href={educationDonationHref}
                icon={ArrowRight}
                iconPosition="right"
              >
                {content.donation.buttonLabel}
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>

      <CounsellingForm />

      {/* Reuse the existing carousel with education photos only. */}
      {educationGallery && (
        <section
          id="education-gallery"
          aria-labelledby="education-gallery-heading"
          className="scroll-mt-28 py-12 sm:py-16"
        >
          <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-10">
            <Reveal as="header" className="mx-auto max-w-xl text-center">
              <SectionLabel align="center">
                {content.gallery.label}
              </SectionLabel>

              <h2
                id="education-gallery-heading"
                className="mt-5 font-serif text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
              >
                {content.gallery.heading}
                <br />
                {content.gallery.headingSecondLine}
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted">
                {content.gallery.description}
              </p>
            </Reveal>

            <div className="mt-8">
              <PhotoCarousel
                photos={educationGallery.photos}
                label={
                  "Education programme photos" +
                  (educationGallery.year ? " · " + educationGallery.year : "")
                }
                description={educationGallery.description}
              />
            </div>
          </div>
        </section>
      )}

      {/* Beneficiary partners */}
      <section className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-10">
        <Reveal
          as="div"
          className="flex flex-col items-start gap-6 border-t border-slate-200 py-10 md:flex-row md:items-center md:justify-between"
        >
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
              {content.partners.heading}
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted">
              {content.partners.description}
            </p>
          </div>

          <LinkButton href={educationDonationHref} icon={Heart}>
            {content.partners.buttonLabel}
          </LinkButton>
        </Reveal>
      </section>
    </div>
  );
}
