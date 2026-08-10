import { defineField, defineType } from "sanity";

const quoteFormFields = [
  defineField({ name: "promptLabel", title: "Prompt label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "promptPlaceholder", title: "Prompt placeholder", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
  defineField({ name: "submitLabel", title: "Submit button", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "loadingLabel", title: "Loading button", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "fallbackError", title: "Fallback error", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "networkError", title: "Network error", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "regionLabel", title: "Region label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "modelLabel", title: "Model label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "tokensLabel", title: "Estimated tokens label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "hoursLabel", title: "Estimated human hours label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "tierLabel", title: "Expertise tier label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "modelCostLabel", title: "Model credits cost label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "humanCostLabel", title: "Human hours cost label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "quoteDisclaimer", title: "Quote disclaimer", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
];

export const agentStorePage = defineType({
  name: "agentStorePage",
  title: "Agent Store",
  type: "document",
  groups: [
    { name: "page", title: "Page", default: true },
    { name: "form", title: "Quote Form" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "page", validation: (Rule) => Rule.required() }),
    defineField({ name: "heading", title: "Heading", type: "string", group: "page", validation: (Rule) => Rule.required() }),
    defineField({ name: "introLead", title: "Introduction before pricing link", type: "text", rows: 4, group: "page", validation: (Rule) => Rule.required() }),
    defineField({ name: "pricingAction", title: "Pricing link", type: "callToAction", group: "page", validation: (Rule) => Rule.required() }),
    defineField({ name: "introMiddle", title: "Text between links", type: "string", group: "page", validation: (Rule) => Rule.required() }),
    defineField({ name: "discoverAction", title: "Discover link", type: "callToAction", group: "page", validation: (Rule) => Rule.required() }),
    defineField({ name: "introTail", title: "Text after Discover link", type: "string", group: "page", validation: (Rule) => Rule.required() }),
    defineField({ name: "formCopy", title: "Quote form copy", type: "object", group: "form", fields: quoteFormFields, validation: (Rule) => Rule.required() }),
    defineField({ name: "seo", title: "SEO and social sharing", type: "seo", group: "seo", validation: (Rule) => Rule.required() }),
  ],
  preview: { prepare: () => ({ title: "Agent Store", subtitle: "Landing page and quote form" }) },
});

export const agentPricingPage = defineType({
  name: "agentPricingPage",
  title: "Agent Pricing",
  type: "document",
  groups: [
    { name: "page", title: "Page", default: true },
    { name: "table", title: "Regional Table" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "backAction", title: "Back action", type: "callToAction", group: "page", validation: (Rule) => Rule.required() }),
    defineField({ name: "heading", title: "Heading", type: "string", group: "page", validation: (Rule) => Rule.required() }),
    defineField({ name: "introduction", title: "Pricing explanation", type: "text", rows: 7, group: "page", validation: (Rule) => Rule.required() }),
    defineField({ name: "regionalHeading", title: "Regional table heading", type: "string", group: "table", validation: (Rule) => Rule.required() }),
    defineField({ name: "regionColumnLabel", title: "Region column label", type: "string", group: "table", validation: (Rule) => Rule.required() }),
    defineField({ name: "multiplierColumnLabel", title: "Multiplier column label", type: "string", group: "table", validation: (Rule) => Rule.required() }),
    defineField({
      name: "regionLabels",
      title: "Region display labels",
      type: "object",
      group: "table",
      fields: [
        defineField({ name: "US", title: "United States code", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "EU", title: "European Union code", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "IN", title: "India code", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "DEFAULT", title: "Default/rest-of-world code", type: "string", validation: (Rule) => Rule.required() }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "multiplierSuffix", title: "Multiplier suffix", type: "string", group: "table", initialValue: "×", validation: (Rule) => Rule.required() }),
    defineField({ name: "disclaimer", title: "Pricing disclaimer", type: "text", rows: 6, group: "page", validation: (Rule) => Rule.required() }),
    defineField({ name: "seo", title: "SEO and social sharing", type: "seo", group: "seo", validation: (Rule) => Rule.required() }),
  ],
  preview: { prepare: () => ({ title: "Agent Pricing", subtitle: "Explanation and regional labels" }) },
});

const discoverCopyFields = [
  defineField({ name: "placeholder", title: "Search placeholder", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "submitLabel", title: "Search button", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "loadingLabel", title: "Loading button", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "loadingMessage", title: "Loading message", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "fallbackError", title: "Fallback error", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "networkError", title: "Network error", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "agentStoreLabel", title: "Agent Store breadcrumb", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "discoverLabel", title: "Discover breadcrumb", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "generatedForLabel", title: "Generated-for label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "conceptPreviewLabel", title: "Concept preview label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "feasibleLabel", title: "Feasible verdict", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "caveatsLabel", title: "Feasible-with-caveats verdict", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "notFeasibleLabel", title: "Not-feasible verdict", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "regionLabel", title: "Region label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "tierLabel", title: "Tier label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "oversightLabel", title: "Estimated oversight label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "estimateDisclaimer", title: "Estimate disclaimer", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
  defineField({ name: "pricingLinkLabel", title: "Pricing link label", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "capabilitiesHeading", title: "Capabilities heading", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "risksHeading", title: "Risks heading", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "assumptionsHeading", title: "Assumptions heading", type: "string", validation: (Rule) => Rule.required() }),
];

export const agentDiscoverPage = defineType({
  name: "agentDiscoverPage",
  title: "Agent Discover",
  type: "document",
  groups: [
    { name: "page", title: "Page", default: true },
    { name: "interface", title: "Discover Interface" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "page", validation: (Rule) => Rule.required() }),
    defineField({ name: "heading", title: "Heading", type: "string", group: "page", validation: (Rule) => Rule.required() }),
    defineField({ name: "introduction", title: "Introduction", type: "text", rows: 4, group: "page", validation: (Rule) => Rule.required() }),
    defineField({ name: "interfaceCopy", title: "Interface copy", type: "object", group: "interface", fields: discoverCopyFields, validation: (Rule) => Rule.required() }),
    defineField({ name: "seo", title: "SEO and social sharing", type: "seo", group: "seo", validation: (Rule) => Rule.required() }),
  ],
  preview: { prepare: () => ({ title: "Agent Discover", subtitle: "Feasibility page and result labels" }) },
});
