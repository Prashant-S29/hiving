import { defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Metadata & SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagType",
      title: "Article Type",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Deep Dive", value: "deep-dive" },
          { title: "How-To Guide", value: "how-to" },
          { title: "Watchdog Report", value: "watchdog" },
          { title: "Opinion", value: "opinion" },
          { title: "Fact-Checked Analysis", value: "verify" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "industryTag",
      title: "Industry",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Technology & SaaS", value: "tech-saas" },
          { title: "Financial Services", value: "financial-services" },
          { title: "Cross-Industry", value: "cross-industry" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "deck",
      title: "Deck (1-2 sentence summary)",
      type: "text",
      group: "content",
      rows: 3,
      validation: (Rule) => Rule.required().max(280),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
        },
        {
          type: "image",
          options: { hotspot: true },
        },
        {
          type: "code",
          title: "Code Block",
        },
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      group: "content",
      initialValue: "The Hivig Editorial Team",
    }),
    defineField({
      name: "readTimeMinutes",
      title: "Estimated Read Time (minutes)",
      type: "number",
      group: "content",
      validation: (Rule) => Rule.required().min(1).max(60),
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "platformTags",
      title: "Related Platforms",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      options: {
        list: [
          "AWS Bedrock", "Salesforce Agentforce", "Microsoft Copilot Studio",
          "Google Gemini", "Azure AI Foundry", "LangGraph", "CrewAI",
          "AutoGen", "Anthropic Claude", "Open Source",
        ],
      },
    }),
    defineField({
      name: "featured",
      title: "Feature on Homepage",
      type: "boolean",
      group: "content",
      initialValue: false,
    }),
    defineField({
      name: "metaTitle",
      title: "Meta Title (for search/AEO — overrides article title if set)",
      type: "string",
      group: "meta",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description (for search/AEO)",
      type: "text",
      group: "meta",
      rows: 2,
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "tagType", media: "heroImage" },
  },
});
