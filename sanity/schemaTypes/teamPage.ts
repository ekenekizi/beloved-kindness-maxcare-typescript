import { defineField, defineType } from "sanity";
import { defaultTeamContent } from "@/features/about/data/team-content";

export const teamPageType = defineType({
  name: "teamPage",
  title: "Our Team page",
  type: "document",
  initialValue: {
    label: defaultTeamContent.label,
    heading: defaultTeamContent.heading,
    headingHighlight: defaultTeamContent.headingHighlight,
    description: defaultTeamContent.description,
    members: defaultTeamContent.members.map((member) => ({
      _type: "teamMember",
      _key: member.id,
      name: member.name,
      role: member.role,
      contribution: member.contribution,
      bio: member.bio,
      image: { _type: "image", alt: member.imageAlt },
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
      name: "heading",
      title: "Page heading — first line",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headingHighlight",
      title: "Page heading — blue highlighted line",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Page introduction",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "members",
      title: "Team members",
      description:
        "Add as many members as needed. Drag to reorder them on the website. Open a member to edit their profile; use Remove to take a member off the page, then publish.",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        {
          name: "teamMember",
          title: "Team member",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Full name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "role",
              title: "Role in the organisation",
              description:
                "For example: Facilitator, Advisor or Administrator.",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "image",
              title: "Member photo",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required().assetRequired(),
              fields: [
                defineField({
                  name: "alt",
                  title: "Photo description for screen readers",
                  type: "string",
                  description: "For example: Portrait of Susan Levi Debem.",
                  validation: (rule) => rule.required(),
                }),
              ],
            }),
            defineField({
              name: "contribution",
              title: "Short contribution summary",
              description:
                "One or two sentences about how this person supports the organisation. Shown on their card.",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required().max(240),
            }),
            defineField({
              name: "bio",
              title: "Full biography",
              description:
                "Background, experience and work with BKM. Opens when a visitor selects Read bio. Separate paragraphs with a blank line.",
              type: "text",
              rows: 8,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "role", media: "image" },
          },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Our Team", subtitle: "/about/team" }) },
});
