CREATE TYPE "public"."story_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "transformation_stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"location" text NOT NULL,
	"before_text" text NOT NULL,
	"after_text" text NOT NULL,
	"quote" text NOT NULL,
	"image_key" text,
	"image_alt" text,
	"status" "story_status" DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
