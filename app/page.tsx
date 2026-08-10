import { PortableText } from "@portabletext/react";
import { featuredArticlesQuery, homepageHeroQuery } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import type { Article, HomepageContent, HomepageSectionControl, HomepageSectionKey } from "@/lib/types";
import { cmsFallbacksEnabled, fetchCms } from "@/lib/sanity/fetch";
import { categoryLabels, getEditorialSettings } from "@/lib/sanity/editorialSettings";
import HomepageSections from "@/components/homepage/HomepageSections";
import InteractiveHero from "@/components/InteractiveHero";
import HeroChoiceCards from "@/components/HeroChoiceCards";
import CmsLink from "@/components/CmsLink";

async function getFeatured(): Promise<Article[]> {
  const fallback = cmsFallbacksEnabled ? (await import("@/lib/mockArticles")).mockArticles : [];
  const articles = await fetchCms<Article[]>({
    query: featuredArticlesQuery,
    fallback,
    label: "featured homepage articles",
    tags: ["sanity:articles", "sanity:page:home"],
  });
  return articles;
}

const defaultHomepageSectionLayout: HomepageSectionControl[] = [
  { sectionKey: "ticker", enabled: true, spacing: "normal", variant: "default" },
  { sectionKey: "stats", enabled: true, spacing: "normal", variant: "default" },
  { sectionKey: "latestIntel", enabled: true, spacing: "normal", variant: "default" },
  { sectionKey: "manifesto", enabled: true, spacing: "normal", variant: "default" },
  { sectionKey: "subscribe", enabled: true, spacing: "normal", variant: "default" },
];
const approvedHomepageSections = new Set<HomepageSectionKey>(["ticker", "stats", "latestIntel", "manifesto", "subscribe"]);

function normalizeSectionLayout(layout: HomepageSectionControl[] | undefined) {
  if (!layout?.length) return defaultHomepageSectionLayout;
  const seen = new Set<HomepageSectionKey>();
  const normalized = layout.filter((control) => {
    if (!approvedHomepageSections.has(control.sectionKey) || seen.has(control.sectionKey)) return false;
    seen.add(control.sectionKey);
    return true;
  }).map((control) => ({
    ...control,
    enabled: control.enabled !== false,
    spacing: ["compact", "normal", "large"].includes(control.spacing) ? control.spacing : "normal" as const,
    variant: ["default", "alternate"].includes(control.variant) ? control.variant : "default" as const,
  }));
  return normalized.length ? normalized : defaultHomepageSectionLayout;
}

async function getHomepage(): Promise<HomepageContent> {
  const content = await fetchCms<Partial<HomepageContent> | null>({
    query: homepageHeroQuery,
    fallback: null,
    label: "homepage",
    tags: ["sanity:page:home"],
    required: true,
  });

  if (!content) {
    if (!cmsFallbacksEnabled) throw new Error("[Sanity] Homepage: required content is missing");
    return (await import("@/lib/mockHero")).mockHero;
  }
  if (!cmsFallbacksEnabled) {
    return { ...(content as HomepageContent), sectionLayout: normalizeSectionLayout(content.sectionLayout) };
  }

  const { mockHero } = await import("@/lib/mockHero");
  return {
    ...mockHero,
    ...content,
    statusBar: { ...mockHero.statusBar, ...content.statusBar },
    heading: { ...mockHero.heading, ...content.heading },
    primaryAction: { ...mockHero.primaryAction, ...content.primaryAction },
    secondaryAction: { ...mockHero.secondaryAction, ...content.secondaryAction },
    introduction: content.introduction?.length ? content.introduction : mockHero.introduction,
    choices: content.choices?.length ? content.choices : mockHero.choices,
    sectionLayout: normalizeSectionLayout(content.sectionLayout),
    etymology: content.etymology?.length ? content.etymology : mockHero.etymology,
    tickerItems: content.tickerItems?.length ? content.tickerItems : mockHero.tickerItems,
    stats: content.stats?.length ? content.stats : mockHero.stats,
    latestIntel: { ...mockHero.latestIntel, ...content.latestIntel },
    manifestoPromotion: {
      ...mockHero.manifestoPromotion,
      ...content.manifestoPromotion,
      action: { ...mockHero.manifestoPromotion.action, ...content.manifestoPromotion?.action },
    },
    subscribePromotion: {
      ...mockHero.subscribePromotion,
      ...content.subscribePromotion,
      action: { ...mockHero.subscribePromotion.action, ...content.subscribePromotion?.action },
    },
  };
}

function HeroPicker({ hero }: { hero: HomepageContent }) {
  if (hero.mediaType === "image" && hero.heroImage) {
    return (
      <div className="relative min-h-[340px] overflow-hidden py-10">
        <img
          src={urlForImage(hero.heroImage).width(1600).url()}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative z-10">
          <HeroChoiceCards choices={hero.choices} eyebrowLabel={hero.choiceEyebrowLabel} actionLabel={hero.choiceActionLabel} />
        </div>
      </div>
    );
  }
  if (hero.mediaType === "video" && hero.heroVideoUrl) {
    return (
      <div className="relative min-h-[340px] overflow-hidden py-10">
        <video
          src={hero.heroVideoUrl}
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative z-10">
          <HeroChoiceCards choices={hero.choices} eyebrowLabel={hero.choiceEyebrowLabel} actionLabel={hero.choiceActionLabel} />
        </div>
      </div>
    );
  }
  return <InteractiveHero choices={hero.choices} eyebrowLabel={hero.choiceEyebrowLabel} actionLabel={hero.choiceActionLabel} />;
}

export default async function HomePage() {
  const [articles, hero, editorial] = await Promise.all([
    getFeatured(),
    getHomepage(),
    getEditorialSettings(),
  ]);
  const articleCopy = {
    categoryLabels: categoryLabels(editorial),
    minuteShortLabel: editorial.minuteShortLabel,
    minuteReadLabel: editorial.minuteReadLabel,
  };

  return (
    <>
      {/* HERO */}
      <section className="pt-32 pb-0 px-6 md:px-12 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(var(--color-signal), 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--color-signal), 0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 70% 70% at 60% 40%, black, transparent)",
          }}
        />
        <div className="max-w-content mx-auto relative">
          <div className="flex items-center justify-between pb-6 border-b border-rule mb-14 font-mono text-[11px] tracking-[0.1em] uppercase text-muted flex-wrap gap-3">
            <span>{hero.statusBar.leftLabel}</span>
            <span className="flex items-center gap-2 text-signal">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-blink" />
              {hero.statusBar.liveLabel}
            </span>
            <span>{hero.statusBar.rightLabel}</span>
          </div>

          <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-signal mb-7 flex items-center gap-4">
            <span className="w-8 h-px bg-signal" /> {hero.mainEyebrow}
          </div>

          <h1 className="font-serif text-[52px] md:text-[100px] font-bold leading-[0.92] tracking-tight mb-0">
            {hero.heading.lead} <span className="italic text-signal">{hero.heading.emphasis}</span>
            <br />
            {hero.heading.middleLine}
            <br />
            <span style={{ WebkitTextStroke: "1px rgba(var(--color-ink), 0.2)", color: "transparent" }}>
              {hero.heading.outlineLine}
            </span>
          </h1>

          <div className="grid md:grid-cols-2 gap-16 mt-14 pt-10 border-t border-rule">
            <div className="font-body text-[17px] leading-[1.85] text-ink/75 [&_strong]:text-ink [&_strong]:font-bold">
              <PortableText value={hero.introduction} />
            </div>
            <div className="flex flex-col justify-center gap-5">
              <CmsLink
                link={hero.primaryAction}
                className="bg-signal hover:bg-signal-dark text-white font-sans text-[13px] font-bold uppercase tracking-[0.08em] px-9 py-[18px] inline-block w-fit transition-colors"
              >
                {hero.primaryAction.label}
              </CmsLink>
              <CmsLink link={hero.secondaryAction} className="font-mono text-[12px] tracking-[0.1em] uppercase text-muted hover:text-ink transition-colors flex items-center gap-3 w-fit">
                <span className="text-signal text-[10px]">▶</span> {hero.secondaryAction.label}
              </CmsLink>
            </div>
          </div>

          {/* CHOOSE YOUR PATH — the interactive hero picker, CMS-editable at /studio */}
          <div className="mt-16 pt-10 border-t border-rule">
            <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-signal mb-2 flex items-center gap-4">
              <span className="w-8 h-px bg-signal" /> {hero.pickerEyebrow}
            </div>
            <HeroPicker hero={hero} />
          </div>

          {/* Etymology bar */}
          <div className="mt-16 bg-surface border-t border-rule flex flex-wrap items-center gap-6 md:gap-0 py-7 px-6 md:px-12 -mx-6 md:-mx-12">
            {hero.etymology.map((item, index) => (
              <div key={item._key || item.word} className="contents">
                {index > 0 && <Plus eq={index === hero.etymology.length - 1} />}
                <EtymItem word={item.word} def={item.definition} italic={item.italic} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomepageSections
        hero={hero}
        articles={articles}
        articleCopy={articleCopy}
        minuteShortLabel={editorial.minuteShortLabel}
      />
    </>
  );
}

function EtymItem({ word, def, italic }: { word: string; def: string; italic?: boolean }) {
  return (
    <div className="text-center px-4">
      <div className={`font-serif text-3xl font-bold tracking-tight ${italic ? "italic text-signal" : "text-ink"}`}>
        {word}
      </div>
      <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted mt-1">{def}</div>
    </div>
  );
}
function Plus({ eq }: { eq?: boolean }) {
  return <div className="font-serif text-4xl text-dim px-2">{eq ? "=" : "+"}</div>;
}
