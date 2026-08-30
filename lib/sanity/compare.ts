// lib/sanity/compare.ts
//
// Data layer for /compare. Reuses the same aiModel documents as The Race
// (lib/sanity/race.ts) — the /compare-only fields (cost, capability,
// operations, integration, governance, jobFit) live on that same schema
// (sanity/schemaTypes/documents/raceData.ts), hand-curated on a
// monthly-or-model-release cadence, not fetched live from vendor APIs. See
// lib/compare-verdicts.ts for how these roll into the page's badges.

import { cache as reactCache } from "react";
import { cmsFallbacksEnabled, fetchCms } from "@/lib/sanity/fetch";
import { compareModelsQuery, compareSettingsQuery } from "@/lib/sanity/queries";
import type { PageSeo } from "@/lib/sanity/companyPages";

export type VerificationStatus = "unverified" | "review" | "verified";
export type CapabilityTier = "Frontier" | "Strong" | "Efficient";
export type Maturity = "Strong" | "Moderate" | "Limited";
export type LatencyProfile = "Real-time-friendly" | "Batch-friendly" | "Both";
export type McpSupport = "Native" | "Partial" | "None";
export type AvailableVia = "Bedrock" | "Vertex AI" | "Azure" | "Direct API" | "Self-hostable";
export type Certification = "SOC2" | "HIPAA-eligible" | "FedRAMP" | "GDPR" | "ISO27001";
export type LockInRisk = "Low" | "Medium" | "High";
export type Multimodal = "text" | "image" | "video" | "audio";
export type JobFitRating = "Strong" | "Moderate" | "Weak";

// Keys must match sanity/schemaTypes/documents/raceData.ts's jobFitCategories
// and be what compareSettings.jobOptions[].value values resolve to (plus the
// "general" unweighted default, which isn't a jobFit key).
export interface JobFit {
  marketing?: JobFitRating;
  customerSupport?: JobFitRating;
  sales?: JobFitRating;
  accountingFinance?: JobFitRating;
  supplyChain?: JobFitRating;
  opsMonitoring?: JobFitRating;
  coding?: JobFitRating;
  legalCompliance?: JobFitRating;
  researchAnalysis?: JobFitRating;
}

export interface CompareModel {
  id: string;
  slug: string;
  modelName: string;
  releaseDate: string;
  modelType: "frontier" | "open-weight" | "specialized" | "agentic-framework";
  raceScore: number | null;
  summary?: string;
  reviewedAt?: string;
  verificationStatus: VerificationStatus;
  organization: {
    id: string;
    slug: string;
    name: string;
    countryCode: string;
    logoUrl?: string;
    logoAlt?: string;
  };

  inputCostPer1M?: number;
  outputCostPer1M?: number;
  cachingSupported?: boolean;
  cachingDiscountPct?: number;
  batchDiscountPct?: number;

  capabilityTier?: CapabilityTier;
  contextWindow?: number;
  multimodal?: Multimodal[];
  agenticToolUseMaturity?: Maturity;

  latencyProfile?: LatencyProfile;
  rateLimitNotes?: string;
  provisionedCapacityAvailable?: boolean;
  publishedSLA?: boolean;

  mcpSupport?: McpSupport;
  requiresRouting?: boolean;
  requiresRoutingNotes?: string;
  openAICompatible?: boolean;
  availableVia?: AvailableVia[];
  openWeight?: boolean;
  lockInRisk?: LockInRisk;

  trainsOnDataByDefault?: boolean;
  certifications?: Certification[];
  guardrailsMaturity?: string;

  jobFit?: JobFit;
}

interface CmsCompareRecord extends Omit<CompareModel, "id" | "slug" | "modelName" | "organization"> {
  _id: string;
  name: string;
  slug: string;
  organization: {
    _id: string;
    name: string;
    slug: string;
    countryCode: string;
    logoUrl?: string;
    logoAlt?: string;
  } | null;
}

function mapCompareModels(records: CmsCompareRecord[]): CompareModel[] {
  return records
    .filter((r) => r.slug && r.name && r.organization)
    .map((r) => ({
      ...r,
      id: r._id,
      slug: r.slug,
      modelName: r.name,
      raceScore: typeof r.raceScore === "number" ? r.raceScore : null,
      verificationStatus: r.verificationStatus || "unverified",
      organization: {
        id: r.organization!._id,
        slug: r.organization!.slug || "",
        name: r.organization!.name,
        countryCode: r.organization!.countryCode,
        logoUrl: r.organization!.logoUrl,
        logoAlt: r.organization!.logoAlt,
      },
    }));
}

async function fallbackModels(): Promise<CompareModel[]> {
  // Dev-only convenience when Sanity isn't configured — no /compare-specific
  // fields exist in the static seed data, so every model renders with empty
  // comparison rows rather than fabricated numbers. Real content always comes
  // from Sanity; see lib/models-schema.ts / data/seed-models.ts for context.
  const { SEED_MODELS } = await import("@/data/seed-models");
  return SEED_MODELS.map((model) => ({
    id: model.id,
    slug: model.slug,
    modelName: model.model_name,
    releaseDate: model.release_date,
    modelType: model.model_type,
    raceScore: model.race_score ?? null,
    verificationStatus: "unverified" as const,
    organization: {
      id: `organization-${model.org_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      slug: model.org_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name: model.org_name,
      countryCode: model.org_country,
    },
  }));
}

export interface CompareJobOption {
  value: string;
  label: string;
}

export interface CompareSettingsContent {
  heroEyebrow: string;
  heroHeading: string;
  heroSubhead: string;
  addModelLabel: string;
  providerLabel: string;
  modelLabel: string;
  jobLabel: string;
  jobOptions: CompareJobOption[];
  compareButtonLabel: string;
  emptyStateLabel: string;
  editSelectionLabel: string;
  costGroupLabel: string;
  capabilityGroupLabel: string;
  operationsGroupLabel: string;
  integrationGroupLabel: string;
  governanceGroupLabel: string;
  emptyValueLabel: string;
  disclaimerText: string;
  seo: PageSeo;
}

export const DEFAULT_COMPARE_SETTINGS: CompareSettingsContent = {
  heroEyebrow: "Hivig Compare",
  heroHeading: "Pick the models. Pick the job. Get Hivig's call.",
  heroSubhead:
    "Not a raw spec dump — an editorial comparison. The same model can be the right pick for one job and the wrong one for another, so tell us what you're actually doing before we show you the verdict.",
  addModelLabel: "Add model",
  providerLabel: "Provider",
  modelLabel: "Model",
  jobLabel: "What's the job?",
  jobOptions: [
    { value: "marketing", label: "Marketing — Content, Social, Email" },
    { value: "customerSupport", label: "Customer Support" },
    { value: "sales", label: "Sales — outreach, call summarization, CRM" },
    { value: "accountingFinance", label: "Accounting & Finance" },
    { value: "supplyChain", label: "Supply Chain Monitoring" },
    { value: "opsMonitoring", label: "Operations Monitoring" },
    { value: "coding", label: "Coding & Engineering" },
    { value: "legalCompliance", label: "Legal & Compliance Analysis" },
    { value: "researchAnalysis", label: "Research & Data Analysis" },
    { value: "general", label: "General / Not sure yet" },
  ],
  compareButtonLabel: "Compare Now",
  emptyStateLabel: "Add a model",
  editSelectionLabel: "Edit selection",
  costGroupLabel: "Cost & Value",
  capabilityGroupLabel: "Capability & Quality",
  operationsGroupLabel: "Scaling & Operations",
  integrationGroupLabel: "Integration & Lock-in",
  governanceGroupLabel: "Governance & Compliance",
  emptyValueLabel: "—",
  disclaimerText:
    "Hivig Compare reflects hand-curated, dated research — not a live feed from vendor pricing pages. Always confirm current pricing and terms with the provider before making a purchasing decision.",
  seo: {
    metaTitle: "Compare AI Models",
    metaDescription: "Compare up to 4 AI models side by side, weighted by the job you're actually hiring one for — cost, capability, integration risk, and Hivig's editorial verdict.",
  },
};

function stripNullish<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null)) as Partial<T>;
}

const cachePage = typeof reactCache === "function" ? reactCache : <T>(loader: () => Promise<T>) => loader;

export const getCompareSettings = cachePage(async (): Promise<CompareSettingsContent> => {
  const raw = await fetchCms<Partial<CompareSettingsContent> | null>({
    query: compareSettingsQuery,
    fallback: null,
    label: "Compare settings",
    tags: ["sanity:page:compare"],
  });
  if (!raw) return DEFAULT_COMPARE_SETTINGS;
  const value = stripNullish(raw);
  return {
    ...DEFAULT_COMPARE_SETTINGS,
    ...value,
    jobOptions: value.jobOptions?.length ? value.jobOptions : DEFAULT_COMPARE_SETTINGS.jobOptions,
    seo: { ...DEFAULT_COMPARE_SETTINGS.seo, ...stripNullish(value.seo ?? {}) },
  };
});

export const getCompareModels = cachePage(async (): Promise<CompareModel[]> => {
  const records = await fetchCms<CmsCompareRecord[] | null>({
    query: compareModelsQuery,
    fallback: null,
    label: "Compare models",
    tags: ["sanity:race-models"],
    required: true,
  });
  if (!records?.length) {
    if (!cmsFallbacksEnabled) throw new Error("[Sanity] Compare models: required collection is empty");
    return fallbackModels();
  }
  const models = mapCompareModels(records);
  if (!models.length) {
    if (!cmsFallbacksEnabled) throw new Error("[Sanity] Compare models: no valid model records were returned");
    return fallbackModels();
  }
  return models;
});
