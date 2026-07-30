import { client, sanityConfigured } from "@/lib/sanity/client";
import { allArticlesQuery } from "@/lib/sanity/queries";
import { mockArticles } from "@/lib/mockArticles";
import type { Article } from "@/lib/types";
import { filterArticles, paginate, allPlatformTags } from "@/lib/articleFilters";
import { ArticleCard } from "@/components/ArticleCard";
import IntelFilterBar from "@/components/IntelFilterBar";
import Pagination from "@/components/Pagination";
import RevealOnScroll from "@/components/RevealOnScroll";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intel — Independent Agentic AI Analysis",
  description:
    "Deep dives, how-to guides, watchdog reports, and opinion on agentic AI platforms — fact-checked, platform-agnostic, no vendor sponsorships.",
};

async function getAllArticles(): Promise<Article[]> {
  if (sanityConfigured && client) {
    try {
      const data = await client.fetch(allArticlesQuery);
      if (data?.length) return data;
    } catch {
      // fall through to mock
    }
  }
  return mockArticles;
}

export default async function IntelPage({
  searchParams,
}: {
  searchParams: { category?: string; platform?: string; page?: string };
}) {
  const allArticles = await getAllArticles();
  const category = searchParams.category || undefined;
  const platform = searchParams.platform || undefined;

  const filtered = filterArticles(allArticles, category, platform);
  const { items, page, totalPages } = paginate(filtered, Number(searchParams.page) || 1);
  const platforms = allPlatformTags(allArticles);

  return (
    <section className="px-6 md:px-12 pt-32 pb-24 max-w-content mx-auto">
      <RevealOnScroll className="mb-16 pb-8 border-b border-rule">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal mb-4">All Intel</div>
        <h1 className="font-serif text-[44px] md:text-[64px] font-bold tracking-tight leading-[1.05] mb-5">
          Independent Agentic AI <span className="italic text-signal">Analysis</span>
        </h1>
        <p className="font-body text-[16px] text-ink/60 max-w-[560px] leading-[1.8]">
          Deep dives, how-to guides, watchdog reports, and opinion — fact-checked,
          platform-agnostic, and free of vendor sponsorship.
        </p>
      </RevealOnScroll>

      <IntelFilterBar activeCategory={category} activePlatform={platform} platforms={platforms} />

      <div className="grid md:grid-cols-3 gap-px bg-rule">
        {items.map((a, i) => (
          <RevealOnScroll key={a._id} delayMs={i * 60}>
            <ArticleCard article={a} />
          </RevealOnScroll>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="font-body text-ink/50 py-20 text-center">
          {allArticles.length === 0
            ? "No articles published yet. Connect Sanity and publish your first piece."
            : "No articles match these filters."}
        </p>
      )}

      <Pagination page={page} totalPages={totalPages} category={category} platform={platform} />
    </section>
  );
}
