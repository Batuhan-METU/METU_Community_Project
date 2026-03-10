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
      <article className="flex h-full transform flex-col justify-between overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-neutral-800 transition-all duration-300 hover:-translate-y-1 hover:ring-neutral-700 hover:shadow-xl hover:shadow-black/50">
        <div className="relative h-32 overflow-hidden rounded-b-none bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500" />

        <div className="flex h-full flex-col justify-between gap-4 px-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-sm font-bold text-neutral-300">
                {name.charAt(0)}
              </div>
              <h3 className="text-base font-semibold text-white">{name}</h3>
            </div>
            <p className="line-clamp-2 text-sm leading-relaxed text-neutral-400">
              {description}
            </p>
            <p className="text-sm text-neutral-500">
              <span className="font-medium text-neutral-300">{eventCount}</span>{" "}
              events
            </p>
          </div>

          <button
            type="button"
            className="w-full rounded-full bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-200 transition-colors hover:bg-neutral-700"
          >
            View Club
          </button>
        </div>
      </article>
    </Link>
  );
}
