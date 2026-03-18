import Link from "next/link";
import { notFound } from "next/navigation";
import JoinEventButton from "../../components/JoinEventButton";

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;
  const eventId = id;

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

  let events: unknown;
  let communities: unknown;
  let participantsBody: { participant_count?: number } | null = null;

  try {
    const [eventsRes, communitiesRes, participantsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/events`),
      fetch(`${API_BASE_URL}/communities`),
      fetch(`${API_BASE_URL}/events/participants/${eventId}`),
    ]);

    [events, communities] = await Promise.all([
      eventsRes.json(),
      communitiesRes.json(),
    ]);

    participantsBody = await participantsRes.json().catch(() => null);
  } catch {
    notFound();
  }

  type ApiEvent = {
    id: string | number;
    community_id: string | number;
    title: string;
    starts_at: string;
    location?: string | null;
    image_url?: string | null;
    description?: string | null;
    capacity?: number | null;
  };

  type ApiCommunity = {
    id: string | number;
    name: string;
  };

  const typedEvents = events as ApiEvent[];
  const typedCommunities = communities as ApiCommunity[];

  const event = typedEvents.find(
    (item) => String(item.id) === String(eventId)
  );

  if (!event) notFound();

  const community = typedCommunities.find(
    (c) => String(c.id) === String(event.community_id)
  );

  const filledSeats = participantsBody?.participant_count ?? 0;
  const totalSeats = typeof event.capacity === "number" ? event.capacity : 0;

  const formattedDate = new Date(event.starts_at).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = new Date(event.starts_at).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const capacityPercent = Math.min(
    (filledSeats / Math.max(totalSeats, 1)) * 100,
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
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={`${event.title} görseli`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-orange-400" />
          )}
        </div>

        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          {community?.name ?? ""}
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
          {event.description ?? ""}
        </p>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Capacity</span>
            <span>
              {filledSeats}/{totalSeats} seats
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-neutral-800">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>

        <JoinEventButton eventId={event.id} />
      </article>
    </div>
  );
}
