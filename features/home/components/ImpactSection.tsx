import { BookImage, Handshake } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import LinkButton from "@/components/ui/LinkButton";
import ImpactStatsCard from "./ImpactStatsCard";

const impactStats = [
  {
    number: 6,
    label: "Years of Service",
  },
  {
    number: 100,
    label: "children supported",
  },
  {
    number: 10,
    label: "Communities",
  },
  {
    number: 150,
    label: "Lives Impacted",
  },
];

export default function ImpactSection() {
  return (
    <section className="py-20 lg:py-28">
      <Container className="flex flex-col gap-10 md:flex-row md:justify-between">
        <div>
          <SectionLabel className="mb-7">Impact</SectionLabel>

          <h2 className="font-serif text-4xl leading-[0.95] font-black tracking-tight uppercase sm:text-4xl lg:text-5xl">
            The work is hard but the
            <span className="text-primary block">results</span> are real
          </h2>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 lg:text-lg">
            Every number represents a life changed, a child fed, a widow
            empowered. We measure our success in human terms.
          </p>

          <div className="mt-7 flex gap-2 md:gap-7">
            <LinkButton href="/gallery" icon={BookImage} iconPosition="right">
              Explore Our Gallery
            </LinkButton>

            <LinkButton
              href="/get-involved/partner"
              variant="secondary"
              icon={Handshake}
            >
              Partner with us
            </LinkButton>
          </div>
        </div>

        <div className="grid grid-cols-2">
          {impactStats.map((stat) => (
            <ImpactStatsCard
              key={stat.label}
              number={stat.number}
              label={stat.label}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
