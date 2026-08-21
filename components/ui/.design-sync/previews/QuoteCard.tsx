import { QuoteCard } from "@hivig/design-system";

export function MidTier() {
  return (
    <QuoteCard
      quotedPriceUSD={896}
      geoRegion="US"
      modelUsed="sonnet-5"
      expertiseTier="Mid"
      estimatedTokens={24000}
      estimatedHumanHours={28}
      modelCreditsCostUSD={0.14}
      humanHoursCostUSD={560}
    />
  );
}

export function SeniorTier() {
  return (
    <QuoteCard
      quotedPriceUSD={2184}
      geoRegion="EU"
      modelUsed="opus-5"
      expertiseTier="Senior"
      estimatedTokens={61000}
      estimatedHumanHours={30}
      modelCreditsCostUSD={1.83}
      humanHoursCostUSD={1350}
    />
  );
}
