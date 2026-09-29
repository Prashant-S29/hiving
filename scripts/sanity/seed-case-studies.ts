// scripts/sanity/seed-case-studies.ts
//
// Hand-researched, cited case study proving the Phase B pipeline end-to-end
// with real data — same idempotent createOrFill pattern as
// seed-compare-data.ts. Only one entry today: it's the one candidate found
// during research that names an exact, currently-tracked model version
// (Sonnet 5) rather than a generic "Claude"/"Sonnet" mention — this
// project's existing no-fuzzy-matching discipline (see
// scripts/fetch-race-metrics.ts) applies here too, so weaker matches were
// left out rather than forced. More case studies are meant to be added the
// same way going forward: research a real one, cite it, run this pattern
// again (or add directly in Sanity Studio).

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

loadLocalEnv();
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !dataset || !token) throw new Error("Sanity project, dataset, and Editor write token are required.");
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const ACCESSED_DATE = "2026-09-27";

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

interface CaseStudySpec {
  id: string;
  aiModelId: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  headline: string;
  builderName: string;
  description: string;
  category: string;
}

const caseStudies: CaseStudySpec[] = [
  {
    id: "case-study-rocket-money-sonnet-5",
    aiModelId: "ai-model-claude-sonnet-5",
    sourceId: "source-rocket-money-claude-case-study",
    sourceName: "How Rocket Money built its personal finance agent with Claude — Anthropic",
    sourceUrl: "https://claude.com/customers/rocket-money",
    headline: "Rocket Money built a personal finance agent on Claude Sonnet 5",
    builderName: "Rocket Money",
    description:
      "Rocket Money built Rowan, a text-message financial agent, on a classifier-and-subagent architecture: a Haiku 4.5 classifier routes each request to a single-responsibility subagent, with Sonnet 5 running most of them and Opus 5 reserved for financial tasks that need deeper reasoning. The system runs in production on Claude via Amazon Bedrock. Rocket Money's monthly code commits grew 11x (from 11 in December to 128 in July) as the team built the agent, with near-zero hallucinations across Rowan's beta.",
    category: "accountingFinance",
  },
];

async function main() {
  for (const cs of caseStudies) {
    const sourceDoc: SanityDocumentStub = {
      _id: cs.sourceId,
      _type: "sourceCitation",
      name: cs.sourceName,
      url: cs.sourceUrl,
      accessedDate: ACCESSED_DATE,
      sourceType: "primary",
      verificationStatus: "review",
    };
    console.log(`${await createOrFill(sourceDoc)} ${cs.sourceId}`);

    const caseStudyDoc: SanityDocumentStub = {
      _id: cs.id,
      _type: "caseStudy",
      headline: cs.headline,
      builderName: cs.builderName,
      description: cs.description,
      category: cs.category,
      model: { _type: "reference", _ref: cs.aiModelId },
      source: { _type: "reference", _ref: cs.sourceId },
      reviewedAt: ACCESSED_DATE,
      verificationStatus: "review",
      active: true,
    };
    console.log(`${await createOrFill(caseStudyDoc)} ${cs.id}`);

    await client
      .patch(cs.aiModelId)
      .setIfMissing({ caseStudies: [{ _type: "reference", _key: `case-study-${cs.id}`, _ref: cs.id }] })
      .commit();
  }

  console.log(`Case study seed complete: ${caseStudies.length} case stud${caseStudies.length === 1 ? "y" : "ies"}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
