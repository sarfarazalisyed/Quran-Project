import { HeroSection } from "@/components/home/hero-section";
import { StatsBar } from "@/components/home/stats-bar";
import { DailyVerse } from "@/components/home/daily-verse";
import { FeaturesGrid } from "@/components/home/features-grid";
import { CtaSection } from "@/components/home/cta-section";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <DailyVerse />
      <FeaturesGrid />
      <CtaSection />
      <Footer />
    </>
  );
}
