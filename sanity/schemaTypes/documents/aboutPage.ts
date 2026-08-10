import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({ name: "heading", title: "Heading", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({ name: "headingEmphasis", title: "Italic emphasis", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({
      name: "body",
      title: "Page content",
      type: "array",
      group: "content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({ name: "href", title: "URL", type: "url", validation: (Rule) => Rule.required().uri({ scheme: ["http", "https", "mailto"] }) }),
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({ name: "seo", title: "SEO and social sharing", type: "seo", group: "seo", validation: (Rule) => Rule.required() }),
  ],
  preview: { prepare: () => ({ title: "About", subtitle: "Company page" }) },
});
