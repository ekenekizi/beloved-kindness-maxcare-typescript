import { defineField, defineType } from "sanity";

export const storyType = defineType({
  name: "story",
  title: "Stories of Transformation",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "Person or story name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Story photo",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Image description",
          type: "string",
          description: "Describe the photo for people using screen readers.",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "before",
      title: "Life before support",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "after",
      title: "Life after support",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "quote",
      title: "Personal quote",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Display order",
      type: "number",
      initialValue: 10,
      description: "Lower numbers appear first. Use 10, 20, 30.",
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],

  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "image",
    },
  },
});
