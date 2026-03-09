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
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
