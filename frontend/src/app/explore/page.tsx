"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/api/axios";
import CommunityCard from "../components/CommunityCard";

type ApiCommunity = {
  id: string | number;
  name: string;
  description?: string | null;
  logo_url?: string | null;
};

export default function ExplorePage() {
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
          response?: { data?: { error?: string } };
          message?: string;
        };
        setError(err?.response?.data?.error || err?.message || "Topluluklar alınamadı.");
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
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Explore</h1>
      <p className="mt-2 text-sm text-gray-600">
        METU topluluklarını keşfedin ve detaylarını inceleyin.
      </p>

      <div className="mt-8">
        {loading ? (
          <p className="py-12 text-center text-sm text-gray-500">Yükleniyor...</p>
        ) : error ? (
          <p className="py-12 text-center text-sm text-red-500">{error}</p>
        ) : communities.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">Henüz topluluk yok.</p>
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
      </div>
    </div>
  );
}

