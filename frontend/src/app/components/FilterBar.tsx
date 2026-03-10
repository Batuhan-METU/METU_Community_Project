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
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white"
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
