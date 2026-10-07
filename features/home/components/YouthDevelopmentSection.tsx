import CurvedImage from "@/components/ui/CurvedImage";
import { MoveUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import LinkButton from "@/components/ui/LinkButton";

type YouthDevelopmentSectionProps = {
  gRoleUrl?: string;
};

export default function YouthDevelopmentSection({
  gRoleUrl,
}: YouthDevelopmentSectionProps) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <Container className="relative z-10">
        <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionLabel className="mb-7">
              Partnership &amp; Youth Development
            </SectionLabel>

            <h2 className="font-serif text-[2.65rem] leading-[0.88] font-black tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[3.6rem] xl:text-[4rem]">
              Connection to
              <span className="text-primary block">G-Role Africa</span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 lg:max-w-lg">
              Through enlightening, counselling, creating awareness and shading
              light into the lives of children and young adults in the society,
              we will re-orient their minds towards the right and core values of
              good citizenship and leadership by restoring their dignity and
              sanity for the betterment of the people of Africa.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-7">
              {gRoleUrl ? (
                <LinkButton
                  href={gRoleUrl}
                  icon={MoveUpRight}
                  iconPosition="right"
                  newTab
                >
                  Visit G-Role Africa
                  <span className="sr-only"> (opens in a new tab)</span>
                </LinkButton>
              ) : (
                <button
                  type="button"
                  disabled
                  title="Website link coming soon"
                  className="relative flex border-0 bg-transparent p-0"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 translate-y-0.5 rounded-xl bg-black/25"
                  />

                  <span
                    aria-hidden="true"
                    className="bg-primary/60 absolute inset-0 rounded-xl"
                  />

                  <span className="bg-primary relative flex -translate-y-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-white">
                    Visit G-Role Africa
                    <MoveUpRight className="mt-1 size-4.5" aria-hidden="true" />
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <CurvedImage
              src="/images/partners/G-Role.png"
              alt="Young people participating in G-Role Africa"
              sizes="(min-width: 1280px) 560px, (min-width: 1024px) calc(50vw - 80px), (min-width: 496px) 448px, calc(100vw - 48px)"
              loading="lazy"
            />
          </div>
        </div>
      </Container>

      <div className="bg-tertiary/5 pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full blur-3xl" />
    </section>
  );
}
