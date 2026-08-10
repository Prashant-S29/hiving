import fs from "node:fs";
import { createClient } from "@sanity/client";

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

loadLocalEnv();
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !dataset || !token) throw new Error("Sanity project, dataset, and Editor write token are required.");

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const fields = {
  eyebrow: "All Intel",
  heading: "Independent Agentic AI",
  headingEmphasis: "Analysis",
  introduction: "Deep dives, how-to guides, watchdog reports, and opinion — fact-checked, platform-agnostic, and free of vendor sponsorship.",
  categories: [
    { _key: "deep-dive", value: "deep-dive", label: "Deep Dive" },
    { _key: "how-to", value: "how-to", label: "How-To Guide" },
    { _key: "watchdog", value: "watchdog", label: "Watchdog Report" },
    { _key: "opinion", value: "opinion", label: "Opinion" },
    { _key: "verify", value: "verify", label: "Fact-Checked Analysis" },
  ],
  allCategoriesLabel: "All",
  allPlatformsLabel: "All Platforms",
  noArticlesMessage: "No articles published yet. Publish your first piece in Sanity Studio.",
  noMatchesMessage: "No articles match these filters.",
  paginationAriaLabel: "Pagination",
  previousPageLabel: "← Prev",
  nextPageLabel: "Next →",
  backToArchiveLabel: "← All Intel",
  minuteShortLabel: "min",
  minuteReadLabel: "min read",
  missingBodyMessage: "Full article content will appear here once it is published from Sanity Studio.",
  seo: {
    _type: "seo",
    metaTitle: "Intel — Independent Agentic AI Analysis",
    metaDescription: "Deep dives, how-to guides, watchdog reports, and opinion on agentic AI platforms — fact-checked, platform-agnostic, no vendor sponsorships.",
    noIndex: false,
  },
};

try {
  const existing = await client.fetch('*[_id == "editorialSettings"][0]._id');
  if (existing) {
    await client.patch("editorialSettings").setIfMissing(fields).commit();
    console.log("Added missing fields to Editorial Settings without overwriting editor content.");
  } else {
    await client.create({ _id: "editorialSettings", _type: "editorialSettings", ...fields });
    console.log("Created Editorial Settings with the current Intel content.");
  }
} catch (error) {
  if (error && typeof error === "object" && "statusCode" in error && error.statusCode === 403) {
    console.error("Editorial Settings could not be seeded: SANITY_API_WRITE_TOKEN must use the Editor role.");
    process.exitCode = 1;
  } else {
    throw error;
  }
}
