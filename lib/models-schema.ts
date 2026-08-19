// lib/models-schema.ts
// Types for the ai_models / model_commentary tables described in
// files/models-schema.json. One row per AI model, not per company —
// powers /race and /race/models/[slug].

export type ModelType =
  | "frontier"
  | "open-weight"
  | "specialized"
  | "agentic-framework";

export type Exchange = "NASDAQ" | "NYSE" | "BSE" | "NSE" | "SSE" | "SZSE" | "TSE" | null;

export interface BenchmarkScore {
  source: string; // e.g. "LMSYS Chatbot Arena", "Artificial Analysis" — cited, not self-claimed
  score: number | null; // null until a real, sourced score is entered
  score_date: string | null; // ISO date
}

export interface MarketStatus {
  is_public: boolean;
  exchange: Exchange;
  ticker: string | null;
  last_funding_round: string | null; // e.g. "Series C, $2.1B, source: TechCrunch [date]"
  funding_source_url: string | null; // always cite, never fabricate a number
}

export interface AiModel {
  id: string;
  slug: string; // unique, used in canonical URL /race/models/[slug]
  model_name: string;
  org_name: string;
  org_country: string; // ISO 3166 alpha-2
  org_logo_url: string;
  release_date: string; // ISO date
  model_type: ModelType;
  benchmark_scores: BenchmarkScore;
  market_status: MarketStatus;
  race_score?: number | null; // Hivig Velocity Index, 0-100 — undefined/null if no
                               // scoring signal exists yet for this model. See
                               // RANKING_METHODOLOGY.md.
  rank_current: number; // computed — see RANKING_METHODOLOGY.md
  rank_previous_period: number | null;
  last_updated: string; // ISO timestamp — drives the 72h refresh badge
}

export interface ModelCommentary {
  id: string;
  model_id: string;
  summary_text: string; // AI-generated summary, never verbatim-copied source text
  source_name: string;
  source_url: string;
  published_at: string;
  ingested_at: string;
}
