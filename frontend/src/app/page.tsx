import Link from "next/link";
import EventCard from "./components/EventCard";
import { mockEvents } from "./lib/mockEvents";

export default function Home() {
  return (
    <>
      <section className="border-b border-gray-100 bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
            Your campus community,
            <br />
            all in one place.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500">
            METUCom helps you discover student clubs, explore campus events,
            and join communities that match your interests.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/events"
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Browse Events
            </Link>
            <Link
              href="/clubs"
              className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Explore Clubs
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Upcoming Events
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Handpicked events from active student clubs.
            </p>
          </div>
          <Link
            href="/events"
            className="hidden text-sm text-gray-500 transition-colors hover:text-gray-900 md:block"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </>
  );
}
