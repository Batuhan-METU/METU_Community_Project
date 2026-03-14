import Link from "next/link";
import { mockEvents } from "../../lib/mockEvents";

export default function EventsPreview() {
  const previewEvents = mockEvents.slice(0, 3);

  return (
    <section className="bg-gray-100 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Events header */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
              Upcoming Events
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              A snapshot of what&apos;s happening on campus this week.
            </p>
          </div>
          <Link
            href="/events"
            className="text-sm font-medium text-gray-700 underline-offset-4 transition hover:text-gray-900 hover:underline"
          >
            View all events
          </Link>
        </div>

        {/* Event cards */}
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {previewEvents.map((event) => (
            <article
              key={event.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-40 bg-gradient-to-br from-indigo-500 via-sky-500 to-purple-500" />
              <div className="flex flex-1 flex-col justify-between p-5">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {new Date(event.date).toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "short",
                    })}{" "}
                    · {event.location}
                  </p>
                  <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600">{event.club}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {event.filledSeats}/{event.totalSeats} seats filled
                  </p>
                  <Link
                    href={`/events/${event.id}`}
                    className="rounded-full bg-black px-4 py-2 text-xs font-medium text-white transition duration-200 hover:bg-gray-800"
                  >
                    Join
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

