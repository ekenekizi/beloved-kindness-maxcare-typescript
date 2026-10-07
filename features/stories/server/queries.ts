import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { transformationStories } from "@/db/schema";

export async function getPublishedStories() {
  return db
    .select({
      id: transformationStories.id,
      name: transformationStories.name,
      category: transformationStories.category,
      location: transformationStories.location,
      beforeText: transformationStories.beforeText,
      afterText: transformationStories.afterText,
      quote: transformationStories.quote,
      imageKey: transformationStories.imageKey,
      imageAlt: transformationStories.imageAlt,
    })
    .from(transformationStories)
    .where(eq(transformationStories.status, "published"))
    .orderBy(
      asc(transformationStories.sortOrder),
      desc(transformationStories.createdAt),
      asc(transformationStories.id),
    );
}
