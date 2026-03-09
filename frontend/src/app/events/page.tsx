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
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        All Events
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Find events by club name, category, or topic.
      </p>

      <div className="mt-6 space-y-3">
        <SearchBar value={searchText} onChange={setSearchText} />
        <FilterBar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            club={event.club}
            date={event.date}
            location={event.location}
            filledSeats={event.filledSeats}
            totalSeats={event.totalSeats}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <p className="mt-8 text-sm text-gray-400">No events found</p>
      )}
    </div>
  );
}
