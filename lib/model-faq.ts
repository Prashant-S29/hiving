// lib/model-faq.ts
//
// AEO/GEO content for the model pillar page: direct-answer sentences about
// country of origin, cost, and build risk/tech debt, computed purely from
// fields already curated on the aiModel document (see RaceModel in
// lib/sanity/race.ts) — no new schema, no hand-entered per-model prose.
//
// buildCountrySummary/buildCostSummary/buildTechDebtSummary/
// buildIntegrationSummary are also the single source of truth for the
// pillar page's visible sections (app/race/models/[slug]/page.tsx): the FAQ
// block and its FAQPage JSON-LD are built from the exact same strings, so
// visible copy and structured data never drift apart.

import { applyTemplate, type RaceModel, type RaceSettingsContent } from "@/lib/sanity/race";
import { getCountryName } from "@/lib/iso-countries";
import { money } from "@/lib/model-format";

export interface FaqEntry {
  question: string;
  answer: string;
}

export function buildCountrySummary(model: RaceModel): string {
  const country = getCountryName(model.organization.countryCode);
  return `${model.model_name} is developed by ${model.org_name}, headquartered in ${country}.`;
}

export function buildCostSummary(model: RaceModel): string | null {
  if (typeof model.inputCostPer1M !== "number" || typeof model.outputCostPer1M !== "number") return null;
  const sentences = [
    `${model.model_name} costs ${money(model.inputCostPer1M, "")} per 1M input tokens and ${money(model.outputCostPer1M, "")} per 1M output tokens.`,
  ];
  if (model.cachingSupported) {
    sentences.push(
      model.cachingDiscountPct
        ? `Cached prompts get a further ${model.cachingDiscountPct}% discount.`
        : `Prompt/context caching is supported.`
    );
  }
  if (model.batchDiscountPct) {
    sentences.push(`Batch inference is available at a further ${model.batchDiscountPct}% discount.`);
  }
  return sentences.join(" ");
}

export function buildTechDebtSummary(model: RaceModel): string | null {
  const sentences: string[] = [];
  if (model.lockInRisk) {
    sentences.push(`Building agents on ${model.model_name} carries ${model.lockInRisk.toLowerCase()} lock-in risk.`);
  }
  if (model.requiresRouting) {
    sentences.push(`It requires a routing or orchestration layer to use in production${model.requiresRoutingNotes ? ` — ${model.requiresRoutingNotes}` : ""}.`);
  } else if (model.requiresRouting === false) {
    sentences.push(`It does not require a separate routing or orchestration layer.`);
  }
  if (model.openWeight === true) {
    sentences.push(`It is open-weight, so it can be self-hosted to avoid ongoing vendor dependency.`);
  } else if (model.openWeight === false) {
    sentences.push(`It is closed-weight, available only through its provider's own hosting.`);
  }
  if (model.availableVia?.length) {
    sentences.push(`It's available via ${model.availableVia.join(", ")}.`);
  }
  return sentences.length ? sentences.join(" ") : null;
}

export function buildIntegrationSummary(model: RaceModel): string | null {
  const sentences: string[] = [];
  if (model.mcpSupport) {
    sentences.push(`${model.model_name} has ${model.mcpSupport.toLowerCase()} MCP (Model Context Protocol) support.`);
  }
  if (model.openAICompatible === true) {
    sentences.push(`It exposes an OpenAI-compatible API, so most existing agent frameworks can point at it with minimal changes.`);
  } else if (model.openAICompatible === false) {
    sentences.push(`It does not expose an OpenAI-compatible API.`);
  }
  if (model.agenticToolUseMaturity) {
    sentences.push(`Its agentic tool-use maturity is rated ${model.agenticToolUseMaturity.toLowerCase()}.`);
  }
  return sentences.length ? sentences.join(" ") : null;
}

export function buildModelFaq(model: RaceModel, settings: RaceSettingsContent): FaqEntry[] {
  const entries: FaqEntry[] = [
    {
      question: applyTemplate(settings.modelFaqCountryQuestion, { model: model.model_name }),
      answer: buildCountrySummary(model),
    },
  ];

  const costSummary = buildCostSummary(model);
  if (costSummary) {
    entries.push({
      question: applyTemplate(settings.modelFaqCostQuestion, { model: model.model_name }),
      answer: costSummary,
    });
  }

  const techDebtSummary = buildTechDebtSummary(model);
  if (techDebtSummary) {
    entries.push({
      question: applyTemplate(settings.modelFaqTechDebtQuestion, { model: model.model_name }),
      answer: techDebtSummary,
    });
  }

  const integrationSummary = buildIntegrationSummary(model);
  if (integrationSummary) {
    entries.push({
      question: applyTemplate(settings.modelFaqIntegrationQuestion, { model: model.model_name }),
      answer: integrationSummary,
    });
  }

  return entries;
}
