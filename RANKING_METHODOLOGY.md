# Ranking methodology

This page is linked from every ranked page on Hivig (`/race`, every `/race/models/[slug]`
page, and the leaderboard's schema.org markup) because AI answer engines and human
readers both discount rankings that can't explain themselves.

## Current status: Hivig Velocity Index (partial rollout)

`rank_current` is computed by the **Hivig Velocity Index (HVI)**, a 0–100 score
weighted across three real, official/self-published public data sources:

- **Token volume** — trailing 7-day usage, from OpenRouter's `rankings-daily`
  Data API (requires a free `OPENROUTER_API_KEY`). The largest of the three
  weights.
- **Open-weight downloads** — from the Hugging Face Hub's public models API,
  for models that have a Hugging Face repo. The smallest of the three weights.
- **Quality** — average score across [LiveBench](https://livebench.ai)'s task
  categories (github.com/livebench/livebench, Apache 2.0), fetched directly as a
  public CSV with no API key or account needed. LiveBench only tracks current
  frontier-tier releases (~50 models at a time), so this signal is `null` for most
  older or regional models — expected, not an error.

The exact weighting isn't published here by design — see "What this deliberately
avoids" below. What's disclosed is the three inputs, the sourcing, and the
normalization method, not the precise formula.

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

## In development: the Hivig Score

Alongside the Velocity Index (a real *usage* signal — how much a model is actually
being run), Hivig is building a second, separate score that assesses *capability,
agentic performance, and economics* — closer to "how good and how viable is this
model for agentic work," not "how popular is it." This is **not live yet**; it's
disclosed here ahead of shipping because the sourcing and process are already
decided, even though the score itself isn't computed yet.

**Phase 1 sources** (all real, self-published, and used under their own stated
open licenses — see each source's own terms):

- **Hugging Face** — benchmark leaderboard data (via HF's dataset/leaderboard
  APIs), not the download-count signal the Velocity Index already uses.
- **Epoch AI** — their Benchmarking Hub (epoch.ai), covering coding-agent and
  tool-use benchmarks (SWE-bench, Terminal-Bench, OSWorld, Aider, The Agent
  Company, and others), CC BY licensed.
- **Berkeley Function-Calling Leaderboard (BFCL)** — tool-use and agentic
  evaluation data (gorilla.cs.berkeley.edu), Apache 2.0 licensed.

**Artificial Analysis is explicitly not included yet.** Their free-tier data API
doesn't permit redistribution on a public page, and Hivig hasn't taken out a
commercial license — using their data here without one isn't an option. This may
change if that's resolved later.

As with the Velocity Index, **the exact formula and category weights won't be
published** once this ships — not on this page, not in an API response, not
anywhere someone could inspect it. What's disclosed is the inputs and the process;
what stays undisclosed is the scoring function itself, the same posture most
credible ranking methodologies take.

## What this deliberately avoids

- **Fabricating a score.** A model with none of the three Velocity Index signals
  gets `raceScore: null` rather than an invented number — the same discipline will
  apply to the Hivig Score once it ships.
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
- **Publishing exact scoring weights anywhere inspectable.** True for the Velocity
  Index today (see above) and will be true for the Hivig Score once it ships.

## What a fuller methodology would still need to define

1. Building and shipping the Hivig Score itself — the sourcing and process above
   are decided; the ingestion pipeline and formula aren't built yet.
2. Whether/how to widen quality-signal coverage beyond LiveBench's current
   frontier-only tracked set, and separately, whether/when an Artificial Analysis
   commercial license makes sense for the Hivig Score's economics signal.
3. A documented process for editors to opt new models into automated scoring, so
   the "no ids set yet" fallback ranking shrinks over time.
4. What counts as the same "model" across dated snapshot releases, so a rank delta
   ("+3 this week") means something consistent as sources' own listings change —
   LiveBench in particular ages out older models from its tracked set entirely
   rather than keeping a stale score.
5. A unified data layer so Race, Compare, and each model's page read one dataset
   instead of the two (going on more) separate ones that exist today.

## Why this file exists

`models-schema.json` (in `files/`) flags this explicitly: `rank_current` should be
"computed, not manually set, from a defined ranking formula (log it in
RANKING_METHODOLOGY.md so it's defensible and citable)." Treat any model without a
Velocity Index score as illustrative, not authoritative, until it has one.
