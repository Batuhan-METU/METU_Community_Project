import Link from "next/link";
import { messagesHrefForClubThreadId } from "../lib/chatNavigation";

interface EventCardProps {
  id: number;
  title: string;
  club: string;
  date: string;
  location: string;
  filledSeats: number;
  totalSeats: number;
  joined?: boolean;
  chatThreadId: string;
}

export default function EventCard({
  id,
  title,
  club: _club,
  date,
  location,
  filledSeats: _filledSeats,
  totalSeats: _totalSeats,
  joined: _joined = false,
  chatThreadId,
}: EventCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="flex h-full transform flex-col rounded-2xl bg-slate-950/95 shadow-md shadow-black/40 ring-1 ring-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60">
      <Link href={`/events/${id}`} className="group block flex-1">
        <div className="relative h-40 overflow-hidden rounded-2xl rounded-b-none">
          <div className="h-full w-full bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-orange-400" />
        </div>
        <div className="flex flex-col justify-between gap-3 rounded-2xl rounded-t-none bg-slate-900 px-4 py-4">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {formattedDate}, {formattedTime}
            </p>
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-50">
              {title}
            </h3>
            <p className="text-sm text-slate-400">{location}</p>
          </div>
          <div className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition-colors group-hover:bg-white">
            Register
          </div>
        </div>
      </Link>
      <div className="border-t border-slate-800/80 px-4 pb-4 pt-1">
        <Link
          href={messagesHrefForClubThreadId(chatThreadId)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-600/90 bg-slate-800/90 px-3 py-2 text-xs font-medium text-slate-100 transition duration-200 hover:border-indigo-500/50 hover:bg-slate-700/90"
        >
          <span aria-hidden>💬</span>
          Join Chat
        </Link>
      </div>
    </article>
  );
}
