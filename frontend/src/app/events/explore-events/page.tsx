"use client";

import Link from "next/link";
import { mockEvents } from "../../lib/mockEvents";

export default function ExploreEventsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero with vibrant background image */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-110 contrast-110 saturate-125"
          style={{ backgroundImage: "url(/images/events.jpg)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/20"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              Explore Events
            </h1>
            <p className="mt-3 text-lg text-gray-100">
              Browse all upcoming events organized by METU communities.
            </p>
          </div>
        </div>
      </section>

      {/* Events grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {mockEvents.map((event) => (
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
                  <h2 className="mt-3 text-lg font-semibold text-gray-900">
                    {event.title}
                  </h2>
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
                  <p className="mt-1 text-sm text-gray-500">{event.location}</p>
                  <span className="mt-4 inline-block rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                    View Event
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

