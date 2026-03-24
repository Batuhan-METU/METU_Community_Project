import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { mockClubs } from "../../lib/mockClubs";
import { mockEvents } from "../../lib/mockEvents";

type ClubDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  const cookieStore = await cookies();
  const isLoggedIn =
    cookieStore.get("auth-token")?.value === "logged-in";

  const { id } = await params;
  const clubId = Number(id);
  const club = mockClubs.find((item) => item.id === clubId);

  if (!club) {
    notFound();
  }

  const clubEvents = mockEvents.filter((event) => event.club === club.name);
  const memberCount = 120 + club.id * 17;
  const coverImage = clubEvents[0]?.image ?? "/images/events.jpg";
  const badgeClassByCategory: Record<string, string> = {
    Engineering: "bg-indigo-100 text-indigo-700",
    Business: "bg-amber-100 text-amber-700",
    Art: "bg-pink-100 text-pink-700",
    Music: "bg-fuchsia-100 text-fuchsia-700",
    Science: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/60 pb-14">
      {/* Hero / header */}
      <section className="relative h-[18rem] overflow-hidden sm:h-[21rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={club.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(129,140,248,0.35),transparent_35%),radial-gradient(circle_at_85%_30%,rgba(59,130,246,0.25),transparent_40%)]" />

        <div className="relative mx-auto flex h-full max-w-6xl items-end px-6 pb-8">
          <div className="w-full animate-fade-in-up">
            <Link
              href="/clubs"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              <span aria-hidden>&larr;</span> Back to clubs
            </Link>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
              <div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    badgeClassByCategory[club.category] ?? "bg-slate-100 text-slate-700"
                  }`}
                >
                  {club.category}
                </span>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {club.name}
                </h1>
                <p className="mt-2 text-sm text-white/75">
                  {memberCount} members
                </p>
              </div>
              <button
                type="button"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.03] hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40"
              >
                Join Community
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto mt-8 grid max-w-6xl gap-7 px-6 lg:grid-cols-[1.75fr_1fr]">
        {/* Left column */}
        <div className="space-y-7">
          <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-6 shadow-lg shadow-slate-900/5 backdrop-blur animate-fade-in-up">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">About</h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-600">{club.description}</p>
          </section>

          <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-6 shadow-lg shadow-slate-900/5 backdrop-blur animate-fade-in-up">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Upcoming Events
            </h2>

            {isLoggedIn ? (
              <>
                {clubEvents.length === 0 ? (
                  <p className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                    No events are available for this club yet.
                  </p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {clubEvents.map((event) => {
                      const formattedDate = new Date(event.date).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      return (
                        <Link
                          key={event.id}
                          href={`/events/${event.id}`}
                          className="group block rounded-xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-100"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <h3 className="line-clamp-1 text-base font-semibold text-slate-900">
                                {event.title}
                              </h3>
                              <p className="mt-1 text-sm text-slate-500">{formattedDate}</p>
                            </div>
                            <span className="text-xs font-medium text-indigo-600 transition-colors group-hover:text-indigo-700">
                              View
                            </span>
                          </div>
                          <p className="mt-2 line-clamp-1 text-sm text-slate-600">
                            {event.location}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-600">Login to see upcoming events.</p>
                <Link
                  href="/login"
                  className="mt-3 inline-flex rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-200"
                >
                  Login to explore events
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* Right column */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-slate-900/5 backdrop-blur animate-fade-in-up">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Community Info
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-800">Role:</span> Member
              </p>
              <p>
                <span className="font-medium text-slate-800">Category:</span>{" "}
                {club.category}
              </p>
              <p>
                <span className="font-medium text-slate-800">Total events:</span>{" "}
                {club.numberOfEvents}
              </p>
            </div>
            <button
              type="button"
              className="mt-5 w-full rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition-all duration-300 hover:scale-[1.02] hover:bg-indigo-100 hover:shadow-md hover:shadow-indigo-100"
            >
              Leave Community
            </button>
          </section>

          <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-slate-900/5 backdrop-blur animate-fade-in-up">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Members Preview
            </h3>
            <div className="mt-4 flex items-center gap-2">
              {["A", "S", "D", "M", "K"].map((initial, idx) => (
                <span
                  key={initial + idx}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-semibold text-white shadow-sm"
                >
                  {initial}
                </span>
              ))}
              <span className="ml-1 text-xs text-slate-500">+{memberCount - 5}</span>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
