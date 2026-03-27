"use client";

import { useRef } from "react";
import Link from "next/link";

const CATEGORIES = [
  { name: "Art", image: "/images/categories/art.jpg" },
  { name: "Science", image: "/images/categories/science.jpg" },
  { name: "Technology", image: "/images/categories/technology.jpg" },
  { name: "Sport", image: "/images/categories/sport.jpg" },
  { name: "Career", image: "/images/categories/career.jpg" },
];

export default function CategorySlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  function getCommunitiesHref(categoryName: string) {
    const normalized = categoryName.toLowerCase();
    // Keep consistent with /communities/[category] routes (lowercase slugs).
    return `/communities/${normalized === "sport" ? "sport" : normalized}`;
  }

  return (
    <div className="relative overflow-visible">
      <button
        type="button"
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 z-10 -translate-x-8 -translate-y-1/2 cursor-pointer select-none text-2xl font-semibold text-white/70 transition-opacity duration-300 hover:text-white/100"
        aria-label="Scroll categories left"
      >
        ←
      </button>
      <button
        type="button"
        onClick={scrollRight}
        className="absolute right-0 top-1/2 z-10 translate-x-8 -translate-y-1/2 cursor-pointer select-none text-2xl font-semibold text-white/70 transition-opacity duration-300 hover:text-white/100"
        aria-label="Scroll categories right"
      >
        →
      </button>

      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide pb-4"
      >
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            href={getCommunitiesHref(cat.name)}
            className="group relative h-48 min-w-[280px] flex-shrink-0 overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label={`${cat.name} communities`}
          >
            <div
              className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat transition duration-500 group-hover:scale-[1.08] group-hover:brightness-110 group-hover:saturate-110"
              style={{ backgroundImage: `url(${cat.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-85 transition-all duration-300 group-hover:opacity-100" />

            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 shadow-[0_0_40px_rgba(99,102,241,0.35)]" />
            </div>

            <h3 className="absolute bottom-4 left-4 text-xl font-bold tracking-wide text-white">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
