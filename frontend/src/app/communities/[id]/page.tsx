import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import EventCard from "../../components/EventCard";
import { mockCommunities } from "../../lib/mockCommunities";
import { mockEvents } from "../../lib/mockEvents";

type CommunityDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const cookieStore = await cookies();
  const isLoggedIn =
    cookieStore.get("auth-token")?.value === "logged-in";

  const { id } = await params;
  const communityId = Number(id);
  const community = mockCommunities.find((item) => item.id === communityId);

  if (!community) {
    notFound();
  }

  const communityEvents = mockEvents.filter((event) => event.community === community.name);

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
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-lg font-bold text-white">
            {community.name.charAt(0)}
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
            <p className="mt-1 text-neutral-200">{community.numberOfEvents}</p>
          </div>
        </div>
      </article>

      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Community Events
        </h2>

        {isLoggedIn ? (
          <>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {communityEvents.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  community={event.community}
                  date={event.date}
                  location={event.location}
                  filledSeats={event.filledSeats}
                  totalSeats={event.totalSeats}
                />
              ))}
            </div>

            {communityEvents.length === 0 && (
              <p className="mt-6 text-sm text-neutral-500">
                No events are available for this community yet.
              </p>
            )}
          </>
        ) : (
          <div className="mt-6 rounded-xl bg-neutral-900 p-6 ring-1 ring-neutral-800">
            <p className="text-sm text-neutral-400">
              Login to see upcoming events
            </p>
            <Link
              href="/login"
              className="mt-3 inline-block rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Login to explore events
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
