import type { Metadata } from "next";
import { getTeamContent } from "@/sanity/lib/get-team";

import MeetTeamSection from "@/features/about/components/MeetTeamSection";

export const metadata: Metadata = {
  title: "Meet the Team",
  description:
    "Meet the people behind Beloved Kindness Maxcare and their work supporting vulnerable individuals and communities.",
  alternates: {
    canonical: "/about/team",
  },
};

export default async function TeamPage() {
  const content = await getTeamContent();
  return (
    <div className="bg-background pt-24">
      <MeetTeamSection content={content} />
    </div>
  );
}
