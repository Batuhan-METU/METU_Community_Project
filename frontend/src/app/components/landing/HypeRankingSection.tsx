"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { HypeBadgeVariant, HypeRankingEntry } from "../../data/mockHypeRanking";
import {
  badgeForRank,
  HYPE_RANKING_THIS_WEEK,
  TOP_CLUB_OF_THE_WEEK,
} from "../../data/mockHypeRanking";
import {
  displayRatingForCatalogEvent,
  hypeScoreForCatalogEvent,
} from "../../lib/hypeLeaderboard";
import { mockEvents } from "../../lib/mockEvents";
import { getEventRating } from "../../lib/eventRatingsStorage";
import { MOCK_CLUBS } from "../messages/mockClubs";
import { ClubAvatar } from "../messages/ClubAvatar";

function formatEventDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function badgeClass(variant: HypeBadgeVariant): string {
  switch (variant) {
    case "top":
      return "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-950 ring-amber-300/60";
    case "trending":
      return "bg-gradient-to-r from-orange-100 to-rose-50 text-orange-900 ring-orange-200/70";
    case "rising":
      return "bg-gradient-to-r from-emerald-100 to-teal-50 text-emerald-900 ring-emerald-200/70";
    default:
      return "bg-gray-100 text-gray-800 ring-gray-200";
  }
}

/**
 * Recompute hype from turnout + ratings when local ratings exist (after mount).
 * First paint matches SSR (no `localStorage`) so hydration succeeds.
 */
function useLiveRanking(base: readonly HypeRankingEntry[]): HypeRankingEntry[] {
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const on = () => setTick((t) => t + 1);
    window.addEventListener("metu-event-ratings-changed", on);
    return () => window.removeEventListener("metu-event-ratings-changed", on);
  }, []);

  return useMemo(() => {
    const merged = base.map((e) => {
      const ev = mockEvents.find((x) => x.id === e.eventId);
      if (!ev) return e;
      const user = mounted ? getEventRating(e.eventId) : null;
      const hypeScore = hypeScoreForCatalogEvent(ev, user);
      const displayRating = displayRatingForCatalogEvent(ev, user);
      return {
        ...e,
        hypeScore: Math.round(hypeScore * 10) / 10,
        displayRating,
      };
    });
    merged.sort((a, b) => b.hypeScore - a.hypeScore);
    return merged.map((row, i) => {
      const rank = i + 1;
      const b = badgeForRank(rank);
      return {
        ...row,
        rank,
        badgeLabel: b.badgeLabel,
        badgeVariant: b.badgeVariant,
        trendLabel: b.trendLabel,
      };
    });
  }, [base, tick, mounted]);
}

export default function HypeRankingSection() {
  const topFive = useLiveRanking(HYPE_RANKING_THIS_WEEK);
  const featured = topFive[0];
  const topClub = TOP_CLUB_OF_THE_WEEK;
  const topClubThread =
    topClub.clubRouteId != null
      ? MOCK_CLUBS.find((c) => c.id === String(topClub.clubRouteId))
      : undefined;
  const clubAvatarProps = {
    name: topClubThread?.name ?? topClub.name,
    avatarUrl: topClubThread?.avatarUrl,
  };
  const topClubHref =
    topClub.clubRouteId != null
      ? `/clubs/${topClub.clubRouteId}`
      : "/clubs";

  return (
    <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-slate-50 via-white to-indigo-50/30 py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          🔥 Post-event hype
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-600">
          Finished events from the latest window — ranked by attendance fill,
          community ratings, and review volume.
        </p>

        {/* #1 — featured hero */}
        {featured ? (
        <div className="mt-12 hype-featured-float">
          <Link
            href={`/events/${featured.eventId}/insights`}
            className="hype-featured-glow group relative block overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-[3px] shadow-2xl shadow-indigo-500/25 transition duration-300 hover:scale-[1.01] hover:shadow-indigo-500/35"
          >
            <div className="overflow-hidden rounded-[1.8rem] bg-slate-950">
              <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
                <div className="relative aspect-[16/10] min-h-[220px] lg:min-h-[360px]">
                  <Image
                    src={featured.image}
                    alt=""
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-black/50" />
                  <span
                    className={`absolute left-5 top-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold shadow-lg ring-2 ring-white/30 backdrop-blur-sm ${badgeClass(featured.badgeVariant)}`}
                  >
                    {featured.badgeLabel}
                  </span>
                  <span className="absolute bottom-4 left-5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      Hype {featured.hypeScore}
                    </span>
                    <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-amber-100 backdrop-blur-md">
                      ⭐ {featured.displayRating.toFixed(1)}
                    </span>
                  </span>
                </div>
                <div className="flex flex-col justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 sm:p-10 lg:p-12">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                    {featured.club}
                  </p>
                  <h3 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.35rem] lg:leading-[1.15]">
                    {featured.title}
                  </h3>
                  <p
                    className="mt-4 text-sm text-white/85"
                    suppressHydrationWarning
                  >
                    {formatEventDate(featured.date)}
                  </p>
                  <p className="mt-5 line-clamp-4 text-[15px] leading-relaxed text-white/90">
                    {featured.description}
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white transition group-hover:gap-3">
                    View insights
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
        ) : (
          <p className="mx-auto mt-12 max-w-md text-center text-sm text-gray-500">
            No finished events in the current ranking window yet.
          </p>
        )}

        {/* Top 5 + Top club of the week */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_minmax(260px,300px)] lg:items-start lg:gap-10">
          <div>
            <h3 className="mb-5 text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-500 lg:text-left">
              Top 5 by hype score
            </h3>
            <ol className="space-y-3">
              {topFive.map((item, idx) => (
                <li
                  key={item.eventId}
                  className="hype-list-item-animate"
                  style={{ animationDelay: `${idx * 70}ms` }}
                >
                  <Link
                    href={`/events/${item.eventId}/insights`}
                    className="group flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200/90 bg-white/90 px-4 py-3 shadow-md shadow-gray-900/[0.06] ring-1 ring-gray-100 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200/90 hover:shadow-lg hover:shadow-indigo-900/[0.08] sm:gap-4 sm:px-5 sm:py-4"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold tabular-nums text-white shadow-lg shadow-indigo-900/25">
                      #{item.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="line-clamp-1 font-semibold text-gray-900 group-hover:text-indigo-950">
                          {item.title}
                        </p>
                        <span
                          className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums text-amber-800 ring-1 ring-amber-200/80 bg-amber-50/90"
                          title="Community rating"
                        >
                          ⭐ {item.displayRating.toFixed(1)}
                        </span>
                        <span
                          className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${badgeClass(item.badgeVariant)}`}
                        >
                          {item.badgeLabel}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-sm text-gray-500">
                        {item.club}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
                      <span
                        className="text-lg"
                        title={item.badgeLabel}
                        aria-hidden
                      >
                        {item.trendLabel}
                      </span>
                      <span className="text-xs font-medium tabular-nums text-gray-500">
                        {item.hypeScore} pts
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <aside className="relative lg:sticky lg:top-24">
            <h3 className="mb-5 text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-500 lg:text-left">
              Top club of the week
            </h3>
            <Link
              href={topClubHref}
              className="group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100/80 via-white to-indigo-50/90 p-[1px] shadow-[0_8px_40px_-12px_rgba(99,102,241,0.35),0_4px_16px_-8px_rgba(245,158,11,0.25)] ring-1 ring-amber-200/50 transition duration-300 hover:shadow-[0_12px_48px_-12px_rgba(99,102,241,0.45),0_6px_20px_-8px_rgba(245,158,11,0.3)]"
            >
              <div className="relative overflow-hidden rounded-[0.95rem] bg-gradient-to-br from-white via-slate-50/95 to-indigo-50/40 px-5 py-5">
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-400/15 blur-2xl"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-indigo-400/10 blur-2xl"
                  aria-hidden
                />
                <div className="relative flex items-start gap-4">
                  <div className="relative shrink-0">
                    <span
                      className="absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[10px] shadow-md shadow-amber-900/20"
                      aria-hidden
                      title="Top club"
                    >
                      👑
                    </span>
                    <ClubAvatar
                      club={clubAvatarProps}
                      size="lg"
                      active
                    />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-800/90">
                      Aggregated hype
                    </p>
                    <p className="mt-1 line-clamp-2 text-base font-bold leading-snug text-gray-900 transition group-hover:text-indigo-950">
                      {topClub.name}
                    </p>
                    <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-transparent bg-gradient-to-r from-indigo-700 via-violet-600 to-fuchsia-600 bg-clip-text">
                      {topClub.totalHypeScore}
                    </p>
                    <p className="text-xs font-medium text-gray-500">
                      total hype points
                    </p>
                  </div>
                </div>
                <p className="relative mt-4 text-xs font-semibold text-indigo-600 transition group-hover:text-indigo-700">
                  View club profile →
                </p>
              </div>
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
