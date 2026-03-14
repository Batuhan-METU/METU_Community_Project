import HeroSection from "./components/landing/HeroSection";
import LogoCloud from "./components/landing/LogoCloud";
import FeaturesSection from "./components/landing/FeaturesSection";
import EventsPreview from "./components/landing/EventsPreview";
import TestimonialsSection from "./components/landing/TestimonialsSection";
import CTASection from "./components/landing/CTASection";
import Footer from "./components/landing/Footer";

export default function Home() {
  return (
    <>
      <HeroSection />
      <LogoCloud />
      <FeaturesSection />
      <EventsPreview />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </>
  );
}
