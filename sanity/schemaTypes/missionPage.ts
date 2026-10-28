import { defineField, defineType } from "sanity";
import { defaultMissionContent } from "@/features/about/data/mission-content";

export const missionPageType = defineType({
  name: "missionPage",
  title: "Mission & Vision page",
  type: "document",
  initialValue: {
    label: defaultMissionContent.label,
    heading: defaultMissionContent.heading,
    description: defaultMissionContent.description,
    objectives: defaultMissionContent.objectives.map(
      ({ id, ...objective }) => ({
        ...objective,
        _type: "missionObjective",
        _key: id,
      }),
    ),
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
      title: "Page heading",
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
      name: "objectives",
      title: "Four pinned objective cards",
      description:
        "Edit each title and its bullet points. Drag to reorder cards. Numbers, pin colours and paper styles are managed by the website.",
      type: "array",
      validation: (rule) => rule.required().min(4).max(4),
      of: [
        {
          name: "missionObjective",
          title: "Objective card",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Card heading",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "points",
              title: "Objective bullet points",
              description:
                "Add one objective per item. Drag items to reorder them within the card.",
              type: "array",
              of: [{ type: "string", validation: (rule) => rule.required() }],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "title", points: "points" },
            prepare({ title, points }) {
              return {
                title,
                subtitle: String(points?.length ?? 0) + " bullet points",
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Mission & Vision", subtitle: "/about/mission" }),
  },
});
