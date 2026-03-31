"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useJoinedEvents } from "../../context/JoinedEventsContext";
import { useRateEventModal } from "../../context/RateEventModalContext";
import { hasRatedEvent } from "../lib/eventRatingsStorage";
import {
  canShowRateEventButton,
  getEventEndTimeIso,
  isEventCompletedNow,
} from "../lib/postEventRatingEligibility";
import { syncRatingNotificationsFromJoined } from "../lib/ratingNotificationsStorage";
import { mockEvents } from "../lib/mockEvents";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MyEventsSection() {
  const { joinedEventIds } = useJoinedEvents();
  const { openRateModal } = useRateEventModal();

  useEffect(() => {
    syncRatingNotificationsFromJoined(joinedEventIds);
  }, [joinedEventIds]);

  const rows = useMemo(() => {
    const ids = new Set(joinedEventIds.map((id) => Number(id)));
    return mockEvents
      .filter((e) => ids.has(e.id))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [joinedEventIds]);

  if (rows.length === 0) {
    return (
      <section className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl animate-fade-in-up">
        <h2 className="text-xl font-bold tracking-tight text-gray-100">
          My Events
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Events you join will show up here.
        </p>
        <Link
          href="/events/explore-events"
          className="mt-4 inline-flex rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
        >
          Explore events
        </Link>
      </section>
    );
  }

  return (
    <section className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl animate-fade-in-up">
      <h2 className="text-xl font-bold tracking-tight text-gray-100">
        My Events
      </h2>
      <p className="mt-1 text-sm text-gray-400">
        Workshops and meetups you&apos;ve joined — rate them after they end.
      </p>
      <ul className="mt-6 space-y-4">
        {rows.map((event) => {
          const endIso = getEventEndTimeIso(event);
          const completed = isEventCompletedNow(endIso);
          const rated = hasRatedEvent(event.id);
          const showRate = canShowRateEventButton(endIso, rated);

          return (
            <li
              key={event.id}
              className="rounded-xl border border-white/10 bg-white/[0.07] p-4 transition hover:border-indigo-400/35"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/events/${event.id}`}
                      className="font-semibold text-gray-100 transition hover:text-indigo-200"
                    >
                      {event.title}
                    </Link>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        completed
                          ? "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/30"
                          : "bg-sky-500/20 text-sky-200 ring-1 ring-sky-400/30"
                      }`}
                    >
                      {completed ? "Completed" : "Upcoming"}
                    </span>
                    {rated && (
                      <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-100 ring-1 ring-amber-400/30">
                        Rated
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-gray-400">{formatWhen(event.date)}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {showRate && (
                    <button
                      type="button"
                      onClick={() => openRateModal(event.id)}
                      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                    >
                      Rate Event
                    </button>
                  )}
                  <Link
                    href={`/events/${event.id}`}
                    className="rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/10"
                  >
                    View
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
