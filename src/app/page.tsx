import { PageShell } from "@/components/layout/PageShell";
import { Hero } from "@/components/landing/Hero";
import { FeaturedEvents } from "@/components/landing/FeaturedEvents";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTABanner } from "@/components/landing/CTABanner";

export default function HomePage() {
  return (
    <PageShell hideHeader>
      <Hero />
      <FeaturedEvents />
      <HowItWorks />
      <FAQSection />
      <CTABanner />
    </PageShell>
  );
}
