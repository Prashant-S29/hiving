"use client";

import { useState } from "react";
import type { QuoteBreakdown } from "@/lib/pricing-engine";

export default function AgentIntakeForm() {
  const [promptText, setPromptText] = useState("");
  const [quote, setQuote] = useState<QuoteBreakdown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setQuote(null);
    setLoading(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setQuote(data as QuoteBreakdown);
    } catch {
      setError("Could not reach the quote service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="promptText" className="block font-mono text-[11px] uppercase tracking-wider text-muted">
          Describe the agent you want
        </label>
        <textarea
          id="promptText"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          rows={5}
          minLength={10}
          required
          placeholder="e.g. An agent that reads incoming support emails, classifies urgency, drafts a reply, and escalates production issues to Slack."
          className="w-full border border-rule-strong bg-surface p-3 font-body text-sm text-ink placeholder:text-dim focus:border-signal focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || promptText.trim().length < 10}
          className="bg-signal hover:bg-signal-dark px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-colors disabled:opacity-40"
        >
          {loading ? "Getting quote…" : "Get a quote"}
        </button>
      </form>

      {error && <p className="mt-4 font-body text-sm text-signal">{error}</p>}

      {quote && (
        <div className="mt-6 border border-rule bg-surface p-5">
          <p className="font-serif text-3xl font-bold text-ink">${quote.quotedPriceUSD.toFixed(2)}</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">Region: {quote.geoRegion}</p>

          <dl className="mt-5 grid grid-cols-2 gap-y-2 border-t border-rule pt-4 text-sm">
            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Model</dt>
            <dd className="text-ink">{quote.breakdown.modelUsed}</dd>

            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Estimated tokens</dt>
            <dd className="text-ink">{quote.breakdown.estimatedTokens.toLocaleString()}</dd>

            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Estimated human hours</dt>
            <dd className="text-ink">{quote.breakdown.estimatedHumanHours}</dd>

            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Expertise tier</dt>
            <dd className="text-ink">{quote.breakdown.expertiseTier}</dd>

            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Model credits cost</dt>
            <dd className="text-ink">${quote.modelCreditsCostUSD.toFixed(2)}</dd>

            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Human hours cost</dt>
            <dd className="text-ink">${quote.humanHoursCostUSD.toFixed(2)}</dd>
          </dl>

          <p className="mt-4 font-mono text-[11px] leading-relaxed text-dim">
            This is a quote only — no order or payment has been captured. Order capture
            without live checkout is a v1 follow-up per BUILD_BRIEF.md Day 3.
          </p>
        </div>
      )}
    </div>
  );
}
