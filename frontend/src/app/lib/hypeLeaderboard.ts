import type { MockEvent } from "../data/mockEvents";
import { getMockEventSatisfaction } from "../data/mockEventSatisfaction";
import type { EventRatingRecord } from "./eventRatingsStorage";

const DEFAULT_DURATION_H = 2.5;

/**
 * Parse catalog ISO `YYYY-MM-DDTHH:mm:ss` as UTC so leaderboard ordering matches
 * on the server and in the browser (no TZ drift).
 */
export function parseCatalogDateUtc(iso: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/.exec(iso.trim());
  if (!m) return new Date(iso).getTime();
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
}

export function catalogEventEndMsUtc(
  startIso: string,
  durationHours = DEFAULT_DURATION_H,
): number {
  return parseCatalogDateUtc(startIso) + durationHours * 3600 * 1000;
}

export type PostEventHypeInputs = {
  fillRatio: number;
  averageRating: number;
  ratingCount: number;
};

/**
 * Finished events only: turnout (fill vs capacity) + average rating + review volume.
 */
export function computePostEventHypeScore(input: PostEventHypeInputs): number {
  const fill = Math.min(1, Math.max(0, input.fillRatio));
  const avg = Math.min(5, Math.max(0, input.averageRating));
  const rc = Math.max(0, input.ratingCount);
  const fillPts = fill * 380;
  const ratingPts = avg * 58;
  const volumePts = Math.min(95, Math.sqrt(rc + 1) * 7.5);
  return fillPts + ratingPts + volumePts;
}

export function hypeScoreForCatalogEvent(
  ev: MockEvent,
  userRating: EventRatingRecord | null,
): number {
  const fill = ev.filledSeats / Math.max(ev.totalSeats, 1);
  const sat = getMockEventSatisfaction(ev.id);
  const averageRating = userRating?.rating ?? sat.averageRating;
  const ratingCount = userRating ? sat.reviewCount + 1 : sat.reviewCount;
  return computePostEventHypeScore({
    fillRatio: fill,
    averageRating,
    ratingCount,
  });
}

export function displayRatingForCatalogEvent(
  ev: MockEvent,
  userRating: EventRatingRecord | null,
): number {
  const sat = getMockEventSatisfaction(ev.id);
  if (userRating) return userRating.rating;
  return sat.averageRating;
}

/**
 * Fixed “now” for the hype table (UTC). Only events that ended before this and
 * have community ratings are ranked (see `filterCompletedForLeaderboard`).
 */
export const HYPE_LEADERBOARD_REFERENCE_NOW_MS = Date.UTC(
  2026,
  2,
  28,
  12,
  0,
  0,
  0,
);

/** At least one community rating exists (mock reviews or future API). */
export function hasCommunityRatings(ev: MockEvent): boolean {
  return getMockEventSatisfaction(ev.id).reviewCount > 0;
}

function utcWeekRangeContaining(nowMs: number): { start: number; end: number } {
  const d = new Date(nowMs);
  const dow = d.getUTCDay();
  const fromMon = (dow + 6) % 7;
  const start = Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate() - fromMon,
    0,
    0,
    0,
    0,
  );
  const end = start + 7 * 24 * 60 * 60 * 1000;
  return { start, end };
}

/**
 * Finished + rated events for the hype table: prefer the UTC week of the reference “now”,
 * then last 14 days of completions, then the most recently finished events.
 * Unfinished or future events never appear; unrated events (no review count) are excluded.
 */
export function filterCompletedForLeaderboard(
  events: readonly MockEvent[],
  referenceNowMs: number,
): MockEvent[] {
  const done = events
    .map((ev) => ({
      ev,
      endMs: catalogEventEndMsUtc(ev.date),
    }))
    .filter(
      ({ ev, endMs }) =>
        endMs < referenceNowMs && hasCommunityRatings(ev),
    )
    .sort((a, b) => b.endMs - a.endMs);

  const { start: wStart, end: wEnd } = utcWeekRangeContaining(referenceNowMs);
  let picked = done.filter(
    ({ endMs }) => endMs >= wStart && endMs < wEnd && endMs < referenceNowMs,
  );
  if (picked.length < 2) {
    const fourteenMs = 14 * 24 * 60 * 60 * 1000;
    picked = done.filter(({ endMs }) => endMs >= referenceNowMs - fourteenMs);
  }
  if (picked.length < 1) {
    picked = done.slice(0, 12);
  }
  return picked.map((p) => p.ev);
}
