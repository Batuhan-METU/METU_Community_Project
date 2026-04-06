import Link from "next/link";

export type RecommendedEventCardData = {
  id: number;
  title: string;
  category: string;
  expectedParticipants: number;
  hypeScore?: number;
  reason: string;
};

type RecommendedEventsProps = {
  events: readonly RecommendedEventCardData[];
  /** Override section heading */
  title?: string;
  className?: string;
};

export default function RecommendedEvents({
  events,
  title = "🔥 Recommended for You",
  className = "",
}: RecommendedEventsProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <section
      className={`w-full ${className}`.trim()}
      aria-labelledby="recommended-events-heading"
    >
      <div className="mb-5 flex items-end justify-between gap-4 px-1">
        <h2
          id="recommended-events-heading"
          className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
        >
          {title}
        </h2>
      </div>

      <div
        className="-mx-1 flex gap-4 overflow-x-auto pb-3 pt-1 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.5)_transparent] sm:mx-0 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/80 [&::-webkit-scrollbar-track]:bg-transparent"
        role="list"
      >
        {events.map((event) => {
          const isTrending =
            typeof event.hypeScore === "number" && event.hypeScore > 80;
          return (
            <article
              key={event.id}
              role="listitem"
              className="group relative flex w-[min(100%,320px)] shrink-0 snap-start flex-col rounded-2xl border border-slate-200/80 bg-white/75 p-5 shadow-md shadow-slate-900/5 ring-1 ring-slate-900/[0.04] backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-slate-300/90 hover:bg-white/90 hover:shadow-xl hover:shadow-indigo-900/10 sm:w-[300px]"
            >
              {isTrending ? (
                <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-gradient-to-r from-orange-500/15 to-rose-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-800 ring-1 ring-orange-200/60">
                  🔥 Trending
                </span>
              ) : null}

              <div className={isTrending ? "pr-14 sm:pr-16" : ""}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {event.category}
                </p>
                <p className="mt-1.5 text-xs leading-snug text-slate-500">
                  {event.reason}
                </p>
                <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-indigo-950">
                  {event.title}
                </h3>
              </div>

              <div className="mt-4 flex flex-1 flex-col justify-end gap-4">
                <div className="rounded-xl bg-slate-900/[0.04] px-3.5 py-3 ring-1 ring-slate-900/[0.06]">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    Expected participants
                  </p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-slate-800">
                    {event.expectedParticipants.toLocaleString("en-US")}
                  </p>
                </div>

                <Link
                  href={`/events/${event.id}`}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-900/20 transition duration-300 hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg hover:shadow-indigo-900/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-[0.98]"
                >
                  View Event
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
