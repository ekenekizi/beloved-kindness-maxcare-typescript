"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import HTMLFlipBook, {
  type FlipBookHandle,
  type PageOrientation,
} from "@gullabs/react-flipbook";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";

import type { TransformationStory } from "../data/transformation-stories";
import BookPage from "./BookPage";
import "./StoriesSection.css";

type StoriesSectionProps = {
  stories: TransformationStory[];
};

function subscribeToScreen(callback: () => void) {
  window.addEventListener("resize", callback);

  return () => window.removeEventListener("resize", callback);
}

export default function StoriesSection({ stories }: StoriesSectionProps) {
  const bookRef = useRef<FlipBookHandle>(null);
  const reduceMotion = useReducedMotion();

  const screenWidth = useSyncExternalStore(
    subscribeToScreen,
    () => document.documentElement.clientWidth,
    () => 1024,
  );

  const mobile = screenWidth < 768;
  const mobileBookWidth = Math.max(260, Math.min(384, screenWidth - 40));

  const [page, setPage] = useState(0);
  const [orientation, setOrientation] = useState<PageOrientation>("portrait");
  const [turning, setTurning] = useState(false);
  const [readingView, setReadingView] = useState(false);

  const totalPages = stories.length + 1;

  const lastSpread =
    orientation === "landscape"
      ? Math.floor((totalPages - 1) / 2) * 2
      : totalPages - 1;

  const showReadingView = readingView || reduceMotion;

  function turnPage(direction: "next" | "previous") {
    const book = bookRef.current;

    if (!book || turning) return;

    if (direction === "next" && page < lastSpread) {
      book.flipNext();
    }

    if (direction === "previous" && page > 0) {
      book.flipPrev();
    }
  }

  return (
    <section
      className="transformation-section"
      aria-labelledby="stories-heading"
      id="stories"
    >
      <header className="stories-heading">
        <p className="stories-eyebrow">Real people, real change</p>

        <h2 id="stories-heading">
          Stories of <span>Transformation</span>
        </h2>

        <p>
          Behind every statistic is a living, breathing story of courage,
          resilience, and renewed hope.
        </p>
      </header>

      {showReadingView ? (
        <div className="stories-reading-view">
          {stories.map((story, index) => (
            <BookPage key={story.id} story={story} number={index + 1} />
          ))}
        </div>
      ) : (
        <>
          <div
            className="story-book-stage"
            role="group"
            aria-label="Transformation storybook"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                event.preventDefault();

                turnPage(event.key === "ArrowRight" ? "next" : "previous");
              }
            }}
          >
            <HTMLFlipBook
              key={mobile ? "mobile" : "desktop"}
              ref={bookRef}
              width={mobile ? mobileBookWidth : 420}
              height={mobile ? 560 : 590}
              {...(mobile
                ? {
                    sizing: "fixed",
                  }
                : {
                    sizing: "responsive",
                    minWidth: 350,
                    maxWidth: 460,
                    minHeight: 560,
                    maxHeight: 1000,
                  })}
              hardCovers={false}
              usePortrait={true}
              drawShadow={true}
              maxShadowOpacity={0.22}
              flippingTime={850}
              allowTouchScroll={true}
              pointerInput={["mouse", "touch", "pen"]}
              swipeDistance={40}
              foldCornerOnHover={false}
              flipOnClick="anywhere"
              pageBackground="#fffdf7"
              controls="none"
              useKeyboard={false}
              className="story-flipbook"
              onLoaded={(snapshot) => {
                setOrientation(snapshot.orientation);
                setPage(snapshot.page);
                setTurning(false);
              }}
              onPageChange={(snapshot) => {
                setPage(snapshot.page);
              }}
              onChangeOrientation={({ orientation }) => {
                setOrientation(orientation);
              }}
              onChangeState={({ state }) => {
                setTurning(state !== "read");
              }}
            >
              <BookPage key="introduction" interactive />

              {stories.map((story, index) => (
                <BookPage
                  key={story.id}
                  story={story}
                  number={index + 1}
                  interactive
                  isLast={index === stories.length - 1}
                />
              ))}
            </HTMLFlipBook>
          </div>

          <nav className="story-navigation" aria-label="Storybook pages">
            <button
              type="button"
              onClick={() => turnPage("previous")}
              disabled={page === 0 || turning}
            >
              <ArrowLeft size={18} aria-hidden="true" />
              <span>Previous</span>
            </button>

            <p aria-live="polite" aria-atomic="true">
              {orientation === "landscape"
                ? `Pages ${page + 1}–${Math.min(page + 2, totalPages)}`
                : `Page ${page + 1}`}{" "}
              <span>of {totalPages}</span>
            </p>

            <button
              type="button"
              onClick={() => turnPage("next")}
              disabled={page >= lastSpread || turning}
            >
              <span>Next</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </nav>

          <p className="story-book-hint">A new chapter is a page turn away.</p>
        </>
      )}

      {!reduceMotion && (
        <button
          type="button"
          className="story-view-toggle"
          onClick={() => {
            setReadingView(!readingView);
            setPage(0);
            setTurning(false);
          }}
        >
          {readingView
            ? "Back to the storybook"
            : "Read all stories without animation"}
        </button>
      )}
    </section>
  );
}
