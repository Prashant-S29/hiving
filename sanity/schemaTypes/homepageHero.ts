import { defineArrayMember, defineField, defineType } from "sanity";

// Fixed singleton document for every editable homepage content area. The
// interactive particle motion remains code-owned; its labels, destinations,
// media, surrounding copy, stats, ticker, and promotions are CMS-owned.
export const homepageHero = defineType({
  name: "homepageHero",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "main", title: "Main Hero", default: true },
    { name: "picker", title: "Interactive Picker" },
    { name: "sections", title: "Homepage Sections" },
  ],
  fields: [
    defineField({
      name: "statusBar",
      title: "Status bar",
      type: "object",
      group: "main",
      fields: [
        defineField({ name: "leftLabel", title: "Left label", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "liveLabel", title: "Live status", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "rightLabel", title: "Right label", type: "string", validation: (Rule) => Rule.required() }),
      ],
    }),
    defineField({
      name: "mainEyebrow",
      title: "Main hero eyebrow",
      type: "string",
      group: "main",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heading",
      title: "Main heading",
      type: "object",
      group: "main",
      description: "The fields map to the approved homepage headline treatment.",
      fields: [
        defineField({ name: "lead", title: "Lead text", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "emphasis", title: "Italic emphasis", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "middleLine", title: "Middle line", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "outlineLine", title: "Outline line", type: "string", validation: (Rule) => Rule.required() }),
      ],
    }),
    defineField({
      name: "introduction",
      title: "Hero introduction",
      type: "array",
      group: "main",
      of: [{ type: "block", styles: [{ title: "Normal", value: "normal" }], lists: [] }],
      validation: (Rule) => Rule.required().max(2),
    }),
    defineField({ name: "primaryAction", title: "Primary action", type: "callToAction", group: "main", validation: (Rule) => Rule.required() }),
    defineField({ name: "secondaryAction", title: "Secondary action", type: "callToAction", group: "main", validation: (Rule) => Rule.required() }),
    defineField({
      name: "eyebrow",
      title: "Picker eyebrow",
      type: "string",
      group: "picker",
      description: "Small label above the interactive choice picker.",
      initialValue: "Choose your path · Hi-Tech Vigilance",
    }),
    defineField({ name: "choiceEyebrowLabel", title: "Choice-card eyebrow", type: "string", group: "picker", initialValue: "Choose", validation: (Rule) => Rule.required() }),
    defineField({ name: "choiceActionLabel", title: "Choice-card action label", type: "string", group: "picker", initialValue: "Go →", validation: (Rule) => Rule.required() }),
    defineField({
      name: "mediaType",
      title: "Picker style",
      type: "string",
      group: "picker",
      options: {
        list: [
          { title: "Interactive animation (built-in)", value: "animation" },
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "animation",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Picker image",
      type: "image",
      group: "picker",
      options: { hotspot: true },
      hidden: ({ document }) => document?.mediaType !== "image",
    }),
    defineField({
      name: "heroVideo",
      title: "Picker video",
      type: "file",
      group: "picker",
      options: { accept: "video/*" },
      hidden: ({ document }) => document?.mediaType !== "video",
    }),
    defineField({
      name: "choices",
      title: "Choice cards",
      description: "The paths visitors can choose. The frontend controls their safe visual treatment.",
      type: "array",
      group: "picker",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required().max(40) }),
            defineField({ name: "description", title: "Description", type: "string", validation: (Rule) => Rule.required().max(120) }),
            defineField({ name: "href", title: "Link", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "accent",
              title: "Accent color",
              type: "string",
              options: { list: ["signal", "verify", "amber"], layout: "radio" },
              initialValue: "signal",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(4),
    }),
    defineField({
      name: "sectionLayout",
      title: "Section order and appearance",
      description: "Drag to reorder approved homepage sections. The main hero remains fixed for accessibility and SEO.",
      type: "array",
      group: "sections",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "sectionKey",
              title: "Section",
              type: "string",
              options: { list: [
                { title: "Platform ticker", value: "ticker" },
                { title: "Statistics", value: "stats" },
                { title: "Latest Intel", value: "latestIntel" },
                { title: "Manifesto promotion", value: "manifesto" },
                { title: "Subscribe promotion", value: "subscribe" },
              ] },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "enabled", title: "Show this section", type: "boolean", initialValue: true, validation: (Rule) => Rule.required() }),
            defineField({
              name: "spacing",
              title: "Vertical spacing",
              type: "string",
              options: { list: [
                { title: "Compact", value: "compact" },
                { title: "Normal", value: "normal" },
                { title: "Large", value: "large" },
              ], layout: "radio" },
              initialValue: "normal",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "variant",
              title: "Visual treatment",
              type: "string",
              options: { list: [
                { title: "Default", value: "default" },
                { title: "Alternate", value: "alternate" },
              ], layout: "radio" },
              initialValue: "default",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { sectionKey: "sectionKey", enabled: "enabled", spacing: "spacing", variant: "variant" },
            prepare: ({ sectionKey, enabled, spacing, variant }) => ({
              title: sectionKey || "Homepage section",
              subtitle: `${enabled === false ? "Hidden" : "Visible"} · ${spacing || "normal"} · ${variant || "default"}`,
            }),
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(5).custom((items) => {
        const keys = (items || []).map((item) => (item as { sectionKey?: string }).sectionKey).filter(Boolean);
        return new Set(keys).size === keys.length || "Each homepage section may appear only once.";
      }),
    }),
    defineField({
      name: "etymology",
      title: "Etymology bar",
      type: "array",
      group: "sections",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "word", title: "Word", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "definition", title: "Definition", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "italic", title: "Use italic signal treatment", type: "boolean", initialValue: false }),
          ],
          preview: { select: { title: "word", subtitle: "definition" } },
        }),
      ],
      validation: (Rule) => Rule.required().min(2).max(4),
    }),
    defineField({
      name: "tickerItems",
      title: "Platform ticker",
      type: "array",
      group: "sections",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "stats",
      title: "Statistics",
      type: "array",
      group: "sections",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "suffix", title: "Suffix", type: "string" }),
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "label", value: "value", suffix: "suffix" }, prepare: ({ title, value, suffix }) => ({ title, subtitle: `${value || ""}${suffix || ""}` }) },
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(4),
    }),
    defineField({
      name: "latestIntel",
      title: "Latest Intel section",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "emphasis", title: "Italic emphasis", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "archiveLabel", title: "Archive link label", type: "string", validation: (Rule) => Rule.required() }),
      ],
    }),
    defineField({
      name: "manifestoPromotion",
      title: "Manifesto promotion",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "heading", title: "Heading", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "emphasis", title: "Italic emphasis", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "action", title: "Action", type: "callToAction", validation: (Rule) => Rule.required() }),
      ],
    }),
    defineField({
      name: "subscribePromotion",
      title: "Subscribe promotion",
      type: "object",
      group: "sections",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "heading", title: "Heading", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "emphasis", title: "Italic emphasis", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "action", title: "Action", type: "callToAction", validation: (Rule) => Rule.required() }),
      ],
    }),
  ],
  preview: {
    select: { mediaType: "mediaType" },
    prepare: ({ mediaType }) => ({
      title: "Homepage",
      subtitle: mediaType ? `Picker style: ${mediaType}` : "Not configured",
    }),
  },
});
