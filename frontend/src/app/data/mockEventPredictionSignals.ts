/**
 * Mock hype + chat signals for participation prediction (per catalog event id).
 * Aligned loosely with hype leaderboard stories where overlap exists.
 */
export type EventPredictionSignals = {
  hypeScore: number;
  chatActivity: number;
};

export const MOCK_EVENT_PREDICTION_SIGNALS: Record<
  number,
  EventPredictionSignals
> = {
  1: { hypeScore: 412, chatActivity: 352 },
  2: { hypeScore: 268, chatActivity: 88 },
  3: { hypeScore: 310, chatActivity: 195 },
  4: { hypeScore: 195, chatActivity: 72 },
  5: { hypeScore: 398, chatActivity: 195 },
  6: { hypeScore: 245, chatActivity: 156 },
  7: { hypeScore: 220, chatActivity: 98 },
  8: { hypeScore: 228, chatActivity: 142 },
  9: { hypeScore: 285, chatActivity: 112 },
  10: { hypeScore: 455, chatActivity: 280 },
};

export function getMockPredictionSignals(
  eventId: number,
): EventPredictionSignals {
  return (
    MOCK_EVENT_PREDICTION_SIGNALS[eventId] ?? {
      hypeScore: 260,
      chatActivity: 100,
    }
  );
}

/** Mock week-over-week style trend % for list strips (📈 +X%). */
export const MOCK_LIST_TREND_PERCENT: Record<number, number> = {
  1: 18,
  2: 9,
  3: 14,
  4: 7,
  5: 16,
  6: 11,
  7: 10,
  8: 15,
  9: 12,
  10: 22,
};

export function getMockListTrendPercent(eventId: number): number {
  return MOCK_LIST_TREND_PERCENT[eventId] ?? 12;
}
