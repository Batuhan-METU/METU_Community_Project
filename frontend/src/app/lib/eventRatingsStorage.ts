const STORAGE_KEY = "eventRatings";

export type EventRatingRecord = {
  eventId: number;
  rating: number;
  comment: string;
  submittedAt: string;
};

function readAll(): EventRatingRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r): r is EventRatingRecord =>
        r &&
        typeof r === "object" &&
        typeof (r as EventRatingRecord).eventId === "number" &&
        typeof (r as EventRatingRecord).rating === "number",
    );
  } catch {
    return [];
  }
}

function writeAll(rows: EventRatingRecord[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch {
    /* quota */
  }
}

export function getEventRating(eventId: number): EventRatingRecord | null {
  return readAll().find((r) => r.eventId === eventId) ?? null;
}

export function hasRatedEvent(eventId: number): boolean {
  return getEventRating(eventId) != null;
}

/**
 * One rating per event per user (upsert).
 * Returns the saved record.
 */
export function saveEventRating(
  eventId: number,
  rating: number,
  comment: string,
): EventRatingRecord {
  const row: EventRatingRecord = {
    eventId,
    rating: Math.min(5, Math.max(1, Math.round(rating))),
    comment: comment.trim(),
    submittedAt: new Date().toISOString(),
  };
  const rest = readAll().filter((r) => r.eventId !== eventId);
  rest.push(row);
  writeAll(rest);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("metu-event-ratings-changed"));
    void import("./ratingNotificationsStorage").then((m) => {
      m.removeRatingNotificationForEvent(eventId);
    });
  }
  return row;
}
