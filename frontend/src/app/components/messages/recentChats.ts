import { MOCK_CLUBS, RECENT_CHAT_ORDER } from "./mockClubs";
import type { ClubThread } from "./types";

export function getRecentChats(limit = 5): ClubThread[] {
  return RECENT_CHAT_ORDER.slice(0, limit)
    .map((id) => MOCK_CLUBS.find((c) => c.id === id))
    .filter((c): c is ClubThread => c != null);
}
