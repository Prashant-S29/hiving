import { defineField, defineType } from "sanity";

export const richTextSection = defineType({
  name: "richTextSection",
  title: "Rich text",
  type: "object",
  fields: [
    defineField({ name: "internalLabel", title: "Internal label", type: "string", initialValue: "Rich text" }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
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
                name: "externalLink",
                title: "External link",
                type: "object",
                fields: [
                  defineField({ name: "href", title: "URL", type: "url", validation: (Rule) => Rule.required() }),
                  defineField({ name: "openInNewTab", title: "Open in new tab", type: "boolean", initialValue: true }),
                ],
              },
            ],
          },
        },
        { type: "imageWithAlt" },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "settings", title: "Appearance", type: "sectionSettings" }),
  ],
  preview: {
    select: { title: "internalLabel", subtitle: "heading" },
    prepare: ({ title, subtitle }) => ({ title: title || "Rich text", subtitle }),
  },
});
