import { defineArrayMember, defineField, defineType } from "sanity";

export const editorialSettings = defineType({
  name: "editorialSettings",
  title: "Editorial Settings",
  type: "document",
  groups: [
    { name: "archive", title: "Intel Archive", default: true },
    { name: "labels", title: "Shared Labels" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "eyebrow", title: "Archive eyebrow", type: "string", group: "archive", validation: (Rule) => Rule.required() }),
    defineField({ name: "heading", title: "Archive heading", type: "string", group: "archive", validation: (Rule) => Rule.required() }),
    defineField({ name: "headingEmphasis", title: "Heading italic emphasis", type: "string", group: "archive", validation: (Rule) => Rule.required() }),
    defineField({ name: "introduction", title: "Archive introduction", type: "text", rows: 4, group: "archive", validation: (Rule) => Rule.required() }),
    defineField({
      name: "categoryReferences",
      title: "Article type filters",
      type: "array",
      group: "archive",
      description: "Controls filter order. Public labels and stable URL values come from Article Type documents.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "articleType" }] })],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: "categories",
      title: "Article category labels",
      type: "array",
      group: "archive",
      description: "Legacy category labels retained during migration.",
      hidden: true,
      deprecated: { reason: "Filters now reference reusable Article Type documents." },
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "Stable category value",
              type: "string",
              options: {
                list: [
                  { title: "Deep Dive", value: "deep-dive" },
                  { title: "How-To", value: "how-to" },
                  { title: "Watchdog", value: "watchdog" },
                  { title: "Opinion", value: "opinion" },
                  { title: "Fact-Checked", value: "verify" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "label", title: "Public label", type: "string", validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
      validation: (Rule) =>
        Rule.required().min(1).custom((items) => {
          const values = (items || []).map((item) => (item as { value?: string }).value).filter(Boolean);
          return new Set(values).size === values.length || "Each category value may appear only once";
        }),
    }),
    defineField({ name: "allCategoriesLabel", title: "All categories label", type: "string", group: "labels", validation: (Rule) => Rule.required() }),
    defineField({ name: "allPlatformsLabel", title: "All platforms label", type: "string", group: "labels", validation: (Rule) => Rule.required() }),
    defineField({ name: "noArticlesMessage", title: "No published articles message", type: "string", group: "labels", validation: (Rule) => Rule.required() }),
    defineField({ name: "noMatchesMessage", title: "No filter matches message", type: "string", group: "labels", validation: (Rule) => Rule.required() }),
    defineField({ name: "paginationAriaLabel", title: "Pagination accessibility label", type: "string", group: "labels", validation: (Rule) => Rule.required() }),
    defineField({ name: "previousPageLabel", title: "Previous page label", type: "string", group: "labels", validation: (Rule) => Rule.required() }),
    defineField({ name: "nextPageLabel", title: "Next page label", type: "string", group: "labels", validation: (Rule) => Rule.required() }),
    defineField({ name: "backToArchiveLabel", title: "Back to archive label", type: "string", group: "labels", validation: (Rule) => Rule.required() }),
    defineField({ name: "minuteShortLabel", title: "Short reading-time label", type: "string", group: "labels", description: "Displayed as: 5 {label}", validation: (Rule) => Rule.required() }),
    defineField({ name: "minuteReadLabel", title: "Full reading-time label", type: "string", group: "labels", description: "Displayed as: 5 {label}", validation: (Rule) => Rule.required() }),
    defineField({ name: "missingBodyMessage", title: "Missing article body message", type: "string", group: "labels", validation: (Rule) => Rule.required() }),
    defineField({ name: "lastReviewedLabel", title: "Last reviewed label", type: "string", group: "labels", validation: (Rule) => Rule.required() }),
    defineField({ name: "sourcesHeading", title: "Article sources heading", type: "string", group: "labels", validation: (Rule) => Rule.required() }),
    defineField({ name: "relatedArticlesHeading", title: "Related articles heading", type: "string", group: "labels", validation: (Rule) => Rule.required() }),
    defineField({ name: "seo", title: "Intel archive SEO", type: "seo", group: "seo", validation: (Rule) => Rule.required() }),
  ],
  preview: {
    prepare: () => ({ title: "Editorial Settings", subtitle: "Intel archive, categories and shared article labels" }),
  },
});
