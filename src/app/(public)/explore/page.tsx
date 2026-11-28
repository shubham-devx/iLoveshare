import type { Metadata } from 'next';
import Link from 'next/link';
import { ROUTES, EXPERIENCE_TYPES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Explore Experiences',
  description: 'Browse all types of personalized digital experiences you can create on iLoveShare.',
};

// Statically generated — revalidate every 24 hours
export const revalidate = 86400;

export default function ExplorePage() {
  return (
    <main className="pt-24 pb-24 bg-brand-background">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold text-brand-text mb-4">
            Explore Experiences
          </h1>
          <p className="text-brand-muted text-xl max-w-2xl mx-auto">
            Browse the full range of personalized experiences you can create. Each one is unique, beautiful, and completely yours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXPERIENCE_TYPES.map((type) => (
            <Link
              key={type.id}
              href={`${ROUTES.CREATE}?type=${type.id}`}
              className="group p-8 rounded-3xl border border-brand-border bg-brand-surface hover:border-brand-primary/40 hover:shadow-medium transition-all duration-300"
            >
              <div className="text-5xl mb-4">{type.emoji}</div>
              <h3 className="font-serif text-2xl font-bold text-brand-text group-hover:text-brand-primary transition-colors mb-2">
                {type.label}
              </h3>
              <p className="text-brand-muted">{type.description}</p>
              <div className="mt-6 inline-flex items-center text-brand-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Create This Experience →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
