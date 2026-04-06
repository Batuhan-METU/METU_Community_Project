import type { ClubThread } from "./types";

/** Aligned with `lib/mockClubs` ids 1–5 for routing from `/clubs/:id`. */
export const MOCK_CLUBS: ClubThread[] = [
  {
    id: "1",
    name: "METU Computer Society",
    lastMessage: "Hackathon repo is open — branch from main.",
    unread: 3,
    activeMembersCount: 4,
    lastActivityTime: "12m ago",
  },
  {
    id: "2",
    name: "METU Entrepreneurship Club",
    lastMessage: "Pitch night judges confirmed ✓",
    avatarUrl: "/images/avatar-placeholder.svg",
    unread: 0,
    activeMembersCount: 1,
    lastActivityTime: "1h ago",
  },
  {
    id: "3",
    name: "METU Fine Arts Collective",
    lastMessage: "Gallery opening this Thursday at the cultural center.",
    unread: 1,
    activeMembersCount: 0,
    lastActivityTime: "Yesterday",
  },
  {
    id: "4",
    name: "METU Music Society",
    lastMessage: "Open mic sign-ups close tonight.",
    avatarUrl: "/images/avatar-placeholder.svg",
    activeMembersCount: 2,
    lastActivityTime: "3h ago",
  },
  {
    id: "5",
    name: "METU Astronomy Club",
    lastMessage: "Observation night moved to the roof — clear skies!",
    unread: 5,
    activeMembersCount: 8,
    lastActivityTime: "28m ago",
  },
];

/** Order for “Recent chats” on the home dashboard (subset of thread ids). */
export const RECENT_CHAT_ORDER: readonly string[] = ["2", "1", "5", "3", "4"];
