import { defineField, defineType } from "sanity";

// Copy/labels singleton for /compare — mirrors raceSettings.ts's shape. The
// model data itself lives on aiModel (sanity/schemaTypes/documents/raceData.ts);
// this is UI text only, same split as raceSettings vs aiModel.

export const compareSettings = defineType({
  name: "compareSettings",
  title: "Compare",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "picker", title: "Picker" },
    { name: "results", title: "Results" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero eyebrow", type: "string", group: "hero" }),
    defineField({ name: "heroHeading", title: "Hero heading", type: "string", group: "hero" }),
    defineField({ name: "heroSubhead", title: "Hero subhead", type: "text", rows: 3, group: "hero" }),

    defineField({ name: "addModelLabel", title: "\"Add model\" affordance label", type: "string", group: "picker" }),
    defineField({ name: "providerLabel", title: "Provider dropdown label", type: "string", group: "picker" }),
    defineField({ name: "modelLabel", title: "Model dropdown label", type: "string", group: "picker" }),
    defineField({ name: "jobLabel", title: "\"What's the job?\" dropdown label", type: "string", group: "picker" }),
    defineField({
      name: "jobOptions",
      title: "Job options",
      type: "array",
      group: "picker",
      description: "value must match a jobFit key on aiModel (marketing/customerSupport/sales/accountingFinance/supplyChain/opsMonitoring/coding/legalCompliance/researchAnalysis), or \"general\" for the unweighted default.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
          ],
        },
      ],
    }),
    defineField({ name: "compareButtonLabel", title: "\"Compare Now\" button label", type: "string", group: "picker" }),
    defineField({ name: "emptyStateLabel", title: "Empty-slot label", type: "string", group: "picker" }),

    defineField({ name: "editSelectionLabel", title: "\"Edit selection\" back-link label", type: "string", group: "results" }),
    defineField({ name: "costGroupLabel", title: "Cost & Value group label", type: "string", group: "results" }),
    defineField({ name: "capabilityGroupLabel", title: "Capability & Quality group label", type: "string", group: "results" }),
    defineField({ name: "operationsGroupLabel", title: "Scaling & Operations group label", type: "string", group: "results" }),
    defineField({ name: "integrationGroupLabel", title: "Integration & Lock-in group label", type: "string", group: "results" }),
    defineField({ name: "governanceGroupLabel", title: "Governance & Compliance group label", type: "string", group: "results" }),
    defineField({ name: "emptyValueLabel", title: "Empty-field placeholder", type: "string", group: "results", description: "Shown for a row this model has no data for yet, e.g. \"—\"." }),
    defineField({ name: "disclaimerText", title: "Disclaimer text", type: "text", rows: 4, group: "results" }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Compare", subtitle: "Model comparison tool copy" }) },
});
