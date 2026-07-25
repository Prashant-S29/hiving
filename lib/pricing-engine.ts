// lib/pricing-engine.ts
// Quotes an AI agent build based on estimated model credits + human oversight hours.

export type ExpertiseTier = "junior" | "mid" | "senior";

export interface AgentRequest {
  promptText: string;
  estimatedTokens: number; // from the classification pass
  estimatedHumanHours: number; // 10-180hr band, from classification pass
  expertiseTier: ExpertiseTier;
  modelUsed: string; // e.g. "claude-sonnet-5"
}

// Your actual loaded cost per hour by tier — set these to real numbers before launch.
const HOURLY_RATE_USD: Record<ExpertiseTier, number> = {
  junior: 8,
  mid: 20,
  senior: 45,
};

// Your actual per-1K-token cost for the model used — pull from your API billing, not
// list price, since volume pricing may differ.
const MODEL_COST_PER_1K_TOKENS_USD: Record<string, number> = {
  "claude-sonnet-5": 0.006,
  "claude-haiku-4-5": 0.0015,
  "claude-opus-5": 0.03,
  // add models as you support them
};

// Regional price multiplier — PPP-adjusted, like Netflix/Spotify regional pricing.
// Start narrow (a few regions), expand once you've validated demand.
export const GEO_MULTIPLIER: Record<string, number> = {
  US: 1.0,
  EU: 0.9,
  IN: 0.35,
  DEFAULT: 0.6,
};

// Resolved: the spec's "1/3 to 1/5 of actual cost" framing meant "cheaper than a
// traditional dev agency", not "below our own internal cost". quotedPriceUSD is a
// markup on internalCostUSD; the "cheaper than the alternative" figure is a
// marketing comparison claim, not the pricing formula itself.
const MARKUP_MULTIPLIER = 1.6; // your margin on internal cost
const QUOTE_FLOOR_USD = 10;

export interface QuoteBreakdown {
  modelCreditsCostUSD: number;
  humanHoursCostUSD: number;
  internalCostUSD: number; // what it actually costs you
  quotedPriceUSD: number; // what the customer sees, after markup + geo adjustment
  geoRegion: string;
  breakdown: {
    modelUsed: string;
    estimatedTokens: number;
    estimatedHumanHours: number;
    expertiseTier: ExpertiseTier;
  };
}

export function computeQuote(req: AgentRequest, geoRegion: string): QuoteBreakdown {
  const modelRate = MODEL_COST_PER_1K_TOKENS_USD[req.modelUsed] ?? 0.006;
  const modelCreditsCostUSD = (req.estimatedTokens / 1000) * modelRate;

  const hourlyRate = HOURLY_RATE_USD[req.expertiseTier];
  const humanHoursCostUSD = req.estimatedHumanHours * hourlyRate;

  const internalCostUSD = modelCreditsCostUSD + humanHoursCostUSD;

  const basePriceUSD = internalCostUSD * MARKUP_MULTIPLIER;

  const multiplier = GEO_MULTIPLIER[geoRegion] ?? GEO_MULTIPLIER.DEFAULT;
  const quotedPriceUSD = Math.max(QUOTE_FLOOR_USD, basePriceUSD * multiplier);

  return {
    modelCreditsCostUSD,
    humanHoursCostUSD,
    internalCostUSD,
    quotedPriceUSD: Math.round(quotedPriceUSD * 100) / 100,
    geoRegion,
    breakdown: {
      modelUsed: req.modelUsed,
      estimatedTokens: req.estimatedTokens,
      estimatedHumanHours: req.estimatedHumanHours,
      expertiseTier: req.expertiseTier,
    },
  };
}
