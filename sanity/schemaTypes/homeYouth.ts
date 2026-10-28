import { defineField, defineType } from "sanity";
import { defaultHomeYouth } from "@/features/home/data/home-youth";

export const homeYouthType = defineType({
  name: "homeYouth",
  title: "Partnership & Youth Development",
  type: "object",
  initialValue: {
    label: defaultHomeYouth.label,
    headingStart: defaultHomeYouth.headingStart,
    headingHighlight: defaultHomeYouth.headingHighlight,
    description: defaultHomeYouth.description,
    buttonLabel: defaultHomeYouth.buttonLabel,
    partnerUrl: defaultHomeYouth.partnerUrl,
    image: { _type: "image", alt: defaultHomeYouth.imageAlt },
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
      title: "Heading — first line",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headingHighlight",
      title: "Heading — blue highlighted line",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Partnership introduction",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "buttonLabel",
      title: "Partner website button text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "partnerUrl",
      title: "Partner website address",
      description: "Paste the full website URL, including https://. Opens in a new tab.",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["https", "http"] }),
    }),
    defineField({
      name: "image",
      title: "Partnership section photo",
      description: "Upload the photo used in the curved image beside the text.",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required().assetRequired(),
      fields: [
        defineField({
          name: "alt",
          title: "Image description for screen readers",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
});
