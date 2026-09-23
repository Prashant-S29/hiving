// lib/sanity/compare.ts
//
// Page-copy singleton for /compare (hero text, labels, job options, SEO) —
// mirrors raceSettings.ts's split between "labels singleton" and "model
// data." The model data itself (cost/capability/operations/integration/
// governance/jobFit) lives on RaceModel in lib/sanity/race.ts as of Phase 2
// of the Race ranking rebuild — Race, Compare, and the model pillar page all
// read that one type/query now, so this file only handles copy.

import { cache as reactCache } from "react";
import { fetchCms } from "@/lib/sanity/fetch";
import { compareSettingsQuery } from "@/lib/sanity/queries";
import type { PageSeo } from "@/lib/sanity/companyPages";

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
