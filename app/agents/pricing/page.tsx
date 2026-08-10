import type { Metadata } from "next";
import CmsLink from "@/components/CmsLink";
import { GEO_MULTIPLIER } from "@/lib/pricing-engine";
import { getAgentPricingPage } from "@/lib/sanity/agentPages";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAgentPricingPage();
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

export default async function PricingPage() {
  const page = await getAgentPricingPage();
  return (
    <section className="pt-32 pb-24 px-6 md:px-12">
      <div className="mx-auto max-w-2xl">
        <CmsLink link={page.backAction} className="font-mono text-[11px] uppercase tracking-wider text-signal hover:text-ink transition-colors">
          {page.backAction.label}
        </CmsLink>

        <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-ink tracking-tight">{page.heading}</h1>

        <p className="mt-5 font-body text-[16px] leading-[1.8] text-ink/75">{page.introduction}</p>

        <h2 className="mt-10 font-serif text-xl font-bold text-ink">{page.regionalHeading}</h2>
        <table className="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-rule-strong text-left font-mono text-[11px] uppercase tracking-wider text-muted">
              <th className="py-2 pr-4">{page.regionColumnLabel}</th>
              <th className="py-2 pr-4">{page.multiplierColumnLabel}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(GEO_MULTIPLIER).map(([region, multiplier]) => (
              <tr key={region} className="border-b border-rule">
                <td className="py-2 pr-4 text-ink">{page.regionLabels[region] ?? region}</td>
                <td className="py-2 pr-4 text-ink">{multiplier}{page.multiplierSuffix}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-10 font-mono text-[11px] leading-relaxed text-dim">{page.disclaimer}</p>
      </div>
    </section>
  );
}
