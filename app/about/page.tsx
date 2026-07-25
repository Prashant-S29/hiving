import type { Metadata } from "next";
import RevealOnScroll from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "About Hivig",
  description: "The origin, the mission, and the editorial standards behind Hivig.",
};

export default function AboutPage() {
  return (
    <section className="pt-32 pb-24 px-6 md:px-12 max-w-[760px] mx-auto">
      <RevealOnScroll>
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal mb-5">About</div>
        <h1 className="font-serif text-[40px] md:text-[58px] font-bold tracking-tight leading-[1.05] mb-10">
          About <span className="italic text-signal">Hivig</span>
        </h1>

        <div className="font-body text-[16px] leading-[1.9] text-ink/75 space-y-6">
          <p>
            Hivig is an independent intelligence platform covering agentic
            AI: autonomous systems built on platforms like AWS Bedrock,
            Salesforce Agentforce, Microsoft Copilot Studio, and Google
            Gemini. The name comes from Hi-Technology plus Vigilance, and
            that combination is the operating principle behind everything
            published here.
          </p>
          <p>
            Every model, agent, and vendor covered on this platform receives
            the same treatment: an independently produced score, an
            explicit breakdown of evidence versus marketing claim, and a
            visible last-reviewed date. Hivig accepts no payment in
            exchange for ranking, placement, or favourable coverage of any
            model, agent, or vendor. That line does not move regardless of
            how large the company on the other side of it happens to be.
          </p>
          <p>
            Hivig is published by Naganarai Media Tech Private Limited,
            registered under trademark Class 42 in India. The trademark
            covers computer programming, software design, systems analysis,
            and technological research, which is the same scope that
            underpins both the editorial work published here and the
            consultancy services offered separately.
          </p>

          <h2 className="font-serif text-[26px] font-bold text-ink pt-4">Editorial Standards</h2>
          <p>
            Every guide published on Hivig is tested in a real environment
            before publication. Every benchmark claim traces to a named,
            verifiable source. Corrections, when needed, are made visibly
            rather than silently edited away.
          </p>

          <h2 className="font-serif text-[26px] font-bold text-ink pt-4">Write for Hivig</h2>
          <p>
            Hivig is building a network of verified expert contributors —
            practitioners and consultants who publish verdicts and case
            studies under their own name and credentials. If that&rsquo;s
            you, reach out through the subscribe page and mention you&rsquo;d
            like to contribute.
          </p>
        </div>
      </RevealOnScroll>
    </section>
  );
}
