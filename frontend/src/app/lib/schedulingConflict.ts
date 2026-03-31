/**
 * Detect overlap between a proposed event and existing commitments.
 *
 * Overlap (half-open style, works with ISO datetimes as parsed by `Date`):
 * `newStart < existingEnd && newEnd > existingStart`
 *
 * Touching boundaries (e.g. one ends when the other starts) do not overlap.
 */

export type EventTimeRange = {
  startTime: string;
  endTime: string;
};

function rangeOverlapMs(
  newStartMs: number,
  newEndMs: number,
  existingStartMs: number,
  existingEndMs: number,
): boolean {
  return newStartMs < existingEndMs && newEndMs > existingStartMs;
}

/**
 * Returns the first existing event that overlaps the new range, or `null` if none.
 *
 * @param newEvent - Proposed `{ startTime, endTime }` (ISO 8601 strings).
 * @param joinedEvents - Events the user has already joined (same time fields).
 */
export function findSchedulingConflict<E extends EventTimeRange>(
  newEvent: EventTimeRange,
  joinedEvents: readonly E[],
): E | null {
  const newStartMs = Date.parse(newEvent.startTime);
  const newEndMs = Date.parse(newEvent.endTime);

  for (const existing of joinedEvents) {
    const existingStartMs = Date.parse(existing.startTime);
    const existingEndMs = Date.parse(existing.endTime);

    if (
      rangeOverlapMs(newStartMs, newEndMs, existingStartMs, existingEndMs)
    ) {
      return existing;
    }
  }

  return null;
}
