import type { Metadata } from "next";
import { headers } from "next/headers";
import CmsLink from "@/components/CmsLink";
import RaceHero from "@/components/RaceHero";
import RaceTrack from "@/components/RaceTrack";
import RevealOnScroll from "@/components/RevealOnScroll";
import { DEFAULT_THEME_ID } from "@/lib/geo-theme";
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
  const themeId = headers().get("x-race-theme") ?? DEFAULT_THEME_ID;
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
    <section className="pt-32 pb-24 px-6 md:px-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(itemListJsonLd(models, settings, dateModified)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd(models, settings)) }} />

      <div className="max-w-content mx-auto">
        <RevealOnScroll>
          <RaceHero topModels={models} weekLabel={isoWeekLabel(new Date(dateModified))} copy={settings} />
        </RevealOnScroll>

        <RevealOnScroll className="mt-10">
          <p className="max-w-2xl font-body text-[16px] leading-[1.85] text-ink/75">{definition}</p>

          <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-muted">
            {settings.lastUpdatedLabel}: <time dateTime={dateModified}>{dateLabel}</time> · {settings.themeLabel}: {themeId} ·{" "}
            <CmsLink link={settings.methodologyAction} className="text-signal hover:text-ink transition-colors normal-case tracking-normal">
              {settings.methodologyAction.label}
            </CmsLink>
          </p>
        </RevealOnScroll>

        <div className="mt-10"><RaceTrack models={models} themeId={themeId} copy={settings} /></div>
      </div>
    </section>
  );
}
