import type { Metadata } from "next";
import { getOurStory } from "@/sanity/lib/get-our-story";
import { getMembershipContent } from "@/sanity/lib/get-membership-content";

import OurStorySection from "@/features/about/components/OurStorySection";
import MakeItHappenSection from "@/features/about/components/MakeItHappenSection";
import MembershipSection from "@/features/get-involved/components/MembershipSection";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Learn about Beloved Kindness Maxcare and our commitment to supporting vulnerable individuals and communities.",
  alternates: {
    canonical: "/about/story",
  },
};

export default async function OurStoryPage() {
  const [content, membershipContent] = await Promise.all([
    getOurStory(),
    getMembershipContent(),
  ]);
  return (
    <div className="bg-background">
      <OurStorySection content={content.hero} />
      <MakeItHappenSection content={content.work} />
      <MembershipSection content={membershipContent} />
    </div>
  );
}
