import { defineField, defineType } from "sanity";
import {
  defaultProgrammeContent,
  type ProgrammeKey,
} from "@/features/programs/data/programme-content";

function text(name: string, title: string, long = false) {
  return defineField({
    name,
    title,
    type: long ? "text" : "string",
    ...(long ? { rows: 3 } : {}),
    validation: (rule) => rule.required(),
  });
}
function lines(name: string, title: string, maximum = 3) {
  return defineField({
    name,
    title,
    description: "Add one item per heading line.",
    type: "array",
    of: [{ type: "string", validation: (rule) => rule.required() }],
    validation: (rule) => rule.required().min(1).max(maximum),
  });
}

function programmePage(
  key: ProgrammeKey,
  name: string,
  title: string,
  supportCount: number,
) {
  const defaults = defaultProgrammeContent[key];
  const { imageAlt, video, ...heroDefaults } = defaults.hero;
  const isVideo = key === "party";
  return defineType({
    name,
    title: title + " page",
    type: "document",
    initialValue: {
      hero: {
        ...heroDefaults,
        image: { _type: "image", alt: imageAlt },
        ...(video ? { video: { _type: "file" } } : {}),
      },
      supportAreas: defaults.supportAreas.map(({ id, ...area }) => ({
        ...area,
        _type: "programmeSupportArea",
        _key: id,
      })),
      ...(defaults.schedule ? { schedule: defaults.schedule } : {}),
      purpose: {
        ...defaults.purpose,
        paragraphs: defaults.purpose.paragraphs.map((paragraph, index) => ({
          _type: "programmeParagraph",
          _key: "paragraph-" + index,
          text: paragraph,
        })),
      },
      donation: defaults.donation,
      gallery: defaults.gallery,
      invitation: {
        heading: defaults.invitation.heading,
        description: defaults.invitation.description,
        buttonLabel: defaults.invitation.buttonLabel,
        ...(isVideo
          ? { secondaryButtonLabel: defaults.invitation.secondaryButtonLabel }
          : {}),
      },
    },
    fields: [
      defineField({
        name: "hero",
        title: isVideo
          ? "Hero — introduction, video and poster"
          : "Hero — introduction and photo",
        type: "object",
        validation: (rule) => rule.required(),
        fields: [
          text("label", "Small programme label"),
          lines("headingLines", "Heading — opening lines", 2),
          lines("highlightLines", "Heading — blue highlighted lines", 2),
          text("description", "Programme introduction", true),
          text("donateButtonLabel", "Donation button text"),
          text("galleryLinkLabel", "Link to gallery — text"),
          text("captionTitle", "Media caption — heading"),
          text("captionDescription", "Media caption — description"),
          defineField({
            name: "image",
            title: isVideo ? "Video poster image" : "Hero photo",
            type: "image",
            options: { hotspot: true },
            validation: (rule) => rule.required().assetRequired(),
            fields: [text("alt", "Image description for screen readers")],
          }),
          ...(isVideo
            ? [
                text("videoLabel", "Small label above the video"),
                text(
                  "videoDescription",
                  "Video description for screen readers",
                ),
                defineField({
                  name: "video",
                  title: "Christmas celebration video",
                  description:
                    "Upload the MP4 video. The website keeps playback controls and does not autoplay.",
                  type: "file",
                  options: { accept: "video/mp4" },
                  validation: (rule) => rule.required().assetRequired(),
                }),
              ]
            : []),
        ],
      }),
      ...(defaults.schedule
        ? [
            defineField({
              name: "schedule",
              title:
                key === "orphanage"
                  ? "Monthly visit schedule"
                  : "Seasonal gathering notice",
              type: "object",
              validation: (rule) => rule.required(),
              fields: [
                text("heading", "Schedule or notice heading"),
                text("description", "Short explanation", true),
              ],
            }),
          ]
        : []),
      defineField({
        name: "supportAreas",
        title: "Areas of support",
        description:
          "Edit the headings and descriptions. Icons and the existing layout are managed by the website.",
        type: "array",
        validation: (rule) =>
          rule.required().min(supportCount).max(supportCount),
        of: [
          {
            name: "programmeSupportArea",
            type: "object",
            fields: [
              text("title", "Support area heading"),
              text("description", "Short explanation", true),
            ],
            preview: { select: { title: "title", subtitle: "description" } },
          },
        ],
      }),
      defineField({
        name: "purpose",
        title: "Programme explanation",
        type: "object",
        validation: (rule) => rule.required(),
        fields: [
          text("label", "Small section label"),
          lines("headingLines", "Explanation heading"),
          text("quote", "Highlighted statement", true),
          defineField({
            name: "paragraphs",
            title: "Explanation paragraphs",
            description: "Add one paragraph per item. Drag to reorder.",
            type: "array",
            validation: (rule) => rule.required().min(1),
            of: [
              {
                name: "programmeParagraph",
                type: "object",
                fields: [text("text", "Paragraph text", true)],
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
          "Donation destinations stay fixed to the matching programme's cause.",
        type: "object",
        validation: (rule) => rule.required(),
        fields: [
          text("heading", "Callout heading"),
          text("description", "Callout description", true),
          text("buttonLabel", "Donation button text"),
        ],
      }),
      defineField({
        name: "gallery",
        title: "Gallery introduction",
        description:
          "Photos are managed under Gallery Albums. Choose the matching programme and activity year; this page uses its latest published year automatically.",
        type: "object",
        validation: (rule) => rule.required(),
        fields: [
          text("label", "Small gallery label — do not include the year"),
          lines("headingLines", "Gallery heading"),
          defineField({
            name: "description",
            title: "Gallery introduction",
            type: "text",
            rows: 3,
            description: isVideo
              ? "Optional. Leave empty to show the latest album's description."
              : "Introduction above the photo carousel.",
            validation: (rule) => (isVideo ? rule : rule.required()),
          }),
        ],
      }),
      defineField({
        name: "invitation",
        title: "Closing invitation",
        type: "object",
        validation: (rule) => rule.required(),
        fields: [
          text("heading", "Section heading"),
          text("description", "Invitation description", true),
          text(
            "buttonLabel",
            isVideo ? "Become a partner button text" : "Donation button text",
          ),
          ...(isVideo
            ? [text("secondaryButtonLabel", "Volunteer button text")]
            : []),
        ],
      }),
    ],
    preview: { prepare: () => ({ title, subtitle: "/programs/" + key }) },
  });
}

export const orphanagePageType = programmePage(
  "orphanage",
  "orphanagePage",
  "Orphanage Support",
  4,
);
export const widowPageType = programmePage(
  "widow",
  "widowPage",
  "Widow Empowerment",
  3,
);
export const partyPageType = programmePage(
  "party",
  "partyPage",
  "Christmas Party",
  4,
);
