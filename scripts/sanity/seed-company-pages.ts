import fs from "node:fs";
import { createClient, type SanityDocumentStub } from "@sanity/client";
import { DEFAULT_ABOUT_PAGE, DEFAULT_MANIFESTO_PAGE } from "@/lib/sanity/companyPages";

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

const documents = [
  {
    _id: "aboutPage",
    _type: "aboutPage",
    ...DEFAULT_ABOUT_PAGE,
    seo: { _type: "seo", ...DEFAULT_ABOUT_PAGE.seo },
  },
  {
    _id: "manifestoPage",
    _type: "manifestoPage",
    ...DEFAULT_MANIFESTO_PAGE,
    seo: { _type: "seo", ...DEFAULT_MANIFESTO_PAGE.seo },
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
      await client.create(document as SanityDocumentStub);
      console.log(`Created ${document._id}.`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
