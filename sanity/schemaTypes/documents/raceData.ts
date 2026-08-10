import { defineArrayMember, defineField, defineType } from "sanity";

const verificationOptions = {
  list: [
    { title: "Unverified / illustrative", value: "unverified" },
    { title: "Under review", value: "review" },
    { title: "Verified", value: "verified" },
  ],
  layout: "radio" as const,
};

export const sourceCitation = defineType({
  name: "sourceCitation",
  title: "Source",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Source name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "url", title: "Source URL", type: "url", validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }) }),
    defineField({ name: "publicationDate", title: "Publication date", type: "date" }),
    defineField({ name: "accessedDate", title: "Date accessed", type: "date", validation: (Rule) => Rule.required() }),
    defineField({ name: "sourceType", title: "Source type", type: "string", options: { list: ["primary", "benchmark", "financial", "news", "other"] }, validation: (Rule) => Rule.required() }),
    defineField({ name: "summary", title: "Summary / notes", type: "text", rows: 4 }),
    defineField({ name: "verificationStatus", title: "Verification status", type: "string", options: verificationOptions, initialValue: "unverified", validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: "name", subtitle: "url" } },
});

export const organization = defineType({
  name: "organization",
  title: "Organization",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: "countryCode", title: "Country code", type: "string", description: "ISO 3166 alpha-2 code, for example US or IN.", validation: (Rule) => Rule.required().uppercase().length(2) }),
    defineField({ name: "website", title: "Website", type: "url" }),
    defineField({ name: "logo", title: "Logo", type: "imageWithAlt", description: "Use an officially licensed logo and record its source below." }),
    defineField({ name: "logoSourceUrl", title: "Logo source URL", type: "url" }),
    defineField({ name: "logoLicenseNotes", title: "Logo license notes", type: "text", rows: 3 }),
    defineField({ name: "isPublic", title: "Publicly traded", type: "boolean", initialValue: false, validation: (Rule) => Rule.required() }),
    defineField({ name: "exchange", title: "Exchange", type: "string", options: { list: ["NASDAQ", "NYSE", "BSE", "NSE", "SSE", "SZSE", "TSE"] }, hidden: ({ parent }) => !parent?.isPublic }),
    defineField({ name: "ticker", title: "Ticker", type: "string", hidden: ({ parent }) => !parent?.isPublic }),
    defineField({ name: "fundingSummary", title: "Latest funding summary", type: "string", hidden: ({ parent }) => Boolean(parent?.isPublic) }),
    defineField({ name: "fundingSource", title: "Funding source", type: "reference", to: [{ type: "sourceCitation" }], hidden: ({ parent }) => Boolean(parent?.isPublic) }),
    defineField({ name: "reviewedAt", title: "Last reviewed", type: "date" }),
    defineField({ name: "verificationStatus", title: "Verification status", type: "string", options: verificationOptions, initialValue: "unverified", validation: (Rule) => Rule.required() }),
  ],
  validation: (Rule) => Rule.custom((value) => {
    if (value?.isPublic && (!value.exchange || !value.ticker)) return "Public organizations require an exchange and ticker.";
    if (value?.fundingSummary && !value.fundingSource) return "Funding claims require a source citation.";
    return true;
  }),
  preview: { select: { title: "name", country: "countryCode", status: "verificationStatus", media: "logo.image" }, prepare: ({ title, country, status, media }) => ({ title, subtitle: `${country || "??"} · ${status || "unverified"}`, media }) },
});

export const benchmarkRecord = defineType({
  name: "benchmarkRecord",
  title: "Benchmark Record",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Internal title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "model", title: "Model", type: "reference", to: [{ type: "aiModel" }], validation: (Rule) => Rule.required() }),
    defineField({ name: "benchmarkName", title: "Benchmark name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "score", title: "Score", type: "number" }),
    defineField({ name: "scoreDate", title: "Score date", type: "date" }),
    defineField({ name: "source", title: "Source citation", type: "reference", to: [{ type: "sourceCitation" }] }),
    defineField({ name: "notes", title: "Notes", type: "text", rows: 3 }),
    defineField({ name: "verificationStatus", title: "Verification status", type: "string", options: verificationOptions, initialValue: "unverified", validation: (Rule) => Rule.required() }),
  ],
  validation: (Rule) => Rule.custom((value) => {
    if (typeof value?.score === "number" && !value.source) return "A benchmark score cannot be published without a source citation.";
    if (typeof value?.score === "number" && !value.scoreDate) return "A benchmark score requires a score date.";
    return true;
  }),
  preview: { select: { title: "title", score: "score", status: "verificationStatus" }, prepare: ({ title, score, status }) => ({ title, subtitle: `${score ?? "No score"} · ${status || "unverified"}` }) },
});

export const aiModel = defineType({
  name: "aiModel",
  title: "AI Model",
  type: "document",
  groups: [
    { name: "facts", title: "Facts", default: true },
    { name: "editorial", title: "Editorial" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "name", title: "Model name", type: "string", group: "facts", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", group: "facts", options: { source: "name", maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: "organization", title: "Organization", type: "reference", group: "facts", to: [{ type: "organization" }], validation: (Rule) => Rule.required() }),
    defineField({ name: "releaseDate", title: "Release date", type: "date", group: "facts", validation: (Rule) => Rule.required() }),
    defineField({ name: "modelType", title: "Model type", type: "string", group: "facts", options: { list: ["frontier", "open-weight", "specialized", "agentic-framework"] }, validation: (Rule) => Rule.required() }),
    defineField({ name: "benchmarkRecords", title: "Benchmark records", type: "array", group: "facts", of: [defineArrayMember({ type: "reference", to: [{ type: "benchmarkRecord" }] })] }),
    defineField({ name: "summary", title: "Editorial summary", type: "text", rows: 5, group: "editorial" }),
    defineField({ name: "sources", title: "General sources", type: "array", group: "editorial", of: [defineArrayMember({ type: "reference", to: [{ type: "sourceCitation" }] })] }),
    defineField({ name: "reviewedAt", title: "Last reviewed", type: "date", group: "editorial" }),
    defineField({ name: "verificationStatus", title: "Verification status", type: "string", group: "editorial", options: verificationOptions, initialValue: "unverified", validation: (Rule) => Rule.required() }),
    defineField({ name: "active", title: "Show in The Race", type: "boolean", group: "editorial", initialValue: true, validation: (Rule) => Rule.required() }),
    defineField({ name: "seo", title: "SEO override", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "name", organization: "organization.name", releaseDate: "releaseDate", status: "verificationStatus" }, prepare: ({ title, organization, releaseDate, status }) => ({ title, subtitle: `${organization || "No organization"} · ${releaseDate || "No date"} · ${status || "unverified"}` }) },
});
