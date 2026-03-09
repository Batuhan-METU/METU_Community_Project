import ClubCard from "../components/ClubCard";
import { mockClubs } from "../lib/mockClubs";

export default function ClubsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        University Clubs
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Explore communities and find the clubs that match your interests.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
