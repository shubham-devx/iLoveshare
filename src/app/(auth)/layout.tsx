import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/lib/constants';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-background flex">
      {/* Left decorative panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-primary">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(217,168,108,0.2),_transparent_60%)]" />

        {/* Floating emojis */}
        {['🎂', '💌', '💍', '🎊', '🌸', '✨', '🎈', '💕'].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-3xl opacity-20 animate-float"
            style={{
              top: `${10 + (i * 11)}%`,
              left: `${5 + (i * 11)}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {emoji}
          </div>
        ))}

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center bg-white/95 rounded-2xl px-4 py-2.5 shadow-medium mb-10 w-fit hover:bg-white transition-colors"
            aria-label="iLoveShare Home"
          >
            <Image
              src="/logo.png"
              alt="iLoveShare"
              width={106}
              height={68}
              priority
              className="h-12 w-auto object-contain"
            />
          </Link>

          <h2 className="font-serif text-4xl font-bold mb-4 leading-tight">
            Create Memories That<br />
            <span className="italic">Last Forever</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            Join thousands who have made their loved ones feel truly special with personalized digital celebrations.
          </p>

          <div className="space-y-4">
            {[
              { emoji: '🎂', text: 'Birthday surprises with animated cakes & music' },
              { emoji: '💍', text: 'Proposal experiences with interactive responses' },
              { emoji: '💌', text: 'Love letters with beautiful photo galleries' },
              { emoji: '🎉', text: 'Event invitations with RSVP collection' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/80">
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link href={ROUTES.HOME} className="inline-flex items-center" aria-label="iLoveShare Home">
            <Image
              src="/logo.png"
              alt="iLoveShare"
              width={88}
              height={56}
              priority
              className="h-12 w-auto object-contain dark:bg-white/95 dark:rounded-xl dark:px-2.5 dark:py-1"
            />
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
