/**
 * Simple hype score: participants + chat volume + recency boost.
 * Weights tuned so all three factors matter for mock leaderboards.
 */
export type HypeScoreInputs = {
  participantCount: number;
  chatMessageCount: number;
  /** Last chat activity (ISO) — closer to "now" increases score */
  lastActivityAt: string;
  /** Community average rating (0–5), mock or blended */
  averageRating?: number;
  /** Number of ratings behind the average */
  ratingCount?: number;
};

/**
 * @param nowMs - Pass a fixed timestamp in tests/build for deterministic ordering.
 */
export function calculateHypeScore(
  inputs: HypeScoreInputs,
  nowMs: number = Date.now(),
): number {
  const p = Math.max(0, inputs.participantCount);
  const m = Math.max(0, inputs.chatMessageCount);
  const last = new Date(inputs.lastActivityAt).getTime();
  const hoursAgo = Math.max(0, (nowMs - last) / (1000 * 60 * 60));

  // Decays over ~3 days; strongest when activity was recent
  const recencyBoost = 100 * Math.exp(-hoursAgo / 36);

  const avg = Math.min(5, Math.max(0, inputs.averageRating ?? 0));
  const rc = Math.max(0, inputs.ratingCount ?? 0);
  const ratingLift = avg * 22 + Math.min(95, Math.sqrt(rc + 1) * 9);

  return p * 2.2 + m * 0.65 + recencyBoost + ratingLift;
}
