'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ArrowRight, Heart, Star, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

const floatingElements = [
  { emoji: '🎂', size: 'text-3xl', top: '15%', left: '10%', delay: 0 },
  { emoji: '💌', size: 'text-2xl', top: '25%', right: '12%', delay: 0.5 },
  { emoji: '🎈', size: 'text-4xl', top: '60%', left: '5%', delay: 1 },
  { emoji: '💍', size: 'text-2xl', top: '70%', right: '8%', delay: 1.5 },
  { emoji: '✨', size: 'text-3xl', top: '40%', right: '20%', delay: 0.8 },
  { emoji: '🌸', size: 'text-2xl', top: '80%', left: '15%', delay: 0.3 },
];

const stats = [
  { label: 'Curated Themes', value: '9' },
  { label: 'Experience Types', value: '12' },
  { label: 'Private & Ad-Free', value: '100%' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-soft opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(184,92,117,0.15),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(217,168,108,0.1),_transparent_60%)]" />

      {/* Floating emoji decorations */}
      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className={`absolute ${el.size} select-none pointer-events-none`}
          style={{ top: el.top, left: el.left, right: el.right }}
          animate={{
            y: [0, -15, 0],
            rotate: [-5, 5, -5],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: el.delay,
            ease: 'easeInOut',
          }}
        >
          {el.emoji}
        </motion.div>
      ))}

      {/* Main content */}
      <div className="container-custom relative z-10 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Premium Digital Celebrations Platform</span>
          <Star className="w-3 h-3 fill-brand-accent text-brand-accent" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-brand-text mb-6 leading-tight"
        >
          Make Someone&apos;s Day{' '}
          <span className="text-gradient italic">Unforgettable</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-brand-muted text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Create beautiful, personalized digital surprises for birthdays, anniversaries, proposals, and every precious moment in between.{' '}
          <span className="text-brand-primary font-medium">Every feeling deserves a beautiful way to be shared.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link href={ROUTES.REGISTER}>
            <Button size="xl" className="btn-primary group">
              <Gift className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Create Your Surprise
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href={ROUTES.EXPLORE}>
            <Button size="xl" variant="outline" className="group">
              <Heart className="w-5 h-5 mr-2 text-brand-primary group-hover:fill-brand-primary transition-all" />
              Explore Experiences
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-10 mb-16"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-serif text-3xl font-bold text-brand-primary">{stat.value}</div>
              <div className="text-sm text-brand-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Demo Card Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative glass rounded-3xl p-8 border border-brand-primary/20 shadow-large">
            {/* Birthday demo card */}
            <div className="text-center">
              <div className="text-6xl mb-4 animate-heart-beat">🎂</div>
              <div className="font-display text-2xl text-brand-primary italic mb-2">
                Happy Birthday, Priya!
              </div>
              <p className="text-brand-muted text-sm mb-6">
                On your special day, I want you to know how much you mean to me...
              </p>
              <div className="flex justify-center gap-2 mb-4">
                {['🎊', '🎈', '🌸', '✨', '💕'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    className="text-2xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ delay: i * 0.2, duration: 2, repeat: Infinity }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
              <div className="flex gap-3 justify-center">
                <span className="px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-medium">
                  View Full Surprise
                </span>
                <span className="px-4 py-1.5 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-medium">
                  Send Response 💌
                </span>
              </div>
            </div>
          </div>

          {/* Floating card decorations */}
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl glass border border-brand-border flex items-center justify-center text-2xl shadow-soft">
            🎁
          </div>
          <div className="absolute -bottom-4 -left-4 w-14 h-14 rounded-2xl glass border border-brand-border flex items-center justify-center text-xl shadow-soft">
            💌
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-background to-transparent" />
    </section>
  );
}
