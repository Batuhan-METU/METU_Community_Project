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
    <div className="mt-6 flex flex-wrap gap-3">
      {categories.map((category) => {
        const isActive = selectedCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium border shadow-sm bg-white text-gray-700 transition duration-200 hover:bg-gray-50 hover:shadow-md hover:scale-105 transition-transform ${
              isActive ? "bg-black text-white border-black shadow-md" : "border-gray-200"
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
