"use client";

import { galleryProgrammes, type GalleryProgramme } from "../data/programmes";

type GalleryFiltersProps = {
  selectedProgramme: GalleryProgramme;
  onSelectProgramme: (programme: GalleryProgramme) => void;
};

export default function GalleryFilters({
  selectedProgramme,
  onSelectProgramme,
}: GalleryFiltersProps) {
  return (
    <div className="mt-8 lg:mt-10">
      <p className="mb-3 text-center text-sm font-semibold text-foreground">
        Choose a programme
      </p>
      <div
        role="group"
        aria-label="Choose a gallery programme"
        className="flex flex-wrap justify-center gap-2"
      >
        {galleryProgrammes.map((programme) => (
          <button
            key={programme.value}
            type="button"
            aria-pressed={programme.value === selectedProgramme}
            onClick={() => onSelectProgramme(programme.value)}
            className={`focus-visible:outline-primary min-h-11 rounded-full border px-4 py-2.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 sm:px-5 sm:text-sm ${programme.value === selectedProgramme ? "border-primary bg-primary text-white" : "hover:border-primary hover:text-primary border-slate-200 bg-transparent text-slate-600"}`}
          >
            {programme.title}
          </button>
        ))}
      </div>
    </div>
  );
}
