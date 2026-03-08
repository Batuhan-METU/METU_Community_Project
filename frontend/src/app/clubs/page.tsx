import ClubCard from "../components/ClubCard";
import { mockClubs } from "../lib/mockClubs";

export default function ClubsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
        University Clubs
      </h1>
      <p className="mt-2 text-sm text-slate-500">
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
