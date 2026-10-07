import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Learn about Beloved Kindness Maxcare and our commitment to supporting vulnerable individuals and communities.",
};

export default function OurStoryPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">
          Our story
        </p>

        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Restoring dignity. Reaching the unreached.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
          Beloved Kindness Maxcare supports children, adolescents, and women
          through counselling, education, and practical care. Our work helps
          orphans, widows, and vulnerable communities build sustainable
          livelihoods.
        </p>
      </div>
    </section>
  );
}
