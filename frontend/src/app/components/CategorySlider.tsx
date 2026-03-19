"use client";

import { useRef } from "react";

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

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="relative">
        <button
          type="button"
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100"
          aria-label="Scroll categories left"
        >
          <span className="text-lg font-medium text-gray-800">←</span>
        </button>
        <button
          type="button"
          onClick={scrollRight}
          className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100"
          aria-label="Scroll categories right"
        >
          <span className="text-lg font-medium text-gray-800">→</span>
        </button>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide pb-4"
        >
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="relative h-48 min-w-[280px] flex-shrink-0 cursor-pointer overflow-hidden rounded-xl transition duration-300 hover:scale-[1.03]"
            >
              <div
                className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
