import type { Metadata } from "next";
import CmsLink from "@/components/CmsLink";
import SignalPageShell from "@/components/signal/SignalPageShell";
import SignalAgentIntakeForm from "@/components/agent-signal/SignalAgentIntakeForm";
import { getAgentStorePage } from "@/lib/sanity/agentPages";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAgentStorePage();
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

export default async function AgentsPage() {
  const page = await getAgentStorePage();
  return (
    <SignalPageShell>
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center gap-4 text-[11px] uppercase tracking-[0.25em]" style={{ color: "var(--hvg-ember-strong)", fontFamily: "var(--hvg-font-mono)" }}>
          <span className="h-px w-8" style={{ background: "var(--hvg-ember)" }} /> {page.eyebrow}
        </div>

        <h1 className="text-4xl font-bold tracking-tight" style={{ color: "var(--hvg-text-primary)" }}>{page.heading}</h1>
        <p className="mt-5 text-[16px] leading-[1.8]" style={{ color: "var(--hvg-text-secondary)" }}>
          {page.introLead}{" "}
          <CmsLink link={page.pricingAction} className="text-[color:var(--hvg-ember)] transition-colors hover:text-[color:var(--hvg-ember-strong)]">
            {page.pricingAction.label}
          </CmsLink>
          {page.introMiddle}{" "}
          <CmsLink link={page.discoverAction} className="text-[color:var(--hvg-ember)] transition-colors hover:text-[color:var(--hvg-ember-strong)]">
            {page.discoverAction.label}
          </CmsLink>{" "}
          {page.introTail}
        </p>

        <div className="mt-10">
          <SignalAgentIntakeForm copy={page.formCopy} />
        </div>
      </div>
    </SignalPageShell>
  );
}
