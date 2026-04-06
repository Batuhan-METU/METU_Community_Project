import type { MockEvent } from "../data/mockEvents";
import {
  getMockListTrendPercent,
  getMockPredictionSignals,
} from "../data/mockEventPredictionSignals";
import { HYPE_SCORE_REFERENCE_NOW_MS } from "../data/mockHypeRanking";
import {
  predictParticipation,
  type ParticipationPredictionResult,
} from "./participationPrediction";

export type EventListPredictionBundle = {
  prediction: ParticipationPredictionResult;
  trendPercent: number;
};

export function computeEventListPrediction(
  event: MockEvent,
): EventListPredictionBundle {
  const signals = getMockPredictionSignals(event.id);
  const timeRemainingHours = Math.max(
    0,
    (new Date(event.date).getTime() - HYPE_SCORE_REFERENCE_NOW_MS) /
      (1000 * 60 * 60),
  );
  const prediction = predictParticipation({
    currentParticipants: event.filledSeats,
    hypeScore: signals.hypeScore,
    chatActivity: signals.chatActivity,
    timeRemainingHours,
    capacity: event.totalSeats,
  });
  return {
    prediction,
    trendPercent: getMockListTrendPercent(event.id),
  };
}
