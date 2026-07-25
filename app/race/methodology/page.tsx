import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ranking Methodology",
  description: "How Hivig computes AI model rankings for The Race — current status, and what a defensible formula still needs to define.",
};

export default function MethodologyPage() {
  return (
    <section className="pt-32 pb-24 px-6 md:px-12">
    <div className="mx-auto max-w-2xl">
      <Link href="/race" className="font-mono text-[11px] uppercase tracking-wider text-signal hover:text-ink transition-colors">
        ← Back to The Race
      </Link>

      <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-ink tracking-tight">Ranking methodology</h1>

      <p className="mt-6 border border-amber/40 bg-amber/10 p-4 font-body text-[15px] leading-[1.8] text-ink/85">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-amber block mb-2">Current status: placeholder</span>
        Rankings are sorted by release date (newest first) so the field is
        well-defined, not because that is a credible ranking signal. Treat
        every rank shown on Hivig as illustrative until this page describes a
        real, sourced formula.
      </p>

      <h2 className="mt-10 font-serif text-xl font-bold text-ink">What the real methodology needs to define</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 font-body text-[15px] leading-[1.7] text-ink/75">
        <li>Which benchmarks count, and how they&apos;re weighted (e.g. LMSYS Chatbot Arena Elo, Artificial Analysis quality index, task-specific evals).</li>
        <li>How ties and missing benchmark data are handled.</li>
        <li>Refresh cadence and a staleness rule, matched to the 72-hour data refresh.</li>
        <li>What counts as the &quot;same model&quot; across dated snapshot releases, so a rank delta means something consistent.</li>
      </ul>

      <p className="mt-10 font-mono text-[11px] uppercase tracking-wider text-muted">
        Full detail lives in <code className="normal-case tracking-normal text-ink/70">RANKING_METHODOLOGY.md</code> in the project source.
      </p>
    </div>
    </section>
  );
}
