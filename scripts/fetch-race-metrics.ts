// scripts/fetch-race-metrics.ts
//
// Weekly automation for The Race's "Hivig Velocity Index". Run via
// `npm run fetch:race-metrics` locally, or automatically every Sunday by
// .github/workflows/hivig-race-update.yml.
//
// Data sources (real, no fabrication):
//   - OpenRouter's rankings-daily Data API: real per-model token volume,
//     summed over the trailing 7 days. Requires OPENROUTER_API_KEY — free to
//     create at openrouter.ai/keys, but not anonymous-public, hence the env var.
//   - OpenRouter's models catalog API: model identity (name, hugging_face_id).
//     Public, no auth needed.
//   - Hugging Face's models API: `downloads` for models that have a
//     hugging_face_id (i.e. open-weight models). Public, no auth needed.
//   - LiveBench's own published results table (github.com/livebench/livebench,
//     Apache 2.0, ICLR 2025 spotlight): a quality/capability signal, average
//     score across its task categories. Fetched directly as CSV from
//     livebench.ai — a genuinely open, self-published primary source, not a
//     scrape of someone else's site, and no API key needed. Only tracks
//     current frontier-tier releases (~50 models at a time), so most models
//     in this dataset won't have a match — that's expected, not an error.
//
// Unlike an earlier version of this script (in a retired scaffold), this one
// does NOT write to a local JSON file and does NOT auto-create new model/
// organization documents. This repo's Race data is curated, editorially
// reviewed content in Sanity (see sanity/schemaTypes/documents/raceData.ts —
// every aiModel document has a verificationStatus and goes through review).
// Auto-creating documents from an unattended pipeline would bypass that
// review entirely. So instead:
//   - Only EXISTING aiModel documents that have an `openrouterId` and/or
//     `liveBenchId` field set (in Studio, by an editor) are eligible for
//     automated scoring on that signal.
//   - This script only PATCHES those documents' velocity-index fields
//     (raceScore, previousRaceScore, tokensProxy, downloads, liveBenchScore,
//     scoreUpdatedAt) — it never touches curated fields (name, organization,
//     benchmarks, etc).
//   - A model discovered in live source data with no matching id in Sanity
//     is logged and skipped, not auto-created.
//
// What this deliberately does NOT do:
//   - Fabricate a score for a model with no real signal. A model with none
//     of the three signals gets raceScore: null rather than an invented
//     number.
//   - Penalize a model for lacking a signal that structurally doesn't apply
//     to it (e.g. a closed model with no Hugging Face repo, or a model too
//     old to still be on LiveBench's current tracked set). The score is
//     computed only from whichever signals actually exist per model,
//     reweighted proportionally — see computeRaceScores().
//   - Include LMSYS/Chatbot Arena (now "LMArena") data. Still no free,
//     official public API for that as of when this was written — only
//     unofficial third-party scrapes of their site, which isn't a source
//     this pipeline treats as legitimate. LiveBench is an independent
//     benchmark, not a re-publish of Arena's data. See RANKING_METHODOLOGY.md.

import fs from "node:fs";
import { createClient } from "@sanity/client";

function loadLocalEnv() {
  if (!fs.existsSync(".env.local")) return;
  for (const rawLine of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadLocalEnv();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error(
    "ERROR: OPENROUTER_API_KEY is not set.\n" +
      "Get a free key at https://openrouter.ai/keys, then either:\n" +
      "  - add OPENROUTER_API_KEY=... to .env.local before running this locally, or\n" +
      "  - add it as a GitHub Actions secret named OPENROUTER_API_KEY."
  );
  process.exit(1);
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const writeToken = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !dataset || !writeToken) {
  console.error("ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN are all required.");
  process.exit(1);
}

const sanity = createClient({ projectId, dataset, apiVersion, token: writeToken, useCdn: false });

// Restores the original 3-way split described in RANKING_METHODOLOGY.md now
// that LiveBench fills the "quality" slot that was previously unfillable —
// see the file header for why LMSYS/Arena still isn't used for it.
const TOKENS_WEIGHT = 0.49;
const DOWNLOADS_WEIGHT = 0.21;
const QUALITY_WEIGHT = 0.3;

interface OpenRouterModel {
  id: string;
  canonical_slug?: string;
  name: string;
  hugging_face_id?: string | null;
}

interface RankingsDailyRow {
  date: string;
  model_permaslug: string;
  total_tokens: string;
}

async function fetchJson<T>(url: string, headers?: Record<string, string>): Promise<T> {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

function dateNDaysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

async function fetchTokenVolume(): Promise<Map<string, number>> {
  const endDate = dateNDaysAgo(1); // yesterday — today's data may be incomplete
  const startDate = dateNDaysAgo(7);
  const url = `https://openrouter.ai/api/v1/datasets/rankings-daily?start_date=${startDate}&end_date=${endDate}`;
  const data = await fetchJson<{ data: RankingsDailyRow[] }>(url, {
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
  });

  const totals = new Map<string, number>();
  for (const row of data.data ?? []) {
    const tokens = Number(row.total_tokens);
    if (!Number.isFinite(tokens)) continue;
    totals.set(row.model_permaslug, (totals.get(row.model_permaslug) ?? 0) + tokens);
  }
  return totals;
}

async function fetchModelCatalog(): Promise<Map<string, OpenRouterModel>> {
  const data = await fetchJson<{ data: OpenRouterModel[] }>("https://openrouter.ai/api/v1/models");
  const byId = new Map<string, OpenRouterModel>();
  for (const m of data.data ?? []) {
    byId.set(m.id, m);
    if (m.canonical_slug) byId.set(m.canonical_slug, m);
  }
  return byId;
}

async function fetchHfDownloads(hfRepoId: string): Promise<number | null> {
  try {
    const data = await fetchJson<{ downloads?: number }>(`https://huggingface.co/api/models/${hfRepoId}`);
    return typeof data.downloads === "number" ? data.downloads : null;
  } catch (err) {
    console.warn(`  ! Hugging Face lookup failed for ${hfRepoId}: ${(err as Error).message}`);
    return null;
  }
}

interface TrackedSanityModel {
  _id: string;
  openrouterId: string | null;
  liveBenchId: string | null;
  raceScore: number | null;
}

async function fetchTrackedModels(): Promise<TrackedSanityModel[]> {
  return sanity.fetch<TrackedSanityModel[]>(
    `*[_type == "aiModel" && ((defined(openrouterId) && openrouterId != "") || (defined(liveBenchId) && liveBenchId != ""))]{ _id, openrouterId, liveBenchId, raceScore }`
  );
}

// Minimal CSV line splitter — handles double-quoted fields (with escaped ""
// inside), which is all LiveBench's export actually needs; not a general
// RFC 4180 parser.
function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      cells.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells;
}

function dateStringNDaysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return `${d.getUTCFullYear()}_${String(d.getUTCMonth() + 1).padStart(2, "0")}_${String(d.getUTCDate()).padStart(2, "0")}`;
}

// LiveBench's results table is a plain public CSV, but the filename is
// date-versioned (table_YYYY_MM_DD.csv) with no stable alias and no manifest
// listing the current date — their own frontend embeds it at build time. The
// only robust way to find the current file without depending on their
// internal bundle structure is to check recent plausible dates until one
// exists; they update roughly monthly, so this rarely needs more than a
// handful of requests.
async function findCurrentLiveBenchTableUrl(): Promise<string | null> {
  for (let daysAgo = 0; daysAgo <= 120; daysAgo++) {
    const url = `https://livebench.ai/table_${dateStringNDaysAgo(daysAgo)}.csv`;
    const res = await fetch(url, { method: "HEAD" });
    if (res.ok) return url;
  }
  return null;
}

async function fetchLiveBenchScores(): Promise<Map<string, number>> {
  const url = await findCurrentLiveBenchTableUrl();
  if (!url) {
    console.warn("  ! Could not find a current LiveBench table (checked the last 120 days) — quality signal skipped this run.");
    return new Map();
  }
  console.log(`  Using LiveBench table: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  const header = splitCsvLine(lines[0]);

  const scores = new Map<string, number>();
  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line);
    const model = cells[0];
    if (!model) continue;
    const values: number[] = [];
    for (let i = 1; i < cells.length; i++) {
      const n = Number(cells[i]);
      if (Number.isFinite(n)) values.push(n);
    }
    if (values.length === 0) continue;
    scores.set(model, values.reduce((a, b) => a + b, 0) / values.length);
  }
  console.log(`  Parsed ${scores.size} model(s) across ${header.length - 1} LiveBench task columns.`);
  return scores;
}

interface EnrichedModel {
  sanityId: string;
  tokensProxy: number | null;
  downloads: number | null;
  liveBenchScore: number | null;
}

// Max-Relative Normalization with a fairness fix: a model's score is
// computed only from the signals that actually exist for it, reweighted
// proportionally, so a model missing one signal isn't penalized for a metric
// that structurally doesn't apply to it (e.g. a closed model with no
// Hugging Face repo, or one too old for LiveBench's current tracked set).
function computeRaceScores(rows: EnrichedModel[]): Map<string, number | null> {
  const maxTokens = Math.max(0, ...rows.map((r) => r.tokensProxy ?? 0));
  const maxDownloads = Math.max(0, ...rows.map((r) => r.downloads ?? 0));
  const maxQuality = Math.max(0, ...rows.map((r) => r.liveBenchScore ?? 0));

  const scores = new Map<string, number | null>();
  for (const r of rows) {
    const parts: { weight: number; ratio: number }[] = [];
    if (r.tokensProxy != null && maxTokens > 0) {
      parts.push({ weight: TOKENS_WEIGHT, ratio: r.tokensProxy / maxTokens });
    }
    if (r.downloads != null && maxDownloads > 0) {
      parts.push({ weight: DOWNLOADS_WEIGHT, ratio: r.downloads / maxDownloads });
    }
    if (r.liveBenchScore != null && maxQuality > 0) {
      parts.push({ weight: QUALITY_WEIGHT, ratio: r.liveBenchScore / maxQuality });
    }
    if (parts.length === 0) {
      scores.set(r.sanityId, null);
      continue;
    }
    const weightSum = parts.reduce((s, p) => s + p.weight, 0);
    const raw = parts.reduce((s, p) => s + (p.weight / weightSum) * p.ratio, 0) * 100;
    scores.set(r.sanityId, Math.round(raw * 100) / 100);
  }
  return scores;
}

async function main() {
  const tracked = await fetchTrackedModels();
  if (tracked.length === 0) {
    console.log(
      "No aiModel documents have an openrouterId or liveBenchId set yet — nothing to score.\n" +
        "In Studio, open an AI Model document, go to the \"Velocity Index\" tab, and set one or\n" +
        "both of: OpenRouter model ID (e.g. \"deepseek/deepseek-v4-flash-0731\"), LiveBench model\n" +
        "ID (e.g. \"deepseek-v4-pro-0813\", from livebench.ai's results table)."
    );
    return;
  }
  console.log(`Tracking ${tracked.length} model(s) with an openrouterId and/or liveBenchId set.`);

  console.log("Fetching OpenRouter token-volume rankings (trailing 7 days)...");
  const tokenVolume = await fetchTokenVolume();

  console.log("Fetching OpenRouter model catalog...");
  const catalog = await fetchModelCatalog();

  console.log("Fetching LiveBench's current results table...");
  const liveBenchScores = await fetchLiveBenchScores();

  const enriched: EnrichedModel[] = [];
  for (const model of tracked) {
    let tokensProxy: number | null = null;
    let downloads: number | null = null;
    let liveBenchScore: number | null = null;

    if (model.openrouterId) {
      const catalogEntry = catalog.get(model.openrouterId);
      if (!catalogEntry) {
        console.warn(`  ! "${model.openrouterId}" not found in OpenRouter's catalog — token/download signals skipped for this model.`);
      } else {
        tokensProxy = tokenVolume.get(model.openrouterId) ?? tokenVolume.get(catalogEntry.canonical_slug ?? "") ?? null;
        if (catalogEntry.hugging_face_id) {
          console.log(`  Fetching Hugging Face downloads for ${catalogEntry.hugging_face_id}...`);
          downloads = await fetchHfDownloads(catalogEntry.hugging_face_id);
        }
      }
    }

    if (model.liveBenchId) {
      liveBenchScore = liveBenchScores.get(model.liveBenchId) ?? null;
      if (liveBenchScore == null) {
        console.warn(`  ! "${model.liveBenchId}" not found in the current LiveBench table — quality signal skipped for this model.`);
      }
    }

    if (tokensProxy == null && downloads == null && liveBenchScore == null && !model.openrouterId && !model.liveBenchId) continue;
    enriched.push({ sanityId: model._id, tokensProxy, downloads, liveBenchScore });
  }

  if (enriched.length === 0) {
    console.log("None of the tracked models matched any live source data — nothing to write.");
    return;
  }

  const scores = computeRaceScores(enriched);
  const scoreUpdatedAt = new Date().toISOString();

  for (const model of tracked) {
    const enrichedRow = enriched.find((r) => r.sanityId === model._id);
    if (!enrichedRow) continue;
    const newScore = scores.get(model._id) ?? null;

    await sanity
      .patch(model._id)
      .set({
        raceScore: newScore,
        previousRaceScore: model.raceScore ?? null,
        tokensProxy: enrichedRow.tokensProxy,
        downloads: enrichedRow.downloads,
        liveBenchScore: enrichedRow.liveBenchScore,
        scoreUpdatedAt,
      })
      .commit();
    console.log(`  Updated ${model._id}: raceScore=${newScore ?? "null"} (was ${model.raceScore ?? "null"})`);
  }

  console.log(`Done — patched ${enriched.length} model document(s).`);
}

main().catch((err) => {
  console.error("fetch-race-metrics failed:", err);
  process.exit(1);
});
