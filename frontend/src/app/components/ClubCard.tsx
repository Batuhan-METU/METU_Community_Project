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
      <article className="h-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex h-full flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500">
                Logo
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
                {name}
              </h3>
            </div>

            <p className="line-clamp-3 text-sm leading-6 text-zinc-600">
              {description}
            </p>

            <p className="text-sm text-zinc-500">
              <span className="font-medium text-zinc-800">{eventCount}</span>{" "}
              events
            </p>
          </div>

          <span className="block w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors duration-200 group-hover:bg-zinc-800">
            View Club
          </span>
        </div>
      </article>
    </Link>
  );
}
