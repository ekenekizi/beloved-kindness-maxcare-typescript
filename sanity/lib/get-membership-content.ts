import "server-only";
import type { SanityImageSource } from "@sanity/image-url";
import { defaultMembershipContent, type MembershipContent } from "@/features/get-involved/data/membership-content";
import { sanityClient } from "./client";
import { urlFor } from "./image";
import { membershipContentQuery } from "./queries";

type SanityMembershipContent = Omit<MembershipContent, "image"> & { image: SanityImageSource };

export async function getMembershipContent(): Promise<MembershipContent> {
  const content = await sanityClient.fetch<SanityMembershipContent | null>(
    membershipContentQuery, {}, { next: { revalidate: 60 } },
  );
  if (!content || content.benefits.length !== 3) return defaultMembershipContent;
  return {
    ...content,
    image: urlFor(content.image).width(1200).quality(80).auto("format").url(),
  };
}
