# Ranking methodology

This page is linked from every ranked page on Hivig (`/race`, every `/race/models/[slug]`
page, and the leaderboard's schema.org markup) because AI answer engines and human
readers both discount rankings that can't explain themselves.

## Current status: Hivig Velocity Index (partial rollout)

`rank_current` is computed by the **Hivig Velocity Index (HVI)**, a 0–100 score
weighted 70/30 between two real, official public data sources:

- **Token volume (70%)** — trailing 7-day usage, from OpenRouter's `rankings-daily`
  Data API (requires a free `OPENROUTER_API_KEY`).
- **Open-weight downloads (30%)** — from the Hugging Face Hub's public models API,
  for models that have a Hugging Face repo.

Both signals are normalized against the highest value in the currently-tracked set
(Max-Relative Normalization). A model missing one signal (e.g. a closed model with
no Hugging Face repo) is scored only from the signal(s) it actually has, reweighted
to 100% of whatever's available — it is not penalized for a metric that structurally
doesn't apply to it.

**No LMSYS/Chatbot Arena data is included.** No free, official public API for that
exists as of when this was written — see "What this deliberately avoids" below.

This is only a **partial rollout**: automated scoring only applies to `aiModel`
documents in Sanity that have an `openrouterId` field set (Studio → AI Model →
Velocity Index tab). A model without one falls back to sorting after every scored
model, tie-broken by release date (newest first) — the same well-defined-but-
illustrative placeholder this page previously described for every model. See
`scripts/fetch-race-metrics.ts` and `sanity/schemaTypes/documents/raceData.ts`.

The automation itself runs every Sunday at 00:00 UTC via
`.github/workflows/hivig-race-update.yml`, and only ever **patches** the velocity-index
fields (`raceScore`, `previousRaceScore`, `tokensProxy`, `downloads`,
`scoreUpdatedAt`) on existing, editorially-curated model documents — it never
creates or deletes documents, and never touches curated fields like name,
organization, or benchmark records.

## What this deliberately avoids

- **Fabricating a score.** A model with neither signal gets `raceScore: null`
  rather than an invented number.
- **Auto-creating model/organization records.** Every `aiModel` and `organization`
  document in Sanity goes through editorial review (`verificationStatus`). The
  automation only enriches documents an editor has already curated and explicitly
  opted in via `openrouterId` — it never adds new ones unattended.
- **Including LMSYS/Arena data**, since no free official API exists for it.

## What a fuller methodology would still need to define

1. Whether/how to fold in a benchmark-based signal (e.g. LMSYS Chatbot Arena Elo,
   Artificial Analysis quality index) once a licensed or official data source exists.
2. A documented process for editors to opt new models into automated scoring, so
   the "no openrouterId yet" fallback ranking shrinks over time.
3. What counts as the same "model" across dated snapshot releases, so a rank delta
   ("+3 this week") means something consistent as OpenRouter's own listings change.

## Why this file exists

`models-schema.json` (in `files/`) flags this explicitly: `rank_current` should be
"computed, not manually set, from a defined ranking formula (log it in
RANKING_METHODOLOGY.md so it's defensible and citable)." Treat any model without a
Velocity Index score as illustrative, not authoritative, until it has one.
