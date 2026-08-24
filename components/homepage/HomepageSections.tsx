import Link from "next/link";
import type { Article, HomepageContent, HomepageSectionControl } from "@/lib/types";
import type { ArticleCardCopy } from "@/components/ArticleCard";
import { FeaturedArticleCard, ArticleTag } from "@/components/ArticleCard";
import CmsLink from "@/components/CmsLink";
import RevealOnScroll from "@/components/RevealOnScroll";
import StatsBar from "@/components/StatsBar";
import Ticker from "@/components/Ticker";

interface HomepageSectionsProps {
  hero: HomepageContent;
  articles: Article[];
  articleCopy: ArticleCardCopy;
  minuteShortLabel: string;
}

const latestSpacing = { compact: "py-12", normal: "py-20", large: "py-28" } as const;
const promotionSpacing = { compact: "py-16", normal: "py-24", large: "py-32" } as const;

export default function HomepageSections({ hero, articles, articleCopy, minuteShortLabel }: HomepageSectionsProps) {
  const renderers: Record<HomepageSectionControl["sectionKey"], (control: HomepageSectionControl) => React.ReactNode> = {
    ticker: (control) => <Ticker items={hero.tickerItems} spacing={control.spacing} variant={control.variant} />,
    stats: (control) => <StatsBar stats={hero.stats} spacing={control.spacing} variant={control.variant} />,
    latestIntel: (control) => (
      <LatestIntel
        hero={hero}
        articles={articles}
        copy={articleCopy}
        minuteShortLabel={minuteShortLabel}
        control={control}
      />
    ),
    manifesto: (control) => <ManifestoPromotion hero={hero} control={control} />,
    subscribe: (control) => <SubscribePromotion hero={hero} control={control} />,
  };

  return <>{hero.sectionLayout.filter((control) => control.enabled).map((control) => (
    <div key={control._key || control.sectionKey}>{renderers[control.sectionKey](control)}</div>
  ))}</>;
}

function LatestIntel({ hero, articles, copy, minuteShortLabel, control }: {
  hero: HomepageContent;
  articles: Article[];
  copy: ArticleCardCopy;
  minuteShortLabel: string;
  control: HomepageSectionControl;
}) {
  const [lead, ...rest] = articles;
  const sideArticles = rest.slice(0, 3);
  return (
    <section className={`px-6 md:px-12 max-w-content mx-auto ${latestSpacing[control.spacing]} ${control.variant === "alternate" ? "bg-surface" : ""}`}>
      <RevealOnScroll className="flex items-end justify-between pb-5 border-b border-rule mb-14">
        <h2 className="font-serif text-[38px] font-bold tracking-tight">
          {hero.latestIntel.heading} <span className="italic text-signal">{hero.latestIntel.emphasis}</span>
        </h2>
        <Link href="/intel" className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted hover:text-signal transition-colors">
          {hero.latestIntel.archiveLabel}
        </Link>
      </RevealOnScroll>

      {lead && (
        <RevealOnScroll className="grid md:grid-cols-[3fr_2fr] gap-px bg-rule mb-px">
          <FeaturedArticleCard article={lead} copy={copy} />
          <div className="bg-void p-9 flex flex-col gap-7">
            {sideArticles.map((article) => (
              <div key={article._id} className="pb-7 border-b border-rule last:border-b-0 last:pb-0">
                <ArticleTag article={article} copy={copy} />
                <Link href={`/intel/${article.slug.current}`}>
                  <h3 className="font-serif text-[18px] font-bold leading-snug mb-2 hover:text-signal transition-colors">{article.title}</h3>
                </Link>
                <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted">
                  {article.readTimeMinutes} {minuteShortLabel} · {article.platformTags?.[0]}
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      )}
    </section>
  );
}

function ManifestoPromotion({ hero, control }: { hero: HomepageContent; control: HomepageSectionControl }) {
  const theme = control.variant === "alternate" ? "bg-deep text-ink border-y border-rule" : "bg-paper text-void";
  return (
    <section className={`px-6 md:px-12 ${promotionSpacing[control.spacing]} ${theme}`}>
      <RevealOnScroll className="max-w-content mx-auto text-center">
        <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal mb-6">{hero.manifestoPromotion.eyebrow}</div>
        <p className="font-serif text-[32px] md:text-[52px] font-bold leading-[1.1] tracking-tight max-w-[760px] mx-auto mb-8">
          {hero.manifestoPromotion.heading} <span className="italic text-signal">{hero.manifestoPromotion.emphasis}</span>
        </p>
        <CmsLink link={hero.manifestoPromotion.action} className="font-mono text-[12px] tracking-[0.1em] uppercase text-signal hover:text-signal-dark transition-colors">
          {hero.manifestoPromotion.action.label}
        </CmsLink>
      </RevealOnScroll>
    </section>
  );
}

function SubscribePromotion({ hero, control }: { hero: HomepageContent; control: HomepageSectionControl }) {
  const theme = control.variant === "alternate" ? "bg-surface" : "bg-deep";
  return (
    <section className={`px-6 md:px-12 border-t border-rule ${promotionSpacing[control.spacing]} ${theme}`}>
      <RevealOnScroll className="max-w-content mx-auto text-center">
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-signal mb-5">{hero.subscribePromotion.eyebrow}</div>
        <h2 className="font-serif text-[36px] md:text-[56px] font-bold tracking-tight mb-7">
          {hero.subscribePromotion.heading} <span className="italic text-signal">{hero.subscribePromotion.emphasis}</span>
        </h2>
        <CmsLink link={hero.subscribePromotion.action} className="rounded-lg bg-signal hover:bg-signal-dark text-[#241912] hover:text-white font-cta text-[15px] font-bold px-10 py-[18px] inline-block transition-colors">
          {hero.subscribePromotion.action.label}
        </CmsLink>
      </RevealOnScroll>
    </section>
  );
}
