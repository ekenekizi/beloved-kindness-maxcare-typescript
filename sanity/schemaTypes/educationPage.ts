import { defineField, defineType } from "sanity";
import { defaultEducationContent } from "@/features/programs/data/education-content";

// Shared field definitions keep the Studio sections consistent.
function stringField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "string",
    validation: (rule) => rule.required(),
  });
}
function paragraphField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "text",
    rows: 3,
    validation: (rule) => rule.required(),
  });
}
const { imageAlt, ...heroDefaults } = defaultEducationContent.hero;

export const educationPageType = defineType({
  name: "educationPage",
  title: "Education programme page",
  type: "document",
  initialValue: {
    hero: { ...heroDefaults, image: { _type: "image", alt: imageAlt } },
    supportAreas: defaultEducationContent.supportAreas.map(
      ({ id, ...area }) => ({
        ...area,
        _type: "educationSupportArea",
        _key: id,
      }),
    ),
    purpose: {
      ...defaultEducationContent.purpose,
      paragraphs: defaultEducationContent.purpose.paragraphs.map(
        (text, index) => ({
          _type: "educationParagraph",
          _key: "paragraph-" + index,
          text,
        }),
      ),
    },
    donation: defaultEducationContent.donation,
    gallery: defaultEducationContent.gallery,
    partners: defaultEducationContent.partners,
  },
  fields: [
    defineField({
      name: "hero",
      title: "Hero — introduction and photo",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        stringField("label", "Small programme label"),
        stringField("heading", "Heading — first line"),
        stringField("highlightFirstLine", "Blue heading — first line"),
        stringField("highlightSecondLine", "Blue heading — second line"),
        paragraphField("description", "Programme introduction"),
        stringField("donateButtonLabel", "Support button text"),
        stringField("galleryLinkLabel", "Link to the photo gallery — text"),
        stringField("captionTitle", "Floating photo caption — heading"),
        stringField(
          "captionDescription",
          "Floating photo caption — description",
        ),
        defineField({
          name: "image",
          title: "Hero photo",
          type: "image",
          options: { hotspot: true },
          validation: (rule) => rule.required().assetRequired(),
          fields: [stringField("alt", "Photo description for screen readers")],
        }),
      ],
    }),
    defineField({
      name: "supportAreas",
      title: "Four areas of education support",
      description:
        "Edit the four headings and descriptions. Icons remain part of the website design in their current order.",
      type: "array",
      validation: (rule) => rule.required().min(4).max(4),
      of: [
        {
          name: "educationSupportArea",
          type: "object",
          fields: [
            stringField("title", "Support area heading"),
            paragraphField("description", "Short explanation"),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
    }),
    defineField({
      name: "purpose",
      title: "Why this matters — explanation",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        stringField("label", "Small section label"),
        stringField("heading", "Heading — first line"),
        stringField("headingSecondLine", "Heading — second line"),
        paragraphField("quote", "Highlighted statement"),
        defineField({
          name: "paragraphs",
          title: "Explanation paragraphs",
          description:
            "Add one paragraph per item. Drag to reorder paragraphs.",
          type: "array",
          validation: (rule) => rule.required().min(1),
          of: [
            {
              name: "educationParagraph",
              type: "object",
              fields: [paragraphField("text", "Paragraph text")],
              preview: { select: { title: "text" } },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "donation",
      title: "Donation callout",
      description:
        "Buttons always select Education and a suggested gift of ₦25,000 on the donation page.",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        stringField("heading", "Callout heading"),
        paragraphField("description", "Callout description"),
        stringField("buttonLabel", "Support button text"),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Gallery introduction",
      description:
        "Manage photos under Gallery Albums: choose Education and enter the activity year. This page automatically uses the newest published year.",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        stringField("label", "Small gallery label"),
        stringField("heading", "Gallery heading — first line"),
        stringField("headingSecondLine", "Gallery heading — second line"),
        paragraphField("description", "Gallery introduction"),
      ],
    }),
    defineField({
      name: "partners",
      title: "Beneficiary partners — closing section",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        stringField("heading", "Section heading"),
        paragraphField("description", "Partner explanation"),
        stringField("buttonLabel", "Donation button text"),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Education", subtitle: "/programs/education" }),
  },
});
