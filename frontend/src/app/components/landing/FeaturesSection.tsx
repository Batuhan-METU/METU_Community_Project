const features = [
  {
    title: "Explore Events",
    description:
      "Browse talks, workshops, and social events tailored to your interests across campus.",
    icon: "📅",
  },
  {
    title: "Join Communities",
    description:
      "Find student communities that match your passions and stay in sync with what they’re doing.",
    icon: "👥",
  },
  {
    title: "Meet Students",
    description:
      "Connect with people from different departments and build your own community at METU.",
    icon: "✨",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
            Everything you need to explore campus life
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            METUCom gives you a single place to discover events, follow communities,
            and never miss what&apos;s happening on campus.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-lg">
                <span className="text-xl" aria-hidden="true">
                  {feature.icon}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

