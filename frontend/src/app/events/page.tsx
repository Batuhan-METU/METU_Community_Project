"use client";

import { useMemo, useState } from "react";
import EventsGrid from "../components/EventsGrid";
import FilterBar, { FilterCategory } from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
import { mockEvents } from "../lib/mockEvents";

export default function EventsPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>("All");

  const filteredEvents = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return mockEvents.filter((event) => {
      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.community.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchText, selectedCategory]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-white">
        All Events
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        Find events by community name, category, or topic.
      </p>

      <div className="mt-6 space-y-4">
        <SearchBar value={searchText} onChange={setSearchText} />
        <FilterBar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <div className="mt-8">
        <EventsGrid events={filteredEvents} />
      </div>
    </div>
  );
}
