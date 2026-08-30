// lib/compare-verdicts.ts
//
// Computes the "Hivig Verdict" badges shown on /compare. Deliberately NOT a
// hand-authored per-model field (see the plan flag in the /compare build:
// "Best for [job]" is relative to whichever 2-4 models are actually being
// compared, not a fixed fact about one model in isolation — the same model
// can win it in one comparison and lose it in another). The editorial
// ratings feeding this (jobFit, lockInRisk, mcpSupport, cost fields) are
// still 100% hand-curated on the aiModel document; only "who wins this
// specific comparison" is computed, the same way rank_current is computed
// from raceScore elsewhere in this codebase rather than hand-set.

import type { CompareModel, JobFit } from "@/lib/sanity/compare";

export interface VerdictTag {
  icon: string;
  label: string;
}

const JOB_FIT_RANK: Record<string, number> = { Strong: 2, Moderate: 1, Weak: 0 };
const LOCK_IN_RANK: Record<string, number> = { Low: 2, Medium: 1, High: 0 };

export function effectiveCost(model: CompareModel): number | null {
  if (typeof model.inputCostPer1M !== "number" || typeof model.outputCostPer1M !== "number") return null;
  // A simple, stated heuristic (70/30 input/output weighting) rather than a
  // real per-job token-mix estimate — good enough to rank models against each
  // other, not precise enough to display as a dollar figure. See the Cost
  // group's "Effective cost" row for the honest, unweighted input/output split.
  return model.inputCostPer1M * 0.7 + model.outputCostPer1M * 0.3;
}

export function computeVerdicts(models: CompareModel[], job: string): Map<string, VerdictTag[]> {
  const result = new Map<string, VerdictTag[]>();
  for (const m of models) result.set(m.id, []);
  if (models.length < 2) return result;

  function award(modelId: string, tag: VerdictTag) {
    result.get(modelId)?.push(tag);
  }

  // 🏆 Best for [job] — only meaningful with a real job selected, and only
  // when there's a single clear leader (no tie, no "everyone's unrated").
  if (job && job !== "general") {
    const jobKey = job as keyof JobFit;
    const rated = models
      .map((m) => ({ model: m, rank: JOB_FIT_RANK[m.jobFit?.[jobKey] || ""] }))
      .filter((r) => r.rank !== undefined);
    if (rated.length > 0) {
      const best = Math.max(...rated.map((r) => r.rank));
      const leaders = rated.filter((r) => r.rank === best);
      if (leaders.length === 1 && best > 0) {
        award(leaders[0].model.id, { icon: "🏆", label: "Best for this job" });
      }
    }
  }

  // 💰 Most Cost-Effective — lowest blended cost, only when at least 2 models
  // have cost data to actually compare.
  const costed = models.map((m) => ({ model: m, cost: effectiveCost(m) })).filter((c) => c.cost !== null) as { model: CompareModel; cost: number }[];
  if (costed.length >= 2) {
    const cheapest = costed.reduce((a, b) => (b.cost < a.cost ? b : a));
    const isUniqueMin = costed.every((c) => c.model.id === cheapest.model.id || c.cost > cheapest.cost);
    if (isUniqueMin) award(cheapest.model.id, { icon: "💰", label: "Most Cost-Effective" });
  }

  // 📈 Scales Best — provisioned capacity + a published SLA, real-time-ready.
  // Award only a single clear leader by that combined signal.
  const scaling = models.map((m) => ({
    model: m,
    score: (m.provisionedCapacityAvailable ? 1 : 0) + (m.publishedSLA ? 1 : 0) + (m.latencyProfile === "Real-time-friendly" || m.latencyProfile === "Both" ? 1 : 0),
  }));
  const bestScalingScore = Math.max(...scaling.map((s) => s.score));
  if (bestScalingScore >= 2) {
    const scalingLeaders = scaling.filter((s) => s.score === bestScalingScore);
    if (scalingLeaders.length === 1) award(scalingLeaders[0].model.id, { icon: "📈", label: "Scales Best" });
  }

  // 🔓 Lowest Lock-in Risk — only award when the selection actually
  // differentiates on this (skip if every model is tied, e.g. all "Low").
  const risked = models.map((m) => ({ model: m, rank: LOCK_IN_RANK[m.lockInRisk || ""] })).filter((r) => r.rank !== undefined);
  if (risked.length > 0) {
    const bestRisk = Math.max(...risked.map((r) => r.rank));
    const worstRisk = Math.min(...risked.map((r) => r.rank));
    if (bestRisk !== worstRisk) {
      for (const r of risked) if (r.rank === bestRisk) award(r.model.id, { icon: "🔓", label: "Lowest Lock-in Risk" });
    }
  }

  // 🔌 MCP-Native — absolute, not relative to the rest of the comparison.
  for (const m of models) if (m.mcpSupport === "Native") award(m.id, { icon: "🔌", label: "MCP-Native" });

  return result;
}
