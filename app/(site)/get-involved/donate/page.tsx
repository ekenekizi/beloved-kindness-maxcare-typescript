import { Reveal } from "@/components/animation/HomepageMotion";
import type { Metadata } from "next";
import Image from "next/image";
import { HeartHandshake, House, Sprout, UsersRound } from "lucide-react";
import { donationCauses } from "@/features/get-involved/data/donation-options";
import SectionLabel from "@/components/ui/SectionLabel";
import { getDonateContent } from "@/sanity/lib/get-donate-content";
import DonationForm from "@/features/get-involved/components/DonationForm";
import DonationPaymentStatus from "@/features/get-involved/components/DonationPaymentStatus";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Beloved Kindness Maxcare’s work with children, widows and vulnerable communities. Your generosity helps bring care, hope and dignity.",
  alternates: { canonical: "/get-involved/donate" },
};
const careStyles = [
  { icon: House, iconClassName: "bg-blue-50 text-primary" },
  { icon: Sprout, iconClassName: "bg-amber-100 text-amber-700" },
  { icon: UsersRound, iconClassName: "bg-purple-100 text-purple-700" },
];
type DonatePageProps = {
  searchParams: Promise<{
    amount?: string | string[];
    cause?: string | string[];
    reference?: string | string[];
    cancelled?: string | string[];
  }>;
};

export default async function DonatePage({ searchParams }: DonatePageProps) {
  const [query, content] = await Promise.all([
    searchParams,
    getDonateContent(),
  ]);
  const paymentReference =
    typeof query.reference === "string" ? query.reference : null;

  const checkoutCancelled = query.cancelled === "1";
  const areasOfCare = content.care.cards.map((card, index) => ({
    ...card,
    ...careStyles[index],
  }));
  const rawAmount = typeof query.amount === "string" ? query.amount.trim() : "";
  const parsedAmount = Number(rawAmount);
  const amountIsValid =
    /^\d+(\.\d{1,2})?$/.test(rawAmount) &&
    Number.isFinite(parsedAmount) &&
    parsedAmount > 0 &&
    Number.isSafeInteger(Math.round(parsedAmount * 100));
  const initialAmount = amountIsValid ? parsedAmount : 10000;
  const selectedCause = donationCauses.find(
    (cause) => cause.value === query.cause,
  );
  const initialCause = selectedCause?.label ?? donationCauses[0].label;
  return (
    <div className="bg-background pt-24 text-foreground">
      <div className="mx-auto max-w-[1120px] px-5 py-12 sm:px-6 sm:py-16 lg:px-10">
        {paymentReference && (
          <DonationPaymentStatus
            key={`${paymentReference}-${checkoutCancelled}`}
            reference={paymentReference}
            checkoutCancelled={checkoutCancelled}
          />
        )}
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <Reveal as="header" className="min-w-0">
            <SectionLabel>{content.hero.label}</SectionLabel>
            <h1 className="mt-5 font-serif text-[clamp(2.3rem,5vw,3.65rem)] leading-[1.04] font-black tracking-[-0.055em] uppercase">
              {content.hero.heading}
              <br />
              <span className="text-primary">
                {content.hero.highlightLines.map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </h1>
            <p className="mt-6 max-w-[430px] text-base leading-8 text-muted">
              {content.hero.description}
            </p>
            <figure className="relative mt-8 pb-7">
              <div className="relative h-[290px] overflow-hidden rounded-[1.75rem] sm:h-[340px] lg:h-[290px]">
                <Image
                  src={content.hero.image}
                  unoptimized={content.hero.image.startsWith(
                    "https://cdn.sanity.io/",
                  )}
                  alt={content.hero.imageAlt}
                  fill
                  sizes="(min-width: 1120px) 500px, (min-width: 1024px) 46vw, calc(100vw - 40px)"
                  loading="eager"
                  className="object-cover object-[65%_center]"
                />
              </div>

              <figcaption className="absolute inset-x-4 bottom-0 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_12px_30px_rgba(19,44,64,0.05)]">
                <HeartHandshake
                  size={24}
                  aria-hidden="true"
                  className="shrink-0 text-primary"
                />

                <div className="min-w-0">
                  <strong className="block text-sm leading-5 font-bold">
                    {content.hero.captionTitle}
                  </strong>

                  <span className="mt-1 block text-xs leading-5 text-muted">
                    {content.hero.captionDescription}
                  </span>
                </div>
              </figcaption>
            </figure>
          </Reveal>

          <DonationForm
            key={`${initialAmount}-${initialCause}`}
            initialAmount={initialAmount}
            initialCause={initialCause}
            intro={content.formIntro}
          />
        </div>
      </div>

      <section
        aria-labelledby="donation-care-heading"
        className="border-t border-slate-200 bg-section-muted py-12"
      >
        <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-10">
          <Reveal
            as="header"
            className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10"
          >
            <div>
              <SectionLabel>{content.care.label}</SectionLabel>

              <h2
                id="donation-care-heading"
                className="mt-4 font-serif text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
              >
                {content.care.headingLines.map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </div>

            <p className="max-w-xs text-sm leading-7 text-muted">
              {content.care.description}
            </p>
          </Reveal>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {areasOfCare.map(
              ({ id, title, description, icon: Icon, iconClassName }) => (
                <Reveal
                  as="article"
                  hover
                  key={id}
                  className="rounded-2xl bg-white p-6"
                >
                  <span
                    className={`flex size-11 items-center justify-center rounded-xl ${iconClassName}`}
                  >
                    <Icon size={22} aria-hidden="true" />
                  </span>

                  <h3 className="mt-5 font-serif text-xl leading-tight font-bold tracking-tight">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted">
                    {description}
                  </p>
                </Reveal>
              ),
            )}
          </div>
        </div>
      </section>

      <Reveal
        as="section"
        className="mx-auto flex max-w-[1120px] items-start justify-between gap-6 px-5 py-10 sm:px-6 lg:px-10"
      >
        <div>
          <h2 className="font-serif text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
            {content.closing.heading}
          </h2>

          <p className="mt-3 text-sm leading-7 text-muted">
            {content.closing.description}
          </p>
        </div>

        <HeartHandshake
          size={28}
          aria-hidden="true"
          className="mt-1 shrink-0 text-primary"
        />
      </Reveal>
    </div>
  );
}
