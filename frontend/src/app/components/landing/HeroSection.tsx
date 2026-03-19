import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[70vh] flex-col overflow-hidden py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-90 contrast-[1.05]"
        style={{ backgroundImage: "url(/images/metu-campus.jpeg)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-gray-900/40 to-gray-900/60"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-200 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live on campus · Spring 2026
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
            Discover Communities
            <br />
            at METU.
          </h1>
          <p className="max-w-xl text-lg text-gray-300 md:text-xl">
            Explore student communities, join exciting events, and connect with people
            who share your interests across the METU campus.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/events"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-gray-900 shadow-sm transition duration-300 hover:bg-gray-100 hover:shadow-md"
            >
              Explore Events
            </Link>
            <Link
              href="/create-event"
              className="rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition duration-300 hover:bg-white/10"
            >
              Create Event
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

