import type { InterestLevel } from "../lib/participationPrediction";

export function formatInterestLevelLabel(level: InterestLevel): string {
  switch (level) {
    case "High":
      return "🔥 High Interest";
    case "Medium":
      return "✨ Medium Interest";
    default:
      return "○ Low Interest";
  }
}

type EventListPredictionInfoProps = {
  interestLevel: InterestLevel;
  expectedRange: string;
  trendPercent: number;
  /** Horizontal padding to match the card body (e.g. px-5 vs px-4). */
  className?: string;
};

/** Footer strip inside the same card box as the event (Explore / Events lists). */
export function EventListPredictionInfo({
  interestLevel,
  expectedRange,
  trendPercent,
  className = "px-5",
}: EventListPredictionInfoProps) {
  return (
    <div
      className={`shrink-0 border-t border-gray-100 bg-gray-50/90 py-2.5 ${className}`}
      aria-label="Participation forecast"
    >
      <p className="text-sm leading-snug text-gray-500">
        {formatInterestLevelLabel(interestLevel)} • 👥 {expectedRange} • 📈 +{trendPercent}%
      </p>
    </div>
  );
}
