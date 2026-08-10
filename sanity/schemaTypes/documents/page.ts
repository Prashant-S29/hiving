import { defineField, defineType } from "sanity";

const PAGE_KEYS = [
  ["Homepage", "home"],
  ["Intel", "intel"],
  ["About", "about"],
  ["Manifesto", "manifesto"],
  ["Consultancy", "consultancy"],
  ["Consultancy Enquiry", "consultancy-enquire"],
  ["Subscribe", "subscribe"],
  ["Privacy Policy", "privacy"],
  ["Terms of Use", "terms"],
  ["The Race", "race"],
  ["Ranking Methodology", "race-methodology"],
  ["Agent Store", "agents"],
  ["Agent Pricing", "agents-pricing"],
  ["Discover", "agents-discover"],
  ["Not Found", "not-found"],
].map(([title, value]) => ({ title, value }));

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Internal page title",
      type: "string",
      description: "Used in Studio. It is not automatically shown on the website.",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pageKey",
      title: "Website page",
      type: "string",
      options: { list: PAGE_KEYS },
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Page sections",
      type: "array",
      group: "content",
      of: [{ type: "heroSection" }, { type: "richTextSection" }, { type: "ctaSection" }],
    }),
    defineField({
      name: "seo",
      title: "SEO and social sharing",
      type: "seo",
      group: "seo",
    }),
    defineField({
      name: "lastReviewedAt",
      title: "Last reviewed",
      type: "datetime",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "pageKey" },
  },
});
