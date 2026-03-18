"use client";

import { useEffect, useState } from "react";
import EventsGrid from "../components/EventsGrid";
import FilterBar, { FilterCategory } from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
import axiosClient from "@/api/axios";
import type { MockEvent } from "../lib/mockEvents";

export default function EventsPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>("All");

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<MockEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [communityMap, setCommunityMap] = useState<Record<string, string>>({});

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    axiosClient
      .get("/communities")
      .then((r) => {
        if (!alive) return;
        const map: Record<string, string> = {};
        for (const c of r.data || []) {
          map[String(c.id)] = c.name;
        }
        setCommunityMap(map);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.response?.data?.error || "Topluluklar alınamadı.");
      })
      .finally(() => {
        if (!alive) return;
        // events fetch ayrı useEffect ile yapılacak
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        type ApiEvent = {
          id: string | number;
          community_id: string | number;
          title: string;
          starts_at: string;
          location?: string | null;
          image_url?: string | null;
          description?: string | null;
          capacity?: number | null;
        };

        const q = searchText.trim();
        const qLower = q.toLowerCase();

        let apiEvents: ApiEvent[] = [];

        if (selectedCategory !== "All") {
          const res = await axiosClient.get("/events/filter", {
            params: { category: selectedCategory },
          });
          apiEvents = (res.data || []) as ApiEvent[];

          if (qLower) {
            apiEvents = apiEvents.filter((e) => {
              const title = (e.title || "").toLowerCase();
              const desc = (e.description || "").toLowerCase();
              return title.includes(qLower) || desc.includes(qLower);
            });
          }
        } else if (qLower) {
          const res = await axiosClient.get("/events/search", {
            params: { q },
          });
          apiEvents = (res.data || []) as ApiEvent[];
        } else {
          const res = await axiosClient.get("/events");
          apiEvents = (res.data || []) as ApiEvent[];
        }

        const mapped: MockEvent[] = apiEvents.map((e) => ({
          id: e.id,
          title: e.title,
          community: communityMap[String(e.community_id)] || "",
          date: e.starts_at,
          location: e.location || "",
          imageUrl: e.image_url,
          description: e.description || "",
          filledSeats: 0,
          totalSeats: typeof e.capacity === "number" ? e.capacity : 0,
          category: selectedCategory === "All" ? undefined : selectedCategory,
        }));

        if (!alive) return;
        setEvents(mapped);
      } catch (e: unknown) {
        if (!alive) return;
        const err = e as {
          response?: { status?: number; data?: { error?: string } };
          message?: string;
        };
        const status = err?.response?.status;
        if (status === 401) {
          alert("Oturumun süresi dolmuş olabilir. Lütfen tekrar giriş yap.");
        }
        setError(
          err?.response?.data?.error || err?.message || "Etkinlikler alınamadı."
        );
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, [searchText, selectedCategory, communityMap]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-white">
        All Events
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        Find events by community name, category, or topic.
      </p>

      <div className="mt-6 space-y-4">
        <SearchBar value={searchText} onChange={setSearchText} />
        <FilterBar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="py-12 text-center text-sm text-neutral-500">
            Yükleniyor...
          </p>
        ) : error ? (
          <p className="py-12 text-center text-sm text-red-400">{error}</p>
        ) : (
          <EventsGrid events={events} />
        )}
      </div>
    </div>
  );
}
