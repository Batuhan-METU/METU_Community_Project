"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
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
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-[#0f0f0f]/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
            M
          </div>
          <span className="text-base font-semibold tracking-tight text-white">
            METUCom
          </span>
        </Link>

        <div className="hidden flex-1 justify-center sm:flex">
          <input
            type="text"
            placeholder="Search events, clubs..."
            className="w-full max-w-md rounded-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-200 outline-none placeholder:text-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="ml-auto flex items-center gap-5">
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "text-sm font-medium transition-colors " +
                  (pathname === item.href
                    ? "text-white"
                    : "text-neutral-400 hover:text-white")
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {isLoggedIn ? (
            <Link
              href="/profile"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-neutral-300 transition-colors hover:bg-neutral-700"
            >
              BK
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
