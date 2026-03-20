import Link from "next/link";
import { notFound } from "next/navigation";
import JoinEventButton from "../../components/JoinEventButton";
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

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(event.date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const capacityPercent = Math.min(
    (event.filledSeats / Math.max(event.totalSeats, 1)) * 100,
    100
  );

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      {/*
        Her etkinlik için mock’taki event.image (ör. ML → /images/event-images/ai.jpg).
        Blur SADECE bu sayfa gövdesinde (main); navbar/footer layout’ta ayrı, etkilenmez.
        1) Bu alanı dolduran bulanık görsel
        2) Okunabilirlik örtüsü
        3) Üstte beyaz kart
      */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src={event.image}
          alt=""
          className="h-full w-full scale-110 object-cover opacity-95 blur-lg"
          aria-hidden
        />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-white/30" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-3xl">
          <Link
            href="/events/explore-events"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <span aria-hidden>&larr;</span> Back
          </Link>

          <article className="relative w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/*
              Kart üstü: büyük banner; görsel object-cover ile alanı baştan sona doldurur.
            */}
            <div className="relative h-64 w-full overflow-hidden bg-neutral-200 sm:h-72 md:h-80 lg:h-96">
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 h-full w-full object-cover object-center"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="space-y-5 p-6 md:space-y-6 md:p-8">
              <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-600">
                {event.category}
              </span>

              <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                {event.title}
              </h1>

              <div className="flex flex-col gap-3 text-base text-gray-600 md:flex-row md:flex-wrap md:items-center md:gap-x-8 md:gap-y-2 md:text-lg">
                <span>
                  <span className="font-medium text-gray-500">When: </span>
                  {formattedDate} &middot; {formattedTime}
                </span>
                <span>
                  <span className="font-medium text-gray-500">Where: </span>
                  {event.location}
                </span>
              </div>

              <p className="text-sm text-gray-500 md:text-base">
                Hosted by{" "}
                <span className="font-medium text-gray-700">{event.club}</span>
              </p>

              <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                {event.description}
              </p>

              <div>
                <div className="flex items-center justify-between text-xs font-medium text-gray-500 md:text-sm">
                  <span>Capacity</span>
                  <span>
                    {event.filledSeats}/{event.totalSeats} seats
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <JoinEventButton />
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
