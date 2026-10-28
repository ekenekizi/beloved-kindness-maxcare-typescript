import type { Metadata } from "next";
import { getImpactPageContent } from "@/sanity/lib/get-impact-page";

import NextChapterSection from "@/features/impact/components/NextChapterSection";
import StoriesSection from "@/features/home/components/StoriesSection";
import { getTransformationStories } from "@/sanity/lib/get-stories";

export const metadata: Metadata = {
  title: "Our Impact",
  description:
    "Explore Beloved Kindness Maxcare's work supporting children, women, and families, and discover how you can get involved.",
  alternates: {
    canonical: "/impact",
  },
};

export default async function ImpactPage() {
  const [content, stories] = await Promise.all([
    getImpactPageContent(),
    getTransformationStories(),
  ]);

  return (
    <div className="bg-background relative isolate overflow-hidden py-23">
      <NextChapterSection content={content.hero} />

      {stories.length > 0 && (
        <StoriesSection stories={stories} intro={content.storiesIntro} />
      )}
    </div>
  );
}
