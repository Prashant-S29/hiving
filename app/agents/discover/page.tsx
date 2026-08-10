import type { Metadata } from "next";
import DiscoverSearch from "@/components/DiscoverSearch";
import { getAgentDiscoverPage } from "@/lib/sanity/agentPages";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAgentDiscoverPage();
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

export default async function DiscoverPage() {
  const page = await getAgentDiscoverPage();
  return (
    <section className="pt-32 pb-24 px-6 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-signal mb-5 flex items-center gap-4">
          <span className="w-8 h-px bg-signal" /> {page.eyebrow}
        </div>

        <h1 className="font-serif text-4xl font-bold text-ink tracking-tight">{page.heading}</h1>
        <p className="mt-4 max-w-2xl font-body text-[16px] leading-[1.8] text-ink/75">{page.introduction}</p>

        <div className="mt-10">
          <DiscoverSearch copy={page.interfaceCopy} />
        </div>
      </div>
    </section>
  );
}
