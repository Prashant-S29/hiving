import { defineField, defineType } from "sanity";

export const notFoundPage = defineType({
  name: "notFoundPage",
  title: "Not Found Page",
  type: "document",
  fields: [
    defineField({ name: "code", title: "Error code", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "heading", title: "Heading", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "body", title: "Description", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({ name: "primaryAction", title: "Primary action", type: "callToAction", validation: (Rule) => Rule.required() }),
    defineField({ name: "secondaryAction", title: "Secondary action", type: "callToAction", validation: (Rule) => Rule.required() }),
  ],
  preview: { prepare: () => ({ title: "404 — Not Found", subtitle: "System page" }) },
});
