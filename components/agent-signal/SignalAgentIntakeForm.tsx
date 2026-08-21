"use client";

// components/agent-signal/SignalAgentIntakeForm.tsx
// Signal Room rebuild of components/AgentIntakeForm.tsx.

import { useState } from "react";
import { Button, QuoteCard } from "@hivig/design-system";
import type { QuoteBreakdown, ExpertiseTier } from "@/lib/pricing-engine";
import type { AgentQuoteFormCopy } from "@/lib/sanity/agentPages";

// QuoteCard's expertiseTier prop is capitalized ("Junior"/"Mid"/"Senior");
// the real ExpertiseTier type is lowercase — see
// .claude/skills/hivig-signal-room/SKILL.md for why this mismatch exists.
function capitalizeTier(tier: ExpertiseTier): "Junior" | "Mid" | "Senior" {
  return (tier.charAt(0).toUpperCase() + tier.slice(1)) as "Junior" | "Mid" | "Senior";
}

export default function SignalAgentIntakeForm({ copy }: { copy: AgentQuoteFormCopy }) {
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* QuoteCard/Input/Button are the only real components here — the
            design system has no multi-line text field yet (Input wraps a
            plain <input>), so this reuses its .hvg-field CSS classes
            directly on a <textarea> rather than faking a component that
            doesn't exist. See the project skill for this exact call. */}
        <div className="hvg-field">
          <label htmlFor="promptText" className="hvg-field__label">
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
            className="hvg-field__input resize-y"
          />
        </div>
        <Button type="submit" disabled={loading || promptText.trim().length < 10}>
          {loading ? copy.loadingLabel : copy.submitLabel}
        </Button>
      </form>

      {error && (
        <p className="mt-4 text-sm" style={{ color: "var(--hvg-danger)" }}>
          {error}
        </p>
      )}

      {quote && (
        <div className="mt-6">
          <QuoteCard
            quotedPriceUSD={quote.quotedPriceUSD}
            geoRegion={quote.geoRegion}
            modelUsed={quote.breakdown.modelUsed}
            expertiseTier={capitalizeTier(quote.breakdown.expertiseTier)}
            estimatedTokens={quote.breakdown.estimatedTokens}
            estimatedHumanHours={quote.breakdown.estimatedHumanHours}
            modelCreditsCostUSD={quote.modelCreditsCostUSD}
            humanHoursCostUSD={quote.humanHoursCostUSD}
          />
          <p className="mt-3 text-[11px] leading-relaxed" style={{ color: "var(--hvg-text-dim)", fontFamily: "var(--hvg-font-mono)" }}>
            {copy.quoteDisclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
