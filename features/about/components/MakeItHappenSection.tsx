import { Reveal } from "@/components/animation/HomepageMotion";
import Image from "next/image";
import { Heart } from "lucide-react";

import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";

import type { OurStoryContent } from "../data/our-story-content";
const supportBadgeColors = [
  "bg-[#DFCEFF] text-[#5424BD]",
  "bg-[#FFE7AA] text-[#AA6200]",
];

const badgeStyles =
  "inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] uppercase";

export default function MakeItHappenSection({
  content,
}: {
  content: OurStoryContent["work"];
}) {
  const [featuredCard, ...supportCards] = content.cards;
  return (
    <section
      id="our-work"
      className="bg-background scroll-mt-24 py-20 lg:py-28"
    >
      <Container width="wide">
        <Reveal
          as="header"
          className="mx-auto flex max-w-2xl flex-col items-center"
        >
          <SectionLabel align="center">{content.label}</SectionLabel>

          <h2 className="mt-4 text-center font-serif text-4xl leading-[0.95] font-black tracking-tight uppercase lg:text-5xl">
            {content.heading}{" "}
            <span className="text-primary">{content.headingHighlight}</span>
          </h2>

          <p className="mt-6 text-center text-base leading-7 text-slate-600 lg:text-lg">
            {content.description}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-[0.85fr_1.15fr] lg:grid-rows-2">
          <Reveal
            as="article"
            hover
            className="flex flex-col rounded-3xl bg-white p-4 text-[#0B2454] shadow-[0_8px_30px_rgba(15,39,71,0.08)] lg:row-span-2"
          >
            <div className="px-2 pt-2 pb-5 sm:px-4 sm:pt-3">
              <span className={`${badgeStyles} bg-[#BFDEFF] text-[#1645C0]`}>
                {featuredCard.label}
              </span>

              <h3 className="mt-3 font-serif text-3xl leading-[1.08] font-bold tracking-tight xl:text-4xl">
                {featuredCard.title}
              </h3>

              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#294574] sm:text-base">
                {featuredCard.description}
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-72 lg:flex-1">
              <Image
                src={featuredCard.image}
                unoptimized={featuredCard.image.startsWith(
                  "https://cdn.sanity.io/",
                )}
                alt={featuredCard.imageAlt}
                fill
                sizes="(min-width: 1440px) 539px, (min-width: 1024px) calc((100vw - 96px) * 0.425 - 32px), calc(100vw - 80px)"
                className="object-cover"
              />
            </div>
          </Reveal>

          {supportCards.map((card, index) => (
            <Reveal
              as="article"
              hover
              key={card.id}
              className="grid items-center gap-5 rounded-3xl bg-white p-4 text-[#0B2454] shadow-[0_8px_30px_rgba(15,39,71,0.08)] sm:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="px-2 pt-2 sm:py-3 sm:pr-0 sm:pl-4">
                <span className={`${badgeStyles} ${supportBadgeColors[index]}`}>
                  {card.label}
                </span>

                <h3 className="mt-3 font-serif text-3xl leading-[1.08] font-bold tracking-tight xl:text-4xl">
                  {card.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-[#294574] xl:text-base">
                  {card.description}
                </p>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-auto sm:h-full sm:min-h-60">
                <Image
                  src={card.image}
                  unoptimized={card.image.startsWith("https://cdn.sanity.io/")}
                  alt={card.imageAlt}
                  fill
                  sizes="(min-width: 1440px) 402px, (min-width: 1024px) calc(((100vw - 96px) * 0.575 - 52px) * 0.55), (min-width: 640px) calc((100vw - 100px) * 0.55), calc(100vw - 80px)"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs leading-relaxed text-[#294574] sm:text-sm">
          <Heart
            aria-hidden="true"
            className="size-4 shrink-0 fill-[#0B2454] text-[#0B2454]"
          />
          {content.footnote}
        </p>
      </Container>
    </section>
  );
}
