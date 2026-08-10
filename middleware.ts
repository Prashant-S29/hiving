import { NextResponse, type NextRequest } from "next/server";
import { resolveTheme } from "@/lib/geo-theme";

// Resolves the visitor's theme server-side (Edge) so it's baked into first paint —
// no client-side flicker, no cloaking risk for crawlers (BUILD_BRIEF.md section 3).
export function middleware(request: NextRequest) {
  // On Vercel this header is set automatically at the edge. Locally it will be
  // absent, so this falls back to "US" — that's expected for local dev.
  const country = request.headers.get("x-vercel-ip-country") ?? "US";
  const theme = resolveTheme(country);

  // Set it as a request header so it is readable by the Race Server Component.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-race-theme", theme);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-race-theme", theme);
  return response;
}

export const config = {
  matcher: "/race/:path*",
};
