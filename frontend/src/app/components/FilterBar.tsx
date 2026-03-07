"use client";

import { EventCategory } from "../lib/mockEvents";

export type FilterCategory = "All" | EventCategory;

type FilterBarProps = {
  selectedCategory: FilterCategory;
  onCategoryChange: (category: FilterCategory) => void;
};

const categories: FilterCategory[] = [
  "All",
  "Engineering",
  "Business",
  "Art",
  "Music",
  "Science",
];

export default function FilterBar({
  selectedCategory,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = selectedCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100"
            }`}
            aria-pressed={isActive}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
