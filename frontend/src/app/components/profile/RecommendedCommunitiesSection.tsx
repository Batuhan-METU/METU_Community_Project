"use client";

export type RecommendedCommunity = {
  id: string;
  name: string;
  description: string;
};

const recommendedCommunities: RecommendedCommunity[] = [
  {
    id: "r1",
    name: "METU Robotics",
    description:
      "Build robots, compete in tournaments, and learn embedded systems with peers.",
  },
  {
    id: "r2",
    name: "Design Collective",
    description:
      "Weekly design critiques, Figma workshops, and campus branding projects.",
  },
  {
    id: "r3",
    name: "Green Campus Initiative",
    description:
      "Sustainability projects, tree planting, and environmental awareness events.",
  },
  {
    id: "r4",
    name: "HackMETU",
    description:
      "Hackathons, coding nights, and collaboration with local tech companies.",
  },
  {
    id: "r5",
    name: "Film & Media Society",
    description:
      "Short film screenings, editing labs, and documentary nights on campus.",
  },
];

export default function RecommendedCommunitiesSection() {
  return (
    <section className="mt-14 rounded-2xl border border-white/15 bg-white/8 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl animate-fade-in-up">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-xl font-bold tracking-tight text-gray-100">
          Recommended Communities
        </h2>
        <p className="text-sm text-gray-400">
          Communities you might like based on your activity
        </p>
      </div>

      <div className="relative mt-6">
        {/* fade edges hint on larger screens */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#1c2230] to-transparent sm:hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#1c2230] to-transparent sm:hidden"
        />

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-3 pt-1 sm:mx-0 sm:px-0 scrollbar-hide">
          {recommendedCommunities.map((community) => (
            <article
              key={community.id}
              className="group flex w-[min(100%,280px)] shrink-0 snap-start flex-col rounded-2xl border border-white/10 bg-white/10 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-indigo-300/45 hover:shadow-[0_18px_35px_rgba(99,102,241,0.28)] sm:w-72"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-inner ring-1 ring-white/20">
                  {community.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold leading-snug text-gray-100">
                    {community.name}
                  </h3>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-300">
                {community.description}
              </p>
              <button
                type="button"
                className="mt-5 w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.35)] transition duration-300 hover:scale-[1.02] hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Join
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
