import { defineField, defineType } from "sanity";
import { defaultImpactContent } from "@/features/impact/data/impact-content";

function stringField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "string",
    validation: (rule) => rule.required(),
  });
}
const { imageAlt, ...heroDefaults } = defaultImpactContent.hero;

export const impactPageType = defineType({
  name: "impactPage",
  title: "Our Impact page",
  type: "document",
  initialValue: {
    hero: { ...heroDefaults, image: { _type: "image", alt: imageAlt } },
    storiesIntro: defaultImpactContent.storiesIntro,
  },
  fields: [
    defineField({
      name: "hero",
      title: "Hero — introduction and curved image",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        stringField("label", "Small label above the heading"),
        stringField("heading", "Heading — first line"),
        stringField("headingHighlight", "Heading — blue highlighted line"),
        defineField({
          name: "description",
          title: "Introduction paragraph",
          type: "text",
          rows: 4,
          validation: (rule) => rule.required(),
        }),
        stringField("donateButtonLabel", "Donate button text"),
        stringField("volunteerButtonLabel", "Get involved button text"),
        defineField({
          name: "image",
          title: "Hero photo",
          type: "image",
          options: { hotspot: true },
          validation: (rule) => rule.required().assetRequired(),
          fields: [stringField("alt", "Photo description for screen readers")],
        }),
      ],
    }),
    defineField({
      name: "storiesIntro",
      title: "Stories of Transformation — introduction",
      description:
        "Edit the introduction above the storybook. Individual stories and their photos are managed under Stories of Transformation. These introduction fields apply to the Our Impact page.",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        stringField("label", "Small label above the stories"),
        stringField("heading", "Stories heading — opening text"),
        stringField("headingHighlight", "Stories heading — highlighted word"),
        defineField({
          name: "description",
          title: "Stories introduction",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required(),
        }),
        stringField("footnote", "Small note below the storybook"),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Our Impact", subtitle: "/impact" }) },
});
