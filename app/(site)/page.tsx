import type { Metadata } from "next";
import { getMembershipContent } from "@/sanity/lib/get-membership-content";
import { getHomeYouth } from "@/sanity/lib/get-home-youth";
import { getHomePrograms } from "@/sanity/lib/get-home-programs";

import { siteConfig } from "@/config/site";

import HeroSection from "@/features/home/components/HeroSection";
import AboutSection from "@/features/home/components/AboutSection";
import ImpactSection from "@/features/home/components/ImpactSection";
import ProgramSection from "@/features/home/components/ProgramSection";
import StoriesSection from "@/features/home/components/StoriesSection";
import YouthDevelopmentSection from "@/features/home/components/YouthDevelopmentSection";
import MembershipSection from "@/features/get-involved/components/MembershipSection";
import { getTransformationStories } from "@/sanity/lib/get-stories";
import { getHomeHero } from "@/sanity/lib/get-home-hero";
import { getHomeAbout } from "@/sanity/lib/get-home-about";
import { getHomeImpact } from "@/sanity/lib/get-home-impact";

const homeTitle = `${siteConfig.name} | NGO in Nigeria`;

export const metadata: Metadata = {
  title: {
    absolute: homeTitle,
  },

  description: siteConfig.description,

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    title: homeTitle,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
  },

  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: siteConfig.description,
    images: [
      {
        url: "/opengraph-image",
        alt: "Beloved Kindness Maxcare — Restoring hope. Transforming lives.",
      },
    ],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  logo: new URL("/images/logo.png", siteConfig.url).href,
};

export default async function HomePage() {
  const [stories, homeHero, homeAbout, homeImpact, homePrograms, homeYouth, membershipContent] = await Promise.all([
    getTransformationStories(),
    getHomeHero(),
    getHomeAbout(),
    getHomeImpact(),
    getHomePrograms(),
    getHomeYouth(),
    getMembershipContent(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <HeroSection content={homeHero} />
      <AboutSection content={homeAbout} />
      <ImpactSection content={homeImpact} />
      <ProgramSection content={homePrograms} />
      {stories.length > 0 && <StoriesSection stories={stories} />}
      <YouthDevelopmentSection content={homeYouth} />
      <MembershipSection content={membershipContent} />
    </>
  );
}
