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
    <div className="mx-auto max-w-5xl px-6 py-12">
      <section className="border-b border-gray-200 pb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-base font-semibold text-gray-600">
            BK
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Batuhan Kaya</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Computer engineering student exploring clubs, workshops, and
              events across campus.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-gray-900">Joined Events</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      <section className="mt-10">
        <h2 className="text-lg font-bold text-gray-900">Interested Clubs</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
