// lib/model-format.ts
//
// Shared value-formatting helpers for rendering RaceModel fields as prose/table
// cells. Extracted from components/compare/CompareResults.tsx so the pillar
// page's new cost/tech-debt copy (lib/model-faq.ts) formats the same
// inputCostPer1M/outputCostPer1M/boolean fields identically to /compare
// instead of re-implementing the same formatting twice.

export function yesNo(value: boolean | undefined, empty: string): string {
  if (value === undefined) return empty;
  return value ? "Yes" : "No";
}

export function list(values: string[] | undefined, empty: string): string {
  return values?.length ? values.join(", ") : empty;
}

export function money(value: number | undefined, empty: string): string {
  return typeof value === "number" ? `$${value.toFixed(2)}` : empty;
}
