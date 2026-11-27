'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Music, Camera, Heart } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Deeply Personalized',
    description: 'Every element can be tailored — from the recipient\'s name to custom messages, photos, and voice notes.',
  },
  {
    icon: Camera,
    title: 'Rich Media Support',
    description: 'Include up to 4 beautiful photos, PDF attachments, and audio voice notes in every surprise.',
  },
  {
    icon: Music,
    title: 'Immersive Animations',
    description: 'Confetti, floating hearts, balloons, fireworks, and birthday cakes — bring every moment to life.',
  },
  {
    icon: Globe,
    title: 'No App Required',
    description: 'Recipients open their surprise directly in their browser. No login, no download, no friction.',
  },
  {
    icon: Zap,
    title: 'Instant Delivery',
    description: 'Share via unique link or QR code immediately, or schedule for the perfect moment.',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your surprises are protected. Only people with your unique link can view them.',
  },
];

export function WhyLovora() {
  return (
    <section className="py-24 bg-brand-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-brand-primary text-sm font-medium uppercase tracking-widest">
            Why iLoveShare?
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-text mt-3 mb-4">
            More Than a Greeting Card
          </h2>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            iLoveShare is a complete celebration platform that turns ordinary moments into extraordinary memories.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-brand-border bg-brand-surface hover:border-brand-primary/30 hover:shadow-soft transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:bg-brand-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-brand-text mb-2">
                {feature.title}
              </h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
