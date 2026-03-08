import ClubCard from "../components/ClubCard";
import { mockClubs } from "../lib/mockClubs";

export default function ClubsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
        University Clubs
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockClubs.map((club) => (
          <ClubCard
            key={club.id}
            id={club.id}
            name={club.name}
            description={club.description}
            eventCount={club.numberOfEvents}
          />
        ))}
      </div>
    </div>
  );
}
