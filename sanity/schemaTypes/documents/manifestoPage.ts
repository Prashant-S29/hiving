import { defineArrayMember, defineField, defineType } from "sanity";

export const manifestoPage = defineType({
  name: "manifestoPage",
  title: "Manifesto Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "name", title: "Name & Mandate" },
    { name: "why", title: "Why Hivig Exists" },
    { name: "principles", title: "Principles" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "hero", validation: (Rule) => Rule.required() }),
    defineField({ name: "heading", title: "Heading", type: "string", group: "hero", validation: (Rule) => Rule.required() }),
    defineField({ name: "headingEmphasis", title: "Italic emphasis", type: "string", group: "hero", validation: (Rule) => Rule.required() }),
    defineField({ name: "nameSectionTitle", title: "Section title", type: "string", group: "name", validation: (Rule) => Rule.required() }),
    defineField({
      name: "etymology",
      title: "Name definitions",
      type: "array",
      group: "name",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "term", title: "Term", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "definition", title: "Definition", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "term", subtitle: "definition" } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({ name: "equationWord", title: "Result word", type: "string", group: "name", validation: (Rule) => Rule.required() }),
    defineField({ name: "equationEmphasis", title: "Italic part of result word", type: "string", group: "name", description: "For the current design this is the opening ‘Hi’." }),
    defineField({ name: "equationCaption", title: "Result caption", type: "string", group: "name", validation: (Rule) => Rule.required() }),
    defineField({ name: "positionQuote", title: "Editorial position quote", type: "text", rows: 5, group: "name", validation: (Rule) => Rule.required() }),
    defineField({ name: "positionAttribution", title: "Quote attribution", type: "string", group: "name", validation: (Rule) => Rule.required() }),
    defineField({ name: "whySectionTitle", title: "Section title", type: "string", group: "why", validation: (Rule) => Rule.required() }),
    defineField({ name: "whyLead", title: "Lead statement", type: "text", rows: 5, group: "why", validation: (Rule) => Rule.required() }),
    defineField({
      name: "whyBody",
      title: "Supporting content",
      type: "array",
      group: "why",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Signal emphasis", value: "signal" },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "principles",
      title: "Principles",
      type: "array",
      group: "principles",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "number", title: "Number and category", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "body", title: "Description", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "title", subtitle: "number" } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),
    defineField({ name: "seo", title: "SEO and social sharing", type: "seo", group: "seo", validation: (Rule) => Rule.required() }),
  ],
  preview: { prepare: () => ({ title: "Manifesto", subtitle: "Company page" }) },
});
