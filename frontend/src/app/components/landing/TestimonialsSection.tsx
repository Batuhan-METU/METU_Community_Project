const testimonials = [
  {
    name: "Ece, Computer Engineering",
    department: "AI & Robotics Club",
    quote:
      "METUCom makes it effortless to discover technical talks and workshops I care about. I check it every week.",
  },
  {
    name: "Mert, Industrial Design",
    department: "Design & Arts Society",
    quote:
      "Before METUCom I always heard about events too late. Now everything is organized in one place.",
  },
  {
    name: "Zeynep, Business Administration",
    department: "Entrepreneurship Club",
    quote:
      "It feels like a modern startup product built just for our campus. Clean, fast and actually useful.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
            What students are saying
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Built with real student workflows in mind – from hackathons to
            concerts and everything in between.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="flex h-full flex-col rounded-xl bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {"★★★★★".split("").map((star, index) => (
                  <span key={index} aria-hidden="true">
                    ★
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-700">{testimonial.quote}</p>
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-900">
                  {testimonial.name}
                </p>
                <p className="text-xs text-gray-500">
                  {testimonial.department}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

