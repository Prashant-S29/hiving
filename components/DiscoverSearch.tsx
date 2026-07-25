"use client";

import { useState } from "react";
import Link from "next/link";
import type { FeasibilityStudy } from "@/lib/feasibility";
import type { QuoteBreakdown } from "@/lib/pricing-engine";

interface DiscoverResult {
  study: FeasibilityStudy;
  quote: QuoteBreakdown;
}

// Verdict colors map straight onto the brand's semantic tokens — no separate
// palette needed here (see tailwind.config.ts: verify/amber/signal).
const VERDICT_STYLE: Record<
  FeasibilityStudy["feasibility"],
  { label: string; className: string }
> = {
  feasible: { label: "✅ Feasible", className: "bg-verify/10 text-verify border-verify/40" },
  feasible_with_caveats: { label: "⚠️ Feasible with caveats", className: "bg-amber/10 text-amber border-amber/40" },
  not_feasible: { label: "✕ Not feasible as described", className: "bg-signal/10 text-signal border-signal/40" },
};

export default function DiscoverSearch() {
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
        setError(data.error ?? "Something went wrong.");
        setResult(null);
        return;
      }
      setResult(data as DiscoverResult);
      setLastQuery(promptText);
    } catch {
      setError("Could not reach the feasibility service.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Search bar — sticky, storefront-style: dark bar + bright signal CTA */}
      <form
        onSubmit={handleSubmit}
        className="sticky top-[72px] z-10 flex gap-0 border border-rule-strong bg-surface p-1 shadow-lg"
      >
        <input
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          minLength={10}
          required
          placeholder="What do you want your AI agent to do?"
          className="flex-1 bg-deep px-4 py-3 font-body text-sm text-ink placeholder:text-dim focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || promptText.trim().length < 10}
          className="bg-signal hover:bg-signal-dark px-6 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-colors disabled:opacity-40"
        >
          {loading ? "Building…" : "Search"}
        </button>
      </form>

      {error && (
        <div className="mt-6 border border-signal/40 bg-signal/10 p-4 font-body text-sm text-signal">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-10 animate-pulse text-center font-mono text-[11px] uppercase tracking-wider text-muted">
          Generating your feasibility study…
        </div>
      )}

      {result && !loading && (
        <div className="mt-10">
          {/* Breadcrumb */}
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
            <Link href="/agents" className="hover:text-ink transition-colors">Agent Store</Link>
            {" / "}
            <span>Discover</span>
            {" / "}
            <span className="text-ink normal-case tracking-normal">{result.study.agentName}</span>
          </p>

          <p className="mt-2 font-mono text-[11px] text-dim">
            Generated for: &ldquo;{lastQuery}&rdquo;
          </p>

          <div className="mt-6 grid gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            {/* Left: concept preview card (no real image generation — labeled honestly) */}
            <div className="flex aspect-square items-center justify-center border border-rule bg-gradient-to-br from-surface to-deep p-6">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lift font-serif text-2xl font-bold text-ink">
                  {result.study.agentName.slice(0, 1).toUpperCase()}
                </div>
                <p className="mt-3 font-sans text-sm font-medium text-ink">{result.study.agentName}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted">Concept preview — not a real screenshot</p>
              </div>
            </div>

            {/* Right: buybox */}
            <div>
              <h1 className="font-serif text-2xl font-bold text-ink tracking-tight">{result.study.agentName}</h1>

              <span
                className={`mt-3 inline-block border px-3 py-1 font-mono text-[11px] uppercase tracking-wider ${VERDICT_STYLE[result.study.feasibility].className}`}
              >
                {VERDICT_STYLE[result.study.feasibility].label}
              </span>

              <p className="mt-4 font-body text-[15px] leading-[1.75] text-ink/75">{result.study.verdictSummary}</p>

              <div className="mt-6 border border-rule bg-surface p-4">
                <p className="font-serif text-3xl font-bold text-ink">${result.quote.quotedPriceUSD.toFixed(2)}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                  Region: {result.quote.geoRegion} · {result.quote.breakdown.expertiseTier} tier ·{" "}
                  {result.quote.breakdown.estimatedHumanHours}hr estimated oversight
                </p>
                <p className="mt-3 font-mono text-[11px] leading-relaxed text-dim">
                  This is a feasibility study and price estimate only — no order has
                  been placed.{" "}
                  <Link href="/agents/pricing" className="text-signal hover:text-ink transition-colors">
                    See how this is calculated
                  </Link>
                  .
                </p>
              </div>

              {result.study.capabilities.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-mono text-[11px] uppercase tracking-wider text-muted">About this agent</h2>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 font-body text-sm text-ink/80">
                    {result.study.capabilities.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.study.risks.length > 0 && (
                <div className="mt-6 border border-amber/40 bg-amber/10 p-4">
                  <h2 className="font-mono text-[11px] uppercase tracking-wider text-amber">Risks &amp; open questions</h2>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 font-body text-sm text-ink/80">
                    {result.study.risks.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.study.assumptions.length > 0 && (
                <div className="mt-5">
                  <h2 className="font-mono text-[10px] uppercase tracking-wider text-dim">Assumptions made</h2>
                  <ul className="mt-2 list-disc space-y-1 pl-5 font-mono text-[11px] text-dim">
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
