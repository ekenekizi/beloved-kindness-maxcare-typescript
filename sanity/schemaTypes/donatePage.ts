import { defineField, defineType } from "sanity";
import { defaultDonateContent } from "@/features/get-involved/data/donate-content";
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
const { imageAlt, ...heroDefaults } = defaultDonateContent.hero;
export const donatePageType = defineType({
  name: "donatePage",
  title: "Donate page",
  type: "document",
  initialValue: {
    hero: { ...heroDefaults, image: { _type: "image", alt: imageAlt } },
    formIntro: defaultDonateContent.formIntro,
    care: {
      ...defaultDonateContent.care,
      cards: defaultDonateContent.care.cards.map(({ id, ...card }) => ({
        ...card,
        _type: "donationCareCard",
        _key: id,
      })),
    },
    closing: defaultDonateContent.closing,
  },
  fields: [
    defineField({
      name: "hero",
      title: "Hero — introduction, photo and caption",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        text("label", "Small label above the heading"),
        text("heading", "Heading — first line"),
        lines("highlightLines", "Heading — blue highlighted lines"),
        text("description", "Introduction paragraph", true),
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
    }),
    defineField({
      name: "formIntro",
      title: "Donation form introduction",
      description:
        "Only the heading and introductory text are edited here. Amounts, causes, validation and payment handling are managed in code.",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        text("heading", "Form heading"),
        text("description", "Form introduction", true),
      ],
    }),
    defineField({
      name: "care",
      title: "The heart of our work — three care cards",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        text("label", "Small section label"),
        lines("headingLines", "Section heading"),
        text("description", "Section introduction", true),
        defineField({
          name: "cards",
          title: "Three areas of care",
          description:
            "Edit titles and descriptions. The three icon styles stay in their current order.",
          type: "array",
          validation: (rule) => rule.required().min(3).max(3),
          of: [
            {
              name: "donationCareCard",
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
    }),
    defineField({
      name: "closing",
      title: "Closing thank-you message",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        text("heading", "Closing heading"),
        text("description", "Closing paragraph", true),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Donate", subtitle: "/get-involved/donate" }),
  },
});
