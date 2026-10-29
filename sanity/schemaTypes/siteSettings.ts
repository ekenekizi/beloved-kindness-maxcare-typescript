import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  initialValue: {
    facebookUrl: "https://www.facebook.com/profile.php?id=100093723275365",
    instagramUrl: "https://www.instagram.com/beloved_kindness_maxcare_/",
  },
  fields: [
    ["facebookUrl", "Facebook"],
    ["instagramUrl", "Instagram"],
    ["linkedinUrl", "LinkedIn"],
    ["xUrl", "X"],
  ].map(([name, platform]) => defineField({
    name,
    title: platform + " profile URL",
    description: "Optional. Paste the full https:// address. Clear this field and publish to hide the icon.",
    type: "url",
    validation: (rule) => rule.uri({ scheme: ["https"] }),
  })),
  preview: { prepare: () => ({ title: "Social media links" }) },
});
