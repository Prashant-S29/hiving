// Themed leaderboard visual. Ranking remains code-owned; labels and model facts
// are supplied by Sanity through the server page.

import { applyTemplate, type RaceModel, type RaceSettingsContent } from "@/lib/sanity/race";

interface RaceTrackProps {
  models: RaceModel[];
  themeId: string;
  copy: RaceSettingsContent;
}

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

function rankDelta(m: RaceModel, newRankLabel: string) {
  if (m.rank_previous_period == null) return { symbol: "•", label: newRankLabel, className: "text-muted" };
  const delta = m.rank_previous_period - m.rank_current;
  if (delta > 0) return { symbol: "▲", label: `+${delta}`, className: "text-verify" };
  if (delta < 0) return { symbol: "▼", label: `${delta}`, className: "text-signal" };
  return { symbol: "—", label: "0", className: "text-muted" };
}

function logoAlt(model: RaceModel, copy: RaceSettingsContent) {
  return model.organization.logoAlt || applyTemplate(copy.logoAltTemplate, { organization: model.org_name });
}

function renderF1Track(models: RaceModel[], copy: RaceSettingsContent) {
  return (
    <div className="race-track race-track--f1 flex flex-col gap-px border border-rule bg-rule">
      {models.map((model) => {
        const delta = rankDelta(model, copy.newRankLabel);
        return (
          <div key={model.slug} className="race-track__car flex items-center gap-3 bg-surface px-4 py-2.5" style={{ order: model.rank_current }}>
            <span className="w-6 text-right font-mono text-sm text-muted">{model.rank_current}</span>
            <img src={model.org_logo_url} alt={logoAlt(model, copy)} width={24} height={24} className="rounded-sm" />
            <span className="flex-1 truncate font-sans text-sm font-medium text-ink">{model.model_name}</span>
            <span className="font-mono text-xs uppercase tracking-wider text-muted">{model.org_country}</span>
            <span className={`w-10 text-right font-mono text-xs ${delta.className}`}>{delta.symbol} {delta.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function renderCricketBoard(models: RaceModel[], copy: RaceSettingsContent) {
  return (
    <div className="race-track race-track--cricket flex flex-col gap-px border border-verify/30 bg-verify/10">
      {models.map((model) => {
        const delta = rankDelta(model, copy.newRankLabel);
        return (
          <div key={model.slug} className="race-track__wicket flex items-center gap-3 bg-deep px-4 py-2.5" style={{ order: model.rank_current }}>
            <span className="w-6 text-right font-mono text-sm text-verify">#{model.rank_current}</span>
            <img src={model.org_logo_url} alt={logoAlt(model, copy)} width={24} height={24} className="rounded-sm" />
            <span className="flex-1 truncate font-sans text-sm font-medium text-ink">{model.model_name}</span>
            <span className="font-mono text-xs uppercase tracking-wider text-verify/80">{model.org_country}</span>
            <span className={`w-10 text-right font-mono text-xs ${delta.className}`}>{delta.symbol} {delta.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function renderFootballBoard(models: RaceModel[], copy: RaceSettingsContent) {
  return (
    <div className="race-track race-track--football border border-rule bg-surface p-4 font-mono text-sm text-muted">
      {applyTemplate(copy.footballComingSoonTemplate, { count: models.length })}
    </div>
  );
}

export default function RaceTrack({ models, themeId, copy }: RaceTrackProps) {
  const renderer = getThemeRenderer(themeId);
  return (
    <section aria-label={copy.leaderboardAriaLabel}>
      {renderer(models, copy)}

      <table className="race-track__data-table mt-8 w-full border-collapse text-sm">
        <caption className="mb-2 text-left font-mono text-[11px] uppercase tracking-[0.1em] text-muted">{copy.tableCaption}</caption>
        <thead>
          <tr className="border-b border-rule-strong text-left font-mono text-[11px] uppercase tracking-wider text-muted">
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
            <tr key={model.slug} className="border-b border-rule">
              <td className="py-2 pr-4 font-mono">{model.rank_current}</td>
              <td className="py-2 pr-4"><a href={`/race/models/${model.slug}`} className="text-ink hover:text-signal transition-colors">{model.model_name}</a></td>
              <td className="py-2 pr-4 text-ink/80">{model.org_name}</td>
              <td className="py-2 pr-4 text-ink/80">{model.org_country}</td>
              <td className="py-2 pr-4 text-ink/80">{model.model_type}</td>
              <td className="py-2 pr-4 text-ink/80">{model.release_date}</td>
              <td className="py-2 pr-4 text-ink/80">
                {model.benchmark_scores?.score ?? "—"}
                {model.benchmark_scores?.source ? <span className="ml-1 font-mono text-xs text-dim">({model.benchmark_scores.source})</span> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
