import EventCard from "./EventCard";
import type { MockEvent } from "../lib/mockEvents";

type EventsGridProps = {
  events: MockEvent[];
};

export default function EventsGrid({ events }: EventsGridProps) {
  if (events.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-neutral-500">
        No events found
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          id={event.id}
          title={event.title}
          community={event.community}
          date={event.date}
          location={event.location}
          imageUrl={event.imageUrl}
          filledSeats={event.filledSeats}
          totalSeats={event.totalSeats}
        />
      ))}
    </div>
  );
}
