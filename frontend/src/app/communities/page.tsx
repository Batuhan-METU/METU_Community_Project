"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CATEGORY_COVER: Record<string, string> = {
  art: "/images/categories/art.jpg",
  science: "/images/categories/science.jpg",
  technology: "/images/categories/technology.jpg",
  sport: "/images/categories/sport.jpg",
  career: "/images/categories/career.jpg",
};

type Community = {
  id: string;
  name: string;
  category: keyof typeof CATEGORY_COVER;
  description: string;
};

const COMMUNITIES: Community[] = [
  {
    id: "salsa",
    name: "Salsa Club",
    category: "sport",
    description: "Learn salsa steps, practice together, and join monthly dance nights.",
  },
  {
    id: "music-night",
    name: "Campus Music Night",
    category: "sport",
    description: "Live performances, open mic sessions, and community-led jam circles.",
  },
  {
    id: "ai-builders",
    name: "AI Builders Club",
    category: "technology",
    description: "Hands-on ML projects, model demos, and technical peer mentoring.",
  },
  {
    id: "robotics",
    name: "Robotics Club",
    category: "technology",
    description: "Build robots, compete in workshops, and learn embedded systems together.",
  },
  {
    id: "visual-arts",
    name: "Visual Arts Collective",
    category: "art",
    description: "Weekly illustration sessions, gallery tours, and collaborative exhibitions.",
  },
  {
    id: "photo-walk",
    name: "Photography Walk Crew",
    category: "art",
    description: "Campus photo walks, editing labs, and friendly critique sessions.",
  },
  {
    id: "astronomy",
    name: "Astronomy Society",
    category: "science",
    description: "Night observations, telescope workshops, and science outreach events.",
  },
  {
    id: "sustainability",
    name: "Sustainability Lab",
    category: "science",
    description: "Clean campus initiatives and environmental projects with real impact.",
  },
  {
    id: "startup-network",
    name: "Startup Networking Meetup",
    category: "career",
    description: "Meet founders, learn product thinking, and connect through guided networking.",
  },
  {
    id: "career-talk",
    name: "Career Talk Series",
    category: "career",
    description: "Mock interviews, career insights, and mentor-led sessions for students.",
  },
];

export default function CommunitiesPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => window.clearTimeout(t);
  }, [query]);

  const normalizedQuery = debouncedQuery.trim().toLowerCase();

  const filteredCommunities = useMemo(() => {
    if (!normalizedQuery) return COMMUNITIES;

    return COMMUNITIES.filter((community) => {
      const q = normalizedQuery;
      return (
        community.name.toLowerCase().includes(q) ||
        community.category.toLowerCase().includes(q) ||
        community.description.toLowerCase().includes(q)
      );
    });
  }, [normalizedQuery]);

  function highlightText(text: string) {
    if (!normalizedQuery) return text;

    const lower = text.toLowerCase();
    const idx = lower.indexOf(normalizedQuery);
    if (idx === -1) return text;

    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + normalizedQuery.length);
    const after = text.slice(idx + normalizedQuery.length);

    return (
      <>
        {before}
        <span className="rounded bg-indigo-500/15 px-1 text-indigo-700">
          {match}
        </span>
        {after}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Dark hero header */}
      <section className="bg-black py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-5xl font-bold tracking-wide text-white md:text-6xl">
            Find Your People. Build Your Community.
          </h1>
        </div>
      </section>

      {/* Search bar */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <circle cx="11" cy="11" r="6" />
              <path d="m16 16 4 4" />
            </svg>
          </span>
          {query.trim().length > 0 && (
            <button
              type="button"
              className="absolute inset-y-0 right-4 my-auto flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <span aria-hidden>×</span>
            </button>
          )}
          <input
            type="text"
            placeholder="Search communities (e.g. Salsa, Music, Tech...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-gray-300 px-6 py-4 pl-12 pr-12 text-lg text-gray-900 shadow-sm outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-black"
          />
        </div>
      </section>

      {/* Communities discovery grid */}
      <section className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Fragmented gradient transition (visual only) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 -top-6 h-24 opacity-50"
        >
          <div
            className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-indigo-500/20 via-emerald-400/10 to-transparent blur-2xl"
            style={{
              clipPath:
                "polygon(0% 0%, 55% 0%, 40% 100%, 0% 78%)",
            }}
          />
          <div
            className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-teal-400/20 via-emerald-500/10 to-transparent blur-2xl"
            style={{
              clipPath:
                "polygon(45% 0%, 100% 0%, 100% 78%, 60% 100%)",
            }}
          />
          <div
            className="absolute left-1/3 top-1 h-16 w-1/3 bg-gradient-to-b from-white/10 to-transparent blur-2xl"
            style={{
              clipPath:
                "polygon(10% 0%, 100% 5%, 85% 100%, 0% 80%)",
            }}
          />
        </div>

        {filteredCommunities.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg font-semibold text-gray-900">
              No communities found.
            </p>
            <p className="mt-2 text-gray-500">
              Try a different keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {filteredCommunities.map((community, idx) => {
              const cover = CATEGORY_COVER[community.category];
              const slug = community.category;
              return (
                <Link
                  key={community.id}
                  href={`/communities/${slug}`}
                  className="group relative h-52 overflow-hidden rounded-2xl shadow-lg shadow-gray-900/5 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:opacity-0 before:transition-opacity before:duration-300 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none before:group-hover:opacity-100"
                  style={{ transitionDelay: `${Math.min(idx, 6) * 25}ms` }}
                >
                  <div
                    className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat transition-all duration-500 group-hover:scale-110 brightness-75 blur-[1px] group-hover:brightness-90 group-hover:blur-0"
                    style={{ backgroundImage: `url(${cover})` }}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent transition-all duration-300 group-hover:from-black/90 group-hover:via-black/55"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-4 left-4 right-4 drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
                    <h2 className="line-clamp-1 text-xl font-bold tracking-wide text-white">
                      {highlightText(community.name)}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/80">
                      {community.description}
                    </p>
                    <div className="mt-4 inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-emerald-200/40 active:scale-95">
                      Join
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
