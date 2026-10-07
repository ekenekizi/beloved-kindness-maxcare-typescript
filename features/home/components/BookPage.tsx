"use client";
import Image from "next/image";
import { forwardRef } from "react";
import { ArrowLeft, BookOpen, MapPin, MoveHorizontal } from "lucide-react";

import type { TransformationStory } from "../data/transformation-stories";

type BookPageProps = {
  story?: TransformationStory;
  number?: number;
  interactive?: boolean;
  isLast?: boolean;
};

function SwipeHint({ isLast = false }: { isLast?: boolean }) {
  return (
    <span
      className={`story-page-hint ${isLast ? "story-page-hint--last" : ""}`}
    >
      {isLast ? (
        <>
          <strong>You’ve reached the last page</strong>

          <span>
            <ArrowLeft size={14} aria-hidden="true" />
            Swipe right to revisit the stories
          </span>
        </>
      ) : (
        <>
          <MoveHorizontal size={16} strokeWidth={1.5} aria-hidden="true" />
          Swipe to turn the page
        </>
      )}
    </span>
  );
}

const BookPage = forwardRef<HTMLElement, BookPageProps>(function BookPage(
  { story, number = 0, interactive = false, isLast = false },
  ref,
) {
  return (
    <article
      ref={ref}
      className={`story-page ${story ? "" : "story-page--intro"}`}
    >
      {story ? (
        <div className="story-page-inner">
          <div className="story-page-topline">
            <span>{story.category}</span>
            <span>0{number}</span>
          </div>

          <div className="story-photo">
            <Image
              src={story.image}
              alt=""
              fill
              sizes={
                interactive
                  ? "(min-width: 768px) 400px, (min-width: 424px) 348px, calc(100vw - 76px)"
                  : "(min-width: 768px) 576px, (min-width: 664px) 604px, calc(100vw - 60px)"
              }
              loading="lazy"
              className="object-cover"
              draggable={false}
            />
          </div>

          <h3>{story.name}</h3>

          <p className="story-location">
            <MapPin size={13} aria-hidden="true" />
            {story.location}
          </p>

          <dl className="story-journey">
            <div>
              <dt>Before</dt>
              <dd>{story.before}</dd>
            </div>

            <div>
              <dt>After</dt>
              <dd>{story.after}</dd>
            </div>
          </dl>

          <blockquote>“{story.quote}”</blockquote>

          {interactive && <SwipeHint isLast={isLast} />}

          <footer>
            <span>Stories of Transformation</span>
            <span>{number}</span>
          </footer>
        </div>
      ) : (
        <div className="story-page-inner story-introduction">
          <span className="story-intro-label">Beloved Kindness Maxcare</span>

          <BookOpen size={38} strokeWidth={1} aria-hidden="true" />

          <h3>
            Every life.
            <br />A new <em>chapter.</em>
          </h3>

          <span className="story-gold-rule" />

          <p>
            Behind every statistic is a living, breathing story of courage,
            resilience, and renewed hope.
          </p>

          <span className="story-intro-prompt">
            Every story. A new beginning.
          </span>

          {interactive && <SwipeHint />}

          <footer>
            <span>Real people, real change</span>
          </footer>
        </div>
      )}
    </article>
  );
});

export default BookPage;
