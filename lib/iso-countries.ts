// lib/iso-countries.ts
//
// ISO 3166-1 alpha-2 -> English short name, for turning organization.countryCode
// (a 2-letter code, kept terse for the fact-grid label and JSON-LD countryOfOrigin)
// into natural-language prose for AEO/FAQ copy. Covers countries with at least
// one AI lab tracked today plus other common ones a future model addition is
// likely to need — not the full ISO list, since anything missing degrades to
// the raw code rather than breaking.

const COUNTRY_NAMES: Record<string, string> = {
  US: "the United States",
  CN: "China",
  GB: "the United Kingdom",
  FR: "France",
  DE: "Germany",
  CA: "Canada",
  IN: "India",
  JP: "Japan",
  KR: "South Korea",
  IL: "Israel",
  AE: "the United Arab Emirates",
  SA: "Saudi Arabia",
  SG: "Singapore",
  CH: "Switzerland",
  NL: "the Netherlands",
  SE: "Sweden",
  IE: "Ireland",
  AU: "Australia",
  BR: "Brazil",
  RU: "Russia",
  TW: "Taiwan",
  HK: "Hong Kong",
  PL: "Poland",
  ES: "Spain",
  IT: "Italy",
  NO: "Norway",
  FI: "Finland",
  DK: "Denmark",
  BE: "Belgium",
  AT: "Austria",
  PT: "Portugal",
  CZ: "the Czech Republic",
  NZ: "New Zealand",
  ZA: "South Africa",
  MX: "Mexico",
  AR: "Argentina",
  TR: "Turkey",
  ID: "Indonesia",
  VN: "Vietnam",
  TH: "Thailand",
  MY: "Malaysia",
  PH: "the Philippines",
  EG: "Egypt",
  NG: "Nigeria",
  KE: "Kenya",
  UA: "Ukraine",
  RO: "Romania",
  HU: "Hungary",
  GR: "Greece",
  LU: "Luxembourg",
};

export function getCountryName(countryCode: string): string {
  return COUNTRY_NAMES[countryCode.toUpperCase()] || countryCode;
}
