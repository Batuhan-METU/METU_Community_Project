import { mockClubs } from "./mockClubs";
import { MOCK_CLUBS } from "../components/messages/mockClubs";

/** Route `/clubs/:id` uses numeric ids from lib — chat threads use the same string id. */
export function chatThreadIdForRouteClubId(clubId: number): string | null {
  if (!Number.isFinite(clubId) || clubId < 1) return null;
  const exists = mockClubs.some((c) => c.id === clubId);
  return exists ? String(clubId) : null;
}

function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Map an event’s hosting club name to a chat thread id (MOCK_CLUBS).
 */
export function chatThreadIdForEventClubName(clubName: string): string {
  const n = normalize(clubName);

  const byExactMock = MOCK_CLUBS.find(
    (c) => normalize(c.name) === n,
  );
  if (byExactMock) return byExactMock.id;

  for (const c of mockClubs) {
    const cn = normalize(c.name);
    if (n.includes(cn) || cn.includes(n.slice(0, Math.min(12, n.length)))) {
      return String(c.id);
    }
  }

  if (n.includes("ieee")) return "2";
  if (n.includes("robotics")) return "1";
  if (n.includes("photography")) return "4";
  if (n.includes("game development") || n.includes("gamedev")) return "1";
  if (n.includes("astronomy")) return "5";
  if (n.includes("entrepreneurship") || n.includes("startup")) return "2";
  if (n.includes("dance") || n.includes("salsa")) return "4";
  if (n.includes("environment") || n.includes("sustainable")) return "5";
  if (n.includes("cinema")) return "3";
  if (n.includes("career") || n.includes("google")) return "2";

  return "1";
}

/** Opens /messages with the club thread; supports legacy `club` via MessagesPageClient. */
export function messagesHrefForClubThreadId(threadId: string): string {
  return `/messages?clubId=${encodeURIComponent(threadId)}`;
}
