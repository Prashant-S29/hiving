import type { Metadata } from "next";
import DiscoverSearch from "@/components/DiscoverSearch";

export const metadata: Metadata = {
  title: "Discover — Describe an Agent, Get an Instant Feasibility Study",
  description:
    "Type what you want your AI agent to do and get an instant, AI-generated feasibility study and price estimate.",
};

export default function DiscoverPage() {
  return (
    <section className="pt-32 pb-24 px-6 md:px-12">
    <div className="mx-auto max-w-4xl">
      <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-signal mb-5 flex items-center gap-4">
        <span className="w-8 h-px bg-signal" /> AI-generated, instant
      </div>

      <h1 className="font-serif text-4xl font-bold text-ink tracking-tight">Discover</h1>
      <p className="mt-4 max-w-2xl font-body text-[16px] leading-[1.8] text-ink/75">
        Describe what you want in plain language. We&apos;ll tell you honestly
        whether it&apos;s buildable, and generate a full feasibility page for it —
        instantly.
      </p>

      <div className="mt-10">
        <DiscoverSearch />
      </div>
    </div>
    </section>
  );
}
