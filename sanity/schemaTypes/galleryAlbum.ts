import { defineField, defineType } from "sanity";
import {
  galleryProgrammes,
  isGalleryProgramme,
} from "@/features/gallery/data/programmes";

export const galleryAlbumType = defineType({
  name: "galleryAlbum",
  title: "Gallery Albums",
  type: "document",

  fields: [
    defineField({
      name: "programme",
      title: "Programme",
      description:
        "Choose which of the four programme galleries this album belongs to.",
      type: "string",
      options: {
        list: galleryProgrammes.map(({ title, value }) => ({ title, value })),
        layout: "dropdown",
      },
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value || isGalleryProgramme(value)
              ? true
              : "Choose one of the four programme options.",
          ),
    }),
    defineField({
      name: "year",
      title: "Activity year",
      description:
        "Enter the year the activity took place, for example 2025. The newest published year appears on the programme page automatically.",
      type: "number",
      validation: (rule) => rule.required().integer().min(1900).max(2100),
    }),
    defineField({
      name: "title",
      title: "Album title",
      description:
        "A descriptive name for this album, such as Christmas Celebration in Abuja. Programme and year are selected above.",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    // Retained for compatibility with existing albums, not needed for new ones.
    defineField({
      name: "slug",
      title: "Legacy album identifier",
      type: "slug",
      hidden: true,
    }),

    defineField({
      name: "description",
      title: "Album description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "title",
              title: "Photo title",
              type: "string",
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: "alt",
              title: "Image description",
              type: "string",
              description:
                "Describe what is visible for people using screen readers.",
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: "description",
              title: "Photo caption",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "alt",
              media: "asset",
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),

    defineField({
      name: "sortOrder",
      title: "Display order",
      type: "number",
      initialValue: 10,
      description:
        "Controls album order within the same programme and year. Years always appear newest first.",
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
      title: "title",
      programme: "programme",
      year: "year",
      media: "photos.0.asset",
    },
    prepare({ title, programme, year, media }) {
      const name =
        galleryProgrammes.find((item) => item.value === programme)?.title ??
        "Choose a programme";
      return { title, subtitle: `${name} · ${year ?? "Year not set"}`, media };
    },
  },
});
