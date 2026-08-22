"use client";

// components/agent-signal/SignalDiscoverSearch.tsx
// Signal Room rebuild of components/DiscoverSearch.tsx.

import { useState } from "react";
import Link from "next/link";
import { Button, Card, QuoteCard } from "@hivig/design-system";
import type { FeasibilityStudy } from "@/lib/feasibility";
import type { QuoteBreakdown, ExpertiseTier } from "@/lib/pricing-engine";
import type { DiscoverInterfaceCopy } from "@/lib/sanity/agentPages";

interface DiscoverResult {
  study: FeasibilityStudy;
  quote: QuoteBreakdown;
}

function capitalizeTier(tier: ExpertiseTier): "Junior" | "Mid" | "Senior" {
  return (tier.charAt(0).toUpperCase() + tier.slice(1)) as "Junior" | "Mid" | "Senior";
}

// The design system has no verdict/severity chip yet (Badge is specifically
// for verificationStatus — unverified/review/verified — not feasibility), so
// this composes one directly from the semantic tokens rather than misusing
// Badge for a domain it doesn't model. See the project skill for the
// verdict-color mapping rationale (sage=feasible, warning=caveats,
// danger=not feasible — this repo's existing convention, just retokenized).
const VERDICT_STYLE: Record<FeasibilityStudy["feasibility"], { bg: string; text: string; border: string }> = {
  feasible: { bg: "var(--hvg-success-soft)", text: "var(--hvg-sage)", border: "var(--hvg-sage)" },
  feasible_with_caveats: { bg: "var(--hvg-warning-soft)", text: "var(--hvg-warning)", border: "var(--hvg-warning)" },
  not_feasible: { bg: "var(--hvg-danger-soft)", text: "var(--hvg-danger)", border: "var(--hvg-danger)" },
};

export default function SignalDiscoverSearch({ copy }: { copy: DiscoverInterfaceCopy }) {
  const [promptText, setPromptText] = useState("");
  const [result, setResult] = useState<DiscoverResult | null>(null);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/feasibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(copy.fallbackError);
        setResult(null);
        return;
      }
      setResult(data as DiscoverResult);
      setLastQuery(promptText);
    } catch {
      setError(copy.networkError);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="hvg-scope sticky top-[72px] z-10 flex gap-0 rounded-[var(--hvg-radius-md)] p-1"
        style={{ background: "var(--hvg-surface)", border: "1px solid var(--hvg-border-strong)", boxShadow: "var(--hvg-shadow-card)" }}
      >
        <input
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          minLength={10}
          required
          placeholder={copy.placeholder}
          className="flex-1 px-4 py-3 text-sm outline-none"
          style={{ background: "transparent", color: "var(--hvg-text-primary)", fontFamily: "var(--hvg-font-display)" }}
        />
        <Button type="submit" disabled={loading || promptText.trim().length < 10}>
          {loading ? copy.loadingLabel : copy.submitLabel}
        </Button>
      </form>

      {error && (
        <div className="mt-6 rounded-[var(--hvg-radius-md)] p-4 text-sm" style={{ background: "var(--hvg-danger-soft)", color: "var(--hvg-danger)", border: "1px solid var(--hvg-danger)" }}>
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-10 animate-pulse text-center text-[11px] uppercase tracking-wider" style={{ color: "var(--hvg-text-muted)", fontFamily: "var(--hvg-font-mono)" }}>
          {copy.loadingMessage}
        </div>
      )}

      {result && !loading && (
        <div className="mt-10">
          <p className="text-[11px] uppercase tracking-wider" style={{ color: "var(--hvg-text-muted)", fontFamily: "var(--hvg-font-mono)" }}>
            <Link href="/agents" className="transition-colors" style={{ color: "var(--hvg-text-muted)" }}>{copy.agentStoreLabel}</Link>
            {" / "}
            <span>{copy.discoverLabel}</span>
            {" / "}
            <span className="normal-case tracking-normal" style={{ color: "var(--hvg-text-primary)" }}>{result.study.agentName}</span>
          </p>

          <p className="mt-2 text-[11px]" style={{ color: "var(--hvg-text-dim)", fontFamily: "var(--hvg-font-mono)" }}>
            {copy.generatedForLabel} &ldquo;{lastQuery}&rdquo;
          </p>

          <div className="mt-6 grid gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <Card padding="lg" className="flex aspect-square items-center justify-center">
              <div className="text-center">
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold"
                  style={{ background: "var(--hvg-surface-container-high)", color: "var(--hvg-text-primary)" }}
                >
                  {result.study.agentName.slice(0, 1).toUpperCase()}
                </div>
                <p className="mt-3 text-sm font-medium" style={{ color: "var(--hvg-text-primary)" }}>{result.study.agentName}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider" style={{ color: "var(--hvg-text-muted)", fontFamily: "var(--hvg-font-mono)" }}>
                  {copy.conceptPreviewLabel}
                </p>
              </div>
            </Card>

            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--hvg-text-primary)" }}>{result.study.agentName}</h1>

              <span
                className="mt-3 inline-block rounded-[var(--hvg-radius-sm)] px-3 py-1 text-[11px] uppercase tracking-wider"
                style={{
                  background: VERDICT_STYLE[result.study.feasibility].bg,
                  color: VERDICT_STYLE[result.study.feasibility].text,
                  border: `1px solid ${VERDICT_STYLE[result.study.feasibility].border}`,
                  fontFamily: "var(--hvg-font-mono)",
                }}
              >
                {{
                  feasible: copy.feasibleLabel,
                  feasible_with_caveats: copy.caveatsLabel,
                  not_feasible: copy.notFeasibleLabel,
                }[result.study.feasibility]}
              </span>

              <p className="mt-4 text-[15px] leading-[1.75]" style={{ color: "var(--hvg-text-secondary)" }}>{result.study.verdictSummary}</p>

              <div className="mt-6">
                <QuoteCard
                  quotedPriceUSD={result.quote.quotedPriceUSD}
                  geoRegion={result.quote.geoRegion}
                  modelUsed={result.quote.breakdown.modelUsed}
                  expertiseTier={capitalizeTier(result.quote.breakdown.expertiseTier)}
                  estimatedTokens={result.quote.breakdown.estimatedTokens}
                  estimatedHumanHours={result.quote.breakdown.estimatedHumanHours}
                  modelCreditsCostUSD={result.quote.modelCreditsCostUSD}
                  humanHoursCostUSD={result.quote.humanHoursCostUSD}
                />
                <p className="mt-3 text-[11px] leading-relaxed" style={{ color: "var(--hvg-text-dim)", fontFamily: "var(--hvg-font-mono)" }}>
                  {copy.estimateDisclaimer}{" "}
                  <Link href="/agents/pricing" className="transition-colors" style={{ color: "var(--hvg-ember)" }}>
                    {copy.pricingLinkLabel}
                  </Link>
                  .
                </p>
              </div>

              {result.study.capabilities.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-[11px] uppercase tracking-wider" style={{ color: "var(--hvg-text-muted)", fontFamily: "var(--hvg-font-mono)" }}>{copy.capabilitiesHeading}</h2>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm" style={{ color: "var(--hvg-text-secondary)" }}>
                    {result.study.capabilities.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.study.risks.length > 0 && (
                <div className="mt-6 rounded-[var(--hvg-radius-md)] p-4" style={{ background: "var(--hvg-warning-soft)", border: "1px solid var(--hvg-warning)" }}>
                  <h2 className="text-[11px] uppercase tracking-wider" style={{ color: "var(--hvg-warning)", fontFamily: "var(--hvg-font-mono)" }}>{copy.risksHeading}</h2>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm" style={{ color: "var(--hvg-text-secondary)" }}>
                    {result.study.risks.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.study.assumptions.length > 0 && (
                <div className="mt-5">
                  <h2 className="text-[10px] uppercase tracking-wider" style={{ color: "var(--hvg-text-dim)", fontFamily: "var(--hvg-font-mono)" }}>{copy.assumptionsHeading}</h2>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[11px]" style={{ color: "var(--hvg-text-dim)", fontFamily: "var(--hvg-font-mono)" }}>
                    {result.study.assumptions.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
