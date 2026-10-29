"use client";

import { Reveal } from "@/components/animation/HomepageMotion";
import { useState } from "react";
import { Images, Video } from "lucide-react";
import GallerySelectionFilters from "./GallerySelectionFilters";

import dynamic from "next/dynamic";
const VideoGallery = dynamic(() => import("./VideoGallery"), {
  loading: () => <p role="status" className="py-12 text-center text-muted">Loading videos…</p>,
});
import type { GalleryVideo } from "../types";
import type { GalleryAlbum } from "../types";
import PhotoCarousel from "./PhotoCarousel";
import { galleryProgrammes, type GalleryProgramme } from "../data/programmes";
import { getProgrammeAlbums } from "../data/album-selection";

type GallerySectionProps = {
  categories: GalleryAlbum[];
  videos?: GalleryVideo[];
  videosUnavailable?: boolean;
  initialView?: "photos" | "videos";
};

export default function GallerySection({
  categories,
  videos = [],
  videosUnavailable = false,
  initialView = "photos",
}: GallerySectionProps) {
  const [view, setView] = useState<"photos" | "videos">(initialView);
  const [selection, setSelection] = useState<{
    programme: GalleryProgramme;
    year?: number | null;
  }>(() => ({
    programme:
      galleryProgrammes.find((programme) =>
        categories.some((album) => album.programme === programme.value),
      )?.value ?? "education",
  }));
  const albums = getProgrammeAlbums(categories, selection.programme);
  const selectedAlbum =
    albums.find((album) => album.year === selection.year) ?? albums[0];
  const programmeLabel = galleryProgrammes.find(
    (programme) => programme.value === selection.programme,
  )!.title;

  return (
    <section aria-labelledby="gallery-heading" className="overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <Reveal as="header" className="mx-auto max-w-2xl text-center">
          <p className="text-primary flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.25em] uppercase">
            <span aria-hidden="true" className="bg-primary h-px w-6" />
            {view === "videos" ? "Our work, in motion" : "Our gallery"}
            <span aria-hidden="true" className="bg-primary h-px w-6" />
          </p>

          <h1
            id="gallery-heading"
            className={"mt-4 font-serif leading-[1.1] tracking-tight sm:text-5xl lg:text-4xl " + (view === "videos" ? "text-[1.75rem] font-bold" : "text-4xl font-black uppercase")}
          >
            {view === "videos"
              ? <><span className="block sm:inline">Every moment.</span>{" "}<span className="block sm:inline">A story of kindness.</span></>
              : "Kindness, year after year."}
          </h1>

          <p className={"mx-auto max-w-md text-slate-600 sm:text-base " + (view === "videos" ? "mt-3 text-[13px] leading-6" : "mt-5 text-sm leading-7")}>
            {view === "videos"
              ? "Meet the people and moments bringing our mission to life."
              : "Explore the people, programs, and everyday moments that bring our mission to life."}
          </p>
        </Reveal>

        <div
          role="tablist"
          aria-label="Gallery media"
          className="mx-auto mt-5 flex w-full max-w-sm rounded-xl border border-slate-200 bg-white p-1 sm:mt-7"
          onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
              return;
            event.preventDefault();
            const next =
              event.key === "Home"
                ? "photos"
                : event.key === "End"
                  ? "videos"
                  : view === "photos"
                    ? "videos"
                    : "photos";
            setView(next);
            document.getElementById("gallery-tab-" + next)?.focus();
          }}
        >
          {(["photos", "videos"] as const).map((tab) => (
            <button
              key={tab}
              id={"gallery-tab-" + tab}
              type="button"
              role="tab"
              aria-selected={view === tab}
              aria-controls={"gallery-panel-" + tab}
              tabIndex={view === tab ? 0 : -1}
              onClick={() => setView(tab)}
              className={
                "inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
                (view === tab
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-blue-50")
              }
            >
              {tab === "photos" ? (
                <Images size={18} aria-hidden="true" />
              ) : (
                <Video size={18} aria-hidden="true" />
              )}
              {tab === "photos" ? "Photos" : "Videos"}
            </button>
          ))}
        </div>
        {view === "photos" ? (
          <div
            id="gallery-panel-photos"
            role="tabpanel"
            aria-labelledby="gallery-tab-photos"
          >
            <GallerySelectionFilters
              programme={selection.programme}
              years={albums.map((album) => album.year)}
              selectedYear={selectedAlbum?.year}
              onProgrammeChange={(programme) => setSelection({ programme })}
              onYearChange={(year) => setSelection({ ...selection, year })}
            />

            {selectedAlbum ? (
              <>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold tracking-wider text-foreground uppercase">
                  <span>
                    {programmeLabel} / {selectedAlbum.year ?? "Year not set"}
                  </span>
                  {selectedAlbum.year !== null &&
                    selectedAlbum.year === albums[0].year && (
                      <span className="rounded-full border border-primary px-3 py-1 text-[10px] text-primary">
                        Latest album
                      </span>
                    )}
                </div>
                <div className="mt-6">
                  <PhotoCarousel
                    key={selectedAlbum.id + ":" + selectedAlbum.year}
                    photos={selectedAlbum.photos}
                    label={`${programmeLabel} · ${selectedAlbum.year ?? "Year not set"}`}
                    description={selectedAlbum.description}
                  />
                </div>
              </>
            ) : (
              <p role="status" className="py-16 text-center text-slate-600">
                Photos for {programmeLabel} are coming soon.
              </p>
            )}
          </div>
        ) : (
          <div
            id="gallery-panel-videos"
            role="tabpanel"
            aria-labelledby="gallery-tab-videos"
          >
            <VideoGallery
              videos={videos}
              unavailable={videosUnavailable}
              onBrowsePhotos={() => {
                setView("photos");
                document.getElementById("gallery-tab-photos")?.focus();
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
