import { defineArrayMember, defineField, defineType } from "sanity";

export const subscribePage = defineType({
  name: "subscribePage",
  title: "Subscribe Page",
  type: "document",
  groups: [
    { name: "content", title: "Page Content", default: true },
    { name: "form", title: "Form" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({ name: "headingLineOne", title: "Heading line one", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({ name: "headingLineTwo", title: "Heading line two", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({ name: "headingEmphasis", title: "Italic emphasis", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({ name: "introduction", title: "Introduction", type: "text", rows: 5, group: "content", validation: (Rule) => Rule.required() }),
    defineField({ name: "formCaption", title: "Form caption", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({
      name: "benefits",
      title: "Benefit statements",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1).max(4),
    }),
    defineField({
      name: "formCopy",
      title: "Form copy",
      type: "object",
      group: "form",
      fields: [
        defineField({ name: "namePlaceholder", title: "Name placeholder", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "emailPlaceholder", title: "Email placeholder", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "rolePlaceholder", title: "Role placeholder", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "submitLabel", title: "Submit button", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "submittingLabel", title: "Submitting label", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "successMessage", title: "Success message", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "errorMessage", title: "Error message", type: "string", validation: (Rule) => Rule.required() }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "seo", title: "SEO and social sharing", type: "seo", group: "seo", validation: (Rule) => Rule.required() }),
  ],
  preview: { prepare: () => ({ title: "Subscribe", subtitle: "Page and form copy" }) },
});
