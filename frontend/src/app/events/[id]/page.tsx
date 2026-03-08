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

  const safeTotalSeats = Math.max(event.totalSeats, 1);
  const capacityPercent = Math.min(
    (event.filledSeats / safeTotalSeats) * 100,
    100
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
      <Link
        href="/events"
        className="inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-indigo-400"
      >
        &larr; Back to events
      </Link>

      <article className="mt-6 rounded-2xl border border-white/[0.06] bg-surface p-6 md:p-8">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {event.club}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {event.title}
        </h1>

        <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Date & Time
            </p>
            <p className="mt-1 text-slate-300">
              {formattedDate} at {formattedTime}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Location
            </p>
            <p className="mt-1 text-slate-300">{event.location}</p>
          </div>
        </div>

        <p className="mt-6 leading-7 text-slate-400">{event.description}</p>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Capacity</span>
            <span>
              {event.filledSeats} / {event.totalSeats} seats filled
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-indigo-500/70 transition-all duration-500"
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>

        <JoinEventButton />
      </article>
    </div>
  );
}
