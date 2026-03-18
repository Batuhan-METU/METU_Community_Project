import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden py-36">
      {/* Background image: vibrant, visible */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-105 contrast-[1.05]"
        style={{ backgroundImage: "url(/images/metu-campus-2.jpeg)" }}
      />
      {/* Lighter gradient overlay for text readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center text-white">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Join the METU student community today.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
          Create your profile, follow communities, and never miss another event on
          campus. METUCom keeps everything organized in one place.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-gray-900 shadow-sm transition duration-300 hover:bg-gray-100 hover:shadow-md"
          >
            Sign Up
          </Link>
          <Link
            href="/events"
            className="rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition duration-300 hover:bg-white/10"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </section>
  );
}

