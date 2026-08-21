import { Button } from "./Button";
import "./QuoteCard.css";

export interface QuoteCardProps {
  quotedPriceUSD: number;
  geoRegion: string;
  modelUsed: string;
  expertiseTier: "Junior" | "Mid" | "Senior";
  estimatedTokens: number;
  estimatedHumanHours: number;
  modelCreditsCostUSD: number;
  humanHoursCostUSD: number;
  onGetDetailedQuote?: () => void;
  onAdjustInputs?: () => void;
}

/** Agent Store quote result — mirrors the real `QuoteBreakdown` shape returned by the pricing engine. */
export function QuoteCard({
  quotedPriceUSD,
  geoRegion,
  modelUsed,
  expertiseTier,
  estimatedTokens,
  estimatedHumanHours,
  modelCreditsCostUSD,
  humanHoursCostUSD,
  onGetDetailedQuote,
  onAdjustInputs,
}: QuoteCardProps) {
  return (
    <div className="hvg-qcard">
      <div className="hvg-qcard__head">
        <span className="hvg-qcard__label">Estimated quote</span>
        <span className="hvg-qcard__region">{geoRegion} pricing</span>
      </div>
      <div className="hvg-qcard__price">${quotedPriceUSD.toLocaleString()}</div>
      <div className="hvg-qcard__grid">
        <div className="hvg-qcard__line">
          <span>Model</span>
          <span>{modelUsed}</span>
        </div>
        <div className="hvg-qcard__line">
          <span>Tier</span>
          <span>{expertiseTier}</span>
        </div>
        <div className="hvg-qcard__line">
          <span>Tokens</span>
          <span>{estimatedTokens.toLocaleString()}</span>
        </div>
        <div className="hvg-qcard__line">
          <span>Hours</span>
          <span>{estimatedHumanHours}</span>
        </div>
      </div>
      <div className="hvg-qcard__actions">
        <Button size="sm" onClick={onGetDetailedQuote}>
          Get detailed quote
        </Button>
        <Button size="sm" variant="secondary" onClick={onAdjustInputs}>
          Adjust inputs
        </Button>
      </div>
      <div className="hvg-qcard__breakdown">
        MODEL COST ${modelCreditsCostUSD.toFixed(2)} · HUMAN COST ${humanHoursCostUSD.toLocaleString()}
      </div>
    </div>
  );
}
