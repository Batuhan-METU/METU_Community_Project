"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosClient from "@/api/axios";
import CommunityCard from "../components/CommunityCard";

type ApiCommunity = {
  id: string | number;
  name: string;
  description?: string | null;
  logo_url?: string | null;
};

const LOGOS = [
  "/images/community-logos/edt.png",
  "/images/community-logos/biz.png",
  "/images/community-logos/radio.png",
  "/images/community-logos/vt.png",
];

export default function CommunitiesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [communities, setCommunities] = useState<ApiCommunity[]>([]);

  useEffect(() => {
    let alive = true;

    axiosClient
      .get("/communities")
      .then((r) => {
        if (!alive) return;
        setCommunities(r.data || []);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        const err = e as {
          response?: { status?: number; data?: { error?: string } };
          message?: string;
        };
        const status = err?.response?.status;
        if (status === 401) alert("Lütfen giriş yapın.");
        setError(
          err?.response?.data?.error ||
            err?.message ||
            "Topluluklar alınamadı."
        );
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero with video background */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        >
          <source src="/videos/metu-community.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
            Discover Communities at METU
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Explore student communities, connect with people, and find your people
            on campus.
          </p>
        </div>
      </section>

      {/* Community trust - logo carousel */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mx-auto mb-16 max-w-4xl text-center text-4xl font-bold text-gray-900 md:text-5xl">
            Driving Engagement Through Student Communities at METU
          </h2>

          <div className="relative w-full overflow-hidden">
            <div className="flex w-max items-center gap-16 animate-scroll-logos">
              {[...LOGOS, ...LOGOS].map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt=""
                  className="h-16 w-auto opacity-70 transition hover:opacity-100"
                />
              ))}
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="#communities"
              className="rounded-full bg-green-500 px-8 py-3 font-medium text-white transition hover:bg-green-600"
            >
              Join a Community
            </Link>
          </div>
        </div>
      </section>

      {/* Community cards */}
      <section id="communities" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-gray-900">
          Communities
        </h2>
        {loading ? (
          <p className="py-12 text-center text-sm text-neutral-500">
            Yükleniyor...
          </p>
        ) : error ? (
          <p className="py-12 text-center text-sm text-red-400">{error}</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {communities.map((community) => (
              <CommunityCard
                key={String(community.id)}
                id={community.id}
                name={community.name}
                description={community.description || ""}
                logoUrl={community.logo_url}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
