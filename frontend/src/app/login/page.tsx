"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

type LoginPayload = {
  error?: string;
  user?: {
    id: string;
    email?: string | null;
    user_metadata?: { full_name?: string };
  };
  session?: {
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
  };
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const registeredHint = searchParams.get("message");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      let payload: LoginPayload;
      try {
        payload = (await response.json()) as LoginPayload;
      } catch {
        setErrorMessage("Could not read the server response.");
        return;
      }

      if (!response.ok) {
        setErrorMessage(
          payload.error ||
            (response.status === 401
              ? "Invalid email or password."
              : "Sign-in failed.")
        );
        return;
      }

      const accessToken = payload?.session?.access_token;
      if (!accessToken) {
        setErrorMessage("Could not create a session. Please try again.");
        return;
      }

      const userHint =
        payload.user != null
          ? {
              id: payload.user.id,
              email: payload.user.email ?? undefined,
              full_name: payload.user.user_metadata?.full_name,
            }
          : null;

      await login(accessToken, userHint);
      router.push("/");
    } catch {
      setErrorMessage("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

          {registeredHint ? (
            <p
              className="mt-4 rounded-lg bg-white/15 px-3 py-2 text-sm text-white/95"
              role="status"
            >
              {registeredHint}
            </p>
          ) : null}

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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-white"
                required
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
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-white"
                required
              />
            </div>

            {errorMessage ? (
              <p className="text-sm font-medium text-red-200">{errorMessage}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-gray-900"
                    aria-hidden
                  />
                  <span>Loading...</span>
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-white/90">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-white underline-offset-2 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
