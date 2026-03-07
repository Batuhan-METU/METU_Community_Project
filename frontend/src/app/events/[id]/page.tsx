import { notFound } from "next/navigation";
import { mockEvents } from "../../lib/mockEvents";

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;
  const eventId = Number(id);
  const event = mockEvents.find((item) => item.id === eventId);

  if (!event) {
    notFound();
  }

  const formattedDate = new Date(event.date).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = new Date(event.date).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
      <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {event.club}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          {event.title}
        </h1>

        <div className="mt-6 space-y-2 text-sm text-zinc-600">
          <p>
            <span className="font-medium text-zinc-800">Date:</span>{" "}
            {formattedDate} at {formattedTime}
          </p>
          <p>
            <span className="font-medium text-zinc-800">Location:</span>{" "}
            {event.location}
          </p>
        </div>

        <p className="mt-6 leading-7 text-zinc-700">{event.description}</p>

        <button className="mt-8 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
          Join Event
        </button>
      </article>
    </div>
  );
}
