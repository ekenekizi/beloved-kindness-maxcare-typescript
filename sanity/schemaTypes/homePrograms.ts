import { defineField, defineType } from "sanity";
import {
  defaultHomePrograms,
  programDestinations,
} from "@/features/home/data/home-programs";

export const homeProgramsType = defineType({
  name: "homePrograms",
  title: "Homepage Programmes section",
  type: "object",
  initialValue: {
    label: defaultHomePrograms.label,
    headingStart: defaultHomePrograms.headingStart,
    headingHighlight: defaultHomePrograms.headingHighlight,
    description: defaultHomePrograms.description,
    cards: defaultHomePrograms.cards.map((card) => ({
      _type: "programCard",
      _key: card.id,
      category: card.category,
      title: card.title,
      description: card.description,
      buttonLabel: card.buttonLabel,
      href: card.href,
      image: { _type: "image", alt: card.imageAlt },
    })),
  },
  fields: [
    defineField({
      name: "label",
      title: "Small label above the heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headingStart",
      title: "Heading — opening text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headingHighlight",
      title: "Heading — highlighted text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Programme introduction",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cards",
      title: "Three programme cards",
      description:
        "Drag to reorder. The first card appears larger. Upload a photo for each card before publishing.",
      type: "array",
      of: [
        {
          name: "programCard",
          title: "Programme card",
          type: "object",
          fields: [
            defineField({
              name: "category",
              title: "Small category label",
              description: "For example: Education, Care or Empowerment.",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Card heading",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Card introduction",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "buttonLabel",
              title: "Button text",
              type: "string",
              initialValue: "Learn more",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "Programme page to open",
              type: "string",
              options: { list: programDestinations },
              validation: (rule) =>
                rule.required().custom((value) =>
                  !value || programDestinations.some((route) => route.value === value)
                    ? true
                    : "Select an existing programme page.",
                ),
            }),
            defineField({
              name: "image",
              title: "Card photo",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Image description for screen readers",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
              ],
              validation: (rule) => rule.required().assetRequired(),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "category", media: "image" },
          },
        },
      ],
      validation: (rule) => rule.required().min(3).max(3),
    }),
  ],
});
