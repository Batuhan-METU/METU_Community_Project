import { hasRatedEvent } from "./eventRatingsStorage";
import {
  getEventEndTimeIso,
  POST_EVENT_RATING_NOTIFICATION_DELAY_MS,
} from "./postEventRatingEligibility";
import { mockEvents } from "./mockEvents";

export const RATING_NOTIFICATIONS_STORAGE_KEY = "metu_inAppNotifications";

export type RatingNotificationRecord = {
  id: string;
  type: "rating";
  /** String id aligned with joinedEvents entries */
  eventId: string;
  message: string;
  createdAt: string;
};

function readAll(): RatingNotificationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RATING_NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (n): n is RatingNotificationRecord =>
        n &&
        typeof n === "object" &&
        (n as RatingNotificationRecord).type === "rating" &&
        typeof (n as RatingNotificationRecord).id === "string" &&
        typeof (n as RatingNotificationRecord).eventId === "string" &&
        typeof (n as RatingNotificationRecord).message === "string",
    );
  } catch {
    return [];
  }
}

function writeAll(rows: RatingNotificationRecord[], emitChange = true) {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(rows);
  try {
    const prev = window.localStorage.getItem(RATING_NOTIFICATIONS_STORAGE_KEY);
    if (prev === serialized) {
      return;
    }
    window.localStorage.setItem(RATING_NOTIFICATIONS_STORAGE_KEY, serialized);
  } catch {
    /* quota */
  }
  if (emitChange) {
    window.dispatchEvent(new CustomEvent("metu-notifications-changed"));
  }
}

/**
 * Keep only rating rows that are still valid: catalog event exists, end + notification delay passed, not rated yet.
 * Drops stale rows (e.g. before the event actually ended, or after rating).
 */
function keepValidRatingRows(
  rows: RatingNotificationRecord[],
  now: Date,
): RatingNotificationRecord[] {
  return rows.filter((r) => {
    if (r.type !== "rating") return true;
    const n = Number(r.eventId);
    if (Number.isNaN(n)) return false;
    if (hasRatedEvent(n)) return false;
    const ev = mockEvents.find((e) => e.id === n);
    if (!ev) return false;
    const eventEnd = new Date(getEventEndTimeIso(ev));
    if (Number.isNaN(eventEnd.getTime())) return false;
    return (
      eventEnd.getTime() + POST_EVENT_RATING_NOTIFICATION_DELAY_MS < now.getTime()
    );
  });
}

export function getRatingNotifications(): RatingNotificationRecord[] {
  const raw = readAll();
  const pruned = keepValidRatingRows(raw, new Date());
  if (pruned.length < raw.length) {
    writeAll(pruned, false);
  }
  return pruned;
}

/**
 * Remove a rating notification for this event (e.g. after submit).
 */
export function removeRatingNotificationForEvent(eventId: string | number): void {
  const key = String(eventId);
  const next = readAll().filter(
    (r) => !(r.type === "rating" && r.eventId === key),
  );
  writeAll(next);
}

/**
 * For each joined event: if eventEnd < now and not rated and no notification yet — append one.
 * Not tied to join actions; call on load / interval with wall-clock time.
 */
export function syncRatingNotificationsFromJoined(
  joinedEventIds: readonly string[],
): void {
  const now = new Date();
  let rows = keepValidRatingRows(readAll(), now);

  const existingIds = new Set(
    rows.filter((r) => r.type === "rating").map((r) => r.eventId),
  );

  for (const idStr of joinedEventIds) {
    const eventIdNum = Number(idStr);
    if (Number.isNaN(eventIdNum)) continue;
    const ev = mockEvents.find((e) => e.id === eventIdNum);
    if (!ev) continue;

    const eventEnd = new Date(getEventEndTimeIso(ev));
    if (Number.isNaN(eventEnd.getTime())) continue;

    if (
      !(eventEnd.getTime() + POST_EVENT_RATING_NOTIFICATION_DELAY_MS < now.getTime())
    )
      continue;
    if (hasRatedEvent(eventIdNum)) continue;
    if (existingIds.has(idStr)) continue;

    rows.push({
      id: `rate-${idStr}`,
      type: "rating",
      eventId: idStr,
      message: "⭐ Rate the event you attended",
      createdAt: new Date().toISOString(),
    });
    existingIds.add(idStr);
  }

  writeAll(rows);
}
