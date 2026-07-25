import type { Metadata } from "next";
import RevealOnScroll from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "The Hivig Manifesto",
  description: "Hi-Technology plus Vigilance. Why Hivig exists, and the four principles it operates by.",
};

export default function ManifestoPage() {
  return (
    <div className="pt-32">
      <section className="bg-void px-6 md:px-12 py-20 relative overflow-hidden">
        <RevealOnScroll className="max-w-content mx-auto">
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal mb-8 flex items-center gap-4">
            <span className="w-7 h-px bg-signal" /> The Hivig Manifesto
          </div>
          <p className="font-serif text-[32px] md:text-[60px] font-bold leading-[1.05] tracking-tight max-w-[820px]">
            The agentic AI space has enough noise. We bring <span className="italic text-signal">signal.</span>
          </p>
        </RevealOnScroll>
      </section>

      <section className="grid md:grid-cols-2">
        <RevealOnScroll className="bg-paper text-void px-6 md:px-12 py-16 border-r border-void/10">
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-signal mb-7 pb-4 border-b-2 border-void">
            The Name. The Mandate.
          </div>
          <div className="space-y-4 mb-9">
            <EtymRow term="Hi" def="Hi-Technology — precision, advancement, and the relentless forward motion of machine intelligence." />
            <EtymRow term="Vig" def="Vigilance — the act of keeping careful watch. Not passive observation. Active, purposeful scrutiny." />
          </div>
          <div className="flex items-center gap-4 pt-5">
            <span className="font-serif text-4xl text-void/20">=</span>
            <div>
              <div className="font-serif text-[36px] font-bold tracking-tight"><span className="italic text-signal">Hi</span>vig</div>
              <div className="font-mono text-[11px] text-void/50 tracking-[0.1em] mt-1">A mandate, not a portmanteau</div>
            </div>
          </div>
          <div className="bg-void text-paper p-7 border-l-[3px] border-signal mt-9">
            <p className="font-serif italic text-[18px] leading-[1.65] mb-3">
              &ldquo;Speed of deployment is not the same as readiness. The
              platforms racing to ship agents need watchdogs, not
              cheerleaders. That watchdog is Hivig.&rdquo;
            </p>
            <cite className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted not-italic">
              — Hivig Editorial Position
            </cite>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={100} className="bg-cream text-void px-6 md:px-12 py-16">
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-signal mb-7 pb-4 border-b-2 border-void">
            Why This Publication Exists
          </div>
          <div className="space-y-5 font-body text-[15.5px] leading-[1.9] text-void/85">
            <p className="text-[18px] italic text-void border-l-[3px] border-signal pl-5">
              The agentic AI revolution does not need more hype. It needs
              more honesty. The gap between what platforms claim in press
              releases and what developers experience in production is
              wide, and growing wider by the week.
            </p>
            <p>
              Hivig was founded to close that gap. <strong>We believe the
              most important thing any publication can be in this space is
              trustworthy.</strong> That means we will tell you when an LLM
              underperforms its marketing. It means we will critique a
              platform that ships recklessly, regardless of that
              company&rsquo;s advertising budget. It means we take the
              relationship between artificial intelligence and human beings
              seriously, not as a philosophical exercise but as an ethical
              obligation.
            </p>
            <p>
              It also means we will champion genuine breakthroughs with{" "}
              <span className="text-signal italic">real enthusiasm</span>,
              because this technology, deployed responsibly and
              intelligently, has the potential to compress decades of human
              progress into years. We are{" "}
              <strong>optimists. Rigorous, well-informed,
              uncompromising optimists.</strong>
            </p>
            <p>
              The work speaks. Every article we publish is a proof of
              intent. Every verdict we issue is a test of our integrity.
              Come back in six months. Come back in two years. Judge us by
              what we&rsquo;ve built.
            </p>
          </div>
        </RevealOnScroll>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 border-t border-rule">
        <Principle num="01 · Truth First" title="Factually Unimpeachable" body="Every claim is verified. Every benchmark is reproducible. If we get something wrong, we correct it visibly and without equivocation." />
        <Principle num="02 · Voice" title="Opinionated When It Earns It" body="We are not neutral for neutrality's sake. We form views, carefully and evidentially, and we state them plainly." />
        <Principle num="03 · Ethics" title="AI & Humanity, Honestly" body="We write about the relationship between artificial intelligence and human beings as if it actually matters. Because it does." />
        <Principle num="04 · Independence" title="No Allegiance. No Platform." body="We cover every major platform with identical rigour. We are not on anyone's payroll. Our readers are our only constituency." />
      </section>
    </div>
  );
}

function EtymRow({ term, def }: { term: string; def: string }) {
  return (
    <div className="flex items-baseline gap-4 py-3 border-b border-void/10">
      <div className="font-serif text-[30px] font-bold text-signal min-w-[64px]">{term}</div>
      <div className="font-body text-[14px] text-void/80 leading-snug">{def}</div>
    </div>
  );
}

function Principle({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <RevealOnScroll className="px-7 py-10 border-r border-rule last:border-r-0 hover:bg-surface transition-colors">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-signal mb-3.5">{num}</div>
      <h3 className="font-serif text-[21px] font-bold mb-3 leading-snug">{title}</h3>
      <p className="text-[13px] text-muted leading-[1.75]">{body}</p>
    </RevealOnScroll>
  );
}
