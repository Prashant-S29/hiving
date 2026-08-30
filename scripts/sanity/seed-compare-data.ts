// scripts/sanity/seed-compare-data.ts
//
// Hand-researched, cited /compare data for 4 current (Aug 2026) flagship
// models, patched onto existing aiModel documents where they already exist
// (gpt-4o, llama-3-1-405b) and created fresh where they don't yet
// (claude-sonnet-5, deepseek-v4-pro — the existing 18-model Race seed set
// predates this generation and several of its entries are now retired;
// see the /compare build's plan notes). Idempotent, same createOrFill
// pattern as migrate-race-data.ts — safe to re-run.
//
// Uncertain/unconfirmed fields are left unset rather than guessed, matching
// this repo's existing anti-fabrication discipline (see data/seed-models.ts).
// Every numeric claim below is cited via a sourceCitation document.

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

const ACCESSED_DATE = "2026-08-24";

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

interface SourceSpec {
  id: string;
  name: string;
  url: string;
}

const sources: SourceSpec[] = [
  { id: "source-gpt-4o-pricing-2026", name: "GPT-4o Pricing 2026 — pecollective", url: "https://pecollective.com/tools/gpt-4o-pricing/" },
  { id: "source-claude-sonnet-5-launch", name: "Introducing Claude Sonnet 5 — Anthropic", url: "https://www.anthropic.com/news/claude-sonnet-5" },
  { id: "source-deepseek-v4-pricing", name: "DeepSeek API Pricing — V4-Flash & V4-Pro", url: "https://deepseek.ai/pricing" },
  { id: "source-bedrock-pricing", name: "Amazon Bedrock Pricing — AWS", url: "https://aws.amazon.com/bedrock/pricing/" },
];

interface ModelSpec {
  aiModelId: string;
  isNew: boolean;
  name?: string; // required if isNew
  slug?: string; // required if isNew
  organizationId?: string; // required if isNew
  releaseDate?: string; // required if isNew
  modelType?: "frontier" | "open-weight" | "specialized" | "agentic-framework"; // required if isNew
  sourceId: string;
  fields: Record<string, unknown>;
}

const models: ModelSpec[] = [
  {
    aiModelId: "ai-model-gpt-4o",
    isNew: false,
    sourceId: "source-gpt-4o-pricing-2026",
    fields: {
      inputCostPer1M: 2.5,
      outputCostPer1M: 10,
      cachingSupported: true,
      cachingDiscountPct: 50,
      batchDiscountPct: 50,
      capabilityTier: "Strong",
      contextWindow: 128000,
      multimodal: ["text", "image"],
      agenticToolUseMaturity: "Strong",
      latencyProfile: "Real-time-friendly",
      provisionedCapacityAvailable: true,
      publishedSLA: true,
      mcpSupport: "Partial",
      requiresRouting: false,
      openAICompatible: true,
      availableVia: ["Direct API", "Azure"],
      openWeight: false,
      lockInRisk: "Medium",
      trainsOnDataByDefault: false,
      certifications: ["SOC2"],
      jobFit: { coding: "Strong", customerSupport: "Strong", marketing: "Strong" },
    },
  },
  {
    aiModelId: "ai-model-llama-3-1-405b",
    isNew: false,
    sourceId: "source-bedrock-pricing",
    fields: {
      inputCostPer1M: 2.4,
      outputCostPer1M: 2.4,
      capabilityTier: "Strong",
      contextWindow: 128000,
      multimodal: ["text"],
      agenticToolUseMaturity: "Moderate",
      latencyProfile: "Both",
      provisionedCapacityAvailable: true,
      publishedSLA: true,
      mcpSupport: "None",
      requiresRouting: true,
      requiresRoutingNotes: "Needs a hosting/inference layer (Bedrock, Together, self-hosted) — MCP support depends on that layer, not the model.",
      availableVia: ["Bedrock", "Self-hostable"],
      openWeight: true,
      lockInRisk: "Low",
      trainsOnDataByDefault: false,
      rateLimitNotes: "Cost above is AWS Bedrock's blended (input+output combined) standard-tier rate — self-hosting or other inference providers vary.",
      jobFit: { opsMonitoring: "Moderate", supplyChain: "Moderate" },
    },
  },
  {
    aiModelId: "ai-model-claude-sonnet-5",
    isNew: true,
    name: "Claude Sonnet 5",
    slug: "claude-sonnet-5",
    organizationId: "organization-anthropic",
    releaseDate: "2026-06-30",
    modelType: "frontier",
    sourceId: "source-claude-sonnet-5-launch",
    fields: {
      inputCostPer1M: 2,
      outputCostPer1M: 10,
      cachingSupported: true,
      cachingDiscountPct: 90,
      batchDiscountPct: 50,
      capabilityTier: "Frontier",
      contextWindow: 200000,
      multimodal: ["text", "image"],
      agenticToolUseMaturity: "Strong",
      latencyProfile: "Both",
      provisionedCapacityAvailable: true,
      publishedSLA: true,
      mcpSupport: "Native",
      requiresRouting: false,
      openAICompatible: false,
      availableVia: ["Direct API", "Bedrock", "Vertex AI"],
      openWeight: false,
      lockInRisk: "Low",
      trainsOnDataByDefault: false,
      certifications: ["SOC2", "HIPAA-eligible", "GDPR"],
      jobFit: { coding: "Strong", researchAnalysis: "Strong", legalCompliance: "Strong" },
    },
  },
  {
    aiModelId: "ai-model-deepseek-v4-pro",
    isNew: true,
    name: "DeepSeek-V4-Pro",
    slug: "deepseek-v4-pro",
    organizationId: "organization-deepseek",
    releaseDate: "2026-04-24",
    modelType: "open-weight",
    sourceId: "source-deepseek-v4-pricing",
    fields: {
      inputCostPer1M: 0.435,
      outputCostPer1M: 0.87,
      cachingSupported: true,
      capabilityTier: "Frontier",
      contextWindow: 1000000,
      multimodal: ["text"],
      agenticToolUseMaturity: "Moderate",
      mcpSupport: "None",
      requiresRouting: true,
      requiresRoutingNotes: "No documented native MCP integration as of this review — third-party bridges only.",
      openAICompatible: true,
      availableVia: ["Direct API", "Self-hostable"],
      openWeight: true,
      lockInRisk: "Low",
      rateLimitNotes: "List price is $1.74/$3.48 per 1M tokens; figures above reflect a standing promotional discount as of the access date below.",
      jobFit: { coding: "Strong", accountingFinance: "Moderate" },
    },
  },
];

async function main() {
  for (const s of sources) {
    const document: SanityDocumentStub = {
      _id: s.id,
      _type: "sourceCitation",
      name: s.name,
      url: s.url,
      accessedDate: ACCESSED_DATE,
      sourceType: "primary",
      verificationStatus: "review",
    };
    console.log(`${await createOrFill(document)} ${s.id}`);
  }

  for (const m of models) {
    if (m.isNew) {
      const document: SanityDocumentStub = {
        _id: m.aiModelId,
        _type: "aiModel",
        name: m.name,
        slug: { _type: "slug", current: m.slug },
        organization: { _type: "reference", _ref: m.organizationId },
        releaseDate: m.releaseDate,
        modelType: m.modelType,
        verificationStatus: "review",
        active: true,
        reviewedAt: ACCESSED_DATE,
        ...m.fields,
      };
      console.log(`${await createOrFill(document)} ${m.aiModelId}`);
    } else {
      await client.patch(m.aiModelId).setIfMissing(m.fields).commit();
      await client.patch(m.aiModelId).set({ reviewedAt: ACCESSED_DATE }).commit();
      console.log(`updated ${m.aiModelId}`);
    }
    await client.patch(m.aiModelId).setIfMissing({ sources: [{ _type: "reference", _key: `source-${m.aiModelId}`, _ref: m.sourceId }] }).commit();
  }

  console.log(`Compare data seed complete: ${sources.length} sources, ${models.length} models (${models.filter((m) => m.isNew).length} new).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
