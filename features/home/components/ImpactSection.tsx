import { BookImage, Handshake } from "lucide-react";

import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import LinkButton from "@/components/ui/LinkButton";
import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/HomepageMotion";

import type { HomeImpactContent } from "../types";
import ImpactStatsCard from "./ImpactStatsCard";

type ImpactSectionProps = {
  content: HomeImpactContent | null;
};

export default function ImpactSection({ content }: ImpactSectionProps) {
  if (!content) return null;

  return (
    <section className="py-20 lg:py-28">
      <Container className="flex flex-col gap-10 md:flex-row md:justify-between">
        <Reveal className="min-w-0">
          <SectionLabel className="mb-7">{content.label}</SectionLabel>

          <h2 className="font-serif text-3xl leading-[1.08] font-black tracking-tight uppercase sm:text-4xl lg:text-5xl">
            {content.headingStart}
            <span className="text-primary block">
              {content.headingHighlight}
            </span>{" "}
            {content.headingEnd}
          </h2>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 lg:text-lg">
            {content.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-2 md:gap-7">
            <LinkButton href="/gallery" icon={BookImage} iconPosition="right">
              {content.galleryButtonLabel}
            </LinkButton>

            <LinkButton
              href="/get-involved/partner"
              variant="secondary"
              icon={Handshake}
            >
              {content.partnerButtonLabel}
            </LinkButton>
          </div>
        </Reveal>

        <Stagger className="grid shrink-0 grid-cols-2">
          {content.stats.map((stat) => (
            <StaggerItem key={stat.id}>
              <ImpactStatsCard number={stat.number} label={stat.label} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
