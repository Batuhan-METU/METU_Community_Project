import EventCard from "./components/EventCard";
import { mockEvents } from "./lib/mockEvents";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 md:text-6xl">
          METU Community Platform
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">
          Discover student clubs, explore campus activities, and join the
          events that match your interests - all in one place.
        </p>
      </section>

      <section className="mt-12 md:mt-16">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
          Upcoming Events
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockEvents.map((event) => (
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
      </section>
    </div>
  );
}
