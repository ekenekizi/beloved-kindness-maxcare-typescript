import { Reveal } from "@/components/animation/HomepageMotion";
import { CircleCheck } from "lucide-react";

import SectionLabel from "@/components/ui/SectionLabel";

import type { MissionContent } from "../data/mission-content";

const objectiveStyles = [
  {
    paper: "bg-[#FFF3CB]",
    heading: "text-[#967000]",
    pin: "#E9B600",
    rotation: "rotate-[-2deg]",
    placement: "lg:col-start-1 lg:row-start-2 lg:-mt-16",
  },
  {
    paper: "bg-[#ECDDFA]",
    heading: "text-[#8044AE]",
    pin: "#A72CC5",
    rotation: "rotate-[3deg]",
    placement: "lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start",
  },
  {
    paper: "bg-[#DEE7FF]",
    heading: "text-[#3657A5]",
    pin: "#244FD4",
    rotation: "rotate-[2deg]",
    placement: "lg:col-start-1 lg:row-start-3",
  },
  {
    paper: "bg-[#E3F4D3]",
    heading: "text-[#527E2B]",
    pin: "#82B520",
    rotation: "rotate-[-3deg]",
    placement: "lg:col-start-2 lg:row-start-3 lg:-mt-28 lg:self-start",
  },
];

function PushPin({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="absolute top-5 left-1/2 z-10 size-7 -translate-x-1/2"
    >
      <span className="absolute top-2 left-2 h-6 w-7 rotate-[-35deg] rounded-full bg-black/25 blur-[3px]" />

      <span
        className="absolute top-1 left-0 size-6 rounded-full"
        style={{
          background: `linear-gradient(135deg, #ffffff90, ${color} 45%, #00000065)`,
          boxShadow: "0 2px 3px #00000030",
        }}
      />

      <span
        className="absolute top-0 left-1 size-5 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 25%, #ffffffb0, ${color} 48%, #00000070 100%)`,
          boxShadow: "inset 0 1px 2px #ffffff80, 2px 3px 3px #00000030",
        }}
      />
    </span>
  );
}

export default function ObjectivesSection({
  content,
}: {
  content: MissionContent;
}) {
  const objectives = content.objectives.map((objective, index) => ({
    ...objective,
    ...objectiveStyles[index],
    number: String(index + 1).padStart(2, "0"),
  }));
  return (
    <section className="bg-background relative isolate overflow-hidden py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, rgba(100, 130, 180, 0.16) 31px, rgba(100, 130, 180, 0.16) 32px)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-3 w-px bg-red-300/40 sm:left-6 lg:left-10"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 sm:gap-14 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-20">
          <Reveal
            as="div"
            className="min-w-0 pb-3 lg:col-start-1 lg:row-start-1 lg:pb-20"
          >
            <div className="mb-7">
              <SectionLabel>{content.label}</SectionLabel>
            </div>

            <h1 className="font-serif text-4xl leading-[0.95] font-black tracking-tight text-slate-950 uppercase sm:text-5xl">
              {content.heading}
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 lg:text-lg">
              {content.description}
            </p>
          </Reveal>

          {objectives.map((objective) => (
            <Reveal
              key={objective.id}
              className={`relative mx-auto w-full max-w-lg ${objective.placement}`}
            >
              <article
                className={`relative mx-auto w-full max-w-lg rounded-xl bg-white px-3 pt-16 pb-3 drop-shadow-[0_18px_28px_rgba(15,39,71,0.16)] transition-transform duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:rotate-0 sm:px-4 sm:pb-4 ${objective.rotation}`}
              >
                <PushPin color={objective.pin} />

                <div
                  className={`h-full rounded-md px-5 py-6 sm:px-7 sm:py-7 ${objective.paper}`}
                >
                  <span
                    className={`mb-3 block text-xs font-bold tracking-[0.2em] ${objective.heading}`}
                  >
                    {objective.number}
                  </span>

                  <h2
                    className={`text-xl leading-tight font-bold sm:text-2xl ${objective.heading}`}
                  >
                    {objective.title}
                  </h2>

                  <ul className="mt-5 space-y-4">
                    {objective.points.map((point, index) => (
                      <li
                        key={objective.id + "-" + index}
                        className="flex items-start gap-3"
                      >
                        <CircleCheck
                          aria-hidden="true"
                          className={`mt-2 size-4 shrink-0 ${objective.heading}`}
                          strokeWidth={1.8}
                        />

                        <p className="text-sm leading-7 text-slate-700 sm:text-[15px]">
                          {point}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
