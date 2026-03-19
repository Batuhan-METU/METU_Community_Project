"use client";

import { useMemo, useState } from "react";

const CATEGORIES = [
  { name: "Art", image: "/images/categories/art.jpg" },
  { name: "Science", image: "/images/categories/science.jpg" },
  { name: "Technology", image: "/images/categories/technology.jpg" },
  { name: "Sport", image: "/images/categories/sport.jpg" },
  { name: "Career", image: "/images/categories/career.jpg" },
];

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((category) =>
      category.name.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      {/* Dark hero header */}
      <section className="bg-black py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-5xl font-bold text-white md:text-6xl">
            → See Who&apos;s Texting
          </h1>
        </div>
      </section>

      {/* Search bar */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <circle cx="11" cy="11" r="6" />
              <path d="m16 16 4 4" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Find communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-gray-300 px-6 py-4 pl-12 text-lg text-gray-900 shadow-sm outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-black"
          />
        </div>
      </section>

      {/* Category discovery grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        {filteredCategories.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            No categories found
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {filteredCategories.map((category) => (
              <div
                key={category.name}
                className="relative h-52 cursor-pointer overflow-hidden rounded-xl transition duration-300 hover:scale-[1.03]"
              >
                <div
                  className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h2 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
                  {category.name}
                </h2>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
