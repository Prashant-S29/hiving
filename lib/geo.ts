// lib/geo.ts
// Maps a visitor's country code to one of the pricing regions defined in
// lib/pricing-engine.ts's GEO_MULTIPLIER. Shared by /api/quote and /api/feasibility.

import { GEO_MULTIPLIER } from "./pricing-engine";

const EU_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
]);

export function mapCountryToRegion(countryCode: string): keyof typeof GEO_MULTIPLIER {
  if (countryCode === "US") return "US";
  if (countryCode === "IN") return "IN";
  if (EU_COUNTRIES.has(countryCode)) return "EU";
  return "DEFAULT";
}

// Vercel sets x-vercel-ip-country in production. Locally, allow an override via
// ?region= for testing since there is no real edge geo header on localhost.
export function resolveRegionFromRequest(req: { headers: Headers; nextUrl: URL }): keyof typeof GEO_MULTIPLIER {
  const overrideRegion = req.nextUrl.searchParams.get("region");
  const country = overrideRegion ?? req.headers.get("x-vercel-ip-country") ?? "US";
  return mapCountryToRegion(country.toUpperCase());
}
