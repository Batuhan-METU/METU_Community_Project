import type { ClubThread } from "./types";

export function getClubInitials(club: Pick<ClubThread, "name">): string {
  const words = club.name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return club.name.slice(0, 2).toUpperCase();
}
