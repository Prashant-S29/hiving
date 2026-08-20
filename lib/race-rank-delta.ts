// Shared by RaceTrack.tsx (server) and RaceHero.tsx (client) — kept in its
// own module, importing only the RaceModel *type* from lib/sanity/race, so
// that RaceHero (a client component) never pulls in lib/sanity/race's
// runtime dependency chain (which reaches next/headers via lib/sanity/fetch
// and can't be bundled into client code).
import type { RaceModel } from "@/lib/sanity/race";

export function rankDelta(m: RaceModel, newRankLabel: string) {
  if (m.rank_previous_period == null) return { symbol: "•", label: newRankLabel, className: "text-muted" };
  const delta = m.rank_previous_period - m.rank_current;
  if (delta > 0) return { symbol: "▲", label: `+${delta}`, className: "text-verify" };
  if (delta < 0) return { symbol: "▼", label: `${delta}`, className: "text-signal" };
  return { symbol: "—", label: "0", className: "text-muted" };
}
