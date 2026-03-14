"use client";

import Link from "next/link";
import { mockClubs } from "../lib/mockClubs";

const LOGOS = [
  "/images/community-logos/edt.png",
  "/images/community-logos/biz.png",
  "/images/community-logos/radio.png",
  "/images/community-logos/vt.png",
];

export default function ClubsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero with video background */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        >
          <source src="/videos/metu-community.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
            Discover Communities at METU
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Explore student clubs, connect with communities, and find your people
            on campus.
          </p>
        </div>
      </section>

      {/* Community trust - logo carousel */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mx-auto mb-16 max-w-4xl text-center text-4xl font-bold text-gray-900 md:text-5xl">
            Driving Engagement Through Student Communities at METU
          </h2>

          <div className="relative w-full overflow-hidden">
            <div className="flex w-max items-center gap-16 animate-scroll-logos">
              {[...LOGOS, ...LOGOS].map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt=""
                  className="h-16 w-auto opacity-70 transition hover:opacity-100"
                />
              ))}
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="#communities"
              className="rounded-full bg-green-500 px-8 py-3 font-medium text-white transition hover:bg-green-600"
            >
              Join a Community
            </Link>
          </div>
        </div>
      </section>

      {/* Community cards */}
      <section id="communities" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-gray-900">
          Communities
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {mockClubs.map((club) => (
            <article
              key={club.id}
              className="overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <Link href={`/clubs/${club.id}`} className="block">
                <div className="relative h-40 overflow-hidden rounded-lg bg-gradient-to-br from-gray-200 to-gray-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/80 via-purple-400/80 to-pink-400/80" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {club.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {club.description}
                </p>
                <p className="mt-3 text-xs text-gray-500">
                  {club.numberOfEvents * 12} members · {club.numberOfEvents}{" "}
                  events
                </p>
              </Link>
              <Link
                href={`/clubs/${club.id}`}
                className="mt-4 inline-block rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Join
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
