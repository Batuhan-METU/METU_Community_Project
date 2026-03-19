import Link from "next/link";
import { notFound } from "next/navigation";
import EventCard from "../../components/EventCard";
import type { MockEvent } from "../../lib/mockEvents";

type CommunityDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CommunityDetailPage({
  params,
}: CommunityDetailPageProps) {
  const { id } = await params;
  const communityId = id;
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

  let communities: unknown;
  let events: unknown;

  try {
    const [communitiesRes, eventsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/communities`),
      fetch(`${API_BASE_URL}/events`),
    ]);

    [communities, events] = await Promise.all([
      communitiesRes.json(),
      eventsRes.json(),
    ]);
  } catch {
    notFound();
  }

  type ApiCommunity = {
    id: string | number;
    name: string;
    description?: string | null;
    logo_url?: string | null;
    category?: string | null;
  };

  type ApiEvent = {
    id: string | number;
    community_id: string | number;
    title: string;
    starts_at: string;
    location?: string | null;
    image_url?: string | null;
    capacity?: number | null;
    description?: string | null;
  };

  const typedCommunities = communities as ApiCommunity[];
  const typedEvents = events as ApiEvent[];

  const community = typedCommunities.find(
    (item) => String(item.id) === String(communityId)
  );

  if (!community) notFound();

  const communityEvents: MockEvent[] = (typedEvents || [])
    .filter((event) => String(event.community_id) === String(communityId))
    .map((event) => ({
      id: event.id,
      title: event.title,
      community: community.name,
      date: event.starts_at,
      location: event.location || "",
      imageUrl: event.image_url,
      filledSeats: 0,
      totalSeats: typeof event.capacity === "number" ? event.capacity : 0,
      description: event.description || "",
      category: undefined,
    }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/communities"
        className="text-sm text-neutral-500 transition-colors hover:text-indigo-400"
      >
        &larr; Back to communities
      </Link>

      <article className="mt-8 rounded-2xl bg-neutral-900 p-6 ring-1 ring-neutral-800 md:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
            {community.logo_url ? (
              // Supabase public URL zaten doğrudan açılabilir.
              <img
                src={community.logo_url}
                alt={`${community.name} logosu`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-white">
                {community.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              {community.category}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {community.name}
            </h1>
          </div>
        </div>

        <p className="mt-6 text-base leading-7 text-neutral-400">
          {community.description}
        </p>

        <div className="mt-6 grid gap-px overflow-hidden rounded-xl bg-neutral-800 text-sm sm:grid-cols-2">
          <div className="bg-neutral-900 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Category
            </p>
            <p className="mt-1 text-neutral-200">{community.category}</p>
          </div>
          <div className="bg-neutral-900 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Total Events
            </p>
            <p className="mt-1 text-neutral-200">{communityEvents.length}</p>
          </div>
        </div>
      </article>

      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Community Events
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {communityEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              community={event.community}
              date={event.date}
              location={event.location}
              imageUrl={event.imageUrl}
              filledSeats={event.filledSeats}
              totalSeats={event.totalSeats}
            />
          ))}
        </div>

        {communityEvents.length === 0 && (
          <p className="mt-6 text-sm text-neutral-500">
            Bu topluluğa ait etkinlik bulunamadı.
          </p>
        )}
      </section>
    </div>
  );
}
