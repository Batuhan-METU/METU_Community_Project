import Link from "next/link";
import EventCard from "./components/EventCard";
import { mockEvents } from "./lib/mockEvents";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <section className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-surface px-4 py-1.5 text-xs font-medium text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Now open for Spring 2026
        </div>
        <h1 className="mt-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-5xl font-semibold tracking-tight text-transparent md:text-7xl">
          Campus life,
          <br />
          all in one place.
        </h1>
        <p className="mt-6 text-base leading-7 text-slate-400 md:text-lg">
          Discover student clubs, explore campus events, and join the
          communities that match your interests.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/events"
            className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-400 hover:shadow-indigo-500/30"
          >
            Browse Events
          </Link>
          <Link
            href="/clubs"
            className="rounded-lg border border-white/[0.06] bg-surface px-5 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-white/[0.1] hover:text-white"
          >
            Explore Clubs
          </Link>
        </div>
      </section>

      <section className="mt-20 md:mt-28">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Upcoming Events
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Handpicked events from active student clubs.
            </p>
          </div>
          <Link
            href="/events"
            className="hidden text-sm font-medium text-slate-400 transition-colors hover:text-indigo-400 md:block"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mockEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              club={event.club}
              date={event.date}
              location={event.location}
              filledSeats={event.filledSeats}
              totalSeats={event.totalSeats}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
