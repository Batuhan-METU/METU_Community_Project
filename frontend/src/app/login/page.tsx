"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    document.cookie = "auth-token=logged-in; path=/";
    router.push("/events");
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-95"
        style={{ backgroundImage: "url(/images/metu-campus-3.jpeg)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="rounded-2xl border border-white/30 bg-white/20 p-10 shadow-xl backdrop-blur-md">
          <h1 className="text-xl font-bold tracking-tight text-white">
            Login to METUCom
          </h1>
          <p className="mt-2 text-sm text-white/90">
            Access events and your personal profile
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-white"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@metu.edu.tr"
                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-white"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium text-white"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-white"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
            >
              Login
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-white/90">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-white underline-offset-2 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
