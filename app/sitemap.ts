import type { MetadataRoute } from "next";
import { client, sanityConfigured } from "@/lib/sanity/client";
import { allSlugsQuery } from "@/lib/sanity/queries";
import { getRaceModels } from "@/lib/sanity/race";

const BASE_URL = "https://hivig.com";

// force-dynamic, not headers()/cookies() — see app/robots.ts for why.
export const dynamic = "force-dynamic";

// Same production gate as middleware.ts and app/robots.ts.
const IS_PRODUCTION = process.env.VERCEL_ENV === "production";

// Every static route on the site, with a sensible crawl priority and change
// frequency. Update this list whenever a new top-level page is added.
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/intel", priority: 0.9, changeFrequency: "daily" },
  { path: "/race", priority: 0.9, changeFrequency: "daily" },
  { path: "/race/methodology", priority: 0.5, changeFrequency: "monthly" },
  { path: "/agents", priority: 0.8, changeFrequency: "weekly" },
  { path: "/agents/pricing", priority: 0.6, changeFrequency: "monthly" },
  { path: "/agents/discover", priority: 0.6, changeFrequency: "monthly" },
  { path: "/manifesto", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/consultancy", priority: 0.8, changeFrequency: "monthly" },
  { path: "/subscribe", priority: 0.5, changeFrequency: "monthly" },
  { path: "/legal/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/legal/terms", priority: 0.2, changeFrequency: "yearly" },
];

async function getArticleSlugs(): Promise<{ slug: string; publishedAt?: string }[]> {
  if (!sanityConfigured || !client) return [];
  try {
    const data = await client.fetch(allSlugsQuery);
    if (Array.isArray(data)) return data;
    return [];
  } catch {
    // If Sanity is briefly unreachable at build/request time, fail gracefully
    // and still ship a sitemap with the static routes rather than failing
    // the whole build.
    return [];
  }
}

async function getModelEntries(): Promise<{ slug: string; lastModified: string }[]> {
  try {
    const models = await getRaceModels();
    return models.map((m) => ({ slug: m.slug, lastModified: m.last_updated }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Nothing on a non-production deployment should be listed anywhere a
  // crawler might follow it from — robots.ts already fully disallows
  // crawling there, so publishing URLs here would be pointless at best.
  if (!IS_PRODUCTION) return [];

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [articles, models] = await Promise.all([getArticleSlugs(), getModelEntries()]);

  const articleEntries: MetadataRoute.Sitemap = articles
    .filter((a) => a?.slug)
    .map((a) => ({
      url: `${BASE_URL}/intel/${a.slug}`,
      lastModified: a.publishedAt ? new Date(a.publishedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const modelEntries: MetadataRoute.Sitemap = models.map((m) => ({
    url: `${BASE_URL}/race/models/${m.slug}`,
    lastModified: new Date(m.lastModified),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...articleEntries, ...modelEntries];
}
