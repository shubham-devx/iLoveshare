import dynamic from 'next/dynamic';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { ExperienceCategories } from '@/components/home/experience-categories';
import type { Metadata } from 'next';

// Sections below the fold — lazy-load so they don't bloat the initial JS bundle
// Each is loaded only when it scrolls into view (IntersectionObserver inside Next)
const HowItWorksSection = dynamic(() =>
  import('@/components/home/how-it-works').then((m) => m.HowItWorksSection)
);
const FeaturedThemes = dynamic(() =>
  import('@/components/home/featured-themes').then((m) => m.FeaturedThemes)
);
const WhyLovora = dynamic(() =>
  import('@/components/home/why-iloveshare').then((m) => m.WhyLovora)
);
const TestimonialsSection = dynamic(() =>
  import('@/components/home/testimonials').then((m) => m.TestimonialsSection)
);
const FAQSection = dynamic(() =>
  import('@/components/home/faq').then((m) => m.FAQSection)
);
const CTASection = dynamic(() =>
  import('@/components/home/cta-section').then((m) => m.CTASection)
);

export const metadata: Metadata = {
  title: 'iLoveShare — Make Someone\'s Day Unforgettable',
  description: 'Create and send personalized digital celebrations for birthdays, anniversaries, proposals, and more. iLoveShare — Every feeling deserves a beautiful way to be shared.',
};

// Statically generated — revalidate every 24 hours (ISR)
export const revalidate = 86400;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-background">
      <Navigation />
      <HeroSection />
      <ExperienceCategories />
      <HowItWorksSection />
      <FeaturedThemes />
      <WhyLovora />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
