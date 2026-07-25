import Link from "next/link";
import type { Metadata } from "next";
import RevealOnScroll from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "Hivig Consulting",
  description: "Helping brands design and deploy production-grade AI agents across AWS, Copilot, Agentforce, Gemini, and beyond.",
};

const SERVICES = [
  { title: "Readiness Assessment", desc: "A 2–4 week engagement that audits your stack, data, and security posture, and tells you exactly where agents create value." },
  { title: "Agent Architecture & Design", desc: "Platform-agnostic design of your agent's reasoning loop, tool use, memory, and escalation paths." },
  { title: "Agent Build & Deployment", desc: "Hands-on implementation across AWS Bedrock, Agentforce, Copilot Studio, Gemini, or open-source frameworks." },
  { title: "LLM & Platform Evaluation", desc: "A reproducible, structured evaluation of candidate platforms for your specific use case." },
  { title: "AI Agent Governance & Safety", desc: "Policy, audit logging, escalation design, and compliance mapping for regulated environments." },
  { title: "Team Enablement & Training", desc: "Workshops and executive briefings so your team can run what gets built." },
];

export default function ConsultancyPage() {
  return (
    <section className="pt-32 pb-24">
      <div className="px-6 md:px-12 max-w-content mx-auto">
        <RevealOnScroll className="max-w-[700px] mb-16">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal mb-5">Hivig Consulting</div>
          <h1 className="font-serif text-[40px] md:text-[58px] font-bold tracking-tight leading-[1.05] mb-7">
            Independent expertise. <span className="italic text-signal">Implementation that ships.</span>
          </h1>
          <p className="font-body text-[16px] leading-[1.85] text-ink/70">
            The same independent rigour behind every Hivig verdict, applied
            directly to your organisation. We are not partnered with any
            single platform, which means our recommendation is the one
            that actually fits your stack — not the one that pays the best
            referral fee.
          </p>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-px bg-rule mb-16">
          {SERVICES.map((s, i) => (
            <RevealOnScroll key={s.title} delayMs={i * 60} className="bg-void p-8 hover:bg-deep transition-colors">
              <h3 className="font-serif text-[20px] font-bold mb-3">{s.title}</h3>
              <p className="text-[13px] text-muted leading-[1.7]">{s.desc}</p>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll className="bg-surface border border-rule p-10 md:p-14 text-center">
          <h2 className="font-serif text-[28px] font-bold mb-4">Tell us what you&rsquo;re building.</h2>
          <p className="font-body text-[14px] text-muted mb-8 max-w-[480px] mx-auto">
            We typically respond within 48 hours to discuss scope, timeline,
            and whether Hivig is the right fit for what you need.
          </p>
          <Link
            href="/subscribe"
            className="bg-signal hover:bg-signal-dark text-white font-sans text-[13px] font-bold uppercase tracking-[0.1em] px-9 py-[16px] inline-block transition-colors"
          >
            Enquire Now →
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
