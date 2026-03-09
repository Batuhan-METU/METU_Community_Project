import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Create your METUCom account
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Join clubs, discover events, and build your campus profile
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              className="w-full rounded-md border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
          </div>

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
              autoComplete="new-password"
              placeholder="Create a password"
              className="w-full rounded-md border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className="w-full rounded-md border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Register
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-700"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
