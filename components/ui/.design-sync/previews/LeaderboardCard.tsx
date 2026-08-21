import { LeaderboardCard } from "@hivig/design-system";

export function TopRank() {
  return (
    <LeaderboardCard
      rank={1}
      rankDelta={2}
      modelName="Gemini 2.0 Flash"
      orgName="Google DeepMind"
      orgInitials="GD"
      country="US"
      modelType="frontier"
      hviScore={91.2}
      live
    />
  );
}

export function MidPack() {
  return (
    <LeaderboardCard
      rank={15}
      rankDelta={-2}
      modelName="DeepSeek-R1"
      orgName="DeepSeek"
      orgInitials="DS"
      country="CN"
      modelType="open-weight"
      hviScore={62.4}
      live
    />
  );
}

export function Unchanged() {
  return (
    <LeaderboardCard
      rank={4}
      modelName="Claude 3.5 Sonnet"
      orgName="Anthropic"
      orgInitials="AN"
      country="US"
      modelType="frontier"
      hviScore={78.9}
      live={false}
    />
  );
}
