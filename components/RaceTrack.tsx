// components/RaceTrack.tsx
// Themed leaderboard visual. Ships with an F1 track by default; a cricket-themed
// scoreboard proves the theme-switching concept (BUILD_BRIEF.md section 3/6, Day 2).
// Server component — renders as plain HTML/SVG server-side so crawlers see real
// content, not a blank canvas waiting for client JS.

import type { AiModel } from "@/lib/models-schema";

interface RaceTrackProps {
  models: AiModel[]; // pre-sorted by rank_current
  themeId: string; // from resolveTheme() in lib/geo-theme.ts
}

// Each theme maps a model's rank/position to a visual "runner". Keep the mapping
// function separate per theme so adding a new theme doesn't touch ranking logic.
function getThemeRenderer(themeId: string) {
  switch (themeId) {
    case "cricket":
      return renderCricketBoard;
    case "football":
      return renderFootballBoard;
    case "f1":
    default:
      return renderF1Track;
  }
}

function rankDelta(m: AiModel): { symbol: string; label: string; className: string } {
  if (m.rank_previous_period == null) return { symbol: "•", label: "new", className: "text-muted" };
  const delta = m.rank_previous_period - m.rank_current;
  if (delta > 0) return { symbol: "▲", label: `+${delta}`, className: "text-verify" };
  if (delta < 0) return { symbol: "▼", label: `${delta}`, className: "text-signal" };
  return { symbol: "—", label: "0", className: "text-muted" };
}

function renderF1Track(models: AiModel[]) {
  return (
    <div className="race-track race-track--f1 flex flex-col gap-px border border-rule bg-rule">
      {models.map((m) => {
        const delta = rankDelta(m);
        return (
          <div
            key={m.slug}
            className="race-track__car flex items-center gap-3 bg-surface px-4 py-2.5"
            style={{ order: m.rank_current }}
          >
            <span className="w-6 text-right font-mono text-sm text-muted">{m.rank_current}</span>
            <img src={m.org_logo_url} alt={`${m.org_name} logo`} width={24} height={24} className="rounded-sm" />
            <span className="flex-1 truncate font-sans text-sm font-medium text-ink">{m.model_name}</span>
            <span className="font-mono text-xs uppercase tracking-wider text-muted">{m.org_country}</span>
            <span className={`w-10 text-right font-mono text-xs ${delta.className}`}>
              {delta.symbol} {delta.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function renderCricketBoard(models: AiModel[]) {
  return (
    <div className="race-track race-track--cricket flex flex-col gap-px border border-verify/30 bg-verify/10">
      {models.map((m) => {
        const delta = rankDelta(m);
        return (
          <div
            key={m.slug}
            className="race-track__wicket flex items-center gap-3 bg-deep px-4 py-2.5"
            style={{ order: m.rank_current }}
          >
            <span className="w-6 text-right font-mono text-sm text-verify">#{m.rank_current}</span>
            <img src={m.org_logo_url} alt={`${m.org_name} logo`} width={24} height={24} className="rounded-sm" />
            <span className="flex-1 truncate font-sans text-sm font-medium text-ink">{m.model_name}</span>
            <span className="font-mono text-xs uppercase tracking-wider text-verify/80">{m.org_country}</span>
            <span className={`w-10 text-right font-mono text-xs ${delta.className}`}>
              {delta.symbol} {delta.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function renderFootballBoard(models: AiModel[]) {
  // TODO: football theme visual — not built for v1 (BUILD_BRIEF.md Day 2 only asks
  // for F1 + one alternate to prove the concept). resolveTheme() can still select
  // "football"; until this is built it falls back to the data table below.
  return (
    <div className="race-track race-track--football border border-rule bg-surface p-4 font-mono text-sm text-muted">
      Football theme coming soon — {models.length} models tracked in the meantime.
    </div>
  );
}

export default function RaceTrack({ models, themeId }: RaceTrackProps) {
  const renderer = getThemeRenderer(themeId);

  return (
    <section aria-label="Global AI model rankings, live">
      {renderer(models)}

      {/* Machine-readable fallback table — always rendered regardless of theme.
          This is what AI crawlers and screen readers actually parse (BUILD_BRIEF.md
          section 4: "Comparison tables in HTML, not images"). */}
      <table className="race-track__data-table mt-8 w-full border-collapse text-sm">
        <caption className="mb-2 text-left font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
          Live AI model rankings — updated every 72 hours
        </caption>
        <thead>
          <tr className="border-b border-rule-strong text-left font-mono text-[11px] uppercase tracking-wider text-muted">
            <th className="py-2 pr-4">Rank</th>
            <th className="py-2 pr-4">Model</th>
            <th className="py-2 pr-4">Organization</th>
            <th className="py-2 pr-4">Country</th>
            <th className="py-2 pr-4">Type</th>
            <th className="py-2 pr-4">Released</th>
            <th className="py-2 pr-4">Benchmark score</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m.slug} className="border-b border-rule">
              <td className="py-2 pr-4 font-mono">{m.rank_current}</td>
              <td className="py-2 pr-4">
                <a href={`/race/models/${m.slug}`} className="text-ink hover:text-signal transition-colors">
                  {m.model_name}
                </a>
              </td>
              <td className="py-2 pr-4 text-ink/80">{m.org_name}</td>
              <td className="py-2 pr-4 text-ink/80">{m.org_country}</td>
              <td className="py-2 pr-4 text-ink/80">{m.model_type}</td>
              <td className="py-2 pr-4 text-ink/80">{m.release_date}</td>
              <td className="py-2 pr-4 text-ink/80">
                {m.benchmark_scores?.score ?? "—"}
                {m.benchmark_scores?.source ? (
                  <span className="ml-1 font-mono text-xs text-dim">({m.benchmark_scores.source})</span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
