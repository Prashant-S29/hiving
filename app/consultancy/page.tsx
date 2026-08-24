import type { Metadata } from "next";
import CmsLink from "@/components/CmsLink";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getConsultancyPage } from "@/lib/sanity/conversionPages";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getConsultancyPage();
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

export default async function ConsultancyPage() {
  const page = await getConsultancyPage();

  return (
    <section className="pt-32 pb-24">
      <div className="px-6 md:px-12 max-w-content mx-auto">
        <RevealOnScroll className="max-w-[700px] mb-16">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal mb-5">{page.eyebrow}</div>
          <h1 className="font-serif text-[40px] md:text-[58px] font-bold tracking-tight leading-[1.05] mb-7">
            {page.heading} <span className="italic text-signal">{page.headingEmphasis}</span>
          </h1>
          <p className="font-body text-[16px] leading-[1.85] text-ink/70">{page.introduction}</p>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-px bg-rule mb-16">
          {page.services.map((service, index) => (
            <RevealOnScroll key={service._key || service.title} delayMs={index * 60} className="bg-void p-8 hover:bg-deep transition-colors">
              <h3 className="font-serif text-[20px] font-bold mb-3">{service.title}</h3>
              <p className="text-[13px] text-muted leading-[1.7]">{service.description}</p>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll className="bg-surface border border-rule p-10 md:p-14 text-center">
          <h2 className="font-serif text-[28px] font-bold mb-4">{page.ctaHeading}</h2>
          <p className="font-body text-[14px] text-muted mb-8 max-w-[480px] mx-auto">{page.ctaBody}</p>
          <CmsLink
            link={page.ctaAction}
            className="rounded-lg bg-signal hover:bg-signal-dark text-[#241912] hover:text-white font-cta text-[15px] font-bold px-9 py-[16px] inline-block transition-colors"
          >
            {page.ctaAction.label}
          </CmsLink>
        </RevealOnScroll>
      </div>
    </section>
  );
}
