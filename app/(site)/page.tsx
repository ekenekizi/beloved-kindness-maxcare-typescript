import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

import HeroSection from "@/features/home/components/HeroSection";
import AboutSection from "@/features/home/components/AboutSection";
import ImpactSection from "@/features/home/components/ImpactSection";
import ProgramSection from "@/features/home/components/ProgramSection";
import StoriesSection from "@/features/home/components/StoriesSection";
import YouthDevelopmentSection from "@/features/home/components/YouthDevelopmentSection";
import PartnerWithUsSection from "@/features/home/components/PartnerWithUsSection";

import { transformationStories } from "@/features/home/data/transformation-stories";

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

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <HeroSection />
      <AboutSection />
      <ImpactSection />
      <ProgramSection />
      <StoriesSection stories={transformationStories} />
      <YouthDevelopmentSection gRoleUrl="https://thegroleafrica.org/" />
      <PartnerWithUsSection />
    </>
  );
}
