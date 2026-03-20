import CreateEventForm from "./CreateEventForm";

export default function CreateEventPageView() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-100">
      {/* Decorative blurred orbs — aligned with Explore Events */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-8 h-72 w-72 rounded-full bg-blue-500/35 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-12 right-6 h-80 w-80 rounded-full bg-purple-500/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-1/4 hidden h-64 w-64 rounded-full bg-cyan-400/25 blur-3xl md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background:radial-gradient(110%_85%_at_5%_10%,transparent_62%,rgba(99,102,241,0.85)_62.5%,transparent_63%),radial-gradient(110%_85%_at_95%_85%,transparent_62%,rgba(59,130,246,0.85)_62.5%,transparent_63%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(79,70,229,0.18),transparent_42%),radial-gradient(circle_at_75%_75%,rgba(14,165,233,0.14),transparent_45%)]"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-xl backdrop-blur-lg md:p-10">
          <header className="mb-8 border-b border-gray-100 pb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Event</h1>
            <p className="mt-2 text-gray-600">
              Organize and share your community event
            </p>
          </header>

          <CreateEventForm />
        </div>
      </div>
    </div>
  );
}
