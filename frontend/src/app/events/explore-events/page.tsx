"use client";

import Image from "next/image";
import Link from "next/link";
import { EventListPredictionInfo } from "@/app/components/EventListPredictionInfo";
import { computeEventListPrediction } from "@/app/lib/eventListPrediction";
import { mockEvents } from "@/app/lib/mockEvents";

function formatEventCardDate(isoDate: string) {
  return new Date(isoDate).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ExploreEventsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-700">
        {/* Soft radial blends */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.30),transparent_40%),radial-gradient(circle_at_85%_15%,rgba(168,85,247,0.24),transparent_38%),radial-gradient(circle_at_60%_85%,rgba(99,102,241,0.28),transparent_44%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 left-12 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl md:left-32"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-8 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl md:right-24"
        />

        {/* Thin curved decorative lines */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 top-8 hidden h-64 w-64 rounded-full border border-white/10 md:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 hidden h-96 w-96 rounded-full border border-white/10 md:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 bottom-2 hidden h-72 w-72 rounded-full border border-cyan-100/10 md:block"
        />

        {/* Small accent dots */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/3 top-12 h-2 w-2 rounded-full bg-cyan-300/80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-1/4 top-24 hidden h-1.5 w-1.5 rounded-full bg-lime-300/80 md:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-20 right-1/3 h-2 w-2 rounded-full bg-sky-200/70"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight text-white">
              Explore Events
            </h1>
            <p className="mt-4 text-lg text-blue-100">
              Browse all upcoming events organized by METU communities.
            </p>
          </div>
        </div>
      </section>

      {/* Events grid */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-100 py-16 md:py-20">
        {/* Subtle layered background effects */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-8 z-0 h-72 w-72 rounded-full bg-blue-500/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 right-6 z-0 h-80 w-80 rounded-full bg-purple-500/35 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/3 right-1/4 z-0 hidden h-64 w-64 rounded-full bg-cyan-400/35 blur-3xl md:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.14] [background:radial-gradient(110%_85%_at_5%_10%,transparent_62%,rgba(99,102,241,0.95)_62.5%,transparent_63%),radial-gradient(110%_85%_at_95%_85%,transparent_62%,rgba(59,130,246,0.9)_62.5%,transparent_63%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_25%_20%,rgba(79,70,229,0.24),transparent_42%),radial-gradient(circle_at_75%_75%,rgba(14,165,233,0.2),transparent_45%)]"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mockEvents.map((event) => {
              const { prediction, trendPercent } =
                computeEventListPrediction(event);
              return (
                <div
                  key={event.id}
                  className="event-wrapper flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-md backdrop-blur-md transition-all duration-300 hover:border-gray-300 hover:shadow-xl"
                >
                  <article className="flex min-h-0 flex-1 flex-col">
                    <Link
                      href={`/events/${event.id}`}
                      className="flex min-h-0 flex-1 flex-col"
                    >
                      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-slate-200">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <span className="inline-block w-fit rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-600">
                          {event.category}
                        </span>
                        <h2 className="mt-3 text-lg font-semibold text-gray-900">
                          {event.title}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                          {formatEventCardDate(event.date)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {event.location}
                        </p>
                        <span className="mt-auto inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-black">
                          View Details
                        </span>
                      </div>
                    </Link>
                  </article>
                  <EventListPredictionInfo
                    interestLevel={prediction.interestLevel}
                    expectedRange={prediction.expectedRange}
                    trendPercent={trendPercent}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
