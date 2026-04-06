"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useJoinedEvents } from "../../context/JoinedEventsContext";
import { useRateEventModal } from "../../context/RateEventModalContext";
import { messagesHrefForClubThreadId } from "../lib/chatNavigation";
import {
  getRatingNotifications,
  syncRatingNotificationsFromJoined,
  type RatingNotificationRecord,
} from "../lib/ratingNotificationsStorage";
import { mockEvents } from "../lib/mockEvents";

export type NavNotificationItem = {
  id: string;
  title: string;
  preview: string;
  clubId: string;
  timeLabel: string;
};

const MOCK_NOTIFICATIONS: NavNotificationItem[] = [
  {
    id: "n1",
    title: "Ali sent a message",
    preview: "METU Computer Society",
    clubId: "1",
    timeLabel: "2m ago",
  },
  {
    id: "n2",
    title: "Zeynep sent a message",
    preview: "METU Astronomy Club",
    clubId: "5",
    timeLabel: "18m ago",
  },
  {
    id: "n3",
    title: "New reply in club chat",
    preview: "METU Entrepreneurship Club",
    clubId: "2",
    timeLabel: "1h ago",
  },
];

function useTimeTick(intervalMs: number) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return tick;
}

function formatCreated(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function NavbarNotifications() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { openRateModal } = useRateEventModal();
  const { joinedEventIds } = useJoinedEvents();
  const timeTick = useTimeTick(60_000);
  const joinedRef = useRef(joinedEventIds);
  joinedRef.current = joinedEventIds;

  const [ratingItems, setRatingItems] = useState<RatingNotificationRecord[]>(
    [],
  );

  const refreshRatingItems = useCallback(() => {
    syncRatingNotificationsFromJoined(joinedRef.current);
    setRatingItems(getRatingNotifications());
  }, []);

  useEffect(() => {
    refreshRatingItems();
  }, [joinedEventIds, timeTick, refreshRatingItems]);

  useEffect(() => {
    window.addEventListener("metu-notifications-changed", refreshRatingItems);
    window.addEventListener("metu-event-ratings-changed", refreshRatingItems);
    return () => {
      window.removeEventListener(
        "metu-notifications-changed",
        refreshRatingItems,
      );
      window.removeEventListener(
        "metu-event-ratings-changed",
        refreshRatingItems,
      );
    };
  }, [refreshRatingItems]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const showRatingDot = ratingItems.length > 0;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-600 transition duration-200 hover:bg-gray-100 hover:text-gray-900"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Notifications"
      >
        <svg
          className="h-[22px] w-[22px]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
        {showRatingDot && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,22rem)] origin-top-right rounded-xl border border-gray-200/90 bg-white py-1 shadow-xl shadow-gray-900/[0.08] ring-1 ring-black/[0.04]"
        >
          <p className="border-b border-gray-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Notifications
          </p>
          <ul className="max-h-[min(60vh,320px)] overflow-y-auto py-1">
            {ratingItems.map((r) => {
              const ev = mockEvents.find((e) => String(e.id) === r.eventId);
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      openRateModal(Number(r.eventId));
                      close();
                    }}
                    className="block w-full px-4 py-3 text-left transition-colors hover:bg-amber-50"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {r.message}
                    </p>
                    {ev && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                        {ev.title}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] font-medium text-amber-700">
                      {formatCreated(r.createdAt)} · Tap to rate
                    </p>
                  </button>
                </li>
              );
            })}
            {MOCK_NOTIFICATIONS.map((n) => (
              <li key={n.id}>
                <Link
                  href={messagesHrefForClubThreadId(n.clubId)}
                  role="menuitem"
                  onClick={close}
                  className="block px-4 py-3 transition-colors hover:bg-gray-50"
                >
                  <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                    {n.preview}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-gray-400">
                    {n.timeLabel}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
