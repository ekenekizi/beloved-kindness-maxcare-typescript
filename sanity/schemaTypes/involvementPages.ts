import { defineField, defineType } from "sanity";
import {
  defaultPartnerContent,
  defaultVolunteerContent,
  type InvolvementHero,
} from "@/features/get-involved/data/involvement-content";
function text(name: string, title: string, long = false) {
  return defineField({
    name,
    title,
    type: long ? "text" : "string",
    ...(long ? { rows: 3 } : {}),
    validation: (rule) => rule.required(),
  });
}
function lines(name: string, title: string) {
  return defineField({
    name,
    title,
    description: "Add one item per heading line.",
    type: "array",
    of: [{ type: "string", validation: (rule) => rule.required() }],
    validation: (rule) => rule.required().min(1).max(2),
  });
}
function heroField() {
  return defineField({
    name: "hero",
    title: "Hero — introduction, curved photo and caption",
    type: "object",
    validation: (rule) => rule.required(),
    fields: [
      text("label", "Small label above the heading"),
      text("heading", "Heading — first line"),
      lines("highlightLines", "Heading — blue highlighted lines"),
      text("description", "Introduction paragraph", true),
      text("primaryButtonLabel", "Main button text"),
      text("secondaryButtonLabel", "Ways to help link — text"),
      text("captionTitle", "Floating photo caption — heading"),
      text("captionDescription", "Floating photo caption — description"),
      defineField({
        name: "image",
        title: "Hero photo",
        type: "image",
        options: { hotspot: true },
        validation: (rule) => rule.required().assetRequired(),
        fields: [text("alt", "Photo description for screen readers")],
      }),
    ],
  });
}
function initialHero(hero: InvolvementHero) {
  const { imageAlt, ...content } = hero;
  return { ...content, image: { _type: "image", alt: imageAlt } };
}
export const partnerPageType = defineType({
  name: "partnerPage",
  title: "Partner With Us page",
  type: "document",
  initialValue: {
    hero: initialHero(defaultPartnerContent.hero),
    partnership: {
      ...defaultPartnerContent.partnership,
      steps: defaultPartnerContent.partnership.steps.map(({ id, ...step }) => ({
        ...step,
        _type: "partnershipStep",
        _key: id,
      })),
    },
  },
  fields: [
    heroField(),
    defineField({
      name: "partnership",
      title: "Partnership areas and form introduction",
      type: "object",
      validation: (rule) => rule.required(),
      description:
        "These fields manage page text. The Orphanage homes and Widow empowerment options, form fields and validation remain fixed in code. Email sending is configured separately.",
      fields: [
        lines("areasHeadingLines", "Choose an area — heading lines"),
        text("areasDescription", "Choose an area — introduction", true),
        text("orphanageDescription", "Orphanage homes — description", true),
        text("orphanageFootnote", "Orphanage homes — short support summary"),
        text("widowDescription", "Widow empowerment — description", true),
        text("widowFootnote", "Widow empowerment — short support summary"),
        text("formLabel", "Small label above the form introduction"),
        lines("formHeadingLines", "Form introduction — heading lines"),
        text("formDescription", "Form introduction — description", true),
        text("formFootnote", "Small encouragement note below the steps", true),
        defineField({
          name: "steps",
          title: "Three partnership steps",
          type: "array",
          validation: (rule) => rule.required().min(3).max(3),
          of: [
            {
              name: "partnershipStep",
              type: "object",
              fields: [
                text("title", "Step heading"),
                text("description", "Step explanation", true),
              ],
              preview: { select: { title: "title", subtitle: "description" } },
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Partner With Us",
      subtitle: "/get-involved/partner",
    }),
  },
});
export const volunteerPageType = defineType({
  name: "volunteerPage",
  title: "Volunteer page",
  type: "document",
  initialValue: {
    hero: initialHero(defaultVolunteerContent.hero),
    waysToHelp: defaultVolunteerContent.waysToHelp.map(({ id, ...way }) => ({
      ...way,
      _type: "volunteerWay",
      _key: id,
    })),
  },
  fields: [
    heroField(),
    defineField({
      name: "waysToHelp",
      title: "Three ways to volunteer",
      description:
        "Edit these card headings and descriptions. Icons stay in their current order. The membership section below is shared with the homepage; edit it under Homepage → Membership application section (shared).",
      type: "array",
      validation: (rule) => rule.required().min(3).max(3),
      of: [
        {
          name: "volunteerWay",
          type: "object",
          fields: [
            text("title", "Card heading"),
            text("description", "Card explanation", true),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Volunteer",
      subtitle: "/get-involved/volunteer",
    }),
  },
});
