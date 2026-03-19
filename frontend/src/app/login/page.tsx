"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axiosClient from "@/api/axios";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axiosClient.post("/users/login", {
        email,
        password,
      });

      const accessToken = response.data?.session?.access_token;
      const user = response.data?.user;

      if (!accessToken) {
        throw new Error("Sunucudan token alınamadı.");
      }

      login({ token: accessToken, user });

      router.push("/events");
    } catch (e: unknown) {
      const err = e as {
        response?: { data?: { error?: string }; status?: number };
        message?: string;
      };
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Giriş yapılamadı. Lütfen tekrar deneyin.";
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
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
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-white"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
              disabled={loading}
            >
              {loading ? "Giriş yapılıyor..." : "Login"}
            </button>
          </form>

          {error && (
            <p className="mt-3 text-center text-sm text-red-200">{error}</p>
          )}

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
