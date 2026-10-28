import { Reveal } from "@/components/animation/HomepageMotion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Handshake,
  Heart,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

type InvolvementOption = {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
  icon: LucideIcon;
  cardClasses: string;
  iconClasses: string;
  decorationClasses: string;
  buttonClasses: string;
};

const involvementOptions: InvolvementOption[] = [
  {
    id: "donate",
    title: "Donate",
    description:
      "Your support helps us provide education, care, and opportunities for children, widows, and vulnerable communities.",
    buttonLabel: "Donate Now",
    href: "/get-involved/donate",
    icon: Heart,
    cardClasses: "border-blue-100 bg-blue-50/60",
    iconClasses: "bg-primary",
    decorationClasses: "text-primary",
    buttonClasses: "bg-primary hover:bg-blue-700",
  },
  {
    id: "volunteer",
    title: "Volunteer",
    description:
      "Give your time, skills, and passion to make a real difference. Join our team and help create lasting change.",
    buttonLabel: "Volunteer With Us",
    href: "/get-involved/volunteer",
    icon: UsersRound,
    cardClasses: "border-amber-100 bg-amber-50/60",
    iconClasses: "bg-amber-500",
    decorationClasses: "text-amber-500",
    buttonClasses: "bg-amber-700 hover:bg-amber-800",
  },
  {
    id: "partner",
    title: "Partner With Us",
    description:
      "Collaborate with us as an individual, organization, or business to expand our reach and impact more lives together.",
    buttonLabel: "Explore Partnership",
    href: "/get-involved/partner",
    icon: Handshake,
    cardClasses: "border-violet-100 bg-violet-50/60",
    iconClasses: "bg-violet-600",
    decorationClasses: "text-violet-600",
    buttonClasses: "bg-violet-700 hover:bg-violet-800",
  },
];

function InvolvementCard({ option }: { option: InvolvementOption }) {
  const Icon = option.icon;

  return (
    <Reveal
      as="article"
      className={`relative isolate flex h-full flex-col overflow-hidden rounded-2xl border p-6 shadow-sm sm:p-8 lg:p-6 xl:p-8 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-1 ${option.cardClasses}`}
    >
      <Icon
        aria-hidden="true"
        strokeWidth={1}
        className={`pointer-events-none absolute top-12 right-4 -z-10 size-36 opacity-[0.08] lg:top-6 lg:size-28 ${option.decorationClasses}`}
      />

      <div className="relative mb-4 w-fit">
        <div
          className={`flex size-16 items-center justify-center rounded-full text-white shadow-sm ${option.iconClasses}`}
        >
          <Icon
            size={28}
            aria-hidden="true"
            fill={option.id === "donate" ? "currentColor" : "none"}
          />
        </div>
      </div>

      <h3 className="font-serif text-3xl leading-tight font-bold tracking-tight text-slate-950">
        {option.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-7 text-slate-600 sm:text-base lg:text-sm xl:text-base">
        {option.description}
      </p>

      <Link
        href={option.href}
        className={`group focus-visible:outline-primary mt-6 flex min-h-12 w-full items-center justify-center gap-3 rounded-full px-4 py-3 text-center text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${option.buttonClasses}`}
      >
        {option.buttonLabel}

        <ArrowRight
          size={19}
          aria-hidden="true"
          className="shrink-0 motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
        />
      </Link>
    </Reveal>
  );
}

export default function GetInvolvedSection() {
  return (
    <section
      aria-labelledby="get-involved-heading"
      className="bg-background relative isolate overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="to-background pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-blue-50/70 via-blue-50/30"
      />

      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="text-background pointer-events-none absolute inset-x-0 top-0 -z-10 h-16 w-full sm:h-24"
      >
        <path
          fill="currentColor"
          d="M0 0H1440V35C1270 0 1130 105 930 75S580 20 390 75S160 5 0 40Z"
        />
      </svg>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 -left-20 -z-10 h-64 w-44 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_72%)] opacity-20 sm:w-60 lg:top-28 lg:-left-24 lg:h-[560px] lg:w-80 lg:opacity-80 xl:-left-16 xl:w-96"
      >
        <Image
          src="/images/about/bkm-about.png"
          alt=""
          fill
          sizes="(min-width: 1280px) 384px, (min-width: 1024px) 320px, (min-width: 640px) 240px, 176px"
          className="object-cover object-center"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 -right-20 -z-10 h-64 w-44 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_72%)] opacity-20 sm:w-60 lg:top-40 lg:-right-24 lg:h-[480px] lg:w-80 lg:opacity-60 xl:-right-16 xl:w-96"
      >
        <Image
          src="/images/partners/JoinUs.png"
          alt=""
          fill
          sizes="(min-width: 1280px) 384px, (min-width: 1024px) 320px, (min-width: 640px) 240px, 176px"
          className="object-cover object-[75%_center]"
        />
      </div>

      <Heart
        aria-hidden="true"
        strokeWidth={0.8}
        className="pointer-events-none absolute top-5 right-0 -z-10 size-28 rotate-12 text-amber-300/70 sm:right-6 sm:size-40 lg:right-8 lg:size-56"
      />

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-20 xl:px-36">
        <Reveal as="header" className="mx-auto max-w-3xl text-center">
          <p className="text-primary flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.25em] uppercase sm:text-sm">
            <span aria-hidden="true" className="bg-primary h-px w-7" />
            Get involved
            <span aria-hidden="true" className="bg-primary h-px w-7" />
          </p>

          <h2
            id="get-involved-heading"
            className="mt-5 font-serif text-4xl leading-[1.08] font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
          >
            Be Part of{" "}
            <span className="text-primary block lg:inline">the Change</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Together, we can restore hope, empower lives, and build stronger
            communities. There are many ways to get involved.
          </p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-xl grid-cols-1 gap-5 sm:mt-12 sm:gap-6 lg:max-w-none lg:grid-cols-3">
          {involvementOptions.map((option) => (
            <InvolvementCard key={option.id} option={option} />
          ))}
        </div>
      </div>
    </section>
  );
}
