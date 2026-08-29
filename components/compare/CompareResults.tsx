// components/compare/CompareResults.tsx — Section 3 of the spec: verdict
// badges + 5 grouped, collapsible comparison tables.
//
// Each group is a real semantic <table> (matches the SignalRaceTrack.tsx /
// agents/pricing idiom used elsewhere in this design system for AEO/
// screen-reader reasons) wrapped in native <details><summary> — no JS
// required for the collapse, degrades to "all expanded" without it. Each
// table scrolls independently on mobile (spec Section 7) rather than the
// whole page.

import Link from "next/link";
import type { ReactNode } from "react";
import { computeVerdicts, effectiveCost } from "@/lib/compare-verdicts";
import type { CompareModel } from "@/lib/sanity/compare";
import { VerdictBadge } from "@/components/compare/VerdictBadge";

interface Row {
  label: string;
  render: (m: CompareModel) => ReactNode;
}

interface Group {
  label: string;
  rows: Row[];
}

function yesNo(value: boolean | undefined, empty: string): ReactNode {
  if (value === undefined) return empty;
  return value ? "Yes" : "No";
}

function list(values: string[] | undefined, empty: string): ReactNode {
  return values?.length ? values.join(", ") : empty;
}

function money(value: number | undefined, empty: string): ReactNode {
  return typeof value === "number" ? `$${value.toFixed(2)}` : empty;
}

function buildGroups(job: string, empty: string, labels: Record<string, string>): Group[] {
  return [
    {
      label: labels.costGroupLabel,
      rows: [
        { label: "Input cost / 1M tokens", render: (m) => money(m.inputCostPer1M, empty) },
        { label: "Output cost / 1M tokens", render: (m) => money(m.outputCostPer1M, empty) },
        {
          label: "Prompt/context caching",
          render: (m) => (m.cachingSupported === undefined ? empty : m.cachingSupported ? `Yes${m.cachingDiscountPct ? ` (–${m.cachingDiscountPct}%)` : ""}` : "No"),
        },
        { label: "Batch inference discount", render: (m) => (m.batchDiscountPct ? `–${m.batchDiscountPct}%` : yesNo(m.batchDiscountPct !== undefined ? m.batchDiscountPct > 0 : undefined, empty)) },
        {
          label: job && job !== "general" ? "Effective cost for this job" : "Effective cost (blended estimate)",
          render: (m) => {
            const cost = effectiveCost(m);
            return cost === null ? empty : `~$${cost.toFixed(2)} / 1M tokens`;
          },
        },
      ],
    },
    {
      label: labels.capabilityGroupLabel,
      rows: [
        { label: "Hivig capability tier", render: (m) => m.capabilityTier || empty },
        { label: "Context window", render: (m) => (m.contextWindow ? `${(m.contextWindow / 1000).toLocaleString()}K tokens` : empty) },
        { label: "Multimodal support", render: (m) => list(m.multimodal, empty) },
        { label: "Agentic tool-use maturity", render: (m) => m.agenticToolUseMaturity || empty },
      ],
    },
    {
      label: labels.operationsGroupLabel,
      rows: [
        { label: "Latency profile", render: (m) => m.latencyProfile || empty },
        { label: "Rate limits / throughput", render: (m) => m.rateLimitNotes || empty },
        { label: "Provisioned/reserved capacity", render: (m) => yesNo(m.provisionedCapacityAvailable, empty) },
        { label: "Published uptime SLA", render: (m) => yesNo(m.publishedSLA, empty) },
      ],
    },
    {
      label: labels.integrationGroupLabel,
      rows: [
        { label: "MCP support", render: (m) => m.mcpSupport || empty },
        { label: "Requires routing/orchestration layer", render: (m) => (m.requiresRouting === undefined ? empty : m.requiresRouting ? `Yes${m.requiresRoutingNotes ? ` — ${m.requiresRoutingNotes}` : ""}` : "No") },
        { label: "OpenAI-compatible endpoint", render: (m) => yesNo(m.openAICompatible, empty) },
        { label: "Available via", render: (m) => list(m.availableVia, empty) },
        { label: "Open-weight", render: (m) => yesNo(m.openWeight, empty) },
        { label: "Hivig lock-in risk", render: (m) => m.lockInRisk || empty },
      ],
    },
    {
      label: labels.governanceGroupLabel,
      rows: [
        { label: "Trains on your data by default", render: (m) => yesNo(m.trainsOnDataByDefault, empty) },
        { label: "Compliance certifications", render: (m) => list(m.certifications, empty) },
        { label: "Guardrails / moderation maturity", render: (m) => m.guardrailsMaturity || empty },
      ],
    },
  ];
}

export function CompareResults({
  models,
  job,
  emptyValueLabel,
  editSelectionLabel,
  editSelectionHref,
  labels,
}: {
  models: CompareModel[];
  job: string;
  emptyValueLabel: string;
  editSelectionLabel: string;
  editSelectionHref: string;
  labels: Record<string, string>;
}) {
  const verdicts = computeVerdicts(models, job);
  const groups = buildGroups(job, emptyValueLabel, labels);

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-[26px] font-bold md:text-[32px]" style={{ color: "var(--hvg-text-primary)" }}>
          {models.map((m) => m.modelName).join(" vs ")}
        </h1>
        <Link
          href={editSelectionHref}
          className="whitespace-nowrap text-[13px] font-semibold"
          style={{ color: "var(--hvg-ember-strong)" }}
        >
          ← {editSelectionLabel}
        </Link>
      </div>

      {/* Hivig Verdict badges — stacks to 1 column on mobile rather than
          squeezing up to 4 cards into one row (spec Section 7). */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {models.map((m) => (
          <div key={m.id} className="flex flex-col gap-2 rounded-[var(--hvg-radius-lg)] border p-4" style={{ background: "var(--hvg-surface)", borderColor: "var(--hvg-border)" }}>
            <div className="text-[15px] font-bold" style={{ color: "var(--hvg-text-primary)" }}>{m.modelName}</div>
            <div className="text-[12px]" style={{ color: "var(--hvg-text-muted)" }}>{m.organization.name}</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {verdicts.get(m.id)?.length ? verdicts.get(m.id)!.map((tag, i) => <VerdictBadge key={i} tag={tag} />) : (
                <span className="text-[12px]" style={{ color: "var(--hvg-text-dim)" }}>No standout badge</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Grouped, collapsible comparison tables */}
      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <details key={group.label} open className="rounded-[var(--hvg-radius-lg)] border" style={{ borderColor: "var(--hvg-border)", background: "var(--hvg-surface)" }}>
            <summary
              className="cursor-pointer select-none px-4 py-3 text-[13px] font-bold uppercase tracking-wider"
              style={{ color: "var(--hvg-text-primary)", fontFamily: "var(--hvg-font-mono)" }}
            >
              {group.label}
            </summary>
            <div className="overflow-x-auto border-t px-4 py-3" style={{ borderColor: "var(--hvg-border)" }}>
              <table className="w-full min-w-[560px] border-collapse text-[13px]">
                <thead>
                  <tr className="border-b text-left" style={{ borderColor: "var(--hvg-border-strong)" }}>
                    <th className="py-2 pr-4 font-semibold" style={{ color: "var(--hvg-text-dim)" }}>Row</th>
                    {models.map((m) => (
                      <th key={m.id} className="py-2 pr-4 font-semibold" style={{ color: "var(--hvg-text-secondary)" }}>{m.modelName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row) => (
                    <tr key={row.label} className="border-b" style={{ borderColor: "var(--hvg-border)" }}>
                      <td className="py-2 pr-4" style={{ color: "var(--hvg-text-muted)" }}>{row.label}</td>
                      {models.map((m) => (
                        <td key={m.id} className="py-2 pr-4" style={{ color: "var(--hvg-text-primary)" }}>{row.render(m)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
