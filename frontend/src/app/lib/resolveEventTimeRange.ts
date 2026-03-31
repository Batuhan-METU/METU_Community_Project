import { MOCK_CONFLICT_DEMO_EVENTS } from "../data/mockConflictDemoEvents";
import { mockEvents } from "../data/mockEvents";
import { MOCK_USER_JOINED_EVENTS } from "../data/mockUserJoinedEvents";
import type { EventTimeRange } from "./schedulingConflict";
import { inferMockEventEndTime } from "./eventTimeRange";

/** Time range plus display name for conflict UI. */
export type OccupiedSlotInfo = EventTimeRange & { name: string };

/**
 * Resolve an event id to a time range for scheduling (mock catalog + demos + mock joined list).
 */
export function resolveEventTimeRange(
  eventId: string | number,
): EventTimeRange | null {
  const full = resolveOccupiedSlotInfo(eventId);
  return full ? { startTime: full.startTime, endTime: full.endTime } : null;
}

/**
 * Full slot info for conflict modal copy.
 */
export function resolveOccupiedSlotInfo(
  eventId: string | number,
): OccupiedSlotInfo | null {
  const key = String(eventId);

  const demo = MOCK_CONFLICT_DEMO_EVENTS.find((e) => e.id === key);
  if (demo) {
    return {
      name: demo.name,
      startTime: demo.startTime,
      endTime: demo.endTime,
    };
  }

  const n = Number(key);
  if (!Number.isNaN(n)) {
    const m = mockEvents.find((e) => e.id === n);
    if (m) {
      return {
        name: m.title,
        startTime: m.date,
        endTime: inferMockEventEndTime(m.date),
      };
    }
  }

  const u = MOCK_USER_JOINED_EVENTS.find((e) => String(e.id) === key);
  if (u) {
    return {
      name: u.name,
      startTime: u.startTime,
      endTime: u.endTime,
    };
  }

  return null;
}
