import Link from "next/link";
import EventsGrid from "./components/EventsGrid";
import { mockEvents } from "./lib/mockEvents";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-neutral-800 py-24 md:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-neutral-800 px-4 py-1.5 text-xs font-medium text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Now open for Spring 2026
          </p>

          <h1 className="mt-8 bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
            Campus life,
            <br />
            all in one place.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-neutral-400">
            Discover student clubs, explore campus events, and join the
            communities that match your interests at METU.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/events"
              className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Browse Events
            </Link>
            <Link
              href="/clubs"
              className="rounded-full bg-neutral-800 px-6 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:bg-neutral-700"
            >
              Explore Clubs
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Upcoming Events
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Handpicked events from active student clubs.
            </p>
          </div>
          <Link
            href="/events"
            className="hidden text-sm font-medium text-neutral-400 transition-colors hover:text-indigo-400 md:block"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="mt-8">
          <EventsGrid events={mockEvents} />
        </div>
      </section>
    </>
  );
}
