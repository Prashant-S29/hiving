import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import RaceTrack from "@/components/RaceTrack";
import RevealOnScroll from "@/components/RevealOnScroll";
import { SEED_MODELS } from "@/data/seed-models";
import { DEFAULT_THEME_ID } from "@/lib/geo-theme";

export const metadata: Metadata = {
  title: "The Race — Live Global AI Model Rankings",
  description:
    "Live-updated ranking of frontier AI models from the US, China, India, and beyond — with market/funding data and source-cited commentary, refreshed every 72 hours.",
};

function buildDefinitionalBlock(models: typeof SEED_MODELS, dateLabel: string) {
  const top = [...models].sort((a, b) => a.rank_current - b.rank_current)[0];
  const top10 = [...models].sort((a, b) => a.rank_current - b.rank_current).slice(0, 10);
  const countryCount = (code: string) => top10.filter((m) => m.org_country === code).length;
  const cn = countryCount("CN");
  const us = countryCount("US");

  return `As of ${dateLabel}, the top-ranked AI model on Hivig is ${top.model_name} from ${top.org_name} (${top.org_country}). The current top 10 includes ${us} model${us === 1 ? "" : "s"} from US labs and ${cn} from Chinese labs. Rankings use a placeholder methodology pending a documented formula — see the methodology page below.`;
}

function itemListJsonLd(models: typeof SEED_MODELS, dateModifiedIso: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Global AI Model Race — Live Rankings",
    description:
      "Live-updated ranking of frontier AI models from the US, China, and India, refreshed every 72 hours.",
    dateModified: dateModifiedIso,
    itemListElement: [...models]
      .sort((a, b) => a.rank_current - b.rank_current)
      .map((m) => ({
        "@type": "ListItem",
        position: m.rank_current,
        url: `https://hivig.com/race/models/${m.slug}`,
        name: m.model_name,
      })),
  };
}

function faqJsonLd(models: typeof SEED_MODELS) {
  const top = [...models].sort((a, b) => a.rank_current - b.rank_current)[0];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which AI model is currently ranked highest?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `${top.model_name} from ${top.org_name} is currently ranked #1 on Hivig's tracker.`,
        },
      },
      {
        "@type": "Question",
        name: "How often are these rankings updated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every 72 hours. The page shows a visible last-updated timestamp, matched by the dateModified field in this page's structured data.",
        },
      },
    ],
  };
}

export default function RacePage() {
  const headerList = headers();
  const themeId = headerList.get("x-race-theme") ?? DEFAULT_THEME_ID;

  const models = [...SEED_MODELS].sort((a, b) => a.rank_current - b.rank_current);
  const dateModifiedIso = models[0]?.last_updated ?? new Date().toISOString();
  const dateLabel = new Date(dateModifiedIso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="pt-32 pb-24 px-6 md:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd(models, dateModifiedIso)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(models)) }}
      />

      <div className="max-w-content mx-auto">
        <RevealOnScroll>
          <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-signal mb-5 flex items-center gap-4">
            <span className="w-8 h-px bg-signal" /> Live · refreshed every 72h
          </div>

          <h1 className="font-serif text-[40px] md:text-[58px] font-bold tracking-tight leading-[1.05] text-ink">
            The <span className="italic text-signal">Race</span> — Live Global AI Model Rankings
          </h1>

          <p className="mt-6 max-w-2xl font-body text-[16px] leading-[1.85] text-ink/75">
            {buildDefinitionalBlock(models, dateLabel)}
          </p>

          <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-muted">
            Last updated: <time dateTime={dateModifiedIso}>{dateLabel}</time> · Theme: {themeId} ·{" "}
            <Link href="/race/methodology" className="text-signal hover:text-ink transition-colors normal-case tracking-normal">
              How rankings are computed
            </Link>
          </p>
        </RevealOnScroll>

        <div className="mt-10">
          <RaceTrack models={models} themeId={themeId} />
        </div>
      </div>
    </section>
  );
}
