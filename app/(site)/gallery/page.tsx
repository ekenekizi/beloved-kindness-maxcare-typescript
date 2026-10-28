import type { Metadata } from "next";

import GallerySection from "@/features/gallery/components/GallerySection";
import { getGalleryAlbums } from "@/sanity/lib/get-gallery";
import GetInvolvedSection from "@/features/get-involved/components/GetInvolvedSection";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore photographs from Beloved Kindness Maxcare's education programmes, orphanage visits, widow empowerment, and community outreach.",
  alternates: {
    canonical: "/gallery",
  },
};

export default async function GalleryPage() {
  const galleryCategories = await getGalleryAlbums();

  return (
    <div className="bg-background relative isolate overflow-hidden py-23 lg:py-30">
      <GallerySection categories={galleryCategories} />
      <GetInvolvedSection />
    </div>
  );
}
