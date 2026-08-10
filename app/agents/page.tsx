import type { Metadata } from "next";
import AgentIntakeForm from "@/components/AgentIntakeForm";
import CmsLink from "@/components/CmsLink";
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
    <section className="pt-32 pb-24 px-6 md:px-12">
      <div className="mx-auto max-w-2xl">
        <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-verify mb-5 flex items-center gap-4">
          <span className="w-8 h-px bg-verify" /> {page.eyebrow}
        </div>

        <h1 className="font-serif text-4xl font-bold text-ink tracking-tight">{page.heading}</h1>
        <p className="mt-5 font-body text-[16px] leading-[1.8] text-ink/75">
          {page.introLead}{" "}
          <CmsLink link={page.pricingAction} className="text-signal hover:text-ink transition-colors">
            {page.pricingAction.label}
          </CmsLink>
          {page.introMiddle}{" "}
          <CmsLink link={page.discoverAction} className="text-signal hover:text-ink transition-colors">
            {page.discoverAction.label}
          </CmsLink>{" "}
          {page.introTail}
        </p>

        <div className="mt-10">
          <AgentIntakeForm copy={page.formCopy} />
        </div>
      </div>
    </section>
  );
}
