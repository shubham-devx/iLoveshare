'use client';

import { motion } from 'framer-motion';
import { UserPlus, Palette, Share2, Heart } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Create Your Account',
    description: 'Sign up in seconds and start your free creative journey.',
    color: '#B85C75',
  },
  {
    icon: Palette,
    step: '02',
    title: 'Design Your Experience',
    description: 'Choose the occasion, write your message, add photos, music, and animations.',
    color: '#D9A86C',
  },
  {
    icon: Share2,
    step: '03',
    title: 'Share the Magic',
    description: 'Send a unique link or QR code — no login required for recipients.',
    color: '#E8A0AD',
  },
  {
    icon: Heart,
    step: '04',
    title: 'Receive Their Response',
    description: 'Get notified when they open and respond to your surprise.',
    color: '#B85C75',
  },
];

export function HowItWorksSection() {
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
            Simple Process
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-text mt-3 mb-4">
            How It Works
          </h2>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            Create a beautiful personalized experience in minutes. No design skills required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-brand-primary/30 to-brand-secondary/30" />
              )}

              <div
                className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-soft"
                style={{ backgroundColor: step.color + '15', border: `2px solid ${step.color}30` }}
              >
                <step.icon className="w-9 h-9" style={{ color: step.color }} />
              </div>

              <div className="font-display text-5xl font-bold text-brand-muted/20 mb-2">
                {step.step}
              </div>

              <h3 className="font-serif text-xl font-semibold text-brand-text mb-3">
                {step.title}
              </h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
