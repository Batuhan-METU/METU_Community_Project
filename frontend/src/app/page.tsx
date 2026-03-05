"use client";

import { useEffect, useState } from "react";

type Community = {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
};

type Event = {
  id: number;
  communityId: number;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  ticketPrice: number;
};

export default function Home() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Backend health check + örnek veri çekme
    fetch("http://localhost:8080/api/communities")
      .then((res) => res.json())
      .then(setCommunities)
      .catch(console.error);

    fetch("http://localhost:8080/api/events")
      .then((res) => res.json())
      .then(setEvents)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-black px-2 py-1 text-xs font-semibold text-white">
              METU
            </span>
            <span className="text-lg font-semibold tracking-tight">
              METUHub
            </span>
          </div>
          <nav className="flex gap-4 text-sm text-zinc-600">
            <button className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white">
              Giriş Yap
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-8">
        <section className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            ODTÜ topluluklarını tek yerde keşfet.
          </h1>
          <p className="max-w-2xl text-sm text-zinc-600">
            ODTÜ hesabınla giriş yap, hobilerini seç, METUHub sana uygun
            toplulukları ve etkinlikleri önersin. Eşli Dans’tan oyun
            geliştirmeye kadar hepsi burada.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-[2fr,3fr]">
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-zinc-700">
              Öne çıkan topluluklar
            </h2>
            <div className="flex flex-col gap-3">
              {communities.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold">{c.name}</h3>
                      <p className="text-xs text-zinc-500">{c.category}</p>
                    </div>
                    <button className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                      Sayfayı Aç
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-zinc-600">
                    {c.description}
                  </p>
                </div>
              ))}
              {communities.length === 0 && (
                <p className="text-xs text-zinc-500">
                  Topluluklar yükleniyor veya şu an için tanımlı topluluk yok.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-medium text-zinc-700">
              Yaklaşan etkinlikler
            </h2>
            <div className="flex flex-col gap-3">
              {events.map((e) => (
                <div
                  key={e.id}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold">{e.title}</h3>
                      <p className="text-xs text-zinc-500">
                        {new Date(e.dateTime).toLocaleString("tr-TR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <button className="rounded-full border border-black px-3 py-1 text-xs font-medium text-black">
                      Katıl / Bilet Al
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-zinc-600">
                    {e.description}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">{e.location}</p>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-xs text-zinc-500">
                  Etkinlikler yükleniyor veya şu an için tanımlı etkinlik yok.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
