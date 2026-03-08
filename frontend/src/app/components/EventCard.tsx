import Link from "next/link";

interface EventCardProps {
  id: number;
  title: string;
  club: string;
  date: string;
  location: string;
  filledSeats: number;
  totalSeats: number;
  joined?: boolean;
}

export default function EventCard({
  id,
  title,
  club,
  date,
  location,
  filledSeats,
  totalSeats,
  joined = false,
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
  const capacityPercent = Math.min(
    (filledSeats / Math.max(totalSeats, 1)) * 100,
    100
  );

  return (
    <Link href={`/events/${id}`} className="group block h-full">
      <article className="flex h-full flex-col justify-between rounded-md border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50/30">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium tracking-wide text-gray-400">{club}</p>
            {joined && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                Joined
              </span>
            )}
          </div>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900">
            {title}
          </h3>
          <div className="space-y-1 text-sm text-gray-500">
            <p>
              {formattedDate}, {formattedTime}
            </p>
            <p>{location}</p>
          </div>
          <div className="pt-0.5">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                {filledSeats}/{totalSeats} seats
              </span>
              <span>{Math.round(capacityPercent)}%</span>
            </div>
            <div className="mt-1.5 h-1 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gray-900 transition-all duration-500"
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-3 text-center text-sm font-medium text-gray-500 transition-colors group-hover:text-gray-800">
          View details &rarr;
        </div>
      </article>
    </Link>
  );
}
