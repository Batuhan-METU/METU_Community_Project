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
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Login to METUCom
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Access events and your personal profile
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@metu.edu.tr"
              className="w-full rounded-md border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-md border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-700"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
