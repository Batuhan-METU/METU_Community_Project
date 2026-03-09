import Link from "next/link";
import EventCard from "./components/EventCard";
import { mockEvents } from "./lib/mockEvents";

export default function Home() {
  return (
    <>
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl">
            Welcome to METUCom
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
            Your gateway to student clubs, campus events, and university
            communities at Middle East Technical University.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/events"
              className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Browse Events
            </Link>
            <Link
              href="/clubs"
              className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              Explore Clubs
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Upcoming Events
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Handpicked events from active student clubs.
            </p>
          </div>
          <Link
            href="/events"
            className="hidden text-sm text-gray-500 hover:text-gray-900 md:block"
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

      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            About METUCom
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500">
            METUCom is a platform designed for METU students to discover
            university clubs, browse upcoming events, and connect with
            communities that share their interests. From engineering workshops
            to art exhibitions, everything is here.
          </p>
        </div>
      </section>
    </>
  );
}
