import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CmsLink from "@/components/CmsLink";
import { applyTemplate, getRaceModelBySlug, getRaceModels, getRaceSettings, type RaceModel } from "@/lib/sanity/race";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const models = await getRaceModels();
  return models.map((model) => ({ slug: model.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [model, settings] = await Promise.all([getRaceModelBySlug(params.slug), getRaceSettings()]);
  if (!model) return { title: settings.modelNotFoundTitle };
  const title = model.seo?.metaTitle || applyTemplate(settings.modelSeoTitleTemplate, { model: model.model_name });
  const description = model.seo?.metaDescription || applyTemplate(settings.modelSeoDescriptionTemplate, {
    model: model.model_name,
    organization: model.org_name,
    country: model.org_country,
    releaseDate: model.release_date,
  });
  return {
    title,
    description,
    alternates: model.seo?.canonicalUrl ? { canonical: model.seo.canonicalUrl } : undefined,
    robots: model.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: model.seo?.openGraphTitle || title,
      description: model.seo?.openGraphDescription || description,
      images: model.seo?.openGraphImageUrl ? [{ url: model.seo.openGraphImageUrl }] : undefined,
    },
  };
}

function softwareApplicationJsonLd(model: RaceModel, applicationCategory: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: model.model_name,
    applicationCategory,
    creator: { "@type": "Organization", name: model.org_name },
    countryOfOrigin: model.org_country,
    datePublished: model.release_date,
    dateModified: model.last_updated,
  };
}

export default async function ModelPage({ params }: PageProps) {
  const [model, settings] = await Promise.all([getRaceModelBySlug(params.slug), getRaceSettings()]);
  if (!model) notFound();
  const introduction = applyTemplate(settings.modelIntroductionTemplate, {
    model: model.model_name,
    type: model.model_type,
    organization: model.org_name,
    country: model.org_country,
    releaseDate: model.release_date,
    rank: model.rank_current,
  });
  const verificationLabel = {
    unverified: settings.unverifiedStatusLabel,
    review: settings.reviewStatusLabel,
    verified: settings.verifiedStatusLabel,
  }[model.verificationStatus];
  const marketStatus = model.market_status.is_public
    ? applyTemplate(settings.publicMarketTemplate, {
        exchange: model.market_status.exchange || "",
        ticker: model.market_status.ticker || "",
      })
    : model.market_status.last_funding_round || settings.privateMarketFallback;
  const jsonLd = JSON.stringify(softwareApplicationJsonLd(model, settings.applicationCategory)).replace(/</g, "\\u003c");

  return (
    <section className="pt-32 pb-24 px-6 md:px-12">
      <div className="mx-auto max-w-3xl">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

        <CmsLink link={settings.modelBackAction} className="font-mono text-[11px] uppercase tracking-wider text-signal hover:text-ink transition-colors">
          {settings.modelBackAction.label}
        </CmsLink>

        <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-ink tracking-tight">{model.model_name}</h1>
        <p className="mt-3 font-body text-[16px] leading-[1.8] text-ink/75">{introduction}</p>
        <p className={`mt-4 inline-block border px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${model.verificationStatus === "verified" ? "border-verify/40 bg-verify/10 text-verify" : "border-amber/40 bg-amber/10 text-amber"}`}>
          {settings.dataStatusLabel}: {verificationLabel}
        </p>
        {model.summary && <p className="mt-4 font-body text-[16px] leading-[1.8] text-ink/75">{model.summary}</p>}

        <dl className="mt-10 grid grid-cols-2 gap-y-4 gap-x-4 border-t border-rule pt-6 text-sm">
          <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{settings.organizationLabel}</dt>
          <dd className="text-ink">{model.org_name}</dd>

          <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{settings.countryLabel}</dt>
          <dd className="text-ink">{model.org_country}</dd>

          <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{settings.modelTypeLabel}</dt>
          <dd className="text-ink">{model.model_type}</dd>

          <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{settings.releaseDateLabel}</dt>
          <dd className="text-ink">{model.release_date}</dd>

          <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{settings.currentRankLabel}</dt>
          <dd className="text-ink">#{model.rank_current}</dd>

          <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{settings.benchmarkScoreLabel}</dt>
          <dd className="text-ink">
            {model.benchmark_scores.score ?? settings.benchmarkUnsourcedLabel}{" "}
            <span className="font-mono text-xs text-dim">
              ({model.benchmark?.source ? <a href={model.benchmark.source.url} target="_blank" rel="noopener noreferrer" className="hover:text-signal">{model.benchmark.source.name}</a> : model.benchmark_scores.source})
            </span>
          </dd>

          <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{settings.marketStatusLabel}</dt>
          <dd className="text-ink">
            {marketStatus}{" "}
            {model.market_status.funding_source_url && <a href={model.market_status.funding_source_url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-signal hover:text-ink">{settings.sourceLinkLabel}</a>}
          </dd>
        </dl>

        {model.sources.length > 0 && (
          <div className="mt-10 border-t border-rule pt-6">
            <h2 className="font-serif text-xl font-bold text-ink">{settings.sourcesHeading}</h2>
            <ul className="mt-3 space-y-2 font-body text-sm text-ink/75">
              {model.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-signal hover:text-ink transition-colors">{source.name}</a>
                  {source.publicationDate ? ` · ${source.publicationDate}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-10 font-mono text-[11px] uppercase tracking-wider text-muted">
          <Link href="/race/methodology" className="text-signal hover:text-ink transition-colors">{settings.modelMethodologyLinkLabel}</Link>
        </p>
      </div>
    </section>
  );
}
