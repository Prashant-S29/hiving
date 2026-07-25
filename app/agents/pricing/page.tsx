import type { Metadata } from "next";
import Link from "next/link";
import { GEO_MULTIPLIER } from "@/lib/pricing-engine";

export const metadata: Metadata = {
  title: "How Agent Store Pricing Works",
  description: "How Hivig quotes custom AI agent builds: model credits, human oversight hours, markup, and regional (PPP-adjusted) pricing.",
};

const REGION_LABELS: Record<string, string> = {
  US: "United States",
  EU: "European Union",
  IN: "India",
  DEFAULT: "Rest of world",
};

export default function PricingPage() {
  return (
    <section className="pt-32 pb-24 px-6 md:px-12">
    <div className="mx-auto max-w-2xl">
      <Link href="/agents" className="font-mono text-[11px] uppercase tracking-wider text-signal hover:text-ink transition-colors">
        ← Back to the Agent Store
      </Link>

      <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-ink tracking-tight">How pricing works</h1>

      <p className="mt-5 font-body text-[16px] leading-[1.8] text-ink/75">
        As of today, a quote is built from four steps: (1) classify your request into
        estimated model tokens, human oversight hours (10–180hr band), and an
        expertise tier; (2) compute internal cost = model credits at actual API cost +
        human hours × loaded hourly rate; (3) apply a markup for margin; (4) apply a
        regional multiplier, PPP-adjusted like Netflix or Spotify regional pricing.
      </p>

      <h2 className="mt-10 font-serif text-xl font-bold text-ink">Regional multiplier</h2>
      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-rule-strong text-left font-mono text-[11px] uppercase tracking-wider text-muted">
            <th className="py-2 pr-4">Region</th>
            <th className="py-2 pr-4">Multiplier</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(GEO_MULTIPLIER).map(([region, multiplier]) => (
            <tr key={region} className="border-b border-rule">
              <td className="py-2 pr-4 text-ink">{REGION_LABELS[region] ?? region}</td>
              <td className="py-2 pr-4 text-ink">{multiplier}×</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-10 font-mono text-[11px] leading-relaxed text-dim">
        Pricing is regional and non-transferable — see BUILD_BRIEF.md section 5 for
        the ToS and VPN-arbitrage note before this goes live with real payment
        methods, since IP-based geo alone can be bypassed the way Netflix handles with
        payment-method/billing-country checks.
      </p>
    </div>
    </section>
  );
}
