import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import LinkButton from "@/components/ui/LinkButton";
import Image from "next/image";
import { Reveal } from "@/components/animation/HomepageMotion";
import type { HomeProgramsContent } from "../types";

export default function ProgramSection({ content }: { content: HomeProgramsContent }) {
  return (
    <section className="bg-section-muted py-20 lg:py-28">
      <Container width="wide">
        <Reveal>
          <header className="mx-auto flex max-w-2xl flex-col items-center">
            <div className="w-fit">
              <SectionLabel align="center">{content.label}</SectionLabel>
            </div>

            <h2 className="mt-4 font-serif text-4xl leading-[0.95] font-black tracking-tight uppercase lg:text-5xl">
              {content.headingStart}{" "}
              <span className="text-primary">{content.headingHighlight}</span>
            </h2>

            <p className="mt-6 text-center text-base leading-7 text-slate-600 lg:text-lg">
              {content.description}
            </p>
          </header>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-4">
          {content.cards.map((program, index) => {
            const isFeatured = index === 0;

            return (
              <Reveal
                as="article"
                key={program.id}
                delay={index * 0.08}
                hover
                className={`bg-section-muted-thick overflow-hidden rounded-2xl border border-slate-200 ${
                  isFeatured
                    ? "lg:col-span-2 lg:grid lg:grid-cols-2"
                    : "flex flex-col"
                }`}
              >
                <div
                  className={`flex flex-col p-6 ${
                    isFeatured ? "lg:justify-center lg:p-8" : ""
                  }`}
                >
                  <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                    {program.category}
                  </span>

                  <h3 className="mt-3 font-serif text-2xl leading-tight font-bold text-slate-950">
                    {program.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {program.description}
                  </p>

                  <div className="mt-5">
                    <LinkButton
                      href={program.href}
                      variant="secondary"
                      border={false}
                      icon={ArrowRight}
                    >
                      {program.buttonLabel}
                    </LinkButton>
                  </div>
                </div>

                <div
                  className={
                    isFeatured
                      ? "relative h-64 lg:h-auto lg:min-h-full"
                      : "relative order-first h-60 lg:order-last"
                  }
                >
                  <Image
                    src={program.image}
                    alt={program.imageAlt}
                    fill
                    unoptimized={program.image.startsWith("https://cdn.sanity.io/")}
                    sizes={
                      isFeatured
                        ? "(min-width: 1440px) 335px, (min-width: 1024px) calc(25vw - 30px), calc(100vw - 48px)"
                        : "(min-width: 1440px) 325px, (min-width: 1024px) calc(25vw - 35px), calc(100vw - 48px)"
                    }
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
