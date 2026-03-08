import Link from "next/link";
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
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      <Link
        href="/clubs"
        className="inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-indigo-400"
      >
        &larr; Back to clubs
      </Link>

      <article className="mt-6 rounded-2xl border border-white/[0.06] bg-surface p-6 md:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-lg font-bold text-indigo-400 ring-1 ring-indigo-500/20">
            {club.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {club.category}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {club.name}
            </h1>
          </div>
        </div>

        <p className="mt-6 leading-7 text-slate-400">{club.description}</p>

        <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Category
            </p>
            <p className="mt-1 text-slate-300">{club.category}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Total Events
            </p>
            <p className="mt-1 text-slate-300">{club.numberOfEvents}</p>
          </div>
        </div>
      </article>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Club Events
        </h2>

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
          <p className="mt-6 text-sm text-slate-500">
            No events are available for this club yet.
          </p>
        )}
      </section>
    </div>
  );
}
