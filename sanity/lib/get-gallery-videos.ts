import "server-only";
import type { SanityImageSource } from "@sanity/image-url";
import type { GalleryVideo } from "@/features/gallery/types";
import { sanityClient } from "./client";
import { urlFor } from "./image";

type VideoDocument = {
  id: string; title: string; description: string; videoUrl: string; mimeType: string;
  poster: SanityImageSource; posterAlt: string;
  duration?: string; captionsUrl?: string; featured?: boolean;
};

export async function getGalleryVideos(): Promise<{ videos: GalleryVideo[]; unavailable: boolean }> {
  try {
    const documents = await sanityClient.fetch<VideoDocument[]>(
      '*[_type == "galleryVideo" && defined(video.asset) && defined(poster.asset)] | order(uploadedAt desc, _createdAt desc, _id asc) { "id": _id, title, description, featured, duration, "videoUrl": video.asset->url, "mimeType": video.asset->mimeType, poster, "posterAlt": poster.alt, "captionsUrl": captions.asset->url }',
      {}, { next: { revalidate: 60 } },
    );
    const videos = documents.flatMap((document): GalleryVideo[] => {
      if (!document.title || !document.videoUrl ||
          !["video/mp4", "video/webm"].includes(document.mimeType)) return [];
      return [{
        id: document.id, title: document.title, description: document.description || "",
        videoUrl: document.videoUrl,
        posterUrl: urlFor(document.poster).width(1600).height(900).fit("crop").auto("format").url(),
        posterAlt: document.posterAlt || document.title,
        duration: document.duration, captionsUrl: document.captionsUrl,
        featured: document.featured === true,
      }];
    });
    return { videos, unavailable: false };
  } catch {
    return { videos: [], unavailable: true };
  }
}
