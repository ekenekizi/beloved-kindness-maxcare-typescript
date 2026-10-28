import { defineField, defineType } from "sanity";

export const homeImpactType = defineType({
  name: "homeImpact",
  title: "Homepage Impact section",
  type: "object",

  initialValue: {
    label: "Impact",
    headingStart: "The work is hard but the",
    headingHighlight: "results",
    headingEnd: "are real",
    description:
      "Every number represents a life changed, a child fed, a widow empowered. We measure our success in human terms.",
    galleryButtonLabel: "Explore Our Gallery",
    partnerButtonLabel: "Partner with us",
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
      title: "Heading — highlighted line",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "headingEnd",
      title: "Heading — closing text",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "description",
      title: "Impact introduction",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "galleryButtonLabel",
      title: "Gallery button text",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "partnerButtonLabel",
      title: "Partnership button text",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "stats",
      title: "Four impact statistics",
      description:
        "Add four statistics. Drag to reorder them. Enter numbers without a + sign.",
      type: "array",
      of: [
        {
          name: "impactStat",
          title: "Impact statistic",
          type: "object",

          fields: [
            defineField({
              name: "number",
              title: "Number",
              description: "Use a figure confirmed by the organisation.",
              type: "number",
              validation: (rule) => rule.required().integer().min(0),
            }),

            defineField({
              name: "label",
              title: "What this number represents",
              description:
                "For example: Children supported or Communities reached.",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],

          preview: {
            select: {
              title: "label",
              number: "number",
            },
            prepare({ title, number }) {
              return {
                title,
                subtitle: String(number ?? ""),
              };
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(4).max(4),
    }),
  ],
});
