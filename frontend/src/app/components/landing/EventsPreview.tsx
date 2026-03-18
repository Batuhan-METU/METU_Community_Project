"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosClient from "@/api/axios";
import type { MockEvent } from "../../lib/mockEvents";

 export default function EventsPreview() {
   const [loading, setLoading] = useState(true);
   const [events, setEvents] = useState<MockEvent[]>([]);

   useEffect(() => {
     let alive = true;
     const run = async () => {
      type ApiCommunity = { id: string | number; name: string };
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

       setLoading(true);
        let lastError: string | null = null;
       try {
         const [eventsRes, communitiesRes] = await Promise.all([
           axiosClient.get("/events"),
           axiosClient.get("/communities"),
         ]);

        const communities = (communitiesRes.data || []) as ApiCommunity[];
         const map: Record<string, string> = {};
         for (const c of communities) map[String(c.id)] = c.name;

         const apiEvents = eventsRes.data || [];
        const mapped: MockEvent[] = (apiEvents.slice(0, 3) as ApiEvent[]).map((e) => ({
           id: e.id,
           title: e.title,
           community: map[String(e.community_id)] || "",
           date: e.starts_at,
          location: e.location || "",
          imageUrl: e.image_url,
          description: e.description || "",
           filledSeats: 0,
           totalSeats: typeof e.capacity === "number" ? e.capacity : 0,
           category: undefined,
         }));

         if (!alive) return;
         setEvents(mapped);
        } catch (e: unknown) {
          const err = e as {
            code?: string;
            response?: { status?: number; data?: { error?: string } };
            config?: { url?: string };
            message?: string;
          };
          console.error("EventsPreview yükleme hatası:", {
            code: err?.code,
            message: err?.message,
            url: err?.config?.url,
            responseStatus: err?.response?.status,
            responseError: err?.response?.data?.error,
            fullError: err,
          });
          lastError =
            err?.response?.data?.error ||
            err?.message ||
            (err?.response ? "Sunucu hatası oluştu." : "Backend sunucusuna bağlanılamıyor");
          alert(lastError);
        } finally {
          if (!alive) return;
          setLoading(false);
       }
     };

     run();
     return () => {
       alive = false;
     };
   }, []);

   const previewEvents = events;

  return (
    <section className="bg-gray-100 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Events header */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
              Upcoming Events
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              A snapshot of what&apos;s happening on campus this week.
            </p>
          </div>
          <Link
            href="/events"
            className="text-sm font-medium text-gray-700 underline-offset-4 transition hover:text-gray-900 hover:underline"
          >
            View all events
          </Link>
        </div>

        {/* Event cards */}
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {loading ? (
            <p className="col-span-full py-10 text-center text-sm text-gray-600">
              Yükleniyor...
            </p>
          ) : previewEvents.map((event) => (
            <article
              key={event.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={`${event.title} görseli`}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="h-40 bg-gradient-to-br from-indigo-500 via-sky-500 to-purple-500" />
              )}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {new Date(event.date).toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "short",
                    })}{" "}
                    · {event.location}
                  </p>
                  <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600">{event.community}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {event.filledSeats}/{event.totalSeats} seats filled
                  </p>
                  <Link
                    href={`/events/${event.id}`}
                    className="rounded-full bg-black px-4 py-2 text-xs font-medium text-white transition duration-200 hover:bg-gray-800"
                  >
                    Join
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

