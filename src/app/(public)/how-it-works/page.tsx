import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { HowItWorksSection } from '@/components/home/how-it-works';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works – iLoveShare',
  description: 'Learn how to create and send beautiful personalized digital surprises in just a few minutes.',
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-brand-background">
      <Navigation />
      <div className="pt-24">
        <HowItWorksSection />
      </div>
      <Footer />
    </main>
  );
}
