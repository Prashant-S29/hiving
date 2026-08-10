import { defineField, defineType } from "sanity";

export const ctaSection = defineType({
  name: "ctaSection",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({ name: "internalLabel", title: "Internal label", type: "string", initialValue: "Call to action" }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "body", title: "Body", type: "text", rows: 4 }),
    defineField({
      name: "actions",
      title: "Actions",
      type: "array",
      of: [{ type: "callToAction" }],
      validation: (Rule) => Rule.required().min(1).max(2),
    }),
    defineField({ name: "settings", title: "Appearance", type: "sectionSettings" }),
  ],
  preview: {
    select: { title: "internalLabel", subtitle: "heading" },
    prepare: ({ title, subtitle }) => ({ title: title || "Call to action", subtitle }),
  },
});
