/**
 * Mock events the current user has joined — for scheduling / conflict detection.
 * Times are ISO 8601 strings (no offset; treat as local wall-clock for demos).
 */

export type UserJoinedEvent = {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
};

/**
 * Realistic sample set:
 * - Includes pairs that overlap (same day) for conflict tests.
 * - Includes adjacent and disjoint slots.
 */
export const MOCK_USER_JOINED_EVENTS: UserJoinedEvent[] = [
  {
    id: 1,
    name: "AI & Machine Learning Workshop",
    startTime: "2026-03-05T17:30:00",
    endTime: "2026-03-05T20:00:00",
  },
  {
    id: 2,
    name: "Astronomy Observation Night",
    startTime: "2026-03-12T20:00:00",
    endTime: "2026-03-12T22:30:00",
  },
  {
    id: 3,
    name: "Startup Networking Meetup",
    startTime: "2026-03-18T18:00:00",
    endTime: "2026-03-18T20:30:00",
  },
  {
    id: 5,
    name: "Open Air Movie Night",
    startTime: "2026-03-25T21:00:00",
    endTime: "2026-03-25T23:45:00",
  },
  /** Overlaps the next row (14:00–16:00 vs 15:00–17:00 → conflict 15:00–16:00). */
  {
    id: 101,
    name: "Design Systems Working Group",
    startTime: "2026-09-05T14:00:00",
    endTime: "2026-09-05T16:00:00",
  },
  {
    id: 102,
    name: "Industry Career Panel",
    startTime: "2026-09-05T15:00:00",
    endTime: "2026-09-05T17:00:00",
  },
  /** Back-to-back with a following event (no overlap, useful for boundary tests). */
  {
    id: 103,
    name: "Campus Running Club — Morning Loop",
    startTime: "2026-09-12T07:00:00",
    endTime: "2026-09-12T08:00:00",
  },
  {
    id: 104,
    name: "Breakfast Study Session",
    startTime: "2026-09-12T08:00:00",
    endTime: "2026-09-12T09:30:00",
  },
];
