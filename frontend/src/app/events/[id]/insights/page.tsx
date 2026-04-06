import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import type { InsightsStatTrend } from "../../../data/mockHypeRanking";
import { getEventInsightsMock } from "../../../data/mockHypeRanking";
import { ClubAvatar } from "../../../components/messages/ClubAvatar";
import { MOCK_CLUBS } from "../../../components/messages/mockClubs";

type EventInsightsPageProps = {
  params: Promise<{ id: string }>;
};

function IconUsers({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.253a3 3 0 100-5.506 3 3 0 000 5.506z"
      />
    </svg>
  );
}

function IconChat({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    </svg>
  );
}

function IconTrendUp({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
      />
    </svg>
  );
}

function IconBolt({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71L11.018 12.5H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.443z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function StatMiniBar({
  percent,
  accentClass,
}: {
  percent: number;
  accentClass: string;
}) {
  return (
    <div
      className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
      role="presentation"
    >
      <div
        className={`h-full rounded-full bg-gradient-to-r ${accentClass} transition-all duration-500`}
        style={{ width: `${Math.max(8, percent)}%` }}
      />
    </div>
  );
}

type StatDef = {
  key: string;
  label: string;
  value: string;
  hint: string;
  trend: InsightsStatTrend;
  icon: ReactNode;
  trendValueClass: string;
  iconShellClass: string;
  barAccent: string;
};

export default async function EventInsightsPage({
  params,
}: EventInsightsPageProps) {
  const { id } = await params;
  const eventId = Number(id);
  if (!Number.isFinite(eventId)) {
    notFound();
  }

  const data = getEventInsightsMock(eventId);
  if (!data) {
    notFound();
  }

  const formattedDate = new Date(data.date).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const clubThread = MOCK_CLUBS.find((c) => c.id === data.messagesClubId);
  const clubAvatarProps = {
    name: data.club,
    avatarUrl:
      clubThread && clubThread.name === data.club
        ? clubThread.avatarUrl
        : undefined,
  };

  const stats: StatDef[] = [
    {
      key: "participants",
      label: "Participants",
      value: data.participantCount.toLocaleString("en-US"),
      hint: "Interest & sign-ups",
      trend: data.statTrends.participants,
      icon: <IconUsers className="h-5 w-5" />,
      trendValueClass: "text-indigo-600",
      iconShellClass:
        "bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 ring-indigo-100",
      barAccent: "from-indigo-500 to-violet-500",
    },
    {
      key: "chat",
      label: "Chat activity",
      value: data.chatMessageCount.toLocaleString("en-US"),
      hint: "Messages this week",
      trend: data.statTrends.chat,
      icon: <IconChat className="h-5 w-5" />,
      trendValueClass: "text-violet-600",
      iconShellClass:
        "bg-gradient-to-br from-violet-50 to-fuchsia-50 text-violet-600 ring-violet-100",
      barAccent: "from-violet-500 to-fuchsia-500",
    },
    {
      key: "growth",
      label: "Growth (last 24h)",
      value: `+${data.growthLast24hPercent}%`,
      hint: "Vs. prior day",
      trend: data.statTrends.growth,
      icon: <IconTrendUp className="h-5 w-5" />,
      trendValueClass: "text-emerald-600",
      iconShellClass:
        "bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 ring-emerald-100",
      barAccent: "from-emerald-500 to-teal-400",
    },
    {
      key: "hype",
      label: "Hype score",
      value: data.hypeScore.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }),
      hint: "Composite score",
      trend: data.statTrends.hype,
      icon: <IconBolt className="h-5 w-5" />,
      trendValueClass: "text-amber-600",
      iconShellClass:
        "bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600 ring-amber-100",
      barAccent: "from-amber-500 to-orange-500",
    },
  ];

  const rankLabel =
    data.rankThisWeek === 1
      ? "#1 This Week"
      : `#${data.rankThisWeek} This Week`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/40">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <nav className="mb-8 flex flex-wrap items-center gap-3 text-sm">
          <Link
            href="/"
            className="font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            Home
          </Link>
          <span className="text-gray-300" aria-hidden>
            /
          </span>
          <Link
            href="/events/explore-events"
            className="font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            Events
          </Link>
          <span className="text-gray-300" aria-hidden>
            /
          </span>
          <span className="font-medium text-gray-900">Insights</span>
        </nav>

        {/* Hero */}
        <header className="relative overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl shadow-indigo-900/20 ring-1 ring-indigo-200/30">
          {/* Blurred background image */}
          <div className="pointer-events-none absolute inset-0 scale-110">
            <Image
              src={data.image}
              alt=""
              fill
              className="object-cover opacity-40 blur-3xl"
              sizes="100vw"
              aria-hidden
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-950/95 via-violet-900/92 to-fuchsia-950/88"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_-30%,rgba(251,191,36,0.18),transparent_55%)]"
            aria-hidden
          />

          <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-10">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-amber-300/60 via-fuchsia-400/40 to-indigo-500/50 blur-sm" />
                <div className="relative rounded-full bg-slate-900/40 p-1 ring-2 ring-white/25">
                  <ClubAvatar club={clubAvatarProps} size="lg" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-100 shadow-lg backdrop-blur-md">
                    {data.rankThisWeek === 1 ? (
                      <span aria-hidden>👑</span>
                    ) : (
                      <span aria-hidden>📊</span>
                    )}
                    {rankLabel}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-orange-400/30 bg-gradient-to-r from-orange-500/25 to-rose-500/20 px-3 py-1 text-xs font-bold text-orange-50 shadow-md backdrop-blur-md">
                    🔥 Trending
                  </span>
                </div>

                <h1 className="mt-5 max-w-4xl text-3xl font-extrabold leading-[1.12] tracking-tight text-white drop-shadow-sm sm:text-4xl md:text-5xl">
                  {data.title}
                </h1>

                <p className="mt-3 text-lg font-semibold text-white/90 sm:text-xl">
                  {data.club}
                </p>
                <p className="mt-2 text-sm text-white/70 sm:text-base">
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Analytics */}
        <section className="mt-10" aria-labelledby="insights-stats-heading">
          <h2 id="insights-stats-heading" className="sr-only">
            Event statistics
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="group rounded-2xl border border-gray-200/90 bg-white/95 px-5 py-5 shadow-md shadow-gray-900/[0.04] ring-1 ring-gray-100 backdrop-blur-sm transition hover:border-indigo-200/80 hover:shadow-lg hover:shadow-indigo-900/[0.07]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-gray-900 sm:text-[1.65rem]">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-inner ring-1 transition ${stat.iconShellClass}`}
                  >
                    {stat.icon}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <span
                    className={`font-bold tabular-nums ${stat.trendValueClass}`}
                  >
                    {stat.trend.trendLabel}
                  </span>
                  <span className="text-gray-400" aria-hidden>
                    ·
                  </span>
                  <span className="font-medium text-gray-600">
                    {stat.trend.mood}
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-500">{stat.hint}</p>

                <StatMiniBar
                  percent={stat.trend.barPercent}
                  accentClass={stat.barAccent}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Why trending */}
        <section className="mt-12" aria-labelledby="why-trending-heading">
          <div className="rounded-3xl border border-gray-200/90 bg-white/95 p-6 shadow-lg shadow-gray-900/[0.05] ring-1 ring-gray-100 sm:p-8">
            <h2
              id="why-trending-heading"
              className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl"
            >
              Why is this trending?
            </h2>
            <ul className="mt-6 space-y-4">
              {data.whyTrending.map((line, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-[15px] leading-relaxed text-gray-700"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTAs */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Link
            href={`/events/${data.eventId}`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/25 ring-1 ring-white/10 transition hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-900/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            View Event Details
          </Link>
          <Link
            href={`/messages?clubId=${encodeURIComponent(data.messagesClubId)}`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300/90 bg-white px-6 py-3 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-200/80 transition hover:border-indigo-200 hover:bg-gray-50 hover:text-indigo-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            Join Chat
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500 sm:text-left">
          Insights use mock analytics for demonstration.
        </p>
      </div>
    </div>
  );
}
