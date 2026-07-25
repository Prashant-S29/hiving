// lib/geo-theme.ts
// Decides which visual "skin" wraps the race leaderboard for a given visitor.
// The underlying data (ai_models table) never changes — only this container metaphor.

export interface RegionEvent {
  region: string; // ISO country code or region grouping, e.g. "IN", "US", "EU", "AU"
  eventName: string; // "IPL Final", "Super Bowl", "World Cup"
  themeId: string; // maps to a visual theme component, e.g. "cricket", "football"
  windowStart: string; // ISO date
  windowEnd: string; // ISO date
}

// v1: hand-maintained weekly. Automate later once you've seen which themes actually
// get engagement — auto-detecting "what's happening in a region in the next 30 days"
// reliably is its own project, not a day-3 task.
export const REGION_EVENTS: RegionEvent[] = [
  // Example entries — replace with real upcoming events before launch.
  // { region: "IN", eventName: "IPL Final", themeId: "cricket", windowStart: "2026-05-20", windowEnd: "2026-05-31" },
  // { region: "US", eventName: "Super Bowl", themeId: "football", windowStart: "2027-01-25", windowEnd: "2027-02-10" },
];

export const DEFAULT_THEME_ID = "f1";

export function resolveTheme(regionCode: string, now: Date = new Date()): string {
  const match = REGION_EVENTS.find((e) => {
    if (e.region !== regionCode) return false;
    const start = new Date(e.windowStart);
    const end = new Date(e.windowEnd);
    return now >= start && now <= end;
  });
  return match ? match.themeId : DEFAULT_THEME_ID;
}

// Usage in Next.js Edge Middleware — see middleware.ts at the project root, which
// reads the visitor's country and sets an `x-race-theme` response header so the
// theme is resolved server-side and baked into first paint (no client flicker,
// no cloaking risk for crawlers).
