import type { Metadata } from "next";
import CmsLink from "@/components/CmsLink";
import SignalPageShell from "@/components/signal/SignalPageShell";
import SignalRaceHero from "@/components/race-signal/SignalRaceHero";
import SignalRaceTrack from "@/components/race-signal/SignalRaceTrack";
import RevealOnScroll from "@/components/RevealOnScroll";
import { applyTemplate, getRaceModels, getRaceSettings, type RaceModel, type RaceSettingsContent } from "@/lib/sanity/race";

// ISO 8601 week number, for the hero's "Tracking Week" badge.
function isoWeekLabel(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `W${weekNo} · ${d.getUTCFullYear()}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getRaceSettings();
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

function itemListJsonLd(models: RaceModel[], settings: RaceSettingsContent, dateModified: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: settings.itemListName,
    description: settings.itemListDescription,
    dateModified,
    itemListElement: models.map((model) => ({
      "@type": "ListItem",
      position: model.rank_current,
      url: `https://hivig.com/race/models/${model.slug}`,
      name: model.model_name,
    })),
  };
}

function faqJsonLd(models: RaceModel[], settings: RaceSettingsContent) {
  const top = models[0];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: settings.highestModelQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: applyTemplate(settings.highestModelAnswerTemplate, { model: top.model_name, organization: top.org_name }),
        },
      },
      {
        "@type": "Question",
        name: settings.refreshQuestion,
        acceptedAnswer: { "@type": "Answer", text: settings.refreshAnswer },
      },
    ],
  };
}

function jsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function displayDate(value: string, locale: string) {
  try {
    return new Date(value).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
}

export default async function RacePage() {
  const [models, settings] = await Promise.all([getRaceModels(), getRaceSettings()]);
  const top = models[0];
  const top10 = models.slice(0, 10);
  const usCount = top10.filter((model) => model.org_country === "US").length;
  const cnCount = top10.filter((model) => model.org_country === "CN").length;
  const dateModified = top.last_updated;
  const dateLabel = displayDate(dateModified, settings.dateLocale);
  const definition = applyTemplate(settings.definitionTemplate, {
    date: dateLabel,
    model: top.model_name,
    organization: top.org_name,
    country: top.org_country,
    usCount,
    usWord: usCount === 1 ? "model" : "models",
    cnCount,
    cnWord: cnCount === 1 ? "model" : "models",
  });

  return (
    <SignalPageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(itemListJsonLd(models, settings, dateModified)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd(models, settings)) }} />

      <div className="max-w-content mx-auto">
        <RevealOnScroll>
          <SignalRaceHero topModels={models} weekLabel={isoWeekLabel(new Date(dateModified))} copy={settings} />
        </RevealOnScroll>

        <RevealOnScroll className="mt-10">
          <p className="max-w-2xl text-[16px] leading-[1.85]" style={{ color: "var(--hvg-text-secondary)" }}>{definition}</p>

          <p className="mt-3 text-[11px] uppercase tracking-wider" style={{ color: "var(--hvg-text-dim)", fontFamily: "var(--hvg-font-mono)" }}>
            {settings.lastUpdatedLabel}: <time dateTime={dateModified}>{dateLabel}</time> ·{" "}
            <CmsLink
              link={settings.methodologyAction}
              className="normal-case tracking-normal text-[color:var(--hvg-ember)] transition-colors hover:text-[color:var(--hvg-ember-strong)]"
            >
              {settings.methodologyAction.label}
            </CmsLink>
          </p>
        </RevealOnScroll>

        <div className="mt-10">
          <SignalRaceTrack models={models} copy={settings} />
        </div>
      </div>
    </SignalPageShell>
  );
}
