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
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href="/events"
        className="text-sm text-gray-400 transition-colors hover:text-gray-700"
      >
        &larr; Back to events
      </Link>

      <article className="mt-6">
        <p className="text-xs font-medium text-gray-400">{event.club}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
          {event.title}
        </h1>

        <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 sm:grid-cols-2">
          <div className="bg-white p-4">
            <p className="text-xs font-medium text-gray-400">Date & Time</p>
            <p className="mt-1 text-sm text-gray-700">
              {formattedDate}, {formattedTime}
            </p>
          </div>
          <div className="bg-white p-4">
            <p className="text-xs font-medium text-gray-400">Location</p>
            <p className="mt-1 text-sm text-gray-700">{event.location}</p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-gray-600">
          {event.description}
        </p>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Capacity</span>
            <span>
              {event.filledSeats}/{event.totalSeats} seats
            </span>
          </div>
          <div className="mt-1.5 h-1 w-full rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gray-900 transition-all duration-500"
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>

        <JoinEventButton />
      </article>
    </div>
  );
}
