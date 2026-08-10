import { defineField, defineType } from "sanity";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "internalLabel", title: "Internal label", type: "string", initialValue: "Hero" }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({
      name: "body",
      title: "Introduction",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "actions",
      title: "Actions",
      type: "array",
      of: [{ type: "callToAction" }],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({ name: "media", title: "Media", type: "imageWithAlt" }),
    defineField({
      name: "alignment",
      title: "Alignment",
      type: "string",
      options: { list: ["left", "center"], layout: "radio" },
      initialValue: "left",
    }),
    defineField({ name: "settings", title: "Appearance", type: "sectionSettings" }),
  ],
  preview: {
    select: { title: "internalLabel", subtitle: "heading", media: "media.image" },
    prepare: ({ title, subtitle, media }) => ({ title: title || "Hero", subtitle, media }),
  },
});
