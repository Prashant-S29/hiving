# Ranking methodology

This page is linked from every ranked page on Hivig (`/race`, every `/race/models/[slug]`
page, and the leaderboard's schema.org markup) because AI answer engines and human
readers both discount rankings that can't explain themselves.

## Current status: Hivig Velocity Index (partial rollout)

`rank_current` is computed by the **Hivig Velocity Index (HVI)**, a 0–100 score
weighted across three real, official/self-published public data sources:

- **Token volume (49%)** — trailing 7-day usage, from OpenRouter's `rankings-daily`
  Data API (requires a free `OPENROUTER_API_KEY`).
- **Open-weight downloads (21%)** — from the Hugging Face Hub's public models API,
  for models that have a Hugging Face repo.
- **Quality (30%)** — average score across [LiveBench](https://livebench.ai)'s task
  categories (github.com/livebench/livebench, Apache 2.0), fetched directly as a
  public CSV with no API key or account needed. LiveBench only tracks current
  frontier-tier releases (~50 models at a time), so this signal is `null` for most
  older or regional models — expected, not an error.

All three signals are normalized against the highest value in the currently-tracked
set (Max-Relative Normalization). A model missing one or more signals (e.g. a closed
model with no Hugging Face repo, or one too old for LiveBench's current tracked set)
is scored only from the signal(s) it actually has, reweighted to 100% of whatever's
available — it is not penalized for a metric that structurally doesn't apply to it.

**No LMSYS/Chatbot Arena (now "LMArena") data is included.** Still no free, official
public API for that as of when this was last checked — see "What this deliberately
avoids" below. LiveBench is a separate, independent benchmark, not a re-publish of
Arena's data, and was added specifically because it *does* have a legitimate, open,
no-signup data source where Arena still doesn't.

This is only a **partial rollout**: automated scoring only applies to `aiModel`
documents in Sanity that have an `openrouterId` and/or `liveBenchId` field set
(Studio → AI Model → Velocity Index tab). A model with neither falls back to sorting
after every scored model, tie-broken by release date (newest first) — the same
well-defined-but-illustrative placeholder this page previously described for every
model. See `scripts/fetch-race-metrics.ts` and
`sanity/schemaTypes/documents/raceData.ts`.

The automation itself runs every Sunday at 00:00 UTC via
`.github/workflows/hivig-race-update.yml`, and only ever **patches** the velocity-index
fields (`raceScore`, `previousRaceScore`, `tokensProxy`, `downloads`,
`liveBenchScore`, `scoreUpdatedAt`) on existing, editorially-curated model documents
— it never creates or deletes documents, and never touches curated fields like name,
organization, or benchmark records.

## What this deliberately avoids

- **Fabricating a score.** A model with none of the three signals gets
  `raceScore: null` rather than an invented number.
- **Auto-creating model/organization records.** Every `aiModel` and `organization`
  document in Sanity goes through editorial review (`verificationStatus`). The
  automation only enriches documents an editor has already curated and explicitly
  opted in via `openrouterId`/`liveBenchId` — it never adds new ones unattended.
- **Including LMSYS/Arena data.** No free official API exists for it, and the only
  alternatives found are unofficial third-party scrapes of LMArena's own site —
  not a source this pipeline treats as legitimate enough to build on.
- **Fuzzy-matching a model to a LiveBench/OpenRouter id.** Every `openrouterId`/
  `liveBenchId` set on a model was verified against an exact row in that source's
  own current catalog/table before being entered — never a "close enough" guess.

## What a fuller methodology would still need to define

1. Whether/how to widen quality-signal coverage beyond LiveBench's current
   frontier-only tracked set (e.g. Artificial Analysis's free API is a candidate —
   broader coverage, but account/API-key-gated rather than fully open — if
   LiveBench's ~50-model coverage proves too narrow in practice).
2. A documented process for editors to opt new models into automated scoring, so
   the "no ids set yet" fallback ranking shrinks over time.
3. What counts as the same "model" across dated snapshot releases, so a rank delta
   ("+3 this week") means something consistent as OpenRouter's/LiveBench's own
   listings change — LiveBench in particular ages out older models from its
   tracked set entirely rather than keeping a stale score.

## Why this file exists

`models-schema.json` (in `files/`) flags this explicitly: `rank_current` should be
"computed, not manually set, from a defined ranking formula (log it in
RANKING_METHODOLOGY.md so it's defensible and citable)." Treat any model without a
Velocity Index score as illustrative, not authoritative, until it has one.
