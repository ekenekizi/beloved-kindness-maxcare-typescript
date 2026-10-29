import "server-only";
import { sanityClient } from "./client";
import { socialUrl, type SocialLinks } from "@/features/site/social-links";

export async function getSocialLinks(): Promise<SocialLinks> {
  try {
    const settings = await sanityClient.fetch<SocialLinks | null>(
      '*[_type == "siteSettings" && _id == "site-settings"][0]{facebookUrl, instagramUrl, linkedinUrl, xUrl}',
      {},
      { next: { revalidate: 60 } },
    );
    return {
      facebookUrl: socialUrl(settings?.facebookUrl),
      instagramUrl: socialUrl(settings?.instagramUrl),
      linkedinUrl: socialUrl(settings?.linkedinUrl),
      xUrl: socialUrl(settings?.xUrl),
    };
  } catch {
    // Optional social links must not prevent navigation from loading.
    return {};
  }
}
