import { defineField, defineType } from "sanity";
import { defaultMembershipContent } from "@/features/get-involved/data/membership-content";

export const membershipContentType = defineType({
  name: "membershipContent",
  title: "Shared membership application content",
  type: "object",
  initialValue: {
    label: defaultMembershipContent.label,
    headingFirstLine: defaultMembershipContent.headingFirstLine,
    headingSecondLine: defaultMembershipContent.headingSecondLine,
    headingHighlight: defaultMembershipContent.headingHighlight,
    description: defaultMembershipContent.description,
    quote: defaultMembershipContent.quote,
    formLabel: defaultMembershipContent.formLabel,
    formHeading: defaultMembershipContent.formHeading,
    benefits: defaultMembershipContent.benefits.map(({ id, ...benefit }) => ({ ...benefit, _type: "membershipBenefit", _key: id })),
    image: { _type: "image", alt: defaultMembershipContent.imageAlt },
  },
  fields: [
    ...[
      { name: "label", title: "Small introduction label" },
      { name: "headingFirstLine", title: "Introduction heading — first line" },
      { name: "headingSecondLine", title: "Introduction heading — second line" },
      { name: "headingHighlight", title: "Introduction heading — highlighted text" },
      { name: "formLabel", title: "Small label above the form" },
      { name: "formHeading", title: "Form heading" },
    ].map((field) => defineField({ ...field, type: "string", validation: (rule) => rule.required() })),
    defineField({ name: "description", title: "Introduction paragraph", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "quote", title: "Encouragement quote", type: "text", rows: 2, validation: (rule) => rule.required() }),
    defineField({
      name: "benefits",
      title: "Three reasons to join",
      description: "Drag to reorder. The three icon styles remain part of the website design.",
      type: "array",
      validation: (rule) => rule.required().min(3).max(3),
      of: [{
        name: "membershipBenefit",
        type: "object",
        fields: [
          defineField({ name: "title", title: "Benefit heading", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "description", title: "Short benefit explanation", type: "text", rows: 2, validation: (rule) => rule.required() }),
        ],
        preview: { select: { title: "title", subtitle: "description" } },
      }],
    }),
    defineField({
      name: "image",
      title: "Membership photo",
      description: "Used behind the introduction on desktop and above the form on mobile.",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required().assetRequired(),
      fields: [defineField({ name: "alt", title: "Photo description for screen readers", type: "string", validation: (rule) => rule.required() })],
    }),
  ],
});
