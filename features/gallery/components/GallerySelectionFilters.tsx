"use client";

import GalleryDropdown from "./GalleryDropdown";
import { galleryProgrammes, isGalleryProgramme, type GalleryProgramme } from "../data/programmes";

type Props = {
  programme: GalleryProgramme;
  years: (number | null)[];
  selectedYear: number | null | undefined;
  onProgrammeChange: (programme: GalleryProgramme) => void;
  onYearChange: (year: number | null) => void;
};

// Shared photo filters for mobile and desktop.
export default function GallerySelectionFilters({ programme, years, selectedYear, onProgrammeChange, onYearChange }: Props) {
  return (
    <div className="relative z-10 mx-auto mt-5 grid min-w-0 max-w-2xl grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] gap-3 sm:mt-8 sm:gap-4">
      <GalleryDropdown label="Program" value={programme}
        options={galleryProgrammes.map(item => ({ value: item.value, label: item.title }))}
        onChange={value => { if (isGalleryProgramme(value)) onProgrammeChange(value); }} />
      <GalleryDropdown key={programme} label="Year" align="right"
        value={selectedYear === undefined ? "" : selectedYear === null ? "unknown" : String(selectedYear)}
        disabled={!years.length}
        options={years.map(year => ({ value: year === null ? "unknown" : String(year), label: year === null ? "Undated" : String(year) }))}
        onChange={value => {
          const year = years.find(item => (item === null ? "unknown" : String(item)) === value);
          if (year !== undefined) onYearChange(year);
        }} />
    </div>
  );
}
