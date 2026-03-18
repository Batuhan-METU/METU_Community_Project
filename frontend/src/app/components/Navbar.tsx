"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Left: logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-full bg-black px-2.5 py-1 text-xs font-semibold tracking-tight text-white">
            METU
          </span>
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            METUCom
          </span>
        </Link>

        {/* Center: nav links (desktop) */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
          {[
            { label: "Communities", href: "/communities" },
            { label: "Events", href: "/events" },
            { label: "Profiles", href: "/profiles" },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  isActive
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: auth buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 md:inline-flex"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-gray-800"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
