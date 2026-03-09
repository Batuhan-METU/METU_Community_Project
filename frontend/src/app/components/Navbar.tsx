import Link from "next/link";

export default function Navbar() {
  const isLoggedIn = false;
  const navItems = isLoggedIn
    ? [
        { label: "Events", href: "/events" },
        { label: "Clubs", href: "/clubs" },
        { label: "Profile", href: "/profile" },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Clubs", href: "/clubs" },
        { label: "Login", href: "/login" },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/90 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-[1.05rem] font-semibold tracking-tight text-gray-900"
        >
          METUCom
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="flex items-center gap-5 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
