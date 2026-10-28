import "server-only";
import type { SanityImageSource } from "@sanity/image-url";
import {
  defaultTeamContent,
  type TeamContent,
  type TeamMember,
} from "@/features/about/data/team-content";
import { sanityClient } from "./client";
import { urlFor } from "./image";
import { teamPageQuery } from "./queries";

type SanityTeamContent = Omit<TeamContent, "members"> & {
  members: (Omit<TeamMember, "image"> & { image: SanityImageSource })[];
};

export async function getTeamContent(): Promise<TeamContent> {
  const content = await sanityClient.fetch<SanityTeamContent | null>(
    teamPageQuery,
    {},
    { next: { revalidate: 60 } },
  );
  if (!content) return defaultTeamContent;
  // Preserve the published member list, including removals and editorial order.
  return {
    ...content,
    members: content.members.map((member) => ({
      ...member,
      image: urlFor(member.image)
        .width(1000)
        .fit("max")
        .quality(85)
        .auto("format")
        .url(),
    })),
  };
}
