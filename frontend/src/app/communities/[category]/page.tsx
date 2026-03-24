import Link from "next/link";
import { notFound } from "next/navigation";
import { mockClubs } from "../../lib/mockClubs";

const CATEGORIES = ["art", "science", "technology", "sport", "career"] as const;

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

function formatCategoryLabel(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

type Community = {
  id: number;
  name: string;
  description: string;
  category: string;
  coverImage: string;
};

const COVER_BY_CATEGORY: Record<string, string> = {
  engineering: "/images/categories/technology.jpg",
  business: "/images/categories/career.jpg",
  art: "/images/categories/art.jpg",
  music: "/images/event-images/salsa.jpg",
  science: "/images/categories/science.jpg",
};

function mapClubCategoryToCommunityCategory(category: string) {
  const normalized = category.toLowerCase();
  if (normalized === "engineering") return "technology";
  if (normalized === "business") return "career";
  if (normalized === "music") return "sport";
  return normalized;
}

const DUMMY_COMMUNITIES: Community[] = mockClubs.map((club) => {
  const category = mapClubCategoryToCommunityCategory(club.category);
  return {
    id: club.id,
    name: club.name,
    description: club.description,
    category,
    coverImage: COVER_BY_CATEGORY[club.category.toLowerCase()] ?? "/images/events.jpg",
  };
});

// Placeholder for future API call: fetch communities by category slug.
async function getCommunitiesByCategory(category: string): Promise<Community[]> {
  return DUMMY_COMMUNITIES.filter(
    (community) => community.category.toLowerCase() === category.toLowerCase()
  );
}

export default async function CategoryCommunitiesPage({ params }: CategoryPageProps) {
  const { category } = await params;
  if (!category) {
    notFound();
  }
  const normalized = category.toLowerCase();

  if (!CATEGORIES.includes(normalized as (typeof CATEGORIES)[number])) {
    notFound();
  }

  const communities = await getCommunitiesByCategory(normalized);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111827] via-[#0f172a] to-[#0b1220] text-white animate-fade-in-up">
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-indigo-700/35 via-violet-700/20 to-cyan-600/20 py-20 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_35%),radial-gradient(circle_at_80%_15%,rgba(14,165,233,0.25),transparent_35%)]"
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            {formatCategoryLabel(normalized)} Communities
          </h1>
          <p className="mt-4 max-w-2xl text-base text-gray-200 md:text-lg">
            Discover active groups, meet people with similar interests, and join
            new experiences in the {formatCategoryLabel(normalized)} category.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-14">
        <Link
          href="/communities"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
        >
          <span aria-hidden>&larr;</span> Back to categories
        </Link>

        {communities.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-16 text-center backdrop-blur animate-fade-in-up">
            <h2 className="text-2xl font-semibold text-white">No communities yet</h2>
            <p className="mt-3 text-gray-300">
              We couldn&apos;t find any communities in this category right now.
              Check back soon.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 md:gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((community) => (
              <Link
                key={community.id}
                href={`/clubs/${community.id}`}
                className="group block cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_24px_48px_rgba(99,102,241,0.36)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
              >
                <div className="relative h-40 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={community.coverImage}
                    alt={community.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent transition duration-500 group-hover:from-black/75" />
                </div>

                <div className="space-y-4 p-5">
                  <h3 className="text-lg font-semibold leading-snug text-white">
                    {community.name}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-gray-200">
                    {community.description}
                  </p>
                  <span className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-indigo-400 group-hover:shadow-[0_10px_24px_rgba(99,102,241,0.4)]">
                    View Community
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
