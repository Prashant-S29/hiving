import fs from "node:fs";
import { createClient, type SanityDocumentStub } from "@sanity/client";

function loadLocalEnv() {
  if (!fs.existsSync(".env.local")) return;
  for (const rawLine of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

loadLocalEnv();
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !dataset || !token) throw new Error("Sanity project, dataset, and Editor write token are required.");
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const articleTypes = [
  { value: "deep-dive", name: "Deep Dive", accent: "signal", sortOrder: 10 },
  { value: "how-to", name: "How-To Guide", accent: "amber", sortOrder: 20 },
  { value: "watchdog", name: "Watchdog Report", accent: "amber", sortOrder: 30 },
  { value: "opinion", name: "Opinion", accent: "signal", sortOrder: 40 },
  { value: "verify", name: "Fact-Checked Analysis", accent: "verify", sortOrder: 50 },
];
const industries = [
  { value: "tech-saas", name: "Technology & SaaS", sortOrder: 10 },
  { value: "financial-services", name: "Financial Services", sortOrder: 20 },
  { value: "cross-industry", name: "Cross-Industry", sortOrder: 30 },
];
const platforms = [
  "AWS Bedrock",
  "Salesforce Agentforce",
  "Microsoft Copilot Studio",
  "Google Gemini",
  "Azure AI Foundry",
  "LangGraph",
  "CrewAI",
  "AutoGen",
  "Anthropic Claude",
  "Open Source",
];

async function createOrFill(document: SanityDocumentStub) {
  const existing = await client.fetch<string | null>("*[_id == $id][0]._id", { id: document._id });
  if (!existing) {
    await client.create(document);
    return "created";
  }
  const { _id, _type, ...fields } = document;
  await client.patch(document._id).setIfMissing(fields).commit();
  return "updated";
}

async function main() {
  const authorId = "author-hivig-editorial-team";
  console.log(`${await createOrFill({
    _id: authorId,
    _type: "author",
    name: "The Hivig Editorial Team",
    slug: { _type: "slug", current: "hivig-editorial-team" },
    role: "Editorial Team",
    active: true,
  })} ${authorId}`);

  for (const item of articleTypes) {
    const id = `article-type-${item.value}`;
    console.log(`${await createOrFill({ _id: id, _type: "articleType", ...item, active: true })} ${id}`);
  }
  for (const item of industries) {
    const id = `industry-${item.value}`;
    console.log(`${await createOrFill({ _id: id, _type: "industry", ...item, active: true })} ${id}`);
  }
  for (const [index, name] of platforms.entries()) {
    const slug = slugify(name);
    const id = `platform-${slug}`;
    console.log(`${await createOrFill({ _id: id, _type: "platform", name, slug: { _type: "slug", current: slug }, sortOrder: (index + 1) * 10, active: true })} ${id}`);
  }

  await client.patch("editorialSettings").setIfMissing({
    categoryReferences: articleTypes.map((item) => ({ _type: "reference", _key: item.value, _ref: `article-type-${item.value}` })),
    lastReviewedLabel: "Last reviewed",
    sourcesHeading: "Sources",
    relatedArticlesHeading: "Related Intel",
  }).commit();

  const articles = await client.fetch<Array<{
    _id: string;
    author?: string | { _type?: string; _ref?: string };
    tagType?: string | { _type?: string; _ref?: string };
    industryTag?: string | { _type?: string; _ref?: string };
    platformTags?: Array<string | { _type?: string; _ref?: string }>;
    metaTitle?: string;
    metaDescription?: string;
    seo?: object;
  }>>("*[_type == 'article']{_id, author, tagType, industryTag, platformTags, metaTitle, metaDescription, seo}");

  for (const article of articles) {
    const fields: Record<string, unknown> = {};
    if (typeof article.author === "string") {
      const legacyAuthorId = `author-${slugify(article.author.replace(/^the\s+/i, ""))}`;
      await createOrFill({
        _id: legacyAuthorId,
        _type: "author",
        name: article.author,
        slug: { _type: "slug", current: slugify(article.author.replace(/^the\s+/i, "")) },
        active: true,
      });
      fields.author = { _type: "reference", _ref: legacyAuthorId };
    }
    if (typeof article.tagType === "string") fields.tagType = { _type: "reference", _ref: `article-type-${article.tagType}` };
    if (typeof article.industryTag === "string") fields.industryTag = { _type: "reference", _ref: `industry-${article.industryTag}` };
    if (article.platformTags?.some((item) => typeof item === "string")) {
      fields.platformTags = article.platformTags.filter((item): item is string => typeof item === "string").map((name) => ({
        _type: "reference",
        _key: slugify(name),
        _ref: `platform-${slugify(name)}`,
      }));
    }
    if (!article.seo && (article.metaTitle || article.metaDescription)) {
      fields.seo = { _type: "seo", ...(article.metaTitle ? { metaTitle: article.metaTitle } : {}), ...(article.metaDescription ? { metaDescription: article.metaDescription } : {}) };
    }
    if (Object.keys(fields).length) {
      await client.patch(article._id).set(fields).commit();
      console.log(`normalized ${article._id}`);
    } else {
      console.log(`skipped ${article._id}; already normalized`);
    }
  }

  console.log(`Editorial normalization complete: 1 author, ${articleTypes.length} article types, ${industries.length} industries, ${platforms.length} platforms, ${articles.length} articles checked.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
