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
  const safeTotalSeats = Math.max(totalSeats, 1);
  const capacityPercent = Math.min((filledSeats / safeTotalSeats) * 100, 100);

  return (
    <Link href={`/events/${id}`} className="group block h-full">
      <article className="relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.1] hover:shadow-xl hover:shadow-indigo-500/[0.08]">
        <div className="flex h-full flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {club}
              </p>
              {joined && (
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                  Joined
                </span>
              )}
            </div>
            <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-white">
              {title}
            </h3>
            <div className="space-y-1 text-sm text-slate-400">
              <p>
                {formattedDate} at {formattedTime}
              </p>
              <p className="text-slate-500">{location}</p>
            </div>
            <div className="space-y-2 pt-1">
              <p className="text-xs text-slate-500">
                {filledSeats} / {totalSeats} seats filled
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-indigo-500/70 transition-all duration-500"
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>
            </div>
          </div>

          <span className="block w-full rounded-lg bg-white/[0.06] px-4 py-2.5 text-center text-sm font-medium text-slate-300 transition-all duration-200 group-hover:bg-indigo-500/20 group-hover:text-indigo-300">
            View Event
          </span>
        </div>
      </article>
    </Link>
  );
}
