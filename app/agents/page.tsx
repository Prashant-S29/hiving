import type { Metadata } from "next";
import Link from "next/link";
import AgentIntakeForm from "@/components/AgentIntakeForm";

export const metadata: Metadata = {
  title: "Agent Store — Order a Custom AI Agent",
  description:
    "Describe the AI agent you want, get a geo-adjusted price quote built from model credits and human oversight hours, and order a tested, deployed agent.",
};

export default function AgentsPage() {
  return (
    <section className="pt-32 pb-24 px-6 md:px-12">
    <div className="mx-auto max-w-2xl">
      <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-verify mb-5 flex items-center gap-4">
        <span className="w-8 h-px bg-verify" /> Instant quote
      </div>

      <h1 className="font-serif text-4xl font-bold text-ink tracking-tight">The Agent Store</h1>
      <p className="mt-5 font-body text-[16px] leading-[1.8] text-ink/75">
        Describe the AI agent you want in plain language. Hivig estimates the model
        usage and human oversight it will take to build, tests it, and quotes a price
        adjusted for your region —{" "}
        <Link href="/agents/pricing" className="text-signal hover:text-ink transition-colors">
          see how quotes are calculated
        </Link>
        . Prefer a faster, more visual flow?{" "}
        <Link href="/agents/discover" className="text-signal hover:text-ink transition-colors">
          Try Discover
        </Link>{" "}
        for an instant, AI-generated feasibility page.
      </p>

      <div className="mt-10">
        <AgentIntakeForm />
      </div>
    </div>
    </section>
  );
}
