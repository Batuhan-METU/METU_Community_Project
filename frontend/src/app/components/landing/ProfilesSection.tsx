const profiles = [
  {
    name: "Ece Yılmaz",
    department: "Computer Engineering",
    bio: "AI & Robotics Community lead. Organizing weekly meetups on AI and real-world projects.",
  },
  {
    name: "Mert Demir",
    department: "Industrial Design",
    bio: "Design & Arts Society. Connecting designers and creatives across campus.",
  },
  {
    name: "Zeynep Kaya",
    department: "Business Administration",
    bio: "Entrepreneurship Community. Helping students turn ideas into startups.",
  },
  {
    name: "Ali Can",
    department: "Music & Performing Arts",
    bio: "Music Community. Bands, open mics and live performances at METU.",
  },
];

export default function ProfilesSection() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
            Profiles
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Meet students active in the community
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {profiles.map((profile) => (
            <article
              key={profile.name}
              className="rounded-xl bg-white p-6 text-center shadow-sm transition hover:shadow-md"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-base font-semibold text-gray-700">
                {profile.name
                  .split(" ")
                  .map((part) => part.charAt(0))
                  .join("")}
              </div>
              <h3 className="font-semibold text-gray-900">{profile.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{profile.department}</p>
              <p className="mt-3 text-sm text-gray-600">{profile.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
