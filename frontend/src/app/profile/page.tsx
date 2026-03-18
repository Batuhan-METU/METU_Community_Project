"use client";

import { useEffect, useState } from "react";
import CommunityCard from "../components/CommunityCard";
import EventCard from "../components/EventCard";
import axiosClient from "@/api/axios";
import type { MockEvent } from "../lib/mockEvents";

 type Profile = {
   id: string | number;
   email?: string;
   full_name?: string | null;
   avatar_url?: string | null;
 };

type ApiCommunity = {
  id: string | number;
  name: string;
  description?: string | null;
  logo_url?: string | null;
};

type MeEventParticipant = {
  event: {
    id: string | number;
    community_id: string | number;
    title: string;
    starts_at: string;
    location?: string | null;
    image_url?: string | null;
    description?: string | null;
    capacity?: number | null;
  };
};

 export default function ProfilePage() {
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const [profile, setProfile] = useState<Profile | null>(null);
   const [joinedEvents, setJoinedEvents] = useState<MockEvent[]>([]);
  const [communities, setCommunities] = useState<ApiCommunity[]>([]);

   useEffect(() => {
     let alive = true;
     const run = async () => {
       setLoading(true);
       setError(null);
       try {
         const [profileRes, eventsRes, communitiesRes, allCommunitiesRes] =
           await Promise.all([
             axiosClient.get("/me/profile"),
             axiosClient.get("/me/events"),
             axiosClient.get("/me/communities"),
             axiosClient.get("/communities"),
           ]);

         if (!alive) return;

         setProfile(profileRes.data);
        setCommunities((communitiesRes.data || []) as ApiCommunity[]);

         const map: Record<string, string> = {};
        for (const c of (allCommunitiesRes.data || []) as ApiCommunity[]) {
           map[String(c.id)] = c.name;
         }

        const meEvents = (eventsRes.data || []) as MeEventParticipant[];

        const mapped: MockEvent[] = meEvents.map((p) => {
          const e = p.event;
           return {
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
           };
         });

         setJoinedEvents(mapped);
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
          err?.response?.data?.error || err?.message || "Profil alınamadı."
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
   }, []);

   return (
     <div className="mx-auto max-w-6xl px-6 py-12">
       {loading ? (
         <p className="py-12 text-center text-sm text-neutral-500">
           Yükleniyor...
         </p>
       ) : error ? (
         <p className="py-12 text-center text-sm text-red-400">{error}</p>
       ) : (
         <>
      <section className="rounded-2xl bg-neutral-900 p-6 ring-1 ring-neutral-800 md:p-8">
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold text-white">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profil fotoğrafı"
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{(profile?.full_name || "U").charAt(0)}</span>
          )}
        </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
            {profile?.full_name || "Kullanıcı"}
            </h1>
            <p className="mt-1 text-sm text-neutral-400">
            {profile?.email || "Giriş yapıldı"}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Joined Events
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {joinedEvents.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            community={event.community}
            date={event.date}
            location={event.location}
            imageUrl={event.imageUrl}
            filledSeats={event.filledSeats}
            totalSeats={event.totalSeats}
            joined
          />
        ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Interested Communities
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {communities.map((community) => (
            <CommunityCard
              key={community.id}
              id={community.id}
              name={community.name}
            description={community.description || ""}
            logoUrl={community.logo_url}
            />
          ))}
        </div>
      </section>
         </>
       )}
     </div>
   );
 }
