import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SEED_MODELS, getModelBySlug } from "@/data/seed-models";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return SEED_MODELS.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const model = getModelBySlug(params.slug);
  if (!model) return { title: "Model not found" };
  return {
    title: `${model.model_name} — Ranking, Benchmarks & Market Data`,
    description: `${model.model_name} from ${model.org_name} (${model.org_country}), released ${model.release_date}. Live rank, benchmark sourcing, and market status on Hivig's AI model race tracker.`,
  };
}

function softwareApplicationJsonLd(model: NonNullable<ReturnType<typeof getModelBySlug>>) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: model.model_name,
    applicationCategory: "AI Model",
    creator: {
      "@type": "Organization",
      name: model.org_name,
    },
    countryOfOrigin: model.org_country,
    datePublished: model.release_date,
    dateModified: model.last_updated,
  };
}

export default function ModelPage({ params }: PageProps) {
  const model = getModelBySlug(params.slug);
  if (!model) notFound();

  return (
    <section className="pt-32 pb-24 px-6 md:px-12">
      <div className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd(model)) }}
      />

      <Link href="/race" className="font-mono text-[11px] uppercase tracking-wider text-signal hover:text-ink transition-colors">
        ← Back to The Race
      </Link>

      <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-ink tracking-tight">{model.model_name}</h1>
      <p className="mt-3 font-body text-[16px] leading-[1.8] text-ink/75">
        {model.model_name} is a {model.model_type} model from {model.org_name} ({model.org_country}),
        released {model.release_date}. It is currently ranked #{model.rank_current} on Hivig&apos;s tracker.
      </p>

      <dl className="mt-10 grid grid-cols-2 gap-y-4 gap-x-4 border-t border-rule pt-6 text-sm">
        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Organization</dt>
        <dd className="text-ink">{model.org_name}</dd>

        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Country of origin</dt>
        <dd className="text-ink">{model.org_country}</dd>

        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Model type</dt>
        <dd className="text-ink">{model.model_type}</dd>

        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Release date</dt>
        <dd className="text-ink">{model.release_date}</dd>

        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Current rank</dt>
        <dd className="text-ink">#{model.rank_current}</dd>

        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Benchmark score</dt>
        <dd className="text-ink">
          {model.benchmark_scores.score ?? "Not yet sourced"}{" "}
          <span className="font-mono text-xs text-dim">({model.benchmark_scores.source})</span>
        </dd>

        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Market status</dt>
        <dd className="text-ink">
          {model.market_status.is_public
            ? `Public — ${model.market_status.exchange}: ${model.market_status.ticker}`
            : model.market_status.last_funding_round ?? "Private — funding data not yet sourced"}
        </dd>
      </dl>

      <p className="mt-10 font-mono text-[11px] uppercase tracking-wider text-muted">
        <Link href="/race/methodology" className="text-signal hover:text-ink transition-colors">
          How this ranking is computed
        </Link>
      </p>
      </div>
    </section>
  );
}
