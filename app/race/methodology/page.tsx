import type { Metadata } from "next";
import CmsLink from "@/components/CmsLink";
import { getRaceSettings } from "@/lib/sanity/race";

export async function generateMetadata(): Promise<Metadata> {
  const { methodologySeo: seo } = await getRaceSettings();
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

export default async function MethodologyPage() {
  const page = await getRaceSettings();
  const informationTone = page.methodologyNotice.tone === "information";
  return (
    <section className="pt-32 pb-24 px-6 md:px-12">
      <div className="mx-auto max-w-2xl">
        <CmsLink link={page.methodologyBackAction} className="font-mono text-[11px] uppercase tracking-wider text-signal hover:text-ink transition-colors">
          {page.methodologyBackAction.label}
        </CmsLink>

        <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-ink tracking-tight">{page.methodologyHeading}</h1>

        <div className={`mt-6 border p-4 font-body text-[15px] leading-[1.8] text-ink/85 ${informationTone ? "border-verify/40 bg-verify/10" : "border-amber/40 bg-amber/10"}`}>
          <span className={`font-mono text-[10px] uppercase tracking-[0.15em] block mb-2 ${informationTone ? "text-verify" : "text-amber"}`}>
            {page.methodologyNotice.label}
          </span>
          {page.methodologyNotice.body}
        </div>

        <h2 className="mt-10 font-serif text-xl font-bold text-ink">{page.methodologyNeedsHeading}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 font-body text-[15px] leading-[1.7] text-ink/75">
          {page.methodologyNeeds.map((item) => <li key={item}>{item}</li>)}
        </ul>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-wider text-muted">{page.methodologySourceNote}</p>
      </div>
    </section>
  );
}
