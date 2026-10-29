import type { Metadata } from "next";

import { getGalleryVideos } from "@/sanity/lib/get-gallery-videos";
import GallerySection from "@/features/gallery/components/GallerySection";
import { getGalleryAlbums } from "@/sanity/lib/get-gallery";
import GetInvolvedSection from "@/features/get-involved/components/GetInvolvedSection";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore photos and videos from Beloved Kindness Maxcare's education programmes, orphanage visits, widow empowerment, and community outreach.",
  alternates: {
    canonical: "/gallery",
  },
};

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ view?: string | string[] }> }) {
  const query = await searchParams;
  const initialView = query.view === "videos" ? "videos" : "photos";
  const [galleryCategories, videoGallery] = await Promise.all([getGalleryAlbums(), getGalleryVideos()]);

  return (
    <div className="bg-background relative isolate overflow-hidden py-23 lg:py-30">
      <GallerySection key={initialView} initialView={initialView} categories={galleryCategories} videos={videoGallery.videos} videosUnavailable={videoGallery.unavailable} />
      <GetInvolvedSection />
    </div>
  );
}
