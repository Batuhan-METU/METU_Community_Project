"use client";

import { useMemo } from "react";
import { useRecommendations, type RecommendationUser } from "../hooks/useRecommendations";
import RecommendedEvents from "./components/RecommendedEvents";
import { mockEvents } from "./lib/mockEvents";
import HeroSection from "./components/landing/HeroSection";
import LogoCloud from "./components/landing/LogoCloud";
import FeaturesSection from "./components/landing/FeaturesSection";
import EventsPreview from "./components/landing/EventsPreview";
import RecentChatsSection from "./components/landing/RecentChatsSection";
import HypeRankingSection from "./components/landing/HypeRankingSection";
import TestimonialsSection from "./components/landing/TestimonialsSection";
import CTASection from "./components/landing/CTASection";

const DEFAULT_USER: RecommendationUser = {
  preferredCategories: ["Technology", "Engineering", "Science"],
};

function eventsForRecommendations() {
  return mockEvents.map((ev) => {
    const fillRatio = ev.filledSeats / Math.max(ev.totalSeats, 1);
    return {
      ...ev,
      hypeScore: Math.round(fillRatio * 100),
    };
  });
}

export default function Home() {
  const events = useMemo(eventsForRecommendations, []);
  const user = useMemo(() => DEFAULT_USER, []);
  const recommended = useRecommendations(events, user);

  const recommendedCards = useMemo(
    () =>
      recommended.map((e) => ({
        id: e.id,
        title: e.title,
        category: e.category,
        expectedParticipants: e.filledSeats,
        hypeScore: e.hypeScore,
        reason: e.reason,
      })),
    [recommended],
  );

  return (
    <>
      <HeroSection />
      <RecentChatsSection />
      <HypeRankingSection />
      <LogoCloud />
      <FeaturesSection />
      <EventsPreview />
      <TestimonialsSection />
      {recommendedCards.length > 0 ? (
        <section
          className="border-t border-gray-100 bg-white py-16 sm:py-20 lg:py-24"
          aria-label="Recommended events"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <RecommendedEvents events={recommendedCards} />
          </div>
        </section>
      ) : null}
      <CTASection />
    </>
  );
}
