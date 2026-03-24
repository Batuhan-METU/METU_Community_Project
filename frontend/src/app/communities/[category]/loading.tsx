export default function CategoryCommunitiesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111827] via-[#0f172a] to-[#0b1220] text-white">
      <section className="border-b border-white/10 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-12 w-80 rounded-xl bg-white/10" />
          <div className="mt-4 h-5 w-full max-w-2xl rounded-lg bg-white/10" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-14">
        <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/10"
            >
              <div className="h-40 animate-pulse bg-white/10" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-white/10" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
