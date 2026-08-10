import { defineField, defineType, type FieldDefinition } from "sanity";

function legalFields(): FieldDefinition[] {
  return [
    defineField({ name: "title", title: "Page title", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({ name: "lastUpdatedLabel", title: "Last-updated label", type: "string", group: "content", validation: (Rule) => Rule.required() }),
    defineField({ name: "lastUpdatedValue", title: "Last-updated value", type: "string", group: "content", description: "Use a reviewed publication date before launch.", validation: (Rule) => Rule.required() }),
    defineField({
      name: "notice",
      title: "Review notice",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "enabled", title: "Show notice", type: "boolean", initialValue: true }),
        defineField({ name: "label", title: "Notice label", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "body", title: "Notice body", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
        defineField({
          name: "tone",
          title: "Tone",
          type: "string",
          options: { list: ["warning", "information"], layout: "radio" },
          initialValue: "warning",
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Legal content",
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
        { type: "legalTable" },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({ name: "seo", title: "SEO and social sharing", type: "seo", group: "seo", validation: (Rule) => Rule.required() }),
  ];
}

const groups = [
  { name: "content", title: "Content", default: true },
  { name: "seo", title: "SEO" },
];

export const privacyPage = defineType({
  name: "privacyPage",
  title: "Privacy Policy",
  type: "document",
  groups,
  fields: legalFields(),
  preview: { prepare: () => ({ title: "Privacy Policy", subtitle: "Legal page" }) },
});

export const termsPage = defineType({
  name: "termsPage",
  title: "Terms of Use",
  type: "document",
  groups,
  fields: legalFields(),
  preview: { prepare: () => ({ title: "Terms of Use", subtitle: "Legal page" }) },
});
