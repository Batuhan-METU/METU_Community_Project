import Link from "next/link";
import { notFound } from "next/navigation";
import JoinEventButton from "../../components/JoinEventButton";
import { mockEvents } from "../../lib/mockEvents";

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;
  const eventId = Number(id);
  const event = mockEvents.find((item) => item.id === eventId);

  if (!event) {
    notFound();
  }

  const formattedDate = new Date(event.date).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = new Date(event.date).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const capacityPercent = Math.min(
    (event.filledSeats / Math.max(event.totalSeats, 1)) * 100,
    100
  );

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/events"
        className="text-sm text-gray-400 hover:text-gray-700"
      >
        &larr; Back to events
      </Link>

      <article className="mt-8">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {event.club}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          {event.title}
        </h1>

        <dl className="mt-8 grid gap-px overflow-hidden rounded-md border border-gray-200 bg-gray-200 text-sm sm:grid-cols-2">
          <div className="bg-white p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Date &amp; Time
            </dt>
            <dd className="mt-1 text-gray-700">
              {formattedDate}, {formattedTime}
            </dd>
          </div>
          <div className="bg-white p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Location
            </dt>
            <dd className="mt-1 text-gray-700">{event.location}</dd>
          </div>
        </dl>

        <p className="mt-8 text-base leading-7 text-gray-600">
          {event.description}
        </p>

        <div className="mt-8">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Capacity</span>
            <span>
              {event.filledSeats}/{event.totalSeats} seats
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gray-800 transition-all duration-500"
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>

        <JoinEventButton />
      </article>
    </div>
  );
}
