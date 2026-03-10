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
        className="text-sm text-neutral-500 transition-colors hover:text-indigo-400"
      >
        &larr; Back to events
      </Link>

      <article className="mt-8 rounded-2xl bg-neutral-900 p-6 ring-1 ring-neutral-800 md:p-8">
        <div className="relative mb-6 h-48 overflow-hidden rounded-xl">
          <div className="h-full w-full bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-orange-400" />
        </div>

        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          {event.club}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          {event.title}
        </h1>

        <div className="mt-6 grid gap-px overflow-hidden rounded-xl bg-neutral-800 text-sm sm:grid-cols-2">
          <div className="bg-neutral-900 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Date &amp; Time
            </p>
            <p className="mt-1 text-neutral-200">
              {formattedDate}, {formattedTime}
            </p>
          </div>
          <div className="bg-neutral-900 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Location
            </p>
            <p className="mt-1 text-neutral-200">{event.location}</p>
          </div>
        </div>

        <p className="mt-6 text-base leading-7 text-neutral-400">
          {event.description}
        </p>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Capacity</span>
            <span>
              {event.filledSeats}/{event.totalSeats} seats
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-neutral-800">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>

        <JoinEventButton />
      </article>
    </div>
  );
}
