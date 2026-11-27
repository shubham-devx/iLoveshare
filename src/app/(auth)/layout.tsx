import Link from 'next/link';
import { Heart } from 'lucide-react';
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
          <Link href={ROUTES.HOME} className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <span className="font-serif text-2xl font-bold">iLoveShare</span>
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
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-serif text-xl font-semibold text-gradient">iLoveShare</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
