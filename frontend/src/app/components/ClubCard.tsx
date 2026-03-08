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
      <article className="flex h-full flex-col justify-between rounded-lg border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 text-sm font-semibold text-gray-600">
              {name.charAt(0)}
            </div>
            <h3 className="text-base font-semibold text-gray-900">{name}</h3>
          </div>

          <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
            {description}
          </p>

          <p className="text-sm text-gray-400">
            <span className="font-medium text-gray-600">{eventCount}</span>{" "}
            events
          </p>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-3 text-center text-sm font-medium text-gray-500 transition-colors group-hover:text-gray-900">
          View club &rarr;
        </div>
      </article>
    </Link>
  );
}
