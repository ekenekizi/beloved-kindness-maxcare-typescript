import { defineField, defineType } from "sanity";

export const galleryVideoType = defineType({
  name: "galleryVideo", title: "Gallery Videos", type: "document",
  initialValue: () => ({ featured: false, uploadedAt: new Date().toISOString() }),
  fields: [
    defineField({ name: "title", title: "Video title", type: "string", validation: r => r.required().max(120) }),
    defineField({ name: "description", title: "Short description", type: "text", rows: 3, validation: r => r.required().max(500) }),
    defineField({
      name: "video", title: "Upload video", type: "file", options: { accept: "video/mp4,video/webm" },
      description: "Upload MP4 or WebM. Convert MOV and other formats first. No programme or activity year is required.",
      validation: r => r.required().assetRequired(),
    }),
    defineField({
      name: "poster", title: "Video thumbnail / poster", type: "image", options: { hotspot: true },
      validation: r => r.required().assetRequired(),
      fields: [defineField({ name: "alt", title: "Describe what is visible", type: "string", validation: r => r.required() })],
    }),
    defineField({
      name: "duration", title: "Duration (optional)", type: "string", description: "For example 03:42 or 1:02:18. Leave empty if unknown.",
      validation: r => r.custom(value => !value || /^\d{1,3}:[0-5]\d(?::[0-5]\d)?$/.test(value) || "Use minutes:seconds or hours:minutes:seconds."),
    }),
    defineField({ name: "captions", title: "Captions (optional WebVTT file)", type: "file", options: { accept: ".vtt" }, description: "Upload a .vtt captions file matching this video." }),
    defineField({
      name: "featured", title: "Feature this video", type: "boolean",
      description: "If several are featured, the one with the latest upload date wins. If none are featured, the newest video is used.",
    }),
    defineField({ name: "uploadedAt", title: "Upload / listing date", type: "datetime", description: "Controls newest-first ordering, not the year the activity happened.", validation: r => r.required() }),
  ],
  orderings: [{ title: "Newest uploads", name: "newest", by: [{ field: "uploadedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", media: "poster", featured: "featured" },
    prepare: ({ title, media, featured }) => ({ title, media, subtitle: featured ? "Featured video" : "Video" }),
  },
});
