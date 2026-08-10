import type { Metadata } from "next";
import { allArticlesQuery } from "@/lib/sanity/queries";
import { cmsFallbacksEnabled, fetchCms } from "@/lib/sanity/fetch";
import { categoryLabels, getEditorialSettings } from "@/lib/sanity/editorialSettings";
import type { Article } from "@/lib/types";
import { filterArticles, paginate, allPlatformTags } from "@/lib/articleFilters";
import { ArticleCard } from "@/components/ArticleCard";
import IntelFilterBar from "@/components/IntelFilterBar";
import Pagination from "@/components/Pagination";
import RevealOnScroll from "@/components/RevealOnScroll";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getEditorialSettings();
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

async function getAllArticles(): Promise<Article[]> {
  const fallback = cmsFallbacksEnabled ? (await import("@/lib/mockArticles")).mockArticles : [];
  const articles = await fetchCms<Article[]>({
    query: allArticlesQuery,
    fallback,
    label: "Intel archive articles",
    tags: ["sanity:articles"],
  });
  return articles;
}

export default async function IntelPage({
  searchParams,
}: {
  searchParams: { category?: string; platform?: string; page?: string };
}) {
  const [allArticles, settings] = await Promise.all([getAllArticles(), getEditorialSettings()]);
  const category = searchParams.category || undefined;
  const platform = searchParams.platform || undefined;

  const filtered = filterArticles(allArticles, category, platform);
  const { items, page, totalPages } = paginate(filtered, Number(searchParams.page) || 1);
  const platforms = allPlatformTags(allArticles);
  const articleCopy = {
    categoryLabels: categoryLabels(settings),
    minuteShortLabel: settings.minuteShortLabel,
    minuteReadLabel: settings.minuteReadLabel,
  };

  return (
    <section className="px-6 md:px-12 pt-32 pb-24 max-w-content mx-auto">
      <RevealOnScroll className="mb-16 pb-8 border-b border-rule">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal mb-4">{settings.eyebrow}</div>
        <h1 className="font-serif text-[44px] md:text-[64px] font-bold tracking-tight leading-[1.05] mb-5">
          {settings.heading} <span className="italic text-signal">{settings.headingEmphasis}</span>
        </h1>
        <p className="font-body text-[16px] text-ink/60 max-w-[560px] leading-[1.8]">
          {settings.introduction}
        </p>
      </RevealOnScroll>

      <IntelFilterBar
        activeCategory={category}
        activePlatform={platform}
        platforms={platforms}
        categories={settings.categories}
        allCategoriesLabel={settings.allCategoriesLabel}
        allPlatformsLabel={settings.allPlatformsLabel}
      />

      <div className="grid md:grid-cols-3 gap-px bg-rule">
        {items.map((article, index) => (
          <RevealOnScroll key={article._id} delayMs={index * 60}>
            <ArticleCard article={article} copy={articleCopy} />
          </RevealOnScroll>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="font-body text-ink/50 py-20 text-center">
          {allArticles.length === 0 ? settings.noArticlesMessage : settings.noMatchesMessage}
        </p>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        category={category}
        platform={platform}
        ariaLabel={settings.paginationAriaLabel}
        previousLabel={settings.previousPageLabel}
        nextLabel={settings.nextPageLabel}
      />
    </section>
  );
}
