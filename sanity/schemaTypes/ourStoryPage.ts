import { defineField, defineType } from "sanity";
import { defaultOurStoryContent } from "@/features/about/data/our-story-content";

const imageField = () =>
  defineField({
    name: "image",
    title: "Section photo",
    type: "image",
    options: { hotspot: true },
    validation: (rule) => rule.required().assetRequired(),
    fields: [
      defineField({
        name: "alt",
        title: "Photo description for screen readers",
        type: "string",
        validation: (rule) => rule.required(),
      }),
    ],
  });

export const ourStoryPageType = defineType({
  name: "ourStoryPage",
  title: "Our Story page",
  type: "document",
  initialValue: {
    hero: {
      label: defaultOurStoryContent.hero.label,
      heading: defaultOurStoryContent.hero.heading,
      headingHighlight: defaultOurStoryContent.hero.headingHighlight,
      description: defaultOurStoryContent.hero.description,
      location: defaultOurStoryContent.hero.location,
      serviceArea: defaultOurStoryContent.hero.serviceArea,
      discoverButtonLabel: defaultOurStoryContent.hero.discoverButtonLabel,
      volunteerButtonLabel: defaultOurStoryContent.hero.volunteerButtonLabel,
      image: { _type: "image", alt: defaultOurStoryContent.hero.imageAlt },
    },
    work: {
      label: defaultOurStoryContent.work.label,
      heading: defaultOurStoryContent.work.heading,
      headingHighlight: defaultOurStoryContent.work.headingHighlight,
      description: defaultOurStoryContent.work.description,
      footnote: defaultOurStoryContent.work.footnote,
      cards: defaultOurStoryContent.work.cards.map((card) => ({
        label: card.label,
        title: card.title,
        description: card.description,
        _type: "storyActivity",
        _key: card.id,
        image: { _type: "image", alt: card.imageAlt },
      })),
    },
  },
  fields: [
    defineField({
      name: "hero",
      title: "Introduction and heart-shaped photo",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        ...[
          { name: "label", title: "Small label above the heading" },
          { name: "heading", title: "Heading — first line" },
          {
            name: "headingHighlight",
            title: "Heading — blue highlighted line",
          },
          { name: "location", title: "Location badge — where we are based" },
          {
            name: "serviceArea",
            title: "Location badge — communities we serve",
          },
          {
            name: "discoverButtonLabel",
            title: "Discover our work button text",
          },
          { name: "volunteerButtonLabel", title: "Volunteer button text" },
        ].map((field) =>
          defineField({
            ...field,
            type: "string",
            validation: (rule) => rule.required(),
          }),
        ),
        defineField({
          name: "description",
          title: "Introduction paragraph",
          type: "text",
          rows: 5,
          validation: (rule) => rule.required(),
        }),
        imageField(),
      ],
    }),
    defineField({
      name: "work",
      title: "Compassion in action — activity cards",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        ...[
          { name: "label", title: "Small section label" },
          { name: "heading", title: "Section heading — opening text" },
          {
            name: "headingHighlight",
            title: "Section heading — blue highlighted text",
          },
          { name: "footnote", title: "Small note below the cards" },
        ].map((field) =>
          defineField({
            ...field,
            type: "string",
            validation: (rule) => rule.required(),
          }),
        ),
        defineField({
          name: "description",
          title: "Section introduction",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "cards",
          title: "Three activity cards",
          description:
            "The first card is displayed larger. Drag cards to reorder; upload one photo per card.",
          type: "array",
          validation: (rule) => rule.required().min(3).max(3),
          of: [
            {
              name: "storyActivity",
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Small badge text",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "title",
                  title: "Activity heading",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "description",
                  title: "Activity explanation",
                  type: "text",
                  rows: 3,
                  validation: (rule) => rule.required(),
                }),
                imageField(),
              ],
              preview: {
                select: { title: "title", subtitle: "label", media: "image" },
              },
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Our Story", subtitle: "/about/story" }),
  },
});
