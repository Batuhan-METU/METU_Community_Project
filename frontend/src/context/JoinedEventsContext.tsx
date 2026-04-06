"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { MOCK_USER_JOINED_EVENTS } from "../app/data/mockUserJoinedEvents";
import type { OccupiedSlotInfo } from "../app/lib/resolveEventTimeRange";
import { resolveOccupiedSlotInfo } from "../app/lib/resolveEventTimeRange";

export const JOINED_EVENTS_STORAGE_KEY = "joinedEvents";

function parseStoredJoinedIds(raw: string | null): string[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return [...new Set(parsed.map((x) => String(x)))];
  } catch {
    return [];
  }
}

function readJoinedIdsFromStorage(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  return parseStoredJoinedIds(
    localStorage.getItem(JOINED_EVENTS_STORAGE_KEY),
  );
}

type JoinedEventsContextValue = {
  joinedEventIds: readonly string[];
  isJoined: (eventId: string | number) => boolean;
  markJoined: (eventId: string | number) => void;
  getOccupiedSlotsForConflict: (
    excludeId: string | number,
  ) => OccupiedSlotInfo[];
};

const JoinedEventsContext = createContext<JoinedEventsContextValue | null>(
  null,
);

export function JoinedEventsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [joinedEventIds, setJoinedEventIds] = useState<string[]>([]);

  useLayoutEffect(() => {
    setJoinedEventIds(readJoinedIdsFromStorage());
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== JOINED_EVENTS_STORAGE_KEY && e.key !== null) {
        return;
      }
      setJoinedEventIds(readJoinedIdsFromStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isJoined = useCallback(
    (eventId: string | number) =>
      joinedEventIds.includes(String(eventId)),
    [joinedEventIds],
  );

  const markJoined = useCallback((eventId: string | number) => {
    const key = String(eventId);
    setJoinedEventIds((prev) => {
      if (prev.includes(key)) {
        return prev;
      }
      const next = [...prev, key];
      localStorage.setItem(
        JOINED_EVENTS_STORAGE_KEY,
        JSON.stringify(next),
      );
      window.dispatchEvent(new Event("metu-joined-changed"));
      return next;
    });
  }, []);

  const getOccupiedSlotsForConflict = useCallback(
    (excludeId: string | number): OccupiedSlotInfo[] => {
      const exclude = String(excludeId);
      const byId = new Map<string, OccupiedSlotInfo>();

      for (const row of MOCK_USER_JOINED_EVENTS) {
        const id = String(row.id);
        if (id === exclude) {
          continue;
        }
        byId.set(id, {
          name: row.name,
          startTime: row.startTime,
          endTime: row.endTime,
        });
      }

      for (const id of joinedEventIds) {
        if (id === exclude) {
          continue;
        }
        const info = resolveOccupiedSlotInfo(id);
        if (info) {
          byId.set(id, info);
        }
      }

      return [...byId.values()];
    },
    [joinedEventIds],
  );

  const value = useMemo(
    () => ({
      joinedEventIds,
      isJoined,
      markJoined,
      getOccupiedSlotsForConflict,
    }),
    [joinedEventIds, isJoined, markJoined, getOccupiedSlotsForConflict],
  );

  return (
    <JoinedEventsContext.Provider value={value}>
      {children}
    </JoinedEventsContext.Provider>
  );
}

export function useJoinedEvents(): JoinedEventsContextValue {
  const ctx = useContext(JoinedEventsContext);
  if (!ctx) {
    throw new Error("useJoinedEvents must be used within JoinedEventsProvider");
  }
  return ctx;
}
