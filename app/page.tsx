import Link from "next/link";
import { client, sanityConfigured } from "@/lib/sanity/client";
import { featuredArticlesQuery, homepageHeroQuery } from "@/lib/sanity/queries";
import { mockArticles } from "@/lib/mockArticles";
import { mockHero } from "@/lib/mockHero";
import { urlForImage } from "@/lib/sanity/image";
import type { Article, HomepageHero } from "@/lib/types";
import Ticker from "@/components/Ticker";
import StatsBar from "@/components/StatsBar";
import { FeaturedArticleCard, ArticleCard, ArticleTag } from "@/components/ArticleCard";
import RevealOnScroll from "@/components/RevealOnScroll";
import InteractiveHero from "@/components/InteractiveHero";
import HeroChoiceCards from "@/components/HeroChoiceCards";

async function getFeatured(): Promise<Article[]> {
  if (sanityConfigured && client) {
    try {
      const data = await client.fetch(featuredArticlesQuery);
      if (data?.length) return data;
    } catch {
      // fall through to mock
    }
  }
  return mockArticles;
}

async function getHomepageHero(): Promise<HomepageHero> {
  if (sanityConfigured && client) {
    try {
      const data = await client.fetch(homepageHeroQuery);
      if (data?.choices?.length) return data;
    } catch {
      // fall through to mock
    }
  }
  return mockHero;
}

function HeroPicker({ hero }: { hero: HomepageHero }) {
  if (hero.mediaType === "image" && hero.heroImage) {
    return (
      <div className="relative min-h-[340px] overflow-hidden py-10">
        <img
          src={urlForImage(hero.heroImage).width(1600).url()}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative z-10">
          <HeroChoiceCards choices={hero.choices} />
        </div>
      </div>
    );
  }
  if (hero.mediaType === "video" && hero.heroVideoUrl) {
    return (
      <div className="relative min-h-[340px] overflow-hidden py-10">
        <video
          src={hero.heroVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="relative z-10">
          <HeroChoiceCards choices={hero.choices} />
        </div>
      </div>
    );
  }
  return <InteractiveHero choices={hero.choices} />;
}

export default async function HomePage() {
  const articles = await getFeatured();
  const hero = await getHomepageHero();
  const [lead, ...rest] = articles;
  const sideArticles = rest.slice(0, 3);

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
            <span>Hi-Tech Vigilance · Est. 2025</span>
            <span className="flex items-center gap-2 text-signal">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-blink" />
              Live Intelligence Feed Active
            </span>
            <span>™ Type 42 · India · hivig.com</span>
          </div>

          <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-signal mb-7 flex items-center gap-4">
            <span className="w-8 h-px bg-signal" /> Hi-Tech Vigilance · Est. 2025
          </div>

          <h1 className="font-serif text-[52px] md:text-[100px] font-bold leading-[0.92] tracking-tight mb-0">
            The <span className="italic text-signal">vigilant</span>
            <br />
            voice of
            <br />
            <span style={{ WebkitTextStroke: "1px rgba(var(--color-ink), 0.2)", color: "transparent" }}>
              agentic AI
            </span>
          </h1>

          <div className="grid md:grid-cols-2 gap-16 mt-14 pt-10 border-t border-rule">
            <p className="font-body text-[17px] leading-[1.85] text-ink/75">
              The agentic AI space moves fast and talks loudly. Hivig cuts
              through both. <em className="text-ink not-italic font-bold">Technically rigorous</em> enough
              for engineers and architects. <em className="text-ink not-italic font-bold">Strategically clear</em> enough
              for product managers and executives. Independent enough to tell
              you the truth about every platform.
            </p>
            <div className="flex flex-col justify-center gap-5">
              <Link
                href="/intel"
                className="bg-signal hover:bg-signal-dark text-white font-sans text-[13px] font-bold uppercase tracking-[0.08em] px-9 py-[18px] inline-block w-fit transition-colors"
              >
                Read the Latest Intel →
              </Link>
              <Link href="/manifesto" className="font-mono text-[12px] tracking-[0.1em] uppercase text-muted hover:text-ink transition-colors flex items-center gap-3 w-fit">
                <span className="text-signal text-[10px]">▶</span> What Hivig stands for
              </Link>
            </div>
          </div>

          {/* CHOOSE YOUR PATH — the interactive hero picker, CMS-editable at /studio */}
          <div className="mt-16 pt-10 border-t border-rule">
            <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-signal mb-2 flex items-center gap-4">
              <span className="w-8 h-px bg-signal" /> {hero.eyebrow}
            </div>
            <HeroPicker hero={hero} />
          </div>

          {/* Etymology bar */}
          <div className="mt-16 bg-surface border-t border-rule flex flex-wrap items-center gap-6 md:gap-0 py-7 px-6 md:px-12 -mx-6 md:-mx-12">
            <EtymItem word="Hi" def="Hi-Technology" italic />
            <Plus />
            <EtymItem word="Vig" def="Vigilance" />
            <Plus eq />
            <EtymItem word="Hivig" def="A mandate, not a name" italic />
          </div>
        </div>
      </section>

      <Ticker />
      <StatsBar />

      {/* LATEST INTEL */}
      <section className="px-6 md:px-12 py-20 max-w-content mx-auto">
        <RevealOnScroll className="flex items-end justify-between pb-5 border-b border-rule mb-14">
          <h2 className="font-serif text-[38px] font-bold tracking-tight">
            Latest <span className="italic text-signal">Intel</span>
          </h2>
          <Link href="/intel" className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted hover:text-signal transition-colors">
            Full Archive →
          </Link>
        </RevealOnScroll>

        {lead && (
          <RevealOnScroll className="grid md:grid-cols-[3fr_2fr] gap-px bg-rule mb-px">
            <FeaturedArticleCard article={lead} />
            <div className="bg-void p-9 flex flex-col gap-7">
              {sideArticles.map((a) => (
                <div key={a._id} className="pb-7 border-b border-rule last:border-b-0 last:pb-0">
                  <ArticleTag article={a} />
                  <Link href={`/intel/${a.slug.current}`}>
                    <h3 className="font-serif text-[18px] font-bold leading-snug mb-2 hover:text-signal transition-colors">
                      {a.title}
                    </h3>
                  </Link>
                  <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted">
                    {a.readTimeMinutes} min · {a.platformTags?.[0]}
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        )}
      </section>

      {/* MANIFESTO PREVIEW */}
      <section className="bg-paper text-void px-6 md:px-12 py-24">
        <RevealOnScroll className="max-w-content mx-auto text-center">
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal mb-6">The Hivig Manifesto</div>
          <p className="font-serif text-[32px] md:text-[52px] font-bold leading-[1.1] tracking-tight max-w-[760px] mx-auto mb-8">
            The agentic AI space has enough noise. We bring <span className="italic text-signal">signal.</span>
          </p>
          <Link href="/manifesto" className="font-mono text-[12px] tracking-[0.1em] uppercase text-signal hover:text-signal-dark transition-colors">
            Read the full manifesto →
          </Link>
        </RevealOnScroll>
      </section>

      {/* SUBSCRIBE CTA */}
      <section className="px-6 md:px-12 py-24 bg-deep border-t border-rule">
        <RevealOnScroll className="max-w-content mx-auto text-center">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-signal mb-5">Stay Ahead of the Curve</div>
          <h2 className="font-serif text-[36px] md:text-[56px] font-bold tracking-tight mb-7">
            The agentic AI brief that <span className="italic text-signal">matters.</span>
          </h2>
          <Link
            href="/subscribe"
            className="bg-signal hover:bg-signal-dark text-white font-sans text-[13px] font-bold uppercase tracking-[0.1em] px-10 py-[18px] inline-block transition-colors"
          >
            Subscribe Free →
          </Link>
        </RevealOnScroll>
      </section>
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
