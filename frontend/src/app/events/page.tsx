"use client";

import { useMemo, useState } from "react";
import EventCard from "../components/EventCard";
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
        event.club.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchText, selectedCategory]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
        All Events
      </h1>

      <div className="mt-5">
        <SearchBar value={searchText} onChange={setSearchText} />
      </div>

      <div className="mt-4">
        <FilterBar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            club={event.club}
            date={event.date}
            location={event.location}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <p className="mt-6 text-sm text-zinc-500">No events found</p>
      )}
    </div>
  );
}
