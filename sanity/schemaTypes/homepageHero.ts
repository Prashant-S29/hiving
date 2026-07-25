import { defineField, defineType } from "sanity";

// Singleton document (see sanity.config.ts structure) — the homepage hero's
// media and choice cards, editable without touching code. mediaType picks
// which variant renders: an interactive animated picker (default, built into
// the site — its motion isn't editable here, but its labels/links/colors
// are), a static image, or a video.
export const homepageHero = defineType({
  name: "homepageHero",
  title: "Homepage Hero",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow label",
      type: "string",
      description: "Small label above the headline, e.g. 'Hi-Tech Vigilance · Est. 2025'.",
      initialValue: "Hi-Tech Vigilance · Est. 2025",
    }),
    defineField({
      name: "mediaType",
      title: "Hero style",
      type: "string",
      options: {
        list: [
          { title: "Interactive animation (built-in)", value: "animation" },
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "animation",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ document }) => document?.mediaType !== "image",
    }),
    defineField({
      name: "heroVideo",
      title: "Hero video",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ document }) => document?.mediaType !== "video",
    }),
    defineField({
      name: "choices",
      title: "Choice cards",
      description: "The paths visitors can pick — rendered as interactive cards over the animation, or as a row of links under an image/video hero.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required().max(40) }),
            defineField({ name: "description", title: "Description", type: "string", validation: (Rule) => Rule.required().max(120) }),
            defineField({ name: "href", title: "Link", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "accent",
              title: "Accent color",
              type: "string",
              options: { list: ["signal", "verify", "amber"], layout: "radio" },
              initialValue: "signal",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),
  ],
  preview: {
    select: { mediaType: "mediaType" },
    prepare: ({ mediaType }) => ({
      title: "Homepage Hero",
      subtitle: mediaType ? `Style: ${mediaType}` : "Not configured",
    }),
  },
});
