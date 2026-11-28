import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about iLoveShare and our mission to make every feeling beautiful.',
};

// Statically generated — revalidate every 24 hours
export const revalidate = 86400;

export default function AboutPage() {
  return (
    <main className="pt-24 pb-24 bg-brand-background">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold text-brand-text mb-4">
            About iLoveShare
          </h1>
          <p className="text-brand-muted text-xl italic font-display">
            Every feeling deserves a beautiful way to be shared.
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
            <h2 className="font-serif text-3xl font-bold text-brand-text mb-4">Our Story</h2>
            <p className="text-brand-muted leading-relaxed">
              iLoveShare was born from a simple belief — that the people we love deserve more than a quick message. 
              We built this platform because we believe that every emotion, every milestone, every &ldquo;I love you&rdquo; 
              deserves to be wrapped in something as beautiful as the feeling itself.
            </p>
            <p className="text-brand-muted leading-relaxed mt-4">
              We started with a birthday, a message, and the dream of making someone&apos;s day truly unforgettable. 
              Today, thousands of people across India and around the world use iLoveShare to celebrate the moments that matter most.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-brand-surface border border-brand-border">
            <h2 className="font-serif text-3xl font-bold text-brand-text mb-4">Our Mission</h2>
            <p className="text-brand-muted leading-relaxed">
              To make personalized digital celebrations accessible to everyone — from proposals to apologies, 
              from birthdays to &ldquo;just because&rdquo; moments. We believe technology should amplify human connection, 
              not replace it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: '💝', title: 'Emotion First', desc: 'Every design decision starts with how it makes people feel.' },
              { emoji: '🔒', title: 'Privacy Focused', desc: 'Your surprises are private, secure, and always under your control.' },
              { emoji: '🌟', title: 'Always Improving', desc: 'We listen to our users and constantly add new ways to celebrate.' },
            ].map((v) => (
              <div key={v.title} className="p-6 rounded-2xl bg-brand-primary/5 border border-brand-primary/20 text-center">
                <div className="text-4xl mb-3">{v.emoji}</div>
                <h3 className="font-serif text-lg font-bold text-brand-text mb-2">{v.title}</h3>
                <p className="text-brand-muted text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
