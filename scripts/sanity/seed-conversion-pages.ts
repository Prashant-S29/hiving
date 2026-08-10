import fs from "node:fs";
import { createClient, type SanityDocumentStub } from "@sanity/client";
import { DEFAULT_CONSULTANCY_PAGE, DEFAULT_SUBSCRIBE_PAGE } from "@/lib/sanity/conversionPages";

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

const consultancy = {
  ...DEFAULT_CONSULTANCY_PAGE,
  ctaAction: {
    _type: "callToAction",
    label: DEFAULT_CONSULTANCY_PAGE.ctaAction.label,
    style: "primary",
    link: { _type: "link", linkType: "internal", internalPath: DEFAULT_CONSULTANCY_PAGE.ctaAction.href },
  },
  formCopy: { ...DEFAULT_CONSULTANCY_PAGE.formCopy },
  seo: { _type: "seo", ...DEFAULT_CONSULTANCY_PAGE.seo },
  enquirySeo: { _type: "seo", ...DEFAULT_CONSULTANCY_PAGE.enquirySeo },
};
const subscribe = {
  ...DEFAULT_SUBSCRIBE_PAGE,
  formCopy: { ...DEFAULT_SUBSCRIBE_PAGE.formCopy },
  seo: { _type: "seo", ...DEFAULT_SUBSCRIBE_PAGE.seo },
};

const documents: SanityDocumentStub[] = [
  { _id: "consultancyPage", _type: "consultancyPage", ...consultancy },
  { _id: "subscribePage", _type: "subscribePage", ...subscribe },
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
