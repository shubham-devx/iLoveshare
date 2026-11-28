import { HowItWorksSection } from '@/components/home/how-it-works';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works – iLoveShare',
  description: 'Learn how to create and send beautiful personalized digital surprises in just a few minutes.',
};

// Statically generated — revalidate every 24 hours
export const revalidate = 86400;

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-brand-background pt-24">
      <HowItWorksSection />
    </main>
  );
}
