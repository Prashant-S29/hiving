// data/seed-models.ts
//
// SEED DATA — ILLUSTRATIVE ONLY, NOT LAUNCH-READY.
//
// BUILD_BRIEF.md and models-schema.json are explicit: don't seed fabricated
// benchmark/funding numbers, because AEO crawlers and users both penalize that fast.
// So this file only fills in what's reasonably well-established public knowledge
// (model name, org, country of origin, approximate release date, model type) and
// deliberately leaves `benchmark_scores.score` and `market_status` funding fields
// null/unsourced. Before launch:
//   1. Verify every name/org/country/date below against a primary source.
//   2. Pull real benchmark scores from LMSYS/Artificial Analysis/HELM and cite them.
//   3. Fill in real market_status data (ticker or last funding round + source URL).
//   4. Replace org_logo_url with actual licensed logos (see public/logos/README.md).
//   5. Compute rank_current from a real, documented methodology — see
//      RANKING_METHODOLOGY.md. The placeholder below just sorts by release date.
//
// This is here so the UI, routing, and schema markup have real-shaped data to
// render against — not a claim that these are the current top models.

import type { AiModel } from "@/lib/models-schema";

const PLACEHOLDER_LOGO = "/logos/placeholder.svg";

type SeedModel = Omit<AiModel, "rank_current" | "rank_previous_period" | "last_updated">;

const RAW_MODELS: SeedModel[] = [
  { id: "1", slug: "gpt-4o", model_name: "GPT-4o", org_name: "OpenAI", org_country: "US", org_logo_url: PLACEHOLDER_LOGO, release_date: "2024-05-13", model_type: "frontier", benchmark_scores: { source: "TODO — LMSYS Chatbot Arena", score: null, score_date: null }, market_status: { is_public: false, exchange: null, ticker: null, last_funding_round: null, funding_source_url: null } },
  { id: "2", slug: "claude-3-5-sonnet", model_name: "Claude 3.5 Sonnet", org_name: "Anthropic", org_country: "US", org_logo_url: PLACEHOLDER_LOGO, release_date: "2024-06-20", model_type: "frontier", benchmark_scores: { source: "TODO — LMSYS Chatbot Arena", score: null, score_date: null }, market_status: { is_public: false, exchange: null, ticker: null, last_funding_round: null, funding_source_url: null } },
  { id: "3", slug: "gemini-1-5-pro", model_name: "Gemini 1.5 Pro", org_name: "Google DeepMind", org_country: "US", org_logo_url: PLACEHOLDER_LOGO, release_date: "2024-05-14", model_type: "frontier", benchmark_scores: { source: "TODO — LMSYS Chatbot Arena", score: null, score_date: null }, market_status: { is_public: true, exchange: "NASDAQ", ticker: "GOOGL", last_funding_round: null, funding_source_url: null } },
  { id: "4", slug: "gemini-2-0-flash", model_name: "Gemini 2.0 Flash", org_name: "Google DeepMind", org_country: "US", org_logo_url: PLACEHOLDER_LOGO, release_date: "2024-12-11", model_type: "frontier", benchmark_scores: { source: "TODO — Artificial Analysis", score: null, score_date: null }, market_status: { is_public: true, exchange: "NASDAQ", ticker: "GOOGL", last_funding_round: null, funding_source_url: null } },
  { id: "5", slug: "llama-3-1-405b", model_name: "Llama 3.1 405B", org_name: "Meta", org_country: "US", org_logo_url: PLACEHOLDER_LOGO, release_date: "2024-07-23", model_type: "open-weight", benchmark_scores: { source: "TODO — Artificial Analysis", score: null, score_date: null }, market_status: { is_public: true, exchange: "NASDAQ", ticker: "META", last_funding_round: null, funding_source_url: null } },
  { id: "6", slug: "mistral-large-2", model_name: "Mistral Large 2", org_name: "Mistral AI", org_country: "FR", org_logo_url: PLACEHOLDER_LOGO, release_date: "2024-07-24", model_type: "frontier", benchmark_scores: { source: "TODO — Artificial Analysis", score: null, score_date: null }, market_status: { is_public: false, exchange: null, ticker: null, last_funding_round: "TODO — cite source", funding_source_url: null } },
  { id: "7", slug: "deepseek-v3", model_name: "DeepSeek-V3", org_name: "DeepSeek", org_country: "CN", org_logo_url: PLACEHOLDER_LOGO, release_date: "2024-12-26", model_type: "open-weight", benchmark_scores: { source: "TODO — Artificial Analysis", score: null, score_date: null }, market_status: { is_public: false, exchange: null, ticker: null, last_funding_round: "TODO — cite source", funding_source_url: null } },
  { id: "8", slug: "deepseek-r1", model_name: "DeepSeek-R1", org_name: "DeepSeek", org_country: "CN", org_logo_url: PLACEHOLDER_LOGO, release_date: "2025-01-20", model_type: "open-weight", benchmark_scores: { source: "TODO — Artificial Analysis", score: null, score_date: null }, market_status: { is_public: false, exchange: null, ticker: null, last_funding_round: "TODO — cite source", funding_source_url: null } },
  { id: "9", slug: "qwen2-5-max", model_name: "Qwen2.5-Max", org_name: "Alibaba", org_country: "CN", org_logo_url: PLACEHOLDER_LOGO, release_date: "2025-01-28", model_type: "frontier", benchmark_scores: { source: "TODO — Artificial Analysis", score: null, score_date: null }, market_status: { is_public: true, exchange: "NYSE", ticker: "BABA", last_funding_round: null, funding_source_url: null } },
  { id: "10", slug: "glm-4", model_name: "GLM-4", org_name: "Zhipu AI", org_country: "CN", org_logo_url: PLACEHOLDER_LOGO, release_date: "2024-01-16", model_type: "frontier", benchmark_scores: { source: "TODO — Artificial Analysis", score: null, score_date: null }, market_status: { is_public: false, exchange: null, ticker: null, last_funding_round: "TODO — cite source", funding_source_url: null } },
  { id: "11", slug: "ernie-4-0", model_name: "ERNIE 4.0", org_name: "Baidu", org_country: "CN", org_logo_url: PLACEHOLDER_LOGO, release_date: "2023-10-17", model_type: "frontier", benchmark_scores: { source: "TODO — Artificial Analysis", score: null, score_date: null }, market_status: { is_public: true, exchange: "NASDAQ", ticker: "BIDU", last_funding_round: null, funding_source_url: null } },
  { id: "12", slug: "grok-2", model_name: "Grok-2", org_name: "xAI", org_country: "US", org_logo_url: PLACEHOLDER_LOGO, release_date: "2024-08-13", model_type: "frontier", benchmark_scores: { source: "TODO — LMSYS Chatbot Arena", score: null, score_date: null }, market_status: { is_public: false, exchange: null, ticker: null, last_funding_round: "TODO — cite source", funding_source_url: null } },
  { id: "13", slug: "command-r-plus", model_name: "Command R+", org_name: "Cohere", org_country: "CA", org_logo_url: PLACEHOLDER_LOGO, release_date: "2024-04-04", model_type: "frontier", benchmark_scores: { source: "TODO — Artificial Analysis", score: null, score_date: null }, market_status: { is_public: false, exchange: null, ticker: null, last_funding_round: "TODO — cite source", funding_source_url: null } },
  { id: "14", slug: "phi-3", model_name: "Phi-3", org_name: "Microsoft", org_country: "US", org_logo_url: PLACEHOLDER_LOGO, release_date: "2024-04-23", model_type: "specialized", benchmark_scores: { source: "TODO — HELM", score: null, score_date: null }, market_status: { is_public: true, exchange: "NASDAQ", ticker: "MSFT", last_funding_round: null, funding_source_url: null } },
  { id: "15", slug: "falcon-180b", model_name: "Falcon 180B", org_name: "Technology Innovation Institute", org_country: "AE", org_logo_url: PLACEHOLDER_LOGO, release_date: "2023-09-06", model_type: "open-weight", benchmark_scores: { source: "TODO — HELM", score: null, score_date: null }, market_status: { is_public: false, exchange: null, ticker: null, last_funding_round: null, funding_source_url: null } },
  { id: "16", slug: "krutrim-2", model_name: "Krutrim 2", org_name: "Ola Krutrim", org_country: "IN", org_logo_url: PLACEHOLDER_LOGO, release_date: "2024-12-05", model_type: "frontier", benchmark_scores: { source: "TODO — Artificial Analysis", score: null, score_date: null }, market_status: { is_public: false, exchange: null, ticker: null, last_funding_round: "TODO — cite source", funding_source_url: null } },
  { id: "17", slug: "sarvam-1", model_name: "Sarvam-1", org_name: "Sarvam AI", org_country: "IN", org_logo_url: PLACEHOLDER_LOGO, release_date: "2024-10-23", model_type: "open-weight", benchmark_scores: { source: "TODO — Artificial Analysis", score: null, score_date: null }, market_status: { is_public: false, exchange: null, ticker: null, last_funding_round: "TODO — cite source", funding_source_url: null } },
  { id: "18", slug: "yi-large", model_name: "Yi-Large", org_name: "01.AI", org_country: "CN", org_logo_url: PLACEHOLDER_LOGO, release_date: "2024-05-13", model_type: "frontier", benchmark_scores: { source: "TODO — Artificial Analysis", score: null, score_date: null }, market_status: { is_public: false, exchange: null, ticker: null, last_funding_round: "TODO — cite source", funding_source_url: null } },
];

// Placeholder ranking methodology (v1): newest release first. This is NOT the real
// ranking formula — see RANKING_METHODOLOGY.md. It exists purely so rank_current is
// a well-defined, non-arbitrary function of the data while the real formula is built.
function applyPlaceholderRanking(models: SeedModel[]): AiModel[] {
  const sorted = [...models].sort(
    (a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
  );
  const now = new Date().toISOString();
  return sorted.map((m, i) => ({
    ...m,
    rank_current: i + 1,
    rank_previous_period: null,
    last_updated: now,
  }));
}

export const SEED_MODELS: AiModel[] = applyPlaceholderRanking(RAW_MODELS);

export function getModelBySlug(slug: string): AiModel | undefined {
  return SEED_MODELS.find((m) => m.slug === slug);
}
