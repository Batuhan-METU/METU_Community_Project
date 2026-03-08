import Link from "next/link";

type ClubCardProps = {
  id: number;
  name: string;
  description: string;
  eventCount: number;
};

export default function ClubCard({
  id,
  name,
  description,
  eventCount,
}: ClubCardProps) {
  return (
    <Link href={`/clubs/${id}`} className="group block h-full">
      <article className="relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.1] hover:shadow-xl hover:shadow-indigo-500/[0.08]">
        <div className="flex h-full flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xs font-bold text-indigo-400 ring-1 ring-indigo-500/20">
                {name.charAt(0)}
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-white">
                {name}
              </h3>
            </div>

            <p className="line-clamp-3 text-sm leading-6 text-slate-400">
              {description}
            </p>

            <p className="text-sm text-slate-500">
              <span className="font-medium text-slate-300">{eventCount}</span>{" "}
              events
            </p>
          </div>

          <span className="block w-full rounded-lg bg-white/[0.06] px-4 py-2.5 text-center text-sm font-medium text-slate-300 transition-all duration-200 group-hover:bg-indigo-500/20 group-hover:text-indigo-300">
            View Club
          </span>
        </div>
      </article>
    </Link>
  );
}
