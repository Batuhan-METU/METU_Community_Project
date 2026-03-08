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
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300 shadow-sm shadow-indigo-500/10"
                : "border-white/[0.06] bg-surface text-slate-400 hover:border-white/[0.1] hover:text-white"
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
