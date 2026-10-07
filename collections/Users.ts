import type { Access, CollectionConfig } from "payload";

const isStaff: Access = ({ req }) => req.user?.collection === "users";

export const Users: CollectionConfig = {
  slug: "users",

  auth: true,

  admin: {
    useAsTitle: "name",
  },

  access: {
    admin: ({ req }) => req.user?.collection === "users",
    create: isStaff,
    read: isStaff,
    update: isStaff,
    delete: isStaff,
  },

  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
};
