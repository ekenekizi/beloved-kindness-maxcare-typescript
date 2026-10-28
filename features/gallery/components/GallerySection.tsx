"use client";

import { Reveal } from "@/components/animation/HomepageMotion";
import { useState } from "react";

import type { GalleryAlbum } from "../types";
import GalleryFilters from "./GalleryFilters";
import PhotoCarousel from "./PhotoCarousel";
import GalleryYearFilters from "./GalleryYearFilters";
import { galleryProgrammes, type GalleryProgramme } from "../data/programmes";
import { getProgrammeAlbums } from "../data/album-selection";

type GallerySectionProps = {
  categories: GalleryAlbum[];
};

export default function GallerySection({ categories }: GallerySectionProps) {
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
            Our gallery
            <span aria-hidden="true" className="bg-primary h-px w-6" />
          </p>

          <h1
            id="gallery-heading"
            className="mt-4 font-serif text-4xl leading-[1.05] font-black tracking-tight uppercase sm:text-5xl lg:text-6xl"
          >
            Kindness, year after year.
          </h1>

          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
            Explore the people, programs, and everyday moments that bring our
            mission to life.
          </p>
        </Reveal>

        <GalleryFilters
          selectedProgramme={selection.programme}
          onSelectProgramme={(programme) => setSelection({ programme })}
        />
        {selectedAlbum ? (
          <>
            <GalleryYearFilters
              key={selection.programme}
              years={albums.map((album) => album.year)}
              selectedYear={selectedAlbum.year}
              onSelectYear={(year) => setSelection({ ...selection, year })}
            />
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
    </section>
  );
}
