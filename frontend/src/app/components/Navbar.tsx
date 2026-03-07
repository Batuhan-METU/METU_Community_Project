import Link from "next/link";

const navItems = [
  { label: "Events", href: "/events" },
  { label: "Clubs", href: "/clubs" },
];

export default function Navbar() {
  return (
    <header className="border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-zinc-900"
          >
            METU Clubs
          </Link>

          <nav className="hidden items-center gap-8 md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
            Login
          </button>
        </div>

        <nav className="flex items-center justify-center gap-8 pb-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
