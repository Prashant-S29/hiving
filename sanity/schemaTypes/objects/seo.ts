import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO & social sharing",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      validation: (Rule) => Rule.max(70).warning("Search results may truncate titles longer than 70 characters."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(170).warning("Search results may truncate descriptions longer than 170 characters."),
    }),
    defineField({ name: "openGraphTitle", title: "Social title override", type: "string" }),
    defineField({ name: "openGraphDescription", title: "Social description override", type: "text", rows: 3 }),
    defineField({
      name: "openGraphImage",
      title: "Social sharing image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL override",
      type: "url",
      description: "Leave empty unless this page should point search engines to a different canonical URL.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
