"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

type RegisterResponse = {
  message?: string;
  error?: string;
  user?: { id: string; email?: string | null };
  session?: {
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
  } | null;
};

type LoginResponse = {
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

function mapUserToAuthHint(
  user: NonNullable<LoginResponse["user"]>
): { id: string; email?: string; full_name?: string } {
  return {
    id: user.id,
    email: user.email ?? undefined,
    full_name:
      user.user_metadata?.full_name ??
      (user as { full_name?: string }).full_name,
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const registerRes = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          full_name: fullName.trim(),
        }),
      });

      let registerBody: RegisterResponse;
      try {
        registerBody = (await registerRes.json()) as RegisterResponse;
      } catch {
        setErrorMessage("Could not read the server response.");
        return;
      }

      if (!registerRes.ok) {
        setErrorMessage(
          registerBody.error ||
            "Registration failed. Please check your details."
        );
        return;
      }

      const tokenFromRegister =
        registerBody.session?.access_token ?? null;
      const registeredUser = registerBody.user;

      if (tokenFromRegister && registeredUser) {
        await login(
          tokenFromRegister,
          mapUserToAuthHint(registeredUser as NonNullable<LoginResponse["user"]>)
        );
        router.push("/");
        return;
      }

      const loginRes = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      let loginBody: LoginResponse;
      try {
        loginBody = (await loginRes.json()) as LoginResponse;
      } catch {
        router.push(
          "/login?registered=1&message=" +
            encodeURIComponent(
              "Registration received. You can sign in after verifying your email."
            )
        );
        return;
      }

      if (loginRes.ok && loginBody.session?.access_token && loginBody.user) {
        await login(
          loginBody.session.access_token,
          mapUserToAuthHint(loginBody.user)
        );
        router.push("/");
        return;
      }

      router.push(
        "/login?registered=1&message=" +
          encodeURIComponent(
            "Registration successful. Verify your email or sign in with your password."
          )
      );
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
            Create your METUCom account
          </h1>
          <p className="mt-2 text-sm text-white/90">
            Join clubs, discover events, and build your campus profile
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-medium text-white"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                value={fullName}
                onChange={(ev) => setFullName(ev.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-white"
                required
              />
            </div>

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
                onChange={(ev) => setEmail(ev.target.value)}
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
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-white"
                required
                minLength={6}
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-xs font-medium text-white"
              >
                Confirm password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(ev) => setConfirmPassword(ev.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-white"
                required
                minLength={6}
              />
            </div>

            {errorMessage ? (
              <p className="text-sm font-medium text-red-200" role="alert">
                {errorMessage}
              </p>
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
                "Sign up"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-white/90">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-white underline-offset-2 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
