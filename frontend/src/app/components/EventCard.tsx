import Link from "next/link";

interface EventCardProps {
  id: number;
  title: string;
  club: string;
  date: string;
  location: string;
}

export default function EventCard({
  id,
  title,
  club,
  date,
  location,
}: EventCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = new Date(date).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/events/${id}`} className="group block h-full">
      <article className="h-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex h-full flex-col justify-between gap-6">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {club}
            </p>
            <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-zinc-900">
              {title}
            </h3>
            <div className="space-y-1 text-sm text-zinc-600">
              <p>
                {formattedDate} at {formattedTime}
              </p>
              <p className="text-zinc-500">{location}</p>
            </div>
          </div>

          <span className="block w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors duration-200 group-hover:bg-zinc-800">
            Join Event
          </span>
        </div>
      </article>
    </Link>
  );
}
