# Ranking methodology

This page is linked from every ranked page on Hivig (`/race`, every `/race/models/[slug]`
page, and the leaderboard's schema.org markup) because AI answer engines and human
readers both discount rankings that can't explain themselves.

## Current status: placeholder

`rank_current` in `data/seed-models.ts` is computed by **release date, newest first**
(`applyPlaceholderRanking` in that file). This is a placeholder so the field is a
well-defined function of real data instead of being hand-set — it is **not** a
credible ranking methodology and must not be presented to users as one.

## What the real methodology needs to define, before this page can be trusted

1. **Which benchmarks count, and how they're weighted.** e.g. a blend of LMSYS
   Chatbot Arena Elo, Artificial Analysis quality index, and task-specific evals —
   pick a defensible set, not "whatever number is highest."
2. **How ties and missing data are handled.** Not every model has a score on every
   benchmark; the formula needs an explicit rule, not silent omission.
3. **Refresh cadence and staleness rule.** Matches the 72h data refresh — a model
   should not out-rank another on a benchmark score that's materially older.
4. **What counts as the same "model" across versions** (e.g. `GPT-4o` vs a dated
   snapshot release) so rank-delta ("+3 this period") means something consistent.

## Why this file exists

`models-schema.json` (in `files/`) flags this explicitly: `rank_current` should be
"computed, not manually set, from a defined ranking formula (log it in
RANKING_METHODOLOGY.md so it's defensible and citable)." Until the real formula is
defined here, treat every rank shown on the site as illustrative, not authoritative.
