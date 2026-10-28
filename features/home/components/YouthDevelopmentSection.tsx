import CurvedImage from "@/components/ui/CurvedImage";
import { MoveUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import LinkButton from "@/components/ui/LinkButton";
import { Reveal } from "@/components/animation/HomepageMotion";
import type { HomeYouthContent } from "../types";

export default function YouthDevelopmentSection({
  content,
}: { content: HomeYouthContent }) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <Container className="relative z-10">
        <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionLabel className="mb-7">
              {content.label}
            </SectionLabel>

            <h2 className="font-serif text-[2.65rem] leading-[0.88] font-black tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[3.6rem] xl:text-[4rem]">
              {content.headingStart}
              <span className="text-primary block">{content.headingHighlight}</span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 lg:max-w-lg">
              {content.description}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-7">
              <LinkButton
                href={content.partnerUrl}
                icon={MoveUpRight}
                iconPosition="right"
                newTab
              >
                {content.buttonLabel}
                <span className="sr-only"> (opens in a new tab)</span>
              </LinkButton>
            </div>
          </Reveal>

          <Reveal
            image
            delay={0.12}
            className="relative mx-auto w-full max-w-md lg:max-w-[490px]"
          >
            <CurvedImage
              src={content.image}
              alt={content.imageAlt}
              sizes="(min-width: 1140px) 490px, (min-width: 1024px) calc((100vw - 160px) / 2), (min-width: 496px) 448px, calc(100vw - 48px)"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Container>

      <div className="bg-tertiary/5 pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full blur-3xl" />
    </section>
  );
}
