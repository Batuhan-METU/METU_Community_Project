import type { HypeScoreInputs } from "../lib/hypeScore";
import {
  computePostEventHypeScore,
  displayRatingForCatalogEvent,
  filterCompletedForLeaderboard,
  hypeScoreForCatalogEvent,
  HYPE_LEADERBOARD_REFERENCE_NOW_MS,
} from "../lib/hypeLeaderboard";
import { mockEvents } from "./mockEvents";
import { getMockEventSatisfaction } from "./mockEventSatisfaction";

/** Fixed "now" so leaderboard order is stable between SSR and client. */
export const HYPE_SCORE_REFERENCE_NOW_MS = new Date(
  "2026-06-01T14:00:00",
).getTime();

export type HypeBadgeVariant = "top" | "trending" | "rising";

export type HypeRankingEntry = {
  rank: number;
  eventId: number;
  title: string;
  club: string;
  date: string;
  description: string;
  image: string;
  hypeScore: number;
  /** Mock community average for display (⭐) */
  displayRating: number;
  badgeLabel: string;
  badgeVariant: HypeBadgeVariant;
  /** Short trend string for list UI */
  trendLabel: string;
};

type RawHypeEvent = {
  eventId: number;
  title: string;
  club: string;
  date: string;
  description: string;
  image: string;
  hype: HypeScoreInputs;
};

const RAW_HYPE_EVENTS: RawHypeEvent[] = [
  {
    eventId: 1,
    title: "AI & Machine Learning Workshop",
    club: "METU Computer Society",
    date: "2026-03-05T17:30:00",
    description:
      "Hands-on ML basics, notebooks, and a friendly competition — seats filling fast.",
    image: "/images/event-images/ai.jpg",
    hype: {
      participantCount: 72,
      chatMessageCount: 352,
      lastActivityAt: "2026-05-28T11:20:00",
    },
  },
  {
    eventId: 10,
    title: "Career Talk with Google Engineer",
    club: "IEEE METU Student Branch",
    date: "2026-08-15T15:00:00",
    description: "Resume reviews and Q&A after the talk.",
    image: "/images/event-images/google.jpg",
    hype: {
      participantCount: 95,
      chatMessageCount: 280,
      lastActivityAt: "2026-05-30T22:00:00",
    },
  },
  {
    eventId: 5,
    title: "Open Air Movie Night",
    club: "Cinema Society",
    date: "2026-03-25T21:00:00",
    description: "Outdoor screening + snacks on the lawn.",
    image: "/images/event-images/cinema.jpg",
    hype: {
      participantCount: 110,
      chatMessageCount: 195,
      lastActivityAt: "2026-05-29T08:45:00",
    },
  },
  {
    eventId: 6,
    title: "Robotics Club Intro Session",
    club: "METU Robotics Club",
    date: "2026-07-12T17:00:00",
    description: "Tour the lab and meet project leads.",
    image: "/images/event-images/robotics.jpg",
    hype: {
      participantCount: 48,
      chatMessageCount: 156,
      lastActivityAt: "2026-05-25T18:30:00",
    },
  },
  {
    eventId: 8,
    title: "Game Development Meetup",
    club: "Game Development Community",
    date: "2026-07-26T18:30:00",
    description: "Indie devs share builds and playtests.",
    image: "/images/event-images/gamedev.jpg",
    hype: {
      participantCount: 38,
      chatMessageCount: 142,
      lastActivityAt: "2026-05-20T09:00:00",
    },
  },
  {
    eventId: 2,
    title: "Astronomy Observation Night",
    club: "METU Astronomy Club",
    date: "2026-03-12T20:00:00",
    description: "Observe planets and stars with telescopes.",
    image: "/images/event-images/astronomy.jpg",
    hype: {
      participantCount: 55,
      chatMessageCount: 88,
      lastActivityAt: "2026-05-22T14:00:00",
    },
  },
  /** Second event for same club — drives aggregated “club total hype” above single-event leaders. */
  {
    eventId: 12,
    title: "Code Review & Coffee",
    club: "METU Computer Society",
    date: "2026-06-30T18:00:00",
    description: "Peer reviews, lightning talks, and espresso.",
    image: "/images/event-images/ai.jpg",
    hype: {
      participantCount: 52,
      chatMessageCount: 210,
      lastActivityAt: "2026-05-27T16:30:00",
    },
  },
];

export function badgeForRank(rank: number): {
  badgeLabel: string;
  badgeVariant: HypeBadgeVariant;
  trendLabel: string;
} {
  if (rank === 1) {
    return {
      badgeLabel: "👑 Top Event",
      badgeVariant: "top",
      trendLabel: "👑",
    };
  }
  if (rank === 2 || rank === 3) {
    return {
      badgeLabel: "🔥 Trending",
      badgeVariant: "trending",
      trendLabel: "🔥",
    };
  }
  return {
    badgeLabel: "🚀 Rising",
    badgeVariant: "rising",
    trendLabel: "🚀",
  };
}

function buildRanking(): HypeRankingEntry[] {
  const eligible = filterCompletedForLeaderboard(
    mockEvents,
    HYPE_LEADERBOARD_REFERENCE_NOW_MS,
  );
  const scored = eligible.map((ev) => {
    const hypeScore = hypeScoreForCatalogEvent(ev, null);
    const displayRating = displayRatingForCatalogEvent(ev, null);
    return {
      eventId: ev.id,
      title: ev.title,
      club: ev.club,
      date: ev.date,
      description: ev.description,
      image: ev.image,
      hypeScore,
      displayRating,
    };
  });
  scored.sort((a, b) => b.hypeScore - a.hypeScore);

  return scored.slice(0, 5).map((row, i) => {
    const rank = i + 1;
    const { badgeLabel, badgeVariant, trendLabel } = badgeForRank(rank);
    return {
      rank,
      eventId: row.eventId,
      title: row.title,
      club: row.club,
      date: row.date,
      description: row.description,
      image: row.image,
      hypeScore: Math.round(row.hypeScore * 10) / 10,
      displayRating: row.displayRating,
      badgeLabel,
      badgeVariant,
      trendLabel,
    };
  });
}

export const HYPE_RANKING_THIS_WEEK: HypeRankingEntry[] = buildRanking();

/** Map hype leaderboard club display names to `/clubs/:id` when they exist in `lib/mockClubs`. */
const CLUB_NAME_TO_ROUTE_ID: Record<string, number> = {
  "METU Computer Society": 1,
  "METU Entrepreneurship Club": 2,
  "METU Fine Arts Collective": 3,
  "METU Music Society": 4,
  "METU Astronomy Club": 5,
};

export type TopClubOfTheWeek = {
  name: string;
  totalHypeScore: number;
  /** When known in mock clubs; otherwise browse all clubs. */
  clubRouteId: number | null;
};

function buildTopClubOfTheWeek(): TopClubOfTheWeek {
  const eligible = filterCompletedForLeaderboard(
    mockEvents,
    HYPE_LEADERBOARD_REFERENCE_NOW_MS,
  );
  const totals = new Map<string, number>();
  for (const ev of eligible) {
    const s = hypeScoreForCatalogEvent(ev, null);
    totals.set(ev.club, (totals.get(ev.club) ?? 0) + s);
  }
  let bestName = "";
  let bestTotal = -Infinity;
  for (const [name, total] of totals) {
    if (total > bestTotal) {
      bestTotal = total;
      bestName = name;
    }
  }
  return {
    name: bestName,
    totalHypeScore: Math.round(bestTotal * 10) / 10,
    clubRouteId: CLUB_NAME_TO_ROUTE_ID[bestName] ?? null,
  };
}

export const TOP_CLUB_OF_THE_WEEK: TopClubOfTheWeek = buildTopClubOfTheWeek();

/**
 * Map hype leaderboard club names to `/messages?clubId=` thread ids (aligned with
 * `components/messages/mockClubs`).
 */
export const CLUB_NAME_TO_MESSAGES_ID: Record<string, string> = {
  "METU Computer Society": "1",
  "METU Astronomy Club": "5",
  "IEEE METU Student Branch": "2",
  "Cinema Society": "3",
  "METU Robotics Club": "4",
  "Game Development Community": "1",
};

export type InsightsStatTrend = {
  trendLabel: string;
  mood: string;
  /** 0–100 for mini progress bar */
  barPercent: number;
};

/** Mock analytics for `/events/:id/insights` — only events present in hype data. */
export type EventInsightsMock = {
  eventId: number;
  title: string;
  club: string;
  date: string;
  image: string;
  hypeScore: number;
  participantCount: number;
  chatMessageCount: number;
  /** Mock % growth in engagement vs prior 24h window. */
  growthLast24hPercent: number;
  whyTrending: readonly string[];
  /** Rank among all hype-tracked events this week (1 = highest hype). */
  rankThisWeek: number;
  /** Mock chat thread id for `Join Chat` CTA. */
  messagesClubId: string;
  statTrends: {
    participants: InsightsStatTrend;
    chat: InsightsStatTrend;
    growth: InsightsStatTrend;
    hype: InsightsStatTrend;
  };
};

function rankThisWeekForEvent(eventId: number): number {
  const eligible = filterCompletedForLeaderboard(
    mockEvents,
    HYPE_LEADERBOARD_REFERENCE_NOW_MS,
  );
  const scored = eligible
    .map((ev) => ({
      eventId: ev.id,
      hypeScore: hypeScoreForCatalogEvent(ev, null),
    }))
    .sort((a, b) => b.hypeScore - a.hypeScore);
  const idx = scored.findIndex((s) => s.eventId === eventId);
  return idx >= 0 ? idx + 1 : 0;
}

/** Per-event micro-trends for stat cards (mock). `g.trendLabel` is week-over-week (distinct from 24h headline). */
const STAT_MICRO: Record<
  number,
  {
    p: { trendLabel: string; mood: string };
    c: { trendLabel: string; mood: string };
    h: { trendLabel: string; mood: string };
    g: { trendLabel: string; mood: string };
  }
> = {
  1: {
    p: { trendLabel: "+9%", mood: "🔥 rising" },
    c: { trendLabel: "+21%", mood: "🔥 rising" },
    h: { trendLabel: "+6%", mood: "📈 steady" },
    g: { trendLabel: "+3% WoW", mood: "🔥 rising" },
  },
  2: {
    p: { trendLabel: "+7%", mood: "📈 steady" },
    c: { trendLabel: "+11%", mood: "🔥 rising" },
    h: { trendLabel: "+4%", mood: "📈 steady" },
    g: { trendLabel: "+2% WoW", mood: "📈 steady" },
  },
  5: {
    p: { trendLabel: "+12%", mood: "🔥 rising" },
    c: { trendLabel: "+8%", mood: "🔥 rising" },
    h: { trendLabel: "+5%", mood: "📈 steady" },
    g: { trendLabel: "+4% WoW", mood: "🔥 rising" },
  },
  6: {
    p: { trendLabel: "+6%", mood: "📈 steady" },
    c: { trendLabel: "+14%", mood: "🔥 rising" },
    h: { trendLabel: "+7%", mood: "🔥 rising" },
    g: { trendLabel: "+1% WoW", mood: "📈 steady" },
  },
  8: {
    p: { trendLabel: "+18%", mood: "🔥 rising" },
    c: { trendLabel: "+24%", mood: "🔥 rising" },
    h: { trendLabel: "+9%", mood: "🔥 rising" },
    g: { trendLabel: "+5% WoW", mood: "🔥 rising" },
  },
  10: {
    p: { trendLabel: "+15%", mood: "🔥 rising" },
    c: { trendLabel: "+17%", mood: "🔥 rising" },
    h: { trendLabel: "+8%", mood: "🔥 rising" },
    g: { trendLabel: "+6% WoW", mood: "🔥 rising" },
  },
  12: {
    p: { trendLabel: "+10%", mood: "🔥 rising" },
    c: { trendLabel: "+13%", mood: "🔥 rising" },
    h: { trendLabel: "+5%", mood: "📈 steady" },
    g: { trendLabel: "+3% WoW", mood: "🔥 rising" },
  },
};

const GROWTH_LAST_24H_PCT: Record<number, number> = {
  1: 14,
  2: 9,
  5: 11,
  6: 7,
  8: 16,
  10: 19,
  12: 12,
};

const WHY_TRENDING: Record<number, readonly string[]> = {
  1: [
    "Signups spiked after the club shared workshop notebooks on Discord.",
    "Chat volume doubled when mentors announced a live coding segment.",
    "Alumni reshared the event, driving a fresh wave of registrations.",
  ],
  2: [
    "Clear skies in the forecast pushed last-minute interest from science groups.",
    "The astronomy club posted telescope setup photos that went viral on campus.",
    "Students are coordinating rides in the event thread — high coordination energy.",
  ],
  5: [
    "Outdoor seating capacity is nearly full; word-of-mouth picked up mid-week.",
    "Snack pre-orders in chat created a buzz around the screening lineup.",
    "Film club teased a surprise short before the main movie.",
  ],
  6: [
    "Lab tour slots are filling quickly after the robotics team demo clip.",
    "First-years are asking beginner-friendly questions in the chat — great signal.",
    "A guest lecturer mention in the thread drove a bump in RSVPs.",
  ],
  8: [
    "Indie showcase submissions closed and teams are hyping their builds.",
    "Playtest feedback threads are unusually active for a weekday.",
    "A popular game dev streamer linked the event in their community.",
  ],
  10: [
    "Resume review slots were announced and the waitlist grew overnight.",
    "Career office cross-posted to multiple department newsletters.",
    "Google engineer Q&A was upvoted heavily in the student forum.",
  ],
  12: [
    "Peer review pairs matched faster than usual — strong collaboration vibe.",
    "Coffee sponsor shout-out in chat brought in curious visitors from other clubs.",
    "Lightning talk sign-ups created a mini competition for speaking slots.",
  ],
};

export function getEventInsightsMock(eventId: number): EventInsightsMock | null {
  const row = RAW_HYPE_EVENTS.find((e) => e.eventId === eventId);
  const mockEv = mockEvents.find((e) => e.id === eventId);
  if (!row && !mockEv) {
    return null;
  }

  const sat = getMockEventSatisfaction(eventId);
  let hypeScore: number;
  if (mockEv) {
    hypeScore = Math.round(hypeScoreForCatalogEvent(mockEv, null) * 10) / 10;
  } else {
    hypeScore =
      Math.round(
        computePostEventHypeScore({
          fillRatio: Math.min(1, row!.hype.participantCount / 120),
          averageRating: sat.averageRating,
          ratingCount: sat.reviewCount,
        }) * 10,
      ) / 10;
  }

  const growthPct = GROWTH_LAST_24H_PCT[eventId] ?? 10;
  const micro = STAT_MICRO[eventId] ?? {
    p: { trendLabel: "+8%", mood: "🔥 rising" },
    c: { trendLabel: "+12%", mood: "🔥 rising" },
    h: { trendLabel: "+5%", mood: "📈 steady" },
    g: { trendLabel: "+2% WoW", mood: "🔥 rising" },
  };
  const pc = mockEv?.filledSeats ?? row!.hype.participantCount;
  const cm = row?.hype.chatMessageCount ?? 160;

  const barParticipants = Math.min(100, Math.round((pc / 120) * 100));
  const barChat = Math.min(100, Math.round((cm / 400) * 100));
  const barGrowth = Math.min(100, Math.round(growthPct * 4.5));
  const barHype = Math.min(100, Math.round((hypeScore / 720) * 100));

  const title = mockEv?.title ?? row!.title;
  const club = mockEv?.club ?? row!.club;
  const date = mockEv?.date ?? row!.date;
  const image = mockEv?.image ?? row!.image;

  return {
    eventId,
    title,
    club,
    date,
    image,
    hypeScore,
    participantCount: pc,
    chatMessageCount: cm,
    growthLast24hPercent: growthPct,
    whyTrending: WHY_TRENDING[eventId] ?? [
      "Strong signup velocity compared to similar events this term.",
      "Chat activity shows sustained interest from new and returning members.",
      "Campus shares and club cross-promotion amplified reach in the last few days.",
    ],
    rankThisWeek: rankThisWeekForEvent(eventId),
    messagesClubId: CLUB_NAME_TO_MESSAGES_ID[club] ?? "1",
    statTrends: {
      participants: {
        trendLabel: micro.p.trendLabel,
        mood: micro.p.mood,
        barPercent: barParticipants,
      },
      chat: {
        trendLabel: micro.c.trendLabel,
        mood: micro.c.mood,
        barPercent: barChat,
      },
      growth: {
        trendLabel: micro.g.trendLabel,
        mood: micro.g.mood,
        barPercent: barGrowth,
      },
      hype: {
        trendLabel: micro.h.trendLabel,
        mood: micro.h.mood,
        barPercent: barHype,
      },
    },
  };
}
