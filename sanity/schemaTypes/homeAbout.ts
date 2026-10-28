import { defineField, defineType } from "sanity";

export const homeAboutType = defineType({
  name: "homeAbout",
  title: "Homepage About section",
  type: "object",

  fields: [
    defineField({
      name: "label",
      title: "Small label above the heading",
      type: "string",
      initialValue: "About Us",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "headingStart",
      title: "Heading — opening text",
      type: "string",
      initialValue: "Born Out of",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "headingHighlight",
      title: "Heading — highlighted line",
      type: "string",
      initialValue: "Deep Calling.",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "headingEnd",
      title: "Heading — closing text",
      type: "string",
      initialValue: "to Serve",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "description",
      title: "About introduction",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "buttonLabel",
      title: "Our Story button text",
      type: "string",
      initialValue: "Our Story",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "image",
      title: "About section photo",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Image description for screen readers",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
});
