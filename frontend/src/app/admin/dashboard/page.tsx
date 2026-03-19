"use client";

import axiosClient from "@/api/axios";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type MostPopularEvent = {
  event_id: string | number;
  title: string | null;
  participant_count: number;
};

type ActiveCommunity = {
  community_id: string | number;
  name: string | null;
  events_count: number;
};

type AdminStats = {
  totalUsers: number;
  totalCommunities: number;
  totalEvents: number;
  mostPopularEvents: MostPopularEvent[];
  activeCommunities: ActiveCommunity[];
};

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-white/70 p-5 shadow-sm ring-1 ring-gray-200">
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">
        {value}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await axiosClient.get<AdminStats>("/admin/stats");
        if (!alive) return;
        setStats(res.data);
      } catch (e: unknown) {
        if (!alive) return;
        setStats(null);
        const err = e as {
          response?: { data?: { error?: string }; status?: number };
          message?: string;
        };
        setError(
          err?.response?.data?.error ||
            err?.message ||
            "Admin istatistikleri alınamadı."
        );
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const hasAnyData = useMemo(() => {
    if (!stats) return false;
    return (
      stats.totalUsers > 0 ||
      stats.totalCommunities > 0 ||
      stats.totalEvents > 0 ||
      stats.mostPopularEvents.length > 0 ||
      stats.activeCommunities.length > 0
    );
  }, [stats]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-sm text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  if (!stats || !hasAnyData) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-xl bg-white/70 p-6 text-sm text-gray-700 shadow-sm ring-1 ring-gray-200">
          Henüz veri yok
          {error ? (
            <div className="mt-2 text-xs text-red-600">{error}</div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Sistemin genel istatistikleri
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Communities" value={stats.totalCommunities} />
        <StatCard label="Total Events" value={stats.totalEvents} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white/70 p-6 shadow-sm ring-1 ring-gray-200">
          <div className="text-sm font-medium text-gray-900">
            Most Popular Events
          </div>

          {stats.mostPopularEvents.length === 0 ? (
            <div className="mt-4 text-sm text-gray-600">Henüz veri yok</div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-lg ring-1 ring-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Etkinlik</th>
                    <th className="px-4 py-3">Katılımcı</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.mostPopularEvents.map((ev) => (
                    <tr key={String(ev.event_id)} className="border-t border-gray-100">
                      <td className="px-4 py-3">
                        <Link
                          href={`/events/${ev.event_id}`}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          {ev.title || "Başlıksız"}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {ev.participant_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white/70 p-6 shadow-sm ring-1 ring-gray-200">
          <div className="text-sm font-medium text-gray-900">
            Active Communities
          </div>

          {stats.activeCommunities.length === 0 ? (
            <div className="mt-4 text-sm text-gray-600">Henüz veri yok</div>
          ) : (
            <div className="mt-4 space-y-3">
              {stats.activeCommunities.map((c) => (
                <div
                  key={String(c.community_id)}
                  className="flex items-center justify-between rounded-lg bg-white/60 px-4 py-3 ring-1 ring-gray-100"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {c.name || "Başlıksız"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {c.events_count} etkinlik
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

