import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import LinkButton from "@/components/ui/LinkButton";
import Image from "next/image";
import educationImage from "@/public/images/programs/education.jpg";
import orphanageImage from "@/public/images/programs/orphanage.jpg";
import empowermentImage from "@/public/images/programs/empowerment.png";

const programs = [
  {
    id: 1,
    category: "Education",
    title: "Education & Youth Development",
    image: educationImage,
    href: "/programs/education",
    description:
      "Seminars, workshops and educational support that equip young people with knowledge, values and opportunities to thrive.",
  },
  {
    id: 2,
    category: "Care",
    title: "Orphanage & Child Support",
    image: orphanageImage,
    href: "/programs/orphanage",
    description:
      "We visit orphanage homes and provide essential needs, care and support for vulnerable children.",
  },
  {
    id: 3,
    category: "Empowerment",
    title: "Vocational Training",
    image: empowermentImage,
    href: "/programs/vocational-training",
    description:
      "Practical vocational programs that equip disadvantaged individuals with skills for independence and sustainable livelihoods.",
  },
];

export default function ProgramSection() {
  return (
    <section className="bg-section-muted py-20 lg:py-28">
      <Container width="wide">
        <header className="mx-auto flex max-w-2xl flex-col items-center">
          <div className="w-fit">
            <SectionLabel align="center">Programs</SectionLabel>
          </div>

          <h2 className="mt-4 font-serif text-4xl leading-[0.95] font-black tracking-tight uppercase lg:text-5xl">
            What we <span className="text-primary">do.</span>
          </h2>

          <p className="mt-6 text-center text-base leading-7 text-slate-600 lg:text-lg">
            We support vulnerable individuals and communities through practical
            care, education, empowerment and programs that restore dignity and
            create lasting change.
          </p>
        </header>

        <div className="mt-14 grid gap-5 lg:grid-cols-4">
          {programs.map((program, index) => {
            const isFeatured = index === 0;

            return (
              <article
                key={program.id}
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
                      Learn more
                    </LinkButton>
                  </div>
                </div>

                <div
                  className={
                    isFeatured
                      ? "min-h-64 lg:min-h-full"
                      : "order-first h-60 lg:order-last"
                  }
                >
                  <Image
                    src={program.image}
                    alt={`${program.title} program`}
                    sizes={
                      isFeatured
                        ? "(min-width: 1440px) 335px, (min-width: 1024px) calc(25vw - 30px), calc(100vw - 48px)"
                        : "(min-width: 1440px) 325px, (min-width: 1024px) calc(25vw - 35px), calc(100vw - 48px)"
                    }
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
