import { defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",

  initialValue: {
    eyebrow: "Small acts. Lasting change.",
    headingFirstLine: "Restoring hope.",
    headingHighlight: "Transforming",
    headingEnding: "lives.",
    description:
      "Supporting vulnerable communities through compassion, education, empowerment, and sustainable humanitarian action across Nigeria.",
    primaryButtonLabel: "Donate",
    secondaryButtonLabel: "Become a Volunteer",
    footnote: "Compassion in action. Hope in every community.",
  },

  fields: [
    defineField({
      name: "eyebrow",
      title: "Small text above the heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "headingFirstLine",
      title: "Heading — first line",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "headingHighlight",
      title: "Heading — highlighted word or phrase",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "headingEnding",
      title: "Heading — text after the highlight",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "description",
      title: "Introduction below the heading",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "primaryButtonLabel",
      title: "Donate button text",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "secondaryButtonLabel",
      title: "Volunteer button text",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "footnote",
      title: "Small text below the hanging photos",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "photos",
      title: "Five hanging hero photos",
      description:
        "Upload five photos. Drag to reorder them. The third photo is initially centred on mobile.",
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
              title: "Caption below the photo",
              type: "string",
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: "alt",
              title: "Image description for screen readers",
              type: "string",
              validation: (rule) => rule.required(),
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
      validation: (rule) => rule.required().min(5).max(5),
    }),
    defineField({
      name: "about",
      title: "About section",
      type: "homeAbout",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "impact",
      title: "Impact section",
      type: "homeImpact",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "programs",
      title: "Programmes section",
      type: "homePrograms",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "youth",
      title: "Partnership & Youth Development section",
      type: "homeYouth",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "membership",
      title: "Membership application section (shared)",
      description: "This introduction and photo appear on both the homepage and volunteer page. Application fields and sending behavior are managed in code.",
      type: "membershipContent",
      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "headingFirstLine",
      media: "photos.2.asset",
    },
  },
});
