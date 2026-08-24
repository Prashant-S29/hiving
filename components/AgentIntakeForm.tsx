"use client";

import { useState } from "react";
import type { QuoteBreakdown } from "@/lib/pricing-engine";
import type { AgentQuoteFormCopy } from "@/lib/sanity/agentPages";

export default function AgentIntakeForm({ copy }: { copy: AgentQuoteFormCopy }) {
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
        setError(copy.fallbackError);
        return;
      }
      setQuote(data as QuoteBreakdown);
    } catch {
      setError(copy.networkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="promptText" className="block font-mono text-[11px] uppercase tracking-wider text-muted">
          {copy.promptLabel}
        </label>
        <textarea
          id="promptText"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          rows={5}
          minLength={10}
          required
          placeholder={copy.promptPlaceholder}
          className="w-full border border-rule-strong bg-surface p-3 font-body text-sm text-ink placeholder:text-dim focus:border-signal focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || promptText.trim().length < 10}
          className="rounded-lg bg-signal hover:bg-signal-dark px-5 py-2.5 font-cta text-[13px] font-bold text-[#241912] hover:text-white transition-colors disabled:opacity-40"
        >
          {loading ? copy.loadingLabel : copy.submitLabel}
        </button>
      </form>

      {error && <p className="mt-4 font-body text-sm text-signal">{error}</p>}

      {quote && (
        <div className="mt-6 border border-rule bg-surface p-5">
          <p className="font-serif text-3xl font-bold text-ink">${quote.quotedPriceUSD.toFixed(2)}</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">{copy.regionLabel}: {quote.geoRegion}</p>

          <dl className="mt-5 grid grid-cols-2 gap-y-2 border-t border-rule pt-4 text-sm">
            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{copy.modelLabel}</dt>
            <dd className="text-ink">{quote.breakdown.modelUsed}</dd>

            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{copy.tokensLabel}</dt>
            <dd className="text-ink">{quote.breakdown.estimatedTokens.toLocaleString()}</dd>

            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{copy.hoursLabel}</dt>
            <dd className="text-ink">{quote.breakdown.estimatedHumanHours}</dd>

            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{copy.tierLabel}</dt>
            <dd className="text-ink">{quote.breakdown.expertiseTier}</dd>

            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{copy.modelCostLabel}</dt>
            <dd className="text-ink">${quote.modelCreditsCostUSD.toFixed(2)}</dd>

            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{copy.humanCostLabel}</dt>
            <dd className="text-ink">${quote.humanHoursCostUSD.toFixed(2)}</dd>
          </dl>

          <p className="mt-4 font-mono text-[11px] leading-relaxed text-dim">
            {copy.quoteDisclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
