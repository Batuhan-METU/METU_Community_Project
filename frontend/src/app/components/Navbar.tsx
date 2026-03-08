import Link from "next/link";

const navItems = [
  { label: "Events", href: "/events" },
  { label: "Clubs", href: "/clubs" },
  { label: "Profile", href: "/profile" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/60 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-semibold tracking-tight text-white transition-opacity hover:opacity-80"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 text-xs font-bold text-white">
              M
            </span>
            METU Clubs
          </Link>

          <nav className="hidden items-center gap-1 md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-400 hover:shadow-indigo-500/30">
            Login
          </button>
        </div>

        <nav className="flex items-center justify-center gap-1 pb-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
