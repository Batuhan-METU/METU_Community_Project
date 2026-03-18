"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const router = useRouter();

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    document.cookie = "auth-token=logged-in; path=/";
    onClose();
    router.push("/events");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-neutral-900 p-6 ring-1 ring-neutral-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Login to METUCom
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-sm text-neutral-400">
          Access events, follow communities and manage your profile.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label htmlFor="modal-email" className="mb-1 block text-xs font-medium text-neutral-400">
              Email
            </label>
            <input
              id="modal-email"
              type="email"
              placeholder="you@metu.edu.tr"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 outline-none placeholder:text-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="modal-password" className="mb-1 block text-xs font-medium text-neutral-400">
              Password
            </label>
            <input
              id="modal-password"
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 outline-none placeholder:text-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-neutral-500">
          No account?{" "}
          <Link href="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
