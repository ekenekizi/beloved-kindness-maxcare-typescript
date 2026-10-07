import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const storyStatus = pgEnum("story_status", ["draft", "published"]);

export const transformationStories = pgTable("transformation_stories", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),

  beforeText: text("before_text").notNull(),
  afterText: text("after_text").notNull(),
  quote: text("quote").notNull(),

  imageKey: text("image_key"),
  imageAlt: text("image_alt"),

  status: storyStatus("status").default("draft").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),

  publishedAt: timestamp("published_at", {
    withTimezone: true,
  }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export type Story = typeof transformationStories.$inferSelect;
export type NewStory = typeof transformationStories.$inferInsert;
