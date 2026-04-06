import { inferMockEventEndTime } from "./eventTimeRange";
import type { MockEvent } from "../data/mockEvents";

/** After scheduled end, wait this long before post-event rating *notifications* (banner / nav). */
export const POST_EVENT_RATING_NOTIFICATION_DELAY_MS = 10 * 60 * 1000;

export function getEventEndTimeIso(event: MockEvent): string {
  return inferMockEventEndTime(event.date);
}

/**
 * Event is "completed" for status / dashboard Rate button iff end is in the past.
 * Uses: const now = new Date(); const eventEnd = new Date(endTimeIso); eventEnd < now
 */
export function isEventCompletedNow(endTimeIso: string): boolean {
  const now = new Date();
  const eventEnd = new Date(endTimeIso);
  if (Number.isNaN(eventEnd.getTime())) return false;
  return eventEnd < now;
}

/**
 * "Rate the event you attended" notifications only after end + grace window.
 * Requires: joined (caller) + !hasRated (caller) + eventEnd + delay < now.
 */
export function shouldShowPostEventRatingNotification(
  endTimeIso: string,
  hasRated: boolean,
): boolean {
  if (hasRated) return false;
  const eventEnd = new Date(endTimeIso);
  if (Number.isNaN(eventEnd.getTime())) return false;
  const now = Date.now();
  return (
    eventEnd.getTime() + POST_EVENT_RATING_NOTIFICATION_DELAY_MS < now
  );
}

/** Dashboard: show Rate button once the event has ended (no notification delay). */
export function canShowRateEventButton(
  endTimeIso: string,
  hasRated: boolean,
): boolean {
  if (hasRated) return false;
  return isEventCompletedNow(endTimeIso);
}
