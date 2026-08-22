// components/race-signal/SignalRaceTrack.tsx
//
// Full Race leaderboard on the Signal Room design system — the rest of
// components/RaceTrack.tsx's job (everything below the hero), rebuilt with
// real LeaderboardCard components instead of the old dark table rows.
//
// Simplification made here, worth knowing about: the old RaceTrack had
// three visual "themes" (F1 / cricket / football) picked by geo via
// middleware.ts, as a proof-of-concept that the leaderboard visual could
// vary by region. LeaderboardCard doesn't have per-theme variants, and
// building three distinct visual skins on top of a brand-new design system
// was out of scope for this pass — so every region now sees the same
// Signal Room grid. The ranking/data logic (rankDelta, rank_current) is
// unchanged; only the F1/cricket/football visual distinction is dormant
// within this redesigned area. Flag to the user if the theme-switching
// gimmick itself needs to survive the migration.

import Link from "next/link";
import { LeaderboardCard } from "@hivig/design-system";
import type { RaceModel, RaceSettingsContent } from "@/lib/sanity/race";

interface SignalRaceTrackProps {
  models: RaceModel[];
  copy: RaceSettingsContent;
}

function orgInitials(orgName: string): string {
  const words = orgName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function SignalRaceTrack({ models, copy }: SignalRaceTrackProps) {
  return (
    <section aria-label={copy.leaderboardAriaLabel}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((model, i) => (
          <Link key={model.slug} href={`/race/models/${model.slug}`} className="block transition-transform hover:-translate-y-0.5">
            <LeaderboardCard
              rank={model.rank_current}
              rankDelta={model.rank_previous_period != null ? model.rank_previous_period - model.rank_current : undefined}
              modelName={model.model_name}
              orgName={model.org_name}
              orgInitials={orgInitials(model.org_name)}
              country={model.org_country}
              modelType={model.model_type}
              hviScore={model.race_score ?? null}
              live={i < 3}
            />
          </Link>
        ))}
      </div>

      {/* Machine-readable fallback table — kept for crawlers/screen readers,
          same reasoning as the old RaceTrack: comparison tables in real
          HTML, not just cards, matter for AEO. */}
      <table className="mt-10 w-full border-collapse text-sm">
        <caption className="mb-2 text-left text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--hvg-text-muted)", fontFamily: "var(--hvg-font-mono)" }}>
          {copy.tableCaption}
        </caption>
        <thead>
          <tr className="border-b text-left text-[11px] uppercase tracking-wider" style={{ borderColor: "var(--hvg-border-strong)", color: "var(--hvg-text-muted)", fontFamily: "var(--hvg-font-mono)" }}>
            <th className="py-2 pr-4">{copy.rankColumnLabel}</th>
            <th className="py-2 pr-4">{copy.modelColumnLabel}</th>
            <th className="py-2 pr-4">{copy.organizationColumnLabel}</th>
            <th className="py-2 pr-4">{copy.countryColumnLabel}</th>
            <th className="py-2 pr-4">{copy.typeColumnLabel}</th>
            <th className="py-2 pr-4">{copy.releasedColumnLabel}</th>
            <th className="py-2 pr-4">{copy.benchmarkColumnLabel}</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => (
            <tr key={model.slug} className="border-b" style={{ borderColor: "var(--hvg-border)" }}>
              <td className="py-2 pr-4" style={{ fontFamily: "var(--hvg-font-mono)", color: "var(--hvg-text-primary)" }}>{model.rank_current}</td>
              <td className="py-2 pr-4">
                <a href={`/race/models/${model.slug}`} style={{ color: "var(--hvg-text-primary)" }}>{model.model_name}</a>
              </td>
              <td className="py-2 pr-4" style={{ color: "var(--hvg-text-secondary)" }}>{model.org_name}</td>
              <td className="py-2 pr-4" style={{ color: "var(--hvg-text-secondary)" }}>{model.org_country}</td>
              <td className="py-2 pr-4" style={{ color: "var(--hvg-text-secondary)" }}>{model.model_type}</td>
              <td className="py-2 pr-4" style={{ color: "var(--hvg-text-secondary)" }}>{model.release_date}</td>
              <td className="py-2 pr-4" style={{ color: "var(--hvg-text-secondary)" }}>
                {model.benchmark_scores?.score ?? "—"}
                {model.benchmark_scores?.source ? (
                  <span className="ml-1 text-xs" style={{ color: "var(--hvg-text-dim)", fontFamily: "var(--hvg-font-mono)" }}>
                    ({model.benchmark_scores.source})
                  </span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
