import { NextResponse, type NextRequest } from "next/server";
import { resolveTheme } from "@/lib/geo-theme";

// Only the real production deployment (the one bound to `main`) should ever be
// indexable — staging.hivig.com, Vercel preview URLs, and local dev all get a
// hard noindex/nofollow via the X-Robots-Tag header, site-wide, regardless of
// route. This runs on every request (not just /race) because the goal is "no
// bot ever indexes anything on a non-production deployment", not just the race
// page. See app/robots.ts and app/sitemap.ts for the matching robots.txt/
// sitemap behavior — all three layers key off the same VERCEL_ENV check.
const IS_PRODUCTION = process.env.VERCEL_ENV === "production";

export function middleware(request: NextRequest) {
  let response: NextResponse;

  if (request.nextUrl.pathname.startsWith("/race")) {
    // Resolves the visitor's theme server-side (Edge) so it's baked into first
    // paint — no client-side flicker, no cloaking risk for crawlers
    // (BUILD_BRIEF.md section 3).
    // On Vercel this header is set automatically at the edge. Locally it will
    // be absent, so this falls back to "US" — that's expected for local dev.
    const country = request.headers.get("x-vercel-ip-country") ?? "US";
    const theme = resolveTheme(country);

    // Set it as a request header so it is readable by the Race Server Component.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-race-theme", theme);

    response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("x-race-theme", theme);
  } else {
    response = NextResponse.next();
  }

  if (!IS_PRODUCTION) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  return response;
}

export const config = {
  // Runs on every route except static assets/image optimization output —
  // those aren't indexable pages, so there's nothing for the noindex header
  // to protect there, and skipping them keeps the Edge function cheap.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
