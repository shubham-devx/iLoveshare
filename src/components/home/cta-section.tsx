'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

export function CTASection() {
  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(184,92,117,0.2),_transparent_70%)]" />
      <div className="absolute top-10 right-10 text-6xl opacity-10 animate-float">🎊</div>
      <div className="absolute bottom-10 left-10 text-5xl opacity-10 animate-balloon">🎈</div>
      <div className="absolute top-1/2 left-20 text-4xl opacity-10 animate-sparkle">✨</div>

      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="text-5xl mb-6 animate-heart-beat">💝</div>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Create Something{' '}
            <span className="text-gradient">Unforgettable?</span>
          </h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto mb-10">
            Create magical, personalized digital moments with iLoveShare. Your next unforgettable surprise is just minutes away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ROUTES.REGISTER}>
              <Button size="xl" className="btn-primary group">
                <Sparkles className="w-5 h-5 mr-2" />
                Start for Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href={ROUTES.EXPLORE}>
              <Button size="xl" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Explore Experiences
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
