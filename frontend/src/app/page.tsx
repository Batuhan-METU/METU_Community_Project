import HeroSection from "./components/landing/HeroSection";
import LogoCloud from "./components/landing/LogoCloud";
import FeaturesSection from "./components/landing/FeaturesSection";
import EventsPreview from "./components/landing/EventsPreview";
import RecentChatsSection from "./components/landing/RecentChatsSection";
import HypeRankingSection from "./components/landing/HypeRankingSection";
import TestimonialsSection from "./components/landing/TestimonialsSection";
import CTASection from "./components/landing/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <RecentChatsSection />
      <HypeRankingSection />
      <LogoCloud />
      <FeaturesSection />
      <EventsPreview />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
