import type { Metadata } from "next";
import CmsLink from "@/components/CmsLink";
import SignalPageShell from "@/components/signal/SignalPageShell";
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
    <SignalPageShell>
      <div className="mx-auto max-w-2xl">
        <CmsLink
          link={page.backAction}
          className="text-[11px] uppercase tracking-wider text-[color:var(--hvg-ember)] transition-colors hover:text-[color:var(--hvg-ember-strong)] font-[family-name:var(--hvg-font-mono)]"
        >
          {page.backAction.label}
        </CmsLink>

        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "var(--hvg-text-primary)" }}>{page.heading}</h1>

        <p className="mt-5 text-[16px] leading-[1.8]" style={{ color: "var(--hvg-text-secondary)" }}>{page.introduction}</p>

        <h2 className="mt-10 text-xl font-bold" style={{ color: "var(--hvg-text-primary)" }}>{page.regionalHeading}</h2>
        <table className="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left text-[11px] uppercase tracking-wider" style={{ borderColor: "var(--hvg-border-strong)", color: "var(--hvg-text-muted)", fontFamily: "var(--hvg-font-mono)" }}>
              <th className="py-2 pr-4">{page.regionColumnLabel}</th>
              <th className="py-2 pr-4">{page.multiplierColumnLabel}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(GEO_MULTIPLIER).map(([region, multiplier]) => (
              <tr key={region} className="border-b" style={{ borderColor: "var(--hvg-border)" }}>
                <td className="py-2 pr-4" style={{ color: "var(--hvg-text-primary)" }}>{page.regionLabels[region] ?? region}</td>
                <td className="py-2 pr-4" style={{ color: "var(--hvg-text-primary)" }}>{multiplier}{page.multiplierSuffix}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-10 text-[11px] leading-relaxed" style={{ color: "var(--hvg-text-dim)", fontFamily: "var(--hvg-font-mono)" }}>{page.disclaimer}</p>
      </div>
    </SignalPageShell>
  );
}
