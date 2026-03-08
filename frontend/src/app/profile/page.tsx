import ClubCard from "../components/ClubCard";
import EventCard from "../components/EventCard";
import { mockClubs } from "../lib/mockClubs";
import { mockEvents } from "../lib/mockEvents";

const joinedEventIds = [1, 3, 5];
const followedClubIds = [1, 3, 5];

export default function ProfilePage() {
  const joinedEvents = mockEvents.filter((event) =>
    joinedEventIds.includes(event.id)
  );
  const interestedClubs = mockClubs.filter((club) =>
    followedClubIds.includes(club.id)
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      <section className="rounded-2xl border border-white/[0.06] bg-surface p-6 md:p-8">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-lg font-bold text-indigo-400 ring-1 ring-indigo-500/20">
            BK
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Batuhan Kaya
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Computer engineering student exploring clubs, workshops, and
              events across campus.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Joined Events
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {joinedEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              club={event.club}
              date={event.date}
              location={event.location}
              filledSeats={event.filledSeats}
              totalSeats={event.totalSeats}
              joined
            />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Interested Clubs
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {interestedClubs.map((club) => (
            <ClubCard
              key={club.id}
              id={club.id}
              name={club.name}
              description={club.description}
              eventCount={club.numberOfEvents}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
