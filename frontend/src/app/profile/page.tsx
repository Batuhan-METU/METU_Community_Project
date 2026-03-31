import Image from "next/image";
import Link from "next/link";
import CommunityRolesSection from "../components/profile/CommunityRolesSection";
import MyEventsSection from "../components/MyEventsSection";
import ProfileEventsSection from "../components/profile/ProfileEventsSection";
import RecommendedCommunitiesSection from "../components/profile/RecommendedCommunitiesSection";
import { mockClubs } from "../lib/mockClubs";

const followedClubIds = [1, 3, 5];

/** Dummy profile — replace with real user data from auth/API later */
const DUMMY_PROFILE = {
  name: "John Doe",
  email: "john@example.com",
} as const;

export default function ProfilePage() {
  const interestedClubs = mockClubs.filter((club) =>
    followedClubIds.includes(club.id)
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#2b3140] via-[#1c2230] to-[#121723]">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_20%_15%,rgba(99,102,241,0.2),transparent_35%),radial-gradient(circle_at_80%_5%,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(139,92,246,0.14),transparent_35%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Profile header */}
        <section className="relative animate-fade-in-up overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="h-40 bg-gradient-to-r from-indigo-600/45 via-violet-600/35 to-cyan-500/35 sm:h-48" />
          <div className="absolute inset-0 opacity-35 [background:radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.3),transparent_30%),radial-gradient(circle_at_20%_70%,rgba(255,255,255,0.12),transparent_30%)]" />

          <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-12 flex flex-col gap-6 sm:-mt-14 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex min-w-0 flex-1 items-center gap-5 sm:gap-6">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-[#1b2230] bg-[#1b2230] ring-1 ring-white/15 sm:h-32 sm:w-32">
                  <Image
                    src="/images/avatar-placeholder.svg"
                    alt=""
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
                <div className="min-w-0 pt-2">
                  <h1 className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                    {DUMMY_PROFILE.name}
                  </h1>
                  <a
                    href={`mailto:${DUMMY_PROFILE.email}`}
                    className="mt-1 block text-sm text-gray-300 transition hover:text-indigo-300 hover:underline sm:text-base"
                  >
                    {DUMMY_PROFILE.email}
                  </a>
                </div>
              </div>
              <div className="shrink-0">
                <button
                  type="button"
                  className="w-full rounded-xl border border-white/20 bg-white/15 px-5 py-2.5 text-sm font-semibold text-gray-100 transition duration-300 hover:scale-[1.02] hover:bg-white/20 hover:shadow-[0_8px_24px_rgba(99,102,241,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b2230] sm:w-auto"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </section>

        <MyEventsSection />

        <ProfileEventsSection />

        <CommunityRolesSection />

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl animate-fade-in-up">
          <h2 className="text-xl font-bold tracking-tight text-gray-100">
            Interested Clubs
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Communities you are currently following
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {interestedClubs.map((club) => (
              <article
                key={club.id}
                className="group rounded-2xl border border-white/10 bg-white/10 p-5 transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-300/45 hover:shadow-[0_16px_36px_rgba(99,102,241,0.22)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                    {club.name.charAt(0)}
                  </div>
                  <h3 className="line-clamp-1 text-base font-semibold text-gray-100">
                    {club.name}
                  </h3>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-gray-300">
                  {club.description}
                </p>
                <p className="mt-3 text-xs text-gray-400">
                  {club.numberOfEvents} events
                </p>
                <Link
                  href={`/clubs/${club.id}`}
                  className="mt-4 w-full rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-gray-100 transition duration-300 hover:bg-white/15"
                >
                  View Club
                </Link>
              </article>
            ))}
          </div>
        </section>

        <RecommendedCommunitiesSection />
      </div>
    </div>
  );
}
