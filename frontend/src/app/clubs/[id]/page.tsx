import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import EventCard from "../../components/EventCard";
import { mockClubs } from "../../lib/mockClubs";
import { mockEvents } from "../../lib/mockEvents";

type ClubDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  const cookieStore = await cookies();
  const isLoggedIn =
    cookieStore.get("auth-token")?.value === "logged-in";

  const { id } = await params;
  const clubId = Number(id);
  const club = mockClubs.find((item) => item.id === clubId);

  if (!club) {
    notFound();
  }

  const clubEvents = mockEvents.filter((event) => event.club === club.name);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/clubs"
        className="text-sm text-gray-400 hover:text-gray-700"
      >
        &larr; Back to clubs
      </Link>

      <article className="mt-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100 text-base font-semibold text-gray-600">
            {club.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {club.category}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {club.name}
            </h1>
          </div>
        </div>

        <p className="mt-6 text-base leading-7 text-gray-600">
          {club.description}
        </p>

        <dl className="mt-6 grid gap-px overflow-hidden rounded-md border border-gray-200 bg-gray-200 text-sm sm:grid-cols-2">
          <div className="bg-white p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Category
            </dt>
            <dd className="mt-1 text-gray-700">{club.category}</dd>
          </div>
          <div className="bg-white p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Total Events
            </dt>
            <dd className="mt-1 text-gray-700">{club.numberOfEvents}</dd>
          </div>
        </dl>
      </article>

      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">
          Club Events
        </h2>

        {isLoggedIn ? (
          <>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {clubEvents.map((event) => (
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

            {clubEvents.length === 0 && (
              <p className="mt-4 text-sm text-gray-400">
                No events are available for this club yet.
              </p>
            )}
          </>
        ) : (
          <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm text-gray-600">
              Login to see upcoming events
            </p>
            <Link
              href="/login"
              className="mt-3 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Login to explore events
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
