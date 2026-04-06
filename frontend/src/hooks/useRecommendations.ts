"use client";

import { useMemo, useSyncExternalStore } from "react";
import { JOINED_EVENTS_STORAGE_KEY } from "../context/JoinedEventsContext";

/** localStorage key for rated event id list (optional; falls back to `eventRatings`). */
export const RATED_EVENTS_STORAGE_KEY = "ratedEvents";

const EVENT_RATINGS_STORAGE_KEY = "eventRatings";

export type RecommendationUser = {
  /** Category labels must match `event.category` (e.g. "Technology"). */
  preferredCategories?: readonly string[];
};

/** Minimal event shape required for scoring. Extend with your own fields. */
export type RecommendationEventInput = {
  id: number;
  category: string;
  date: string;
  /** Optional; defaults to 0 when missing. */
  hypeScore?: number;
};

export const REASON_PREFERRED_CATEGORY = "Because you like this category";
export const REASON_TRENDING_NOW = "🔥 Trending now";
export const REASON_HAPPENING_SOON = "Happening soon";

export type RecommendedEvent<T extends RecommendationEventInput> = T & {
  recommendationScore: number;
  reason: string;
};

function parseJoinedIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.map((x) => String(x)))];
  } catch {
    return [];
  }

}

function readJoinedIds(): string[] {
  if (typeof window === "undefined") return [];
  return parseJoinedIds(window.localStorage.getItem(JOINED_EVENTS_STORAGE_KEY));
}

function readRatedEventIds(): number[] {
  if (typeof window === "undefined") return [];

  try {
    const ratedRaw = window.localStorage.getItem(RATED_EVENTS_STORAGE_KEY);
    if (ratedRaw) {
      const parsed = JSON.parse(ratedRaw) as unknown;
      if (Array.isArray(parsed)) {
        const ids = parsed
          .map((x) => (typeof x === "number" ? x : Number(x)))
          .filter((n): n is number => Number.isFinite(n));
        if (ids.length > 0) return [...new Set(ids)];
      }
    }
  } catch {
    /* ignore */
  }

  try {
    const raw = window.localStorage.getItem(EVENT_RATINGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const ids: number[] = [];
    for (const row of parsed) {
      if (
        row &&
        typeof row === "object" &&
        typeof (row as { eventId?: unknown }).eventId === "number"
      ) {
        ids.push((row as { eventId: number }).eventId);
      }
    }
    return [...new Set(ids)];
  } catch {
    return [];
  }
}

/**
 * Snapshot string changes when joined or rated sets change (cross-tab + same-tab via events).
 */
function getStorageSnapshot(): string {
  const joined = readJoinedIds().join("\u0000");
  const rated = readRatedEventIds().join("\u0000");
  return `${joined}|\u0001|${rated}`;
}

function getServerSnapshot(): string {
  return "";
}

function subscribeRecommendationsStorage(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const onStorage = (e: StorageEvent) => {
    if (
      e.key === JOINED_EVENTS_STORAGE_KEY ||
      e.key === RATED_EVENTS_STORAGE_KEY ||
      e.key === EVENT_RATINGS_STORAGE_KEY ||
      e.key === null
    ) {
      onStoreChange();
    }
  };
  const onJoined = () => onStoreChange();
  const onRatings = () => onStoreChange();

  window.addEventListener("storage", onStorage);
  window.addEventListener("metu-joined-changed", onJoined);
  window.addEventListener("metu-event-ratings-changed", onRatings);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("metu-joined-changed", onJoined);
    window.removeEventListener("metu-event-ratings-changed", onRatings);
  };
}

function calendarDayKey(iso: string): string {
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(iso.trim());
  if (m) return m[1];
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const d = new Date(t);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}

function isWithinNextSevenDays(iso: string): boolean {
  const start = new Date(iso).getTime();
  if (Number.isNaN(start)) return false;
  const now = Date.now();
  const weekEnd = now + 7 * 24 * 60 * 60 * 1000;
  return start >= now && start <= weekEnd;
}

function prefersCategory(
  user: RecommendationUser,
  category: string,
): boolean {
  const prefs = user.preferredCategories;
  if (!prefs || prefs.length === 0) return false;
  return prefs.some((c) => c === category);
}

/**
 * Picks one human-readable reason (priority: category match → high hype → soon → mid hype → default).
 */
function pickRecommendationReason<T extends RecommendationEventInput>(
  event: T,
  user: RecommendationUser,
): string {
  if (prefersCategory(user, event.category)) {
    return REASON_PREFERRED_CATEGORY;
  }

  const hype = typeof event.hypeScore === "number" ? event.hypeScore : 0;
  if (hype > 80) {
    return REASON_TRENDING_NOW;
  }
  if (isWithinNextSevenDays(event.date)) {
    return REASON_HAPPENING_SOON;
  }
  if (hype > 50) {
    return REASON_TRENDING_NOW;
  }

  return REASON_HAPPENING_SOON;
}

function computeRecommendation<T extends RecommendationEventInput>(
  event: T,
  user: RecommendationUser,
  joinedIds: ReadonlySet<string>,
  ratedIds: ReadonlySet<number>,
  joinedCalendarDays: ReadonlySet<string>,
): { score: number; reason: string } {
  let score = 0;

  if (prefersCategory(user, event.category)) {
    score += 3;
  }

  const hype = typeof event.hypeScore === "number" ? event.hypeScore : 0;
  if (hype > 80) {
    score += 2;
  } else if (hype > 50) {
    score += 1;
  }

  if (isWithinNextSevenDays(event.date)) {
    score += 1;
  }

  const idStr = String(event.id);
  if (joinedIds.has(idStr)) {
    score -= 5;
  }

  if (ratedIds.has(event.id)) {
    score -= 2;
  }

  if (!joinedIds.has(idStr)) {
    const day = calendarDayKey(event.date);
    if (day && joinedCalendarDays.has(day)) {
      score -= 3;
    }
  }

  const reason = pickRecommendationReason(event, user);

  return { score, reason };
}

/**
 * Ranks catalog events for the current user using localStorage (`joinedEvents`, `ratedEvents` or `eventRatings`)
 * and a simple additive score. Returns the top 6 rows with `recommendationScore` and `reason` set.
 */
export function useRecommendations<T extends RecommendationEventInput>(
  events: readonly T[],
  user: RecommendationUser,
): RecommendedEvent<T>[] {
  const storageKey = useSyncExternalStore(
    subscribeRecommendationsStorage,
    getStorageSnapshot,
    getServerSnapshot,
  );

  return useMemo(() => {
    const joinedIdsList = readJoinedIds();
    const ratedIdsList = readRatedEventIds();
    const joinedIds = new Set(joinedIdsList.map(String));
    const ratedIds = new Set(ratedIdsList);

    const joinedCalendarDays = new Set<string>();
    for (const jid of joinedIdsList) {
      const match = events.find((e) => String(e.id) === String(jid));
      if (match) {
        const key = calendarDayKey(match.date);
        if (key) joinedCalendarDays.add(key);
      }
    }

    const scored = events.map((event) => {
      const { score: recommendationScore, reason } = computeRecommendation(
        event,
        user,
        joinedIds,
        ratedIds,
        joinedCalendarDays,
      );
      return { ...event, recommendationScore, reason };
    });

    scored.sort((a, b) => {
      if (b.recommendationScore !== a.recommendationScore) {
        return b.recommendationScore - a.recommendationScore;
      }
      return a.id - b.id;
    });

    return scored.slice(0, 6) as RecommendedEvent<T>[];
  }, [events, user, storageKey]);
}
