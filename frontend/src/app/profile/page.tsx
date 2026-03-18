import CommunityCard from "../components/CommunityCard";
import EventCard from "../components/EventCard";
import { mockCommunities } from "../lib/mockCommunities";
import { mockEvents } from "../lib/mockEvents";

const joinedEventIds = [1, 3, 5];
const followedCommunityIds = [1, 3, 5];

export default function ProfilePage() {
  const joinedEvents = mockEvents.filter((event) =>
    joinedEventIds.includes(event.id)
  );
  const interestedCommunities = mockCommunities.filter((community) =>
    followedCommunityIds.includes(community.id)
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <section className="rounded-2xl bg-neutral-900 p-6 ring-1 ring-neutral-800 md:p-8">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold text-white">
            BK
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Batuhan Kaya
            </h1>
            <p className="mt-1 text-sm text-neutral-400">
              Computer engineering student exploring communities, workshops, and
              events across campus.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Joined Events
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {joinedEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              community={event.community}
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
        <h2 className="text-xl font-bold tracking-tight text-white">
          Interested Communities
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {interestedCommunities.map((community) => (
            <CommunityCard
              key={community.id}
              id={community.id}
              name={community.name}
              description={community.description}
              eventCount={community.numberOfEvents}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
