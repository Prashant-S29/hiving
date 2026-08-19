import type { MetadataRoute } from "next";

const BASE_URL = "https://hivig.com";

// Same production gate as middleware.ts and sitemap.ts. `force-dynamic`
// makes this render per-request rather than once at build time, which is
// required — a statically-generated robots.txt can't tell staging/preview
// traffic apart from production traffic. (headers()/cookies() are NOT a
// reliable way to force this for the robots.ts/sitemap.ts metadata route
// conventions — they aren't rendered inside a normal request-scoped React
// tree the way page.tsx is, so calling them threw and produced a 404
// instead of the intended output.)
export const dynamic = "force-dynamic";

const IS_PRODUCTION = process.env.VERCEL_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION) {
    // Full disallow for every bot on any non-production deployment (staging,
    // previews, local). No sitemap reference either — nothing here should
    // ever be crawled, let alone indexed. The X-Robots-Tag header set in
    // middleware.ts is the belt to this braces: even a bot that ignores
    // robots.txt gets a noindex response header on every route.
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Disallow the CMS admin UI and any internal API routes from being
        // crawled or indexed — these have no value in search and just
        // waste crawl budget.
        disallow: ["/studio", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
