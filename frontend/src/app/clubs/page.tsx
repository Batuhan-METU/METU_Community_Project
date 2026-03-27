"use client";

import Link from "next/link";
import { useState } from "react";
import CategorySlider from "../components/CategorySlider";

const LOGOS = [
  "/images/community-logos/vt.png",
  "/images/community-logos/aft.png",
  "/images/community-logos/ieee.png",
  "/images/community-logos/radio.png",
  "/images/community-logos/cc.png",
  "/images/community-logos/gst.png",
  "/images/community-logos/edt.png",
  "/images/community-logos/arc.png",
  "/images/community-logos/ilkyar.png",
  "/images/community-logos/biz.png",
];

export default function ClubsPage() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [interests, setInterests] = useState("");

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: AI logic will be implemented later
    setAiModalOpen(false);
    setInterests("");
  };

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

      {/* Overlap categories on top of the hero video */}
      <div className="relative z-20 -mt-20 sm:-mt-24 lg:-mt-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-visible rounded-2xl border border-white/15 bg-white/10 shadow-xl backdrop-blur-md">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-black/25 via-black/10 to-transparent p-4 sm:p-6 md:p-8">
            <CategorySlider />
          </div>
        </div>
      </div>

      {/* Community trust - logo carousel */}
      <section className="relative py-24">
        {/* Background overlays */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-950 via-green-900 to-emerald-800"
        />
        {/* Top divider for smoother blending */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-emerald-200/30 via-teal-200/25 to-emerald-200/30"
        />

        {/* Fragmented gradient blobs (layered depth) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-[-8%] z-0 h-96 w-96 rounded-[40%] bg-gradient-to-br from-emerald-500/25 via-teal-400/10 to-transparent blur-3xl opacity-20 rotate-[10deg]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-16 left-[40%] z-0 h-80 w-80 rounded-[60%] bg-gradient-to-tr from-teal-400/20 via-emerald-500/10 to-transparent blur-3xl opacity-15 -rotate-[12deg]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 right-[-10%] z-0 h-[30rem] w-[30rem] rounded-[55%] bg-gradient-to-tl from-emerald-400/20 via-teal-300/10 to-transparent blur-3xl opacity-20 rotate-[8deg]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-10 left-[18%] z-0 h-72 w-72 rounded-[45%] bg-gradient-to-br from-emerald-600/15 via-teal-500/10 to-transparent blur-3xl opacity-20 rotate-[-18deg]"
        />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-emerald-950/55 via-emerald-900/25 to-transparent shadow-2xl">
            <div className="relative px-6 py-16 sm:px-10 sm:py-20">
              {/* Extra inner layers (kept behind content) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 left-[-12%] z-0 h-72 w-72 rounded-[40%] bg-gradient-to-br from-emerald-500/25 via-teal-400/10 to-transparent blur-3xl opacity-20 rotate-[15deg]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-10 right-[-10%] z-0 h-80 w-80 rounded-[60%] bg-gradient-to-tr from-teal-400/20 via-emerald-500/10 to-transparent blur-3xl opacity-15 -rotate-[10deg]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[-8%] left-[28%] z-0 h-96 w-96 rounded-[55%] bg-gradient-to-tl from-emerald-400/18 via-teal-300/8 to-transparent blur-3xl opacity-20 rotate-[-12deg]"
              />

              <div className="relative z-10">
                <h2 className="mx-auto mb-10 max-w-4xl text-center text-4xl font-bold text-white md:text-5xl">
                  Driving Engagement Through Student Communities at METU
                </h2>

                <p className="mx-auto mb-14 max-w-2xl text-center text-white/80">
                  Discover communities, connect with like-minded students, and join your next
                  experience on campus.
                </p>

                <div className="relative w-full overflow-hidden py-6 sm:py-10">
                  <div
                    className="inline-flex items-center gap-12"
                    style={{ animation: "logoScroll 25s linear infinite" }}
                  >
                    {[...LOGOS, ...LOGOS].map((src, i) => (
                      <div
                        key={`${src}-${i}`}
                        className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/90 p-3 shadow-sm opacity-80 transition duration-300 hover:scale-110 hover:opacity-100"
                      >
                        <img
                          src={src}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 flex justify-center">
                  <Link
                    href="/communities"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-medium text-emerald-900 shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:bg-emerald-50 hover:shadow-xl"
                  >
                    Join a Community <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI recommendation section */}
      <section className="border-t border-gray-100 bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative grid items-center gap-10 md:grid-cols-2">
            {/* Left content */}
            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                Can&apos;t find the club you&apos;re looking for?
              </h2>
              <p className="mt-4 max-w-md text-gray-600">
                Our AI can help you discover the perfect community based on
                your interests.
              </p>

              <button
                type="button"
                onClick={() => setAiModalOpen(true)}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-green-800 shadow-lg shadow-emerald-200/60 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-300/70"
              >
                Find Clubs with AI <span aria-hidden>→</span>
              </button>
            </div>

            {/* Right creative image (broken + layered) */}
            <div className="relative h-[22rem] w-full md:h-[26rem]">
              {/* Subtle background highlight */}
              <div
                aria-hidden="true"
                className="absolute inset-0 -top-8 rounded-[2rem] bg-gradient-to-br from-emerald-500/20 via-teal-400/10 to-transparent blur-2xl opacity-80"
              />

              {/* Noise/pattern overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-[2rem] opacity-10 mix-blend-overlay"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.35) 1px, transparent 0)",
                  backgroundSize: "6px 6px",
                }}
              />

              {/* Back layer (slightly offset) */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ai-background.jpg"
                  alt=""
                  className="absolute left-1/2 top-1/2 h-full w-[110%] -translate-x-1/2 -translate-y-1/2 rotate-[-6deg] rounded-[2.25rem] opacity-30 blur-2xl shadow-2xl"
                  style={{
                    clipPath:
                      "polygon(8% 0%, 100% 0%, 92% 74%, 100% 100%, 18% 92%, 0% 60%)",
                  }}
                />
              </div>

              {/* Foreground layer */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ai-background.jpg"
                  alt=""
                  className="absolute left-1/2 top-1/2 h-full w-[100%] -translate-x-1/2 -translate-y-1/2 rotate-[-6deg] rounded-[2.25rem] opacity-100 shadow-2xl"
                  style={{
                    clipPath:
                      "polygon(10% 0%, 100% 0%, 90% 72%, 100% 100%, 22% 94%, 0% 62%)",
                  }}
                />
              </div>

              {/* Edge fade to blend */}
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-l from-white/0 via-white/0 to-white/20 opacity-30"
              />

              {/* Soft gradient fade overlay for readability */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-emerald-950/0 via-emerald-950/0 to-emerald-950/5"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI modal (placeholder for future AI integration) */}
      {aiModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setAiModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-modal-title"
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 id="ai-modal-title" className="text-lg font-semibold text-gray-900">
                What are your interests?
              </h3>
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAiSubmit} className="mt-4 space-y-4">
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Technology, music, robotics..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-green-500 py-3 font-medium text-white transition hover:bg-green-600"
              >
                Get Recommendations
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
