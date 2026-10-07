import type { Access, CollectionConfig } from "payload";

const isStaff: Access = ({ req }) => req.user?.collection === "users";

export const Stories: CollectionConfig = {
  slug: "stories",

  labels: {
    singular: "Story of Transformation",
    plural: "Stories of Transformation",
  },

  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "_status", "sortOrder"],
  },

  defaultSort: "sortOrder",

  access: {
    create: isStaff,
    update: isStaff,
    delete: isStaff,
    readVersions: isStaff,

    read: ({ req }) => {
      if (req.user?.collection === "users") {
        return true;
      }

      return {
        _status: {
          equals: "published",
        },
      };
    },
  },

  versions: {
    drafts: true,
    maxPerDoc: 20,
  },

  fields: [
    {
      name: "name",
      label: "Person or story name",
      type: "text",
      required: true,
    },
    {
      name: "category",
      type: "text",
      required: true,
      admin: {
        description: "For example: Orphan Support or Scholarship Program.",
      },
    },
    {
      name: "location",
      type: "text",
      required: true,
    },
    {
      name: "before",
      label: "Life before support",
      type: "textarea",
      required: true,
    },
    {
      name: "after",
      label: "Life after support",
      type: "textarea",
      required: true,
    },
    {
      name: "quote",
      label: "Personal quote",
      type: "textarea",
      required: true,
    },
    {
      name: "sortOrder",
      label: "Display order",
      type: "number",
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        position: "sidebar",
        description:
          "Lower numbers appear first. Use 10, 20, 30 to leave space between stories.",
      },
    },
  ],
};
