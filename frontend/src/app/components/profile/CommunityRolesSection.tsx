"use client";

type RoleItem = {
  id: string;
  community: string;
  role: "Admin" | "Organizer" | "Member";
};

const roles: RoleItem[] = [
  { id: "r1", community: "METU Computer Society", role: "Admin" },
  { id: "r2", community: "Startup Hub", role: "Organizer" },
  { id: "r3", community: "Photography Club", role: "Member" },
];

function roleBadgeClass(role: RoleItem["role"]) {
  if (role === "Admin") {
    return "border-emerald-400/50 bg-emerald-500/20 text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.28)]";
  }
  if (role === "Organizer") {
    return "border-sky-400/50 bg-sky-500/20 text-sky-200 shadow-[0_0_18px_rgba(56,189,248,0.28)]";
  }
  return "border-white/20 bg-white/10 text-gray-200";
}

export default function CommunityRolesSection() {
  return (
    <section className="mt-12 rounded-2xl border border-white/15 bg-white/8 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl animate-fade-in-up">
      <h2 className="text-xl font-bold tracking-tight text-gray-100">
        Community Roles
      </h2>
      <p className="mt-1 text-sm text-gray-400">
        Your current positions across communities
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-white/10 bg-white/10 p-4 transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(79,70,229,0.22)]"
          >
            <h3 className="text-sm font-semibold text-gray-100">
              {item.community}
            </h3>
            <span
              className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${roleBadgeClass(
                item.role
              )}`}
            >
              {item.role}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
