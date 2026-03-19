export default function LogoCloud() {
  return (
    <section className="border-b border-gray-100 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-gray-500">
          Trusted by METU student organizations and communities
        </p>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-3 opacity-70 grayscale">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Student Communities
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Hackathons
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Tech Communities
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            University Orgs
          </span>
        </div>
      </div>
    </section>
  );
}

