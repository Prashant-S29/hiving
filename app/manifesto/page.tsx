import type { Metadata } from "next";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getManifestoPage } from "@/lib/sanity/companyPages";

const manifestoBodyComponents: PortableTextComponents = {
  block: { normal: ({ children }) => <p>{children}</p> },
  marks: {
    signal: ({ children }) => <span className="text-signal italic">{children}</span>,
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getManifestoPage();
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo.openGraphTitle || seo.metaTitle,
      description: seo.openGraphDescription || seo.metaDescription,
      images: seo.openGraphImageUrl ? [{ url: seo.openGraphImageUrl }] : undefined,
    },
  };
}

export default async function ManifestoPage() {
  const page = await getManifestoPage();
  const equationEmphasis = page.equationEmphasis || "";
  const equationRemainder = page.equationWord.startsWith(equationEmphasis)
    ? page.equationWord.slice(equationEmphasis.length)
    : page.equationWord;

  return (
    <div className="pt-32">
      <section className="bg-void px-6 md:px-12 py-20 relative overflow-hidden">
        <RevealOnScroll className="max-w-content mx-auto">
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal mb-8 flex items-center gap-4">
            <span className="w-7 h-px bg-signal" /> {page.eyebrow}
          </div>
          <p className="font-serif text-[32px] md:text-[60px] font-bold leading-[1.05] tracking-tight max-w-[820px]">
            {page.heading} <span className="italic text-signal">{page.headingEmphasis}</span>
          </p>
        </RevealOnScroll>
      </section>

      <section className="grid md:grid-cols-2">
        <RevealOnScroll className="bg-paper text-void px-6 md:px-12 py-16 border-r border-void/10">
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-signal mb-7 pb-4 border-b-2 border-void">
            {page.nameSectionTitle}
          </div>
          <div className="space-y-4 mb-9">
            {page.etymology.map((item) => (
              <EtymRow key={item._key || item.term} term={item.term} def={item.definition} />
            ))}
          </div>
          <div className="flex items-center gap-4 pt-5">
            <span className="font-serif text-4xl text-void/20">=</span>
            <div>
              <div className="font-serif text-[36px] font-bold tracking-tight">
                {equationEmphasis && <span className="italic text-signal">{equationEmphasis}</span>}
                {equationRemainder}
              </div>
              <div className="font-mono text-[11px] text-void/50 tracking-[0.1em] mt-1">{page.equationCaption}</div>
            </div>
          </div>
          <div className="bg-void text-paper p-7 border-l-[3px] border-signal mt-9">
            <p className="font-serif italic text-[18px] leading-[1.65] mb-3">
              &ldquo;{page.positionQuote}&rdquo;
            </p>
            <cite className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted not-italic">
              {page.positionAttribution}
            </cite>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={100} className="bg-cream text-void px-6 md:px-12 py-16">
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-signal mb-7 pb-4 border-b-2 border-void">
            {page.whySectionTitle}
          </div>
          <div className="space-y-5 font-body text-[15.5px] leading-[1.9] text-void/85">
            <p className="text-[18px] italic text-void border-l-[3px] border-signal pl-5">
              {page.whyLead}
            </p>
            <PortableText value={page.whyBody} components={manifestoBodyComponents} />
          </div>
        </RevealOnScroll>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 border-t border-rule">
        {page.principles.map((principle) => (
          <Principle
            key={principle._key || principle.number}
            num={principle.number}
            title={principle.title}
            body={principle.body}
          />
        ))}
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
