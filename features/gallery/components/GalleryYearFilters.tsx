"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "motion/react";

type Props = {
  years: (number | null)[];
  selectedYear: number | null;
  onSelectYear: (year: number | null) => void;
};

export default function GalleryYearFilters({
  years,
  selectedYear,
  onSelectYear,
}: Props) {
  const rail = useRef<HTMLDivElement>(null);
  const id = useId();
  const reducedMotion = useReducedMotion();
  const [edges, setEdges] = useState({ left: false, right: false });
  const yearsKey = years.join(",");

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () => {
      const maxScroll = element.scrollWidth - element.clientWidth;
      setEdges({
        left: element.scrollLeft > 1,
        right: element.scrollLeft < maxScroll - 1,
      });
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    for (const child of element.children) observer.observe(child);
    element.addEventListener("scroll", update, { passive: true });
    const frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, [yearsKey]);

  useEffect(() => {
    const element = rail.current;
    const selected = element?.querySelector<HTMLButtonElement>(
      '[aria-pressed="true"]',
    );
    if (!element || !selected) return;
    // Move only the horizontal rail, without scrolling the page vertically.
    const left =
      selected.offsetLeft - (element.clientWidth - selected.offsetWidth) / 2;
    element.scrollTo({ left, behavior: reducedMotion ? "auto" : "smooth" });
  }, [selectedYear, yearsKey, reducedMotion]);

  function scroll(direction: number) {
    const element = rail.current;
    if (!element) return;
    element.scrollBy({
      left: direction * element.clientWidth * 0.75,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  const overflow = edges.left || edges.right;
  return (
    <div className="mx-auto mt-6 max-w-3xl">
      <p className="mb-3 text-center text-sm font-semibold text-foreground">
        Choose a year
      </p>
      <div className="flex min-w-0 items-center gap-2">
        {overflow && (
          <button
            type="button"
            aria-label="Show newer years"
            aria-controls={id}
            disabled={!edges.left}
            onClick={() => scroll(-1)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-foreground disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <ChevronLeft size={19} aria-hidden="true" />
          </button>
        )}
        <div className="relative min-w-0 flex-1">
          <div
            id={id}
            ref={rail}
            role="group"
            aria-label="Choose an activity year"
            className={`relative flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${overflow ? "" : "justify-center"}`}
          >
            {years.map((year) => (
              <button
                key={year ?? "undated"}
                type="button"
                aria-pressed={year === selectedYear}
                onClick={() => onSelectYear(year)}
                className={`min-h-11 shrink-0 whitespace-nowrap rounded-full border px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${year === selectedYear ? "border-foreground bg-foreground text-white" : "border-slate-200 text-slate-600 hover:border-primary hover:text-primary"}`}
              >
                {year ?? "Year not set"}
              </button>
            ))}
          </div>
          {edges.left && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-linear-to-r from-background to-transparent"
            />
          )}
          {edges.right && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-linear-to-l from-background to-transparent"
            />
          )}
        </div>
        {overflow && (
          <button
            type="button"
            aria-label="Show earlier years"
            aria-controls={id}
            disabled={!edges.right}
            onClick={() => scroll(1)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-foreground disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <ChevronRight size={19} aria-hidden="true" />
          </button>
        )}
      </div>
      {overflow && (
        <p className="mt-1 text-center text-xs text-slate-500 sm:hidden">
          Swipe to explore more years
        </p>
      )}
    </div>
  );
}
