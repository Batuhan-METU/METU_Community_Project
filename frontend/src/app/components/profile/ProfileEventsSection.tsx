"use client";

import { useState } from "react";

export type ProfileEventItem = {
  id: string;
  title: string;
  /** ISO date string for formatting */
  date: string;
  location: string;
};

const upcomingEvents: ProfileEventItem[] = [
  {
    id: "u1",
    title: "Spring Tech Meetup",
    date: "2026-05-12T17:00:00",
    location: "METU CCC Hall A",
  },
  {
    id: "u2",
    title: "Design Workshop: UI Systems",
    date: "2026-05-20T14:30:00",
    location: "Informatics Institute Lab 3",
  },
  {
    id: "u3",
    title: "Campus Music Night",
    date: "2026-06-01T20:00:00",
    location: "Culture & Convention Center",
  },
];

const pastEvents: ProfileEventItem[] = [
  {
    id: "p1",
    title: "Intro to Machine Learning",
    date: "2025-11-08T16:00:00",
    location: "Engineering Building E-101",
  },
  {
    id: "p2",
    title: "Career Fair Networking",
    date: "2025-10-22T10:00:00",
    location: "Library Conference Hall",
  },
  {
    id: "p3",
    title: "Photography Club Exhibition",
    date: "2025-09-05T18:30:00",
    location: "Student Center Gallery",
  },
];

function formatEventDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function EventGrid({ events }: { events: ProfileEventItem[] }) {
  if (events.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-white/15 bg-white/8 px-4 py-12 text-center text-sm text-gray-300">
        No events in this list yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <article
          key={event.id}
          className="group flex flex-col rounded-2xl border border-white/10 bg-white/10 p-5 shadow-[0_6px_24px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-300/40 hover:shadow-[0_16px_36px_rgba(99,102,241,0.24)]"
        >
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-100">
            {event.title}
          </h3>
          <p className="mt-3 flex items-start gap-2 text-sm text-gray-300">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
            <span>{formatEventDate(event.date)}</span>
          </p>
          <p className="mt-2 flex items-start gap-2 text-sm text-gray-300">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            <span className="line-clamp-2">{event.location}</span>
          </p>
        </article>
      ))}
    </div>
  );
}

export default function ProfileEventsSection() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const events = tab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <section className="mt-12 rounded-2xl border border-white/15 bg-white/8 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl animate-fade-in-up">
      <h2 className="text-xl font-bold tracking-tight text-gray-100">Events</h2>

      <div className="mt-4" role="tablist" aria-label="Event lists">
        <div className="inline-flex rounded-xl border border-white/10 bg-white/8 p-1">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "upcoming"}
            onClick={() => setTab("upcoming")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
              tab === "upcoming"
                ? "bg-white/15 text-indigo-200 shadow-[0_0_18px_rgba(99,102,241,0.35)]"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Upcoming Events
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "past"}
            onClick={() => setTab("past")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
              tab === "past"
                ? "bg-white/15 text-indigo-200 shadow-[0_0_18px_rgba(99,102,241,0.35)]"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Past Events
          </button>
        </div>
      </div>

      <div key={tab} className="mt-6 animate-fade-in-up" role="tabpanel">
        <EventGrid events={events} />
      </div>
    </section>
  );
}
