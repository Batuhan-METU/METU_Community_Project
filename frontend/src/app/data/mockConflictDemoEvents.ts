/**
 * Demo events with intentional schedule relationships:
 * - event1 & event2 overlap (19:00–20:00).
 * - event2 ends when event3 starts (21:00) — no overlap, useful for boundary tests.
 */

export type ConflictDemoEvent = {
  id: string;
  name: string;
  club: string;
  startTime: string;
  endTime: string;
};

export const MOCK_CONFLICT_DEMO_EVENTS: ConflictDemoEvent[] = [
  {
    id: "event1",
    name: "AI Summit",
    club: "AI Club",
    startTime: "2026-11-28T18:00:00",
    endTime: "2026-11-28T20:00:00",
  },
  {
    id: "event2",
    name: "Hackathon",
    club: "IEEE",
    startTime: "2026-11-28T19:00:00",
    endTime: "2026-11-28T21:00:00",
  },
  {
    id: "event3",
    name: "Design Workshop",
    club: "Design Club",
    startTime: "2026-11-28T21:00:00",
    endTime: "2026-11-28T22:30:00",
  },
];
