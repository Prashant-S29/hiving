import { cache as reactCache } from "react";
import type { AiModel, ModelType } from "@/lib/models-schema";
import { cmsFallbacksEnabled, fetchCms } from "@/lib/sanity/fetch";
import { raceModelsQuery, raceSettingsQuery } from "@/lib/sanity/queries";
import type { PageSeo } from "@/lib/sanity/companyPages";
import type { CmsLink } from "@/lib/sanity/siteSettings";

export interface RaceSettingsContent {
  eyebrow: string;
  heroEyebrow: string;
  heroHeadingLead: string;
  heroHeadingEmphasis: string;
  heroSubhead: string;
  heroTrackingWeekLabel: string;
  heroNextUpdateLabel: string;
  heroLeaderboardLabel: string;
  heroScoreUnitLabel: string;
  heroEmptyStateLabel: string;
  heroDisclaimerButtonLabel: string;
  heroDisclaimerTitle: string;
  heroDisclaimerBody: string;
  heroDisclaimerLinkLabel: string;
  headingPrefix: string;
  headingEmphasis: string;
  headingSuffix: string;
  definitionTemplate: string;
  lastUpdatedLabel: string;
  themeLabel: string;
  methodologyAction: CmsLink;
  dateLocale: string;
  leaderboardAriaLabel: string;
  tableCaption: string;
  rankColumnLabel: string;
  modelColumnLabel: string;
  organizationColumnLabel: string;
  countryColumnLabel: string;
  typeColumnLabel: string;
  releasedColumnLabel: string;
  benchmarkColumnLabel: string;
  newRankLabel: string;
  footballComingSoonTemplate: string;
  logoAltTemplate: string;
  modelNotFoundTitle: string;
  modelBackAction: CmsLink;
  modelIntroductionTemplate: string;
  dataStatusLabel: string;
  unverifiedStatusLabel: string;
  reviewStatusLabel: string;
  verifiedStatusLabel: string;
  organizationLabel: string;
  countryLabel: string;
  modelTypeLabel: string;
  releaseDateLabel: string;
  currentRankLabel: string;
  benchmarkScoreLabel: string;
  benchmarkUnsourcedLabel: string;
  marketStatusLabel: string;
  publicMarketTemplate: string;
  privateMarketFallback: string;
  sourcesHeading: string;
  sourceLinkLabel: string;
  modelMethodologyLinkLabel: string;
  modelSeoTitleTemplate: string;
  modelSeoDescriptionTemplate: string;
  methodologyBackAction: CmsLink;
  methodologyHeading: string;
  methodologyNotice: { label: string; body: string; tone: "warning" | "information" };
  methodologyNeedsHeading: string;
  methodologyNeeds: string[];
  methodologySourceNote: string;
  methodologySeo: PageSeo;
  itemListName: string;
  itemListDescription: string;
  highestModelQuestion: string;
  highestModelAnswerTemplate: string;
  refreshQuestion: string;
  refreshAnswer: string;
  applicationCategory: string;
  seo: PageSeo;
}

export interface RaceModel extends AiModel {
  summary?: string;
  reviewedAt?: string;
  verificationStatus: "unverified" | "review" | "verified";
  seo?: PageSeo;
  organization: {
    id: string;
    slug: string;
    name: string;
    countryCode: string;
    website?: string;
    logoAlt?: string;
    logoSourceUrl?: string;
    logoLicenseNotes?: string;
    verificationStatus: "unverified" | "review" | "verified";
    reviewedAt?: string;
  };
  sources: Array<{ name: string; url: string; publicationDate?: string; accessedDate?: string; summary?: string; verificationStatus: "unverified" | "review" | "verified" }>;
  benchmark?: {
    id: string;
    name: string;
    score: number | null;
    scoreDate: string | null;
    notes?: string;
    verificationStatus: "unverified" | "review" | "verified";
    source?: { name: string; url: string };
  };
}

export const DEFAULT_RACE_SETTINGS: RaceSettingsContent = {
  eyebrow: "Live · refreshed every 72h",
  heroEyebrow: "Hivig Velocity Index · Live",
  heroHeadingLead: "The global AI race,",
  heroHeadingEmphasis: "real time",
  heroSubhead: "One index across real token volume and open-weight adoption — recalculated every Sunday from two official public APIs.",
  heroTrackingWeekLabel: "Tracking Week",
  heroNextUpdateLabel: "Next update Sun 00:00 UTC",
  heroLeaderboardLabel: "Live Leaderboard",
  heroScoreUnitLabel: "Score / 100",
  heroEmptyStateLabel: "No ranked models yet — check back after the next weekly run.",
  heroDisclaimerButtonLabel: "Disclaimer — an independent index from public metadata.",
  heroDisclaimerTitle: "Disclaimer",
  heroDisclaimerBody:
    "The Hivig Velocity Index (HVI) is an independent tracking score, out of 100 — not a quality, safety, or capability rating. It's recalculated every Sunday from two real, official public APIs, weighted 70/30: token volume from OpenRouter and download counts from the Hugging Face Hub. No LMSYS/Arena data is included yet — no free public API exists for it. All product names, logos, and brands are the property of their respective owners.",
  heroDisclaimerLinkLabel: "Full methodology",
  headingPrefix: "The",
  headingEmphasis: "Race",
  headingSuffix: "— Live Global AI Model Rankings",
  definitionTemplate: "As of {date}, the top-ranked AI model on Hivig is {model} from {organization} ({country}). The current top 10 includes {usCount} {usWord} from US labs and {cnCount} from Chinese labs. Rankings use a placeholder methodology pending a documented formula — see the methodology page below.",
  lastUpdatedLabel: "Last updated",
  themeLabel: "Theme",
  methodologyAction: { label: "How rankings are computed", href: "/race/methodology" },
  dateLocale: "en-US",
  leaderboardAriaLabel: "Global AI model rankings, live",
  tableCaption: "Live AI model rankings — updated every 72 hours",
  rankColumnLabel: "Rank",
  modelColumnLabel: "Model",
  organizationColumnLabel: "Organization",
  countryColumnLabel: "Country",
  typeColumnLabel: "Type",
  releasedColumnLabel: "Released",
  benchmarkColumnLabel: "Benchmark score",
  newRankLabel: "new",
  footballComingSoonTemplate: "Football theme coming soon — {count} models tracked in the meantime.",
  logoAltTemplate: "{organization} logo",
  modelNotFoundTitle: "Model not found",
  modelBackAction: { label: "← Back to The Race", href: "/race" },
  modelIntroductionTemplate: "{model} is a {type} model from {organization} ({country}), released {releaseDate}. It is currently ranked #{rank} on Hivig’s tracker.",
  dataStatusLabel: "Data status",
  unverifiedStatusLabel: "Unverified / illustrative",
  reviewStatusLabel: "Under review",
  verifiedStatusLabel: "Verified",
  organizationLabel: "Organization",
  countryLabel: "Country of origin",
  modelTypeLabel: "Model type",
  releaseDateLabel: "Release date",
  currentRankLabel: "Current rank",
  benchmarkScoreLabel: "Benchmark score",
  benchmarkUnsourcedLabel: "Not yet sourced",
  marketStatusLabel: "Market status",
  publicMarketTemplate: "Public — {exchange}: {ticker}",
  privateMarketFallback: "Private — funding data not yet sourced",
  sourcesHeading: "Sources",
  sourceLinkLabel: "Source",
  modelMethodologyLinkLabel: "How this ranking is computed",
  modelSeoTitleTemplate: "{model} — Ranking, Benchmarks & Market Data",
  modelSeoDescriptionTemplate: "{model} from {organization} ({country}), released {releaseDate}. Live rank, benchmark sourcing, and market status on Hivig’s AI model race tracker.",
  methodologyBackAction: { label: "← Back to The Race", href: "/race" },
  methodologyHeading: "Ranking methodology",
  methodologyNotice: {
    label: "Current status: Hivig Velocity Index (partial rollout)",
    body: "Rankings are led by the Hivig Velocity Index — a 0–100 score weighted 70/30 between real OpenRouter token volume and Hugging Face downloads — for any model an editor has opted into automated scoring. Models without that opt-in fall back to sorting by release date (newest first) until they're added. No LMSYS/Arena data is included yet — no free public API exists for it.",
    tone: "information",
  },
  methodologyNeedsHeading: "What a fuller methodology still needs to define",
  methodologyNeeds: [
    "Whether/how to fold in a benchmark-based signal (e.g. LMSYS Chatbot Arena Elo, Artificial Analysis quality index) once a licensed or official data source exists.",
    "A documented process for editors to opt new models into automated scoring, so the release-date fallback ranking shrinks over time.",
    "What counts as the “same model” across dated snapshot releases, so a rank delta means something consistent as OpenRouter's own listings change.",
  ],
  methodologySourceNote: "Full detail lives in RANKING_METHODOLOGY.md in the project source.",
  methodologySeo: {
    metaTitle: "Ranking Methodology",
    metaDescription: "How Hivig computes AI model rankings for The Race — current status, and what a defensible formula still needs to define.",
  },
  itemListName: "Global AI Model Race — Live Rankings",
  itemListDescription: "Live-updated ranking of frontier AI models from the US, China, and India, refreshed every 72 hours.",
  highestModelQuestion: "Which AI model is currently ranked highest?",
  highestModelAnswerTemplate: "{model} from {organization} is currently ranked #1 on Hivig’s tracker.",
  refreshQuestion: "How often are these rankings updated?",
  refreshAnswer: "Every 72 hours. The page shows a visible last-updated timestamp, matched by the dateModified field in this page’s structured data.",
  applicationCategory: "AI Model",
  seo: {
    metaTitle: "The Race — Live Global AI Model Rankings",
    metaDescription: "Live-updated ranking of frontier AI models from the US, China, India, and beyond — with market/funding data and source-cited commentary, refreshed every 72 hours.",
  },
};

interface CmsRaceRecord {
  _id: string;
  _updatedAt: string;
  name?: string;
  slug?: string;
  releaseDate?: string;
  modelType?: ModelType;
  openrouterId?: string;
  raceScore?: number | null;
  previousRaceScore?: number | null;
  tokensProxy?: number | null;
  downloads?: number | null;
  scoreUpdatedAt?: string;
  summary?: string;
  reviewedAt?: string;
  verificationStatus?: RaceModel["verificationStatus"];
  seo?: PageSeo;
  organization?: {
    _id: string;
    _updatedAt?: string;
    name?: string;
    slug?: string;
    countryCode?: string;
    website?: string;
    logoUrl?: string;
    logoAlt?: string;
    logoSourceUrl?: string;
    logoLicenseNotes?: string;
    isPublic?: boolean;
    exchange?: string;
    ticker?: string;
    fundingSummary?: string;
    fundingSource?: { _updatedAt?: string; name?: string; url?: string };
    reviewedAt?: string;
    verificationStatus?: RaceModel["verificationStatus"];
  };
  sources?: Array<{ _updatedAt?: string; name?: string; url?: string; publicationDate?: string; accessedDate?: string; summary?: string; verificationStatus?: RaceModel["verificationStatus"] }>;
  benchmarkRecords?: Array<{
    _id: string;
    _updatedAt?: string;
    benchmarkName?: string;
    score?: number;
    scoreDate?: string;
    notes?: string;
    verificationStatus?: RaceModel["verificationStatus"];
    source?: { _updatedAt?: string; name?: string; url?: string };
  }>;
}

export function applyTemplate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (output, [key, value]) => output.split(`{${key}}`).join(String(value)),
    template
  );
}

function mapCmsModels(records: CmsRaceRecord[]): RaceModel[] {
  const valid = records.filter((record) => record.name && record.slug && record.releaseDate && record.modelType && record.organization?.name && record.organization.countryCode);
  const updateTimes = valid.flatMap((record) => [
    record._updatedAt,
    record.organization?._updatedAt,
    record.organization?.fundingSource?._updatedAt,
    ...(record.benchmarkRecords || []).flatMap((benchmark) => [benchmark._updatedAt, benchmark.source?._updatedAt]),
    ...(record.sources || []).map((source) => source._updatedAt),
  ]).filter((value): value is string => Boolean(value));
  const scoreUpdateTimes = valid.map((r) => r.scoreUpdatedAt).filter((v): v is string => Boolean(v));
  const latestUpdate = [...updateTimes, ...scoreUpdateTimes].sort().at(-1) || new Date().toISOString();

  // Primary rank is by Velocity Index score (desc) when a model has one —
  // real signal from openrouterId-matched automation (see
  // scripts/fetch-race-metrics.ts). Models with no score yet (no
  // openrouterId, or not yet picked up by a pipeline run) sort after every
  // scored model, tie-broken by release date so the field stays a
  // well-defined function of the data rather than arbitrary — see
  // RANKING_METHODOLOGY.md. Every model still gets a dense rank_current
  // (never a null/0 "unranked" state), matching how the rest of this codebase
  // (RaceTrack's CSS `order`) expects rank_current to behave.
  const byVelocityThenRelease = (a: CmsRaceRecord, b: CmsRaceRecord) => {
    const scoreA = typeof a.raceScore === "number" ? a.raceScore : -Infinity;
    const scoreB = typeof b.raceScore === "number" ? b.raceScore : -Infinity;
    if (scoreA !== scoreB) return scoreB - scoreA;
    return new Date(b.releaseDate!).getTime() - new Date(a.releaseDate!).getTime();
  };

  // Approximates each model's rank as of the prior automated run by
  // re-deriving it from previousRaceScore over the subset of models that
  // actually had one — not a stored snapshot, so a roster change (a model
  // added/removed from tracking) can shift these slightly, but it's
  // self-consistent and needs no extra CMS field. Models with no
  // previousRaceScore are deliberately left out of this map entirely, so
  // they fall through to rank_previous_period: null ("new") below, rather
  // than getting a fabricated previous rank from an -Infinity sort key.
  const previousRankBySlug = new Map(
    valid
      .filter((r): r is CmsRaceRecord & { previousRaceScore: number } => typeof r.previousRaceScore === "number")
      .sort((a, b) => {
        if (a.previousRaceScore !== b.previousRaceScore) return b.previousRaceScore - a.previousRaceScore;
        return new Date(b.releaseDate!).getTime() - new Date(a.releaseDate!).getTime();
      })
      .map((record, index) => [record.slug!, index + 1] as const)
  );

  return [...valid]
    .sort(byVelocityThenRelease)
    .map((record, index) => {
      const organization = record.organization!;
      const benchmark = record.benchmarkRecords?.[0];
      return {
        id: record._id,
        slug: record.slug!,
        model_name: record.name!,
        org_name: organization.name!,
        org_country: organization.countryCode!,
        org_logo_url: organization.logoUrl || "/logos/placeholder.svg",
        release_date: record.releaseDate!,
        model_type: record.modelType!,
        benchmark_scores: {
          source: benchmark?.source?.name || benchmark?.benchmarkName || "Source not yet verified",
          score: typeof benchmark?.score === "number" ? benchmark.score : null,
          score_date: benchmark?.scoreDate || null,
        },
        market_status: {
          is_public: Boolean(organization.isPublic),
          exchange: (organization.exchange || null) as AiModel["market_status"]["exchange"],
          ticker: organization.ticker || null,
          last_funding_round: organization.fundingSummary || null,
          funding_source_url: organization.fundingSource?.url || null,
        },
        race_score: typeof record.raceScore === "number" ? record.raceScore : null,
        rank_current: index + 1,
        rank_previous_period: previousRankBySlug.get(record.slug!) ?? null,
        last_updated: latestUpdate,
        summary: record.summary,
        reviewedAt: record.reviewedAt,
        verificationStatus: record.verificationStatus || "unverified",
        seo: record.seo,
        sources: (record.sources || []).filter((source) => source.name && source.url).map((source) => ({
          name: source.name!,
          url: source.url!,
          publicationDate: source.publicationDate,
          accessedDate: source.accessedDate,
          summary: source.summary,
          verificationStatus: source.verificationStatus || "unverified",
        })),
        organization: {
          id: organization._id,
          slug: organization.slug || "",
          name: organization.name!,
          countryCode: organization.countryCode!,
          website: organization.website,
          logoAlt: organization.logoAlt,
          logoSourceUrl: organization.logoSourceUrl,
          logoLicenseNotes: organization.logoLicenseNotes,
          verificationStatus: organization.verificationStatus || "unverified",
          reviewedAt: organization.reviewedAt,
        },
        benchmark: benchmark ? {
          id: benchmark._id,
          name: benchmark.benchmarkName || "Unspecified benchmark",
          score: typeof benchmark.score === "number" ? benchmark.score : null,
          scoreDate: benchmark.scoreDate || null,
          notes: benchmark.notes,
          verificationStatus: benchmark.verificationStatus || "unverified",
          source: benchmark.source?.name && benchmark.source.url ? { name: benchmark.source.name, url: benchmark.source.url } : undefined,
        } : undefined,
      };
    });
}

async function fallbackModels(): Promise<RaceModel[]> {
  const { SEED_MODELS } = await import("@/data/seed-models");
  return SEED_MODELS.map((model) => ({
    ...model,
    verificationStatus: "unverified",
    sources: [],
    organization: {
      id: `organization-${model.org_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      slug: model.org_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name: model.org_name,
      countryCode: model.org_country,
      verificationStatus: "unverified",
    },
    benchmark: {
      id: `benchmark-${model.slug}`,
      name: model.benchmark_scores.source.replace(/^TODO\s*—\s*/i, ""),
      score: model.benchmark_scores.score,
      scoreDate: model.benchmark_scores.score_date,
      verificationStatus: "unverified",
    },
  }));
}

type PartialSettings = Partial<Omit<RaceSettingsContent, "methodologyNotice" | "methodologySeo" | "seo">> & {
  methodologyNotice?: Partial<RaceSettingsContent["methodologyNotice"]>;
  methodologySeo?: Partial<PageSeo>;
  seo?: Partial<PageSeo>;
};
const cachePage = typeof reactCache === "function" ? reactCache : <T>(loader: () => Promise<T>) => loader;

// GROQ returns an explicit `null` (not an absent key) for any projected field
// the document doesn't have set — e.g. every new hero* field before an editor
// fills them in. A plain `{...DEFAULT, ...value}` spread copies those `null`s
// over the defaults verbatim (spread only skips genuinely ABSENT keys, not
// null-valued ones), silently blanking out copy that was supposed to fall
// back gracefully. Stripping null/undefined values before merging is what
// makes "leave a field empty in Studio" actually mean "use the code default"
// instead of "render nothing".
function stripNullish<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null)) as Partial<T>;
}

export const getRaceSettings = cachePage(async (): Promise<RaceSettingsContent> => {
  const raw = await fetchCms<PartialSettings | null>({ query: raceSettingsQuery, fallback: null, label: "Race settings", tags: ["sanity:page:race"], required: true });
  if (!raw) return DEFAULT_RACE_SETTINGS;
  const value = stripNullish(raw);
  return {
    ...DEFAULT_RACE_SETTINGS,
    ...value,
    methodologyAction: { ...DEFAULT_RACE_SETTINGS.methodologyAction, ...stripNullish(value.methodologyAction ?? {}) },
    modelBackAction: { ...DEFAULT_RACE_SETTINGS.modelBackAction, ...stripNullish(value.modelBackAction ?? {}) },
    methodologyBackAction: { ...DEFAULT_RACE_SETTINGS.methodologyBackAction, ...stripNullish(value.methodologyBackAction ?? {}) },
    methodologyNotice: { ...DEFAULT_RACE_SETTINGS.methodologyNotice, ...stripNullish(value.methodologyNotice ?? {}) },
    methodologyNeeds: value.methodologyNeeds?.length ? value.methodologyNeeds : DEFAULT_RACE_SETTINGS.methodologyNeeds,
    methodologySeo: { ...DEFAULT_RACE_SETTINGS.methodologySeo, ...stripNullish(value.methodologySeo ?? {}) },
    seo: { ...DEFAULT_RACE_SETTINGS.seo, ...stripNullish(value.seo ?? {}) },
  };
});

export const getRaceModels = cachePage(async (): Promise<RaceModel[]> => {
  const records = await fetchCms<CmsRaceRecord[] | null>({ query: raceModelsQuery, fallback: null, label: "Race models", tags: ["sanity:race-models"], required: true });
  if (!records?.length) {
    if (!cmsFallbacksEnabled) throw new Error("[Sanity] Race models: required collection is empty");
    return fallbackModels();
  }
  const models = mapCmsModels(records);
  if (!models.length) {
    if (!cmsFallbacksEnabled) throw new Error("[Sanity] Race models: no valid model records were returned");
    return fallbackModels();
  }
  return models;
});

export async function getRaceModelBySlug(slug: string) {
  const models = await getRaceModels();
  return models.find((model) => model.slug === slug);
}
