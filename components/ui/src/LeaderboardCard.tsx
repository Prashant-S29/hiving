import "./LeaderboardCard.css";

export type ModelType = "frontier" | "open-weight" | "specialized" | "agentic-framework";

export interface LeaderboardCardProps {
  rank: number;
  /** Positive = moved up since the last tracking week, negative = moved down, 0/undefined = unchanged. */
  rankDelta?: number;
  modelName: string;
  orgName: string;
  /** Short mark shown in the avatar circle, e.g. initials. */
  orgInitials: string;
  /** ISO alpha-2 country code, e.g. "US", "CN", "IN". */
  country: string;
  modelType: ModelType;
  /** Hivig Velocity Index, 0–100. */
  hviScore: number;
  live?: boolean;
}

/** Race Tracker leaderboard entry — mirrors the real `raceData` fields (rank, org, country, model type, HVI). */
export function LeaderboardCard({ rank, rankDelta, modelName, orgName, orgInitials, country, modelType, hviScore, live = true }: LeaderboardCardProps) {
  return (
    <div className="hvg-lbcard">
      <div className="hvg-lbcard__banner">
        {live ? (
          <div className="hvg-lbcard__chip hvg-lbcard__chip--live">
            <span className="hvg-lbcard__pulse" />
            Tracking live
          </div>
        ) : null}
        <div className="hvg-lbcard__chip">HVI {hviScore.toFixed(1)}</div>
        <div className="hvg-lbcard__identity">
          <div className="hvg-lbcard__avatar">{orgInitials}</div>
          <div>
            <div className="hvg-lbcard__rank">Rank #{rank}</div>
            {rankDelta ? (
              <div className={`hvg-lbcard__delta ${rankDelta > 0 ? "hvg-lbcard__delta--up" : "hvg-lbcard__delta--down"}`}>
                {rankDelta > 0 ? "▲" : "▼"} {Math.abs(rankDelta)} this week
              </div>
            ) : (
              <div className="hvg-lbcard__delta">— unchanged</div>
            )}
          </div>
        </div>
      </div>
      <div className="hvg-lbcard__body">
        <div className="hvg-lbcard__row">
          <span className="hvg-lbcard__model">{modelName}</span>
          <span className="hvg-lbcard__country">{country}</span>
        </div>
        <span className="hvg-lbcard__org">
          {orgName} · {modelType}
        </span>
      </div>
    </div>
  );
}
