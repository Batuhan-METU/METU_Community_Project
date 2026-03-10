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
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-neutral-900 p-6 ring-1 ring-neutral-800 sm:p-8">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Login to METUCom
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Access events and your personal profile
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-medium text-neutral-400"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@metu.edu.tr"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-sm text-neutral-200 outline-none placeholder:text-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-medium text-neutral-400"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-sm text-neutral-200 outline-none placeholder:text-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
