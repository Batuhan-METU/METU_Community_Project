import { notFound } from "next/navigation";
import EventCard from "../../components/EventCard";
import { mockClubs } from "../../lib/mockClubs";
import { mockEvents } from "../../lib/mockEvents";

type ClubDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { id } = await params;
  const clubId = Number(id);
  const club = mockClubs.find((item) => item.id === clubId);

  if (!club) {
    notFound();
  }

  const clubEvents = mockEvents.filter((event) => event.club === club.name);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
      <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {club.category}
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          {club.name}
        </h1>

        <p className="mt-6 leading-7 text-zinc-700">{club.description}</p>

        <div className="mt-6 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
          <p>
            <span className="font-medium text-zinc-800">Category:</span>{" "}
            {club.category}
          </p>
          <p>
            <span className="font-medium text-zinc-800">Number of Events:</span>{" "}
            {club.numberOfEvents}
          </p>
        </div>
      </article>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Club Events
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clubEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              club={event.club}
              date={event.date}
              location={event.location}
            />
          ))}
        </div>

        {clubEvents.length === 0 && (
          <p className="mt-4 text-sm text-zinc-500">
            No events are available for this club yet.
          </p>
        )}
      </section>
    </div>
  );
}
