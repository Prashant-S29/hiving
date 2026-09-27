import { OrbitHomepage } from "@/components/homepage/orbit/OrbitHomepage";
import { getSiteSettings } from "@/lib/sanity/siteSettings";
import { getRaceModels } from "@/lib/sanity/race";
import { latestArticlesQuery } from "@/lib/sanity/queries";
import { cmsFallbacksEnabled, fetchCms } from "@/lib/sanity/fetch";
import { categoryLabels, getEditorialSettings } from "@/lib/sanity/editorialSettings";
import type { Article } from "@/lib/types";

// Homepage — "Orbit" direction, ported from Claude Design. The previous
// CMS-driven homepage (Sanity-backed hero/sections) is still intact as
// components/files (HomepageSections, InteractiveHero, HeroChoiceCards,
// lib/mockHero, the getFeatured/getHomepage data loaders) — just no longer
// referenced from this route. Swap this file's contents back if we need to
// restore it before the CMS-driven version is reconnected to this design.
//
// getSiteSettings() is also called in RootLayout (for the now-shared Nav);
// it's wrapped in React's cache(), so this is a free request-memoized call,
// not a duplicate fetch.
async function getHomepageArticles(): Promise<Article[]> {
  const fallback = cmsFallbacksEnabled ? (await import("@/lib/mockArticles")).mockArticles : [];
  const articles = await fetchCms<Article[]>({
    query: latestArticlesQuery,
    fallback,
    label: "Homepage latest Intel",
    tags: ["sanity:articles"],
  });
  // Most-recent articles that actually have a written body — ignores the
  // `featured` flag, which several title-only stubs also happen to carry.
  return articles.filter((article) => article.hasBody).slice(0, 3);
}

export default async function HomePage() {
  const [settings, raceModels, articles, editorialSettings] = await Promise.all([
    getSiteSettings(),
    getRaceModels(),
    getHomepageArticles(),
    getEditorialSettings(),
  ]);
  return (
    <OrbitHomepage
      settings={settings}
      raceModels={raceModels}
      articles={articles}
      articleCategoryLabels={categoryLabels(editorialSettings)}
    />
  );
}
