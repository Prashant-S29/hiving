import fs from "node:fs";
import { createClient, type SanityDocumentStub } from "@sanity/client";
import { SEED_MODELS } from "@/data/seed-models";
import { DEFAULT_RACE_SETTINGS } from "@/lib/sanity/race";

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

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function action(label: string, path: string) {
  return { _type: "callToAction", label, style: "text", link: { _type: "link", linkType: "internal", internalPath: path } };
}

loadLocalEnv();
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !dataset || !token) throw new Error("Sanity project, dataset, and Editor write token are required.");
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

async function createOrFill(document: SanityDocumentStub) {
  const existing = await client.fetch<string | null>("*[_id == $id][0]._id", { id: document._id });
  if (!existing) {
    await client.create(document);
    return "created";
  }
  const { _id, _type, ...fields } = document;
  await client.patch(document._id).setIfMissing(fields).commit();
  return "updated";
}

async function main() {
  const settings: SanityDocumentStub = {
    _id: "raceSettings",
    _type: "raceSettings",
    ...DEFAULT_RACE_SETTINGS,
    methodologyAction: action(DEFAULT_RACE_SETTINGS.methodologyAction.label, DEFAULT_RACE_SETTINGS.methodologyAction.href),
    modelBackAction: action(DEFAULT_RACE_SETTINGS.modelBackAction.label, DEFAULT_RACE_SETTINGS.modelBackAction.href),
    methodologyBackAction: action(DEFAULT_RACE_SETTINGS.methodologyBackAction.label, DEFAULT_RACE_SETTINGS.methodologyBackAction.href),
    seo: { _type: "seo", ...DEFAULT_RACE_SETTINGS.seo },
    methodologySeo: { _type: "seo", ...DEFAULT_RACE_SETTINGS.methodologySeo },
  };
  console.log(`${await createOrFill(settings)} raceSettings`);

  const organizations = new Map<string, (typeof SEED_MODELS)[number]>();
  for (const model of SEED_MODELS) if (!organizations.has(model.org_name)) organizations.set(model.org_name, model);

  for (const [name, model] of organizations) {
    const id = `organization-${slugify(name)}`;
    const document: SanityDocumentStub = {
      _id: id,
      _type: "organization",
      name,
      slug: { _type: "slug", current: slugify(name) },
      countryCode: model.org_country,
      isPublic: model.market_status.is_public,
      ...(model.market_status.exchange ? { exchange: model.market_status.exchange } : {}),
      ...(model.market_status.ticker ? { ticker: model.market_status.ticker } : {}),
      verificationStatus: "unverified",
    };
    console.log(`${await createOrFill(document)} ${id}`);
  }

  for (const model of SEED_MODELS) {
    const id = `ai-model-${model.slug}`;
    const document: SanityDocumentStub = {
      _id: id,
      _type: "aiModel",
      name: model.model_name,
      slug: { _type: "slug", current: model.slug },
      organization: { _type: "reference", _ref: `organization-${slugify(model.org_name)}` },
      releaseDate: model.release_date,
      modelType: model.model_type,
      verificationStatus: "unverified",
      active: true,
    };
    console.log(`${await createOrFill(document)} ${id}`);
  }

  for (const model of SEED_MODELS) {
    const modelId = `ai-model-${model.slug}`;
    const benchmarkId = `benchmark-${model.slug}-primary`;
    const benchmarkName = model.benchmark_scores.source.replace(/^TODO\s*—\s*/i, "");
    const document: SanityDocumentStub = {
      _id: benchmarkId,
      _type: "benchmarkRecord",
      title: `${model.model_name} — ${benchmarkName}`,
      model: { _type: "reference", _ref: modelId },
      benchmarkName,
      notes: "Illustrative migration record. No score or source citation has been supplied; verify against a primary benchmark source before publishing a score.",
      verificationStatus: "unverified",
    };
    console.log(`${await createOrFill(document)} ${benchmarkId}`);
    await client.patch(modelId).setIfMissing({ benchmarkRecords: [{ _type: "reference", _key: `benchmark-${model.slug}`, _ref: benchmarkId }] }).commit();
  }

  console.log(`Race migration complete: ${organizations.size} organizations, ${SEED_MODELS.length} models, ${SEED_MODELS.length} illustrative benchmark records.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
