import type { Metadata } from "next";
import SubscribeForm from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "Subscribe",
  description: "The agentic AI brief that matters — platform verdicts, implementation guides, no vendor sponsorships.",
};

export default function SubscribePage() {
  return (
    <section className="pt-32 pb-24 grid md:grid-cols-2 min-h-[80vh]">
      <div className="bg-paper text-void px-6 md:px-14 py-16 flex flex-col justify-center">
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-signal mb-6 flex items-center gap-3">
          <span className="w-6 h-px bg-signal" /> Stay Ahead of the Curve
        </div>
        <h1 className="font-serif text-[40px] md:text-[58px] font-bold tracking-tight leading-[1] mb-6">
          The agentic AI<br />brief that <span className="italic text-signal">matters.</span>
        </h1>
        <p className="font-body text-[15px] leading-[1.85] text-void/75 max-w-[420px]">
          Trusted by engineers, read by architects, and acted on by
          technology leaders. Platform verdicts, implementation guides, and
          clear-eyed takes on where autonomous AI is heading — no hype, no
          agenda, no noise.
        </p>
      </div>

      <div className="bg-void px-6 md:px-14 py-16 flex flex-col justify-center">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-5 block">
          Request early access · hivig.com
        </span>
        <SubscribeForm />
        <div className="font-mono text-[10px] tracking-[0.08em] text-muted mt-5 flex items-center gap-2">
          <span className="text-verify">✓</span> No spam. No vendor-sponsored content. Unsubscribe any time.
        </div>
        <div className="font-mono text-[10px] tracking-[0.08em] text-muted mt-2 flex items-center gap-2">
          <span className="text-verify">✓</span> Written for practitioners. Independent by design.
        </div>
      </div>
    </section>
  );
}
