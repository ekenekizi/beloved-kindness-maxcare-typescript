import type { Metadata } from "next";
import { getMissionContent } from "@/sanity/lib/get-mission";
import { getMembershipContent } from "@/sanity/lib/get-membership-content";

import ObjectivesSection from "@/features/about/components/ObjectivesSection";
import MembershipSection from "@/features/get-involved/components/MembershipSection";

export const metadata: Metadata = {
  title: "Mission and Vision",
  description:
    "Explore the objectives guiding Beloved Kindness Maxcare: care and dignity, youth development, humanitarian partnerships, and skills empowerment.",
  alternates: {
    canonical: "/about/mission",
  },
};

export default async function MissionVisionPage() {
  const [content, membershipContent] = await Promise.all([
    getMissionContent(),
    getMembershipContent(),
  ]);
  return (
    <div className="bg-background">
      <ObjectivesSection content={content} />
      <MembershipSection content={membershipContent} />
    </div>
  );
}
