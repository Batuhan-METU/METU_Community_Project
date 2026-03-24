"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function getInitials(name?: string | null, email?: string | null) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email?.trim()) return email[0].toUpperCase();
  return "?";
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    router.push("/");
  };

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    function handlePointerDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const initials = getInitials(user?.full_name, user?.email);

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
            { label: "Communities", href: "/clubs" },
            { label: "Events", href: "/events" },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors duration-200 ${
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

        {/* Right: auth actions */}
        <div className="flex min-h-[2.25rem] items-center gap-3">
          {isLoading ? (
            <div
              className="h-9 w-28 animate-pulse rounded-full bg-gray-200"
              aria-hidden
              aria-busy="true"
            />
          ) : isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-transparent transition duration-200 hover:ring-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-label="Account menu"
              >
                {avatarFailed ? (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white shadow-inner">
                    {initials}
                  </span>
                ) : (
                  <Image
                    src="/images/avatar-placeholder.svg"
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                    onError={() => setAvatarFailed(true)}
                  />
                )}
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 min-w-[220px] origin-top-right rounded-xl border border-gray-200/90 bg-white py-1.5 shadow-xl shadow-gray-900/[0.08] ring-1 ring-black/[0.04] transition-opacity duration-150"
                >
                  <div className="border-b border-gray-100 px-3 pb-2.5 pt-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user?.full_name ?? "Account"}
                    </p>
                    {user?.email && (
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    )}
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={closeMenu}
                      className="mx-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-50"
                    >
                      <svg
                        className="h-4 w-4 shrink-0 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                      My Profile
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="mx-1 flex w-[calc(100%-0.5rem)] items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors duration-150 hover:bg-red-50"
                    >
                      <svg
                        className="h-4 w-4 shrink-0 opacity-90"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 md:inline-flex"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex rounded-full bg-black px-3 py-2 text-sm font-medium text-white transition duration-200 hover:bg-gray-800 md:px-4"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
