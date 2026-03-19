"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import FilterBar, { FilterCategory } from "../components/FilterBar";
import { mockEvents } from "../lib/mockEvents";

const EVENT_TYPES = [
  { name: "Workshops", icon: "🛠️" },
  { name: "Competitions", icon: "🏆" },
  { name: "Hackathons", icon: "💻" },
  { name: "Social Events", icon: "🎉" },
  { name: "Tech Talks", icon: "🎤" },
];

export default function EventsPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>("All");

  const filteredEvents = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return mockEvents.filter((event) => {
      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.club.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchText, selectedCategory]);

  const upcomingEvents = useMemo(
    () =>
      [...filteredEvents].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ).slice(0, 3),
    [filteredEvents]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center overflow-hidden">
        {/* Background image */}
        <img
          src="/images/events.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-120 brightness-70 contrast-140 saturate-130"
          aria-hidden
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-50/70 via-indigo-50/60 to-purple-50/70"
          aria-hidden
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 text-left">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Discover Events at METU
          </h1>
          <p className="mt-4 max-w-xl text-lg text-gray-600">
            Find workshops, meetups, hackathons and social events organized by
            student communities.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/events/explore-events"
              className="rounded-full bg-gray-900 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-gray-800"
            >
              Explore Events
            </Link>
            <Link
              href="/create-event"
              className="rounded-full border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Create Event
            </Link>
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Search & filter */}
      <section className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex max-w-2xl flex-col gap-4">
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <circle cx="11" cy="11" r="6" />
                  <path d="m16 16 4 4" />
                </svg>
              </span>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search events at METU..."
                className="w-full rounded-full border border-gray-200 bg-white py-4 pl-12 pr-6 text-lg text-gray-900 shadow-sm outline-none transition placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
                aria-label="Search events"
              />
            </div>
            <FilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="upcoming-events" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-10 text-3xl font-bold text-gray-900">
          Upcoming Events
        </h2>
        {filteredEvents.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            No events match your search.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {upcomingEvents.map((event) => (
              <article
                key={event.id}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
              >
                <Link href={`/events/${event.id}`} className="block">
                  <div className="h-40 w-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500" />
                  <div className="p-4">
                    <span className="inline-block rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
                      {event.category}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-gray-900">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {event.location}
                    </p>
                    <span className="mt-4 inline-block rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                      View Event
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Event Types */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-10 text-3xl font-bold text-gray-900">
            Event Types
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
            {EVENT_TYPES.map((type) => (
              <div
                key={type.name}
                className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="text-3xl" aria-hidden>
                  {type.icon}
                </span>
                <span className="mt-3 font-medium text-gray-900">
                  {type.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
          How Communities Organize Events at METU
        </h2>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gray-100 shadow-md">
          <div
            className="h-80 w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url(/images/metu-campus-2.jpeg)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </section>
    </div>
  );
}
