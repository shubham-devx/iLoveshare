import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { ExperienceCategories } from '@/components/home/experience-categories';
import { HowItWorksSection } from '@/components/home/how-it-works';
import { TestimonialsSection } from '@/components/home/testimonials';
import { FeaturedThemes } from '@/components/home/featured-themes';
import { WhyLovora } from '@/components/home/why-iloveshare';
import { FAQSection } from '@/components/home/faq';
import { CTASection } from '@/components/home/cta-section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'iLoveShare — Make Someone\'s Day Unforgettable',
  description: 'Create and send personalized digital celebrations for birthdays, anniversaries, proposals, and more. iLoveShare — Every feeling deserves a beautiful way to be shared.',
};

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
