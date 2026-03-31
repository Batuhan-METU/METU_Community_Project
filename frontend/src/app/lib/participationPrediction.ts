export type ParticipationPredictionInput = {
  currentParticipants: number;
  hypeScore: number;
  chatActivity: number;
  /** Hours until event start (0 if already started / past). */
  timeRemainingHours: number;
  /** Venue capacity — caps the expected range. */
  capacity: number;
};

export type InterestLevel = "Low" | "Medium" | "High";

export type PredictionBadge = "filling-fast" | "almost-full" | null;

export type ParticipationPredictionResult = {
  interestLevel: InterestLevel;
  /** e.g. "80–120" */
  expectedRange: string;
  statusText: string;
  /** 0–100, current signups vs capacity — for progress UI. */
  fillPercent: number;
  /** 0–100, overall interest score for secondary indicator. */
  interestScorePercent: number;
  /** Short line for the callout (urgency vs invitation). */
  uxMessage: string;
  badge: PredictionBadge;
};

/**
 * Simple weighted blend of fill rate, hype, chat, and time urgency.
 * Tuned for mock dashboards — not a statistical model.
 */
export function predictParticipation(
  input: ParticipationPredictionInput,
): ParticipationPredictionResult {
  const {
    currentParticipants: cur,
    hypeScore,
    chatActivity,
    timeRemainingHours: tHours,
    capacity: capRaw,
  } = input;

  const capacity = Math.max(1, capRaw);
  const pNorm = Math.min(1, cur / capacity);
  const hNorm = Math.min(1, hypeScore / 520);
  const cNorm = Math.min(1, chatActivity / 380);
  const tNorm =
    tHours <= 0
      ? 0.12
      : tHours <= 24
        ? 1
        : tHours <= 72
          ? 0.78
          : tHours <= 168
            ? 0.52
            : 0.34;

  const composite =
    0.32 * pNorm + 0.28 * hNorm + 0.28 * cNorm + 0.12 * tNorm;

  const interestLevel: InterestLevel =
    composite < 0.38 ? "Low" : composite < 0.62 ? "Medium" : "High";

  const room = Math.max(0, capacity - cur);
  const growthFactor = composite * 0.58;
  const mid = cur + room * growthFactor;
  const spread = Math.max(6, Math.round(8 + (1 - composite) * 26));

  let low = Math.round(mid - spread / 2);
  let high = Math.round(mid + spread / 2);
  low = Math.max(cur, Math.min(low, capacity));
  high = Math.max(low, Math.min(high, capacity));
  if (high - low < 8) {
    high = Math.min(capacity, low + 10);
  }

  const expectedRange = `${low}–${high}`;

  let statusText: string;
  if (pNorm >= 0.82 && tHours <= 72 && tHours > 0) {
    statusText = "Filling fast";
  } else if (pNorm >= 0.65 && tHours <= 120 && tHours > 0) {
    statusText = "Popular — seats moving quickly";
  } else if (composite >= 0.58) {
    statusText = "Strong momentum";
  } else if (composite >= 0.38) {
    statusText = "Steady interest";
  } else {
    statusText = "Room to grow";
  }

  const fillPercent = Math.min(100, Math.round(pNorm * 100));
  const interestScorePercent = Math.min(100, Math.round(composite * 100));

  let uxMessage: string;
  if (interestLevel === "High") {
    uxMessage =
      pNorm >= 0.72
        ? "Limited spots left — don’t wait too long."
        : "Limited spots left";
  } else if (interestLevel === "Low") {
    uxMessage = "Be one of the first to join";
  } else {
    uxMessage = "Good time to secure your spot before it picks up.";
  }

  let badge: PredictionBadge = null;
  if (pNorm >= 0.85) {
    badge = "almost-full";
  } else if (
    statusText === "Filling fast" ||
    (pNorm >= 0.68 && tHours > 0 && tHours <= 96)
  ) {
    badge = "filling-fast";
  }

  return {
    interestLevel,
    expectedRange,
    statusText,
    fillPercent,
    interestScorePercent,
    uxMessage,
    badge,
  };
}
