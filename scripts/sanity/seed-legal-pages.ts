import fs from "node:fs";
import { createClient, type SanityDocumentStub } from "@sanity/client";
import { DEFAULT_NOT_FOUND_PAGE, DEFAULT_PRIVACY_PAGE, DEFAULT_TERMS_PAGE } from "@/lib/sanity/legalPages";

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

const action = (label: string, path: string, style: "primary" | "secondary") => ({
  _type: "callToAction",
  label,
  style,
  link: { _type: "link", linkType: "internal", internalPath: path },
});

const documents: SanityDocumentStub[] = [
  {
    _id: "privacyPage",
    _type: "privacyPage",
    ...DEFAULT_PRIVACY_PAGE,
    seo: { _type: "seo", ...DEFAULT_PRIVACY_PAGE.seo },
  },
  {
    _id: "termsPage",
    _type: "termsPage",
    ...DEFAULT_TERMS_PAGE,
    seo: { _type: "seo", ...DEFAULT_TERMS_PAGE.seo },
  },
  {
    _id: "notFoundPage",
    _type: "notFoundPage",
    code: DEFAULT_NOT_FOUND_PAGE.code,
    heading: DEFAULT_NOT_FOUND_PAGE.heading,
    body: DEFAULT_NOT_FOUND_PAGE.body,
    primaryAction: action(DEFAULT_NOT_FOUND_PAGE.primaryAction.label, DEFAULT_NOT_FOUND_PAGE.primaryAction.href, "primary"),
    secondaryAction: action(DEFAULT_NOT_FOUND_PAGE.secondaryAction.label, DEFAULT_NOT_FOUND_PAGE.secondaryAction.href, "secondary"),
  },
];

async function main() {
  for (const document of documents) {
    const existing = await client.fetch<string | null>("*[_id == $id][0]._id", { id: document._id });
    if (existing) {
      const { _id, _type, ...fields } = document;
      await client.patch(document._id).setIfMissing(fields).commit();
      console.log(`Added missing fields to ${document._id} without overwriting editor content.`);
    } else {
      await client.create(document);
      console.log(`Created ${document._id}.`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
