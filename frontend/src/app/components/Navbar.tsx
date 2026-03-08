import Link from "next/link";

const navItems = [
  { label: "Events", href: "/events" },
  { label: "Clubs", href: "/clubs" },
  { label: "Profile", href: "/profile" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:gap-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-3"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700 transition-colors group-hover:bg-gray-100">
            M
          </span>
          <span className="text-base font-bold tracking-tight text-gray-900">
            METUCom
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800">
          Login
        </button>
      </div>

      <nav className="flex items-center justify-center gap-2 border-t border-gray-100 py-2.5 md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
