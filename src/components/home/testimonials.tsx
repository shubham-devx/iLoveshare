'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Mumbai',
    rating: 5,
    text: 'I created a birthday surprise for my husband and he was in tears! The animated cake, our photos, and my voice note made it so special. iLoveShare is truly magical.',
    avatar: '👩',
  },
  {
    name: 'Rahul Verma',
    role: 'Delhi',
    rating: 5,
    text: 'Used it to propose to my girlfriend. The interactive Yes/No experience was breathtaking. She said YES! Thank you iLoveShare for making our moment perfect.',
    avatar: '👨',
  },
  {
    name: 'Anjali Patel',
    role: 'Bangalore',
    rating: 5,
    text: 'Sent an anniversary surprise to my parents. They couldn\'t believe how beautiful it looked on their phone. Such a touching and personal platform.',
    avatar: '👩‍💼',
  },
  {
    name: 'Vikram Singh',
    role: 'Pune',
    rating: 5,
    text: 'The birthday experience with floating hearts and confetti blew my mind. My sister called me immediately after opening it. Worth every penny!',
    avatar: '👨‍💻',
  },
  {
    name: 'Meera Nair',
    role: 'Chennai',
    rating: 5,
    text: 'Simple to create, stunning to receive. I created a thank you experience for my mentor and she was so moved. The attention to detail is incredible.',
    avatar: '👩‍🎨',
  },
  {
    name: 'Arjun Kapoor',
    role: 'Hyderabad',
    rating: 5,
    text: 'Created wedding invitations for all our guests. The QR code sharing was genius and everyone loved receiving something so personal and beautiful.',
    avatar: '👨‍💼',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-brand-surface overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-brand-primary text-sm font-medium uppercase tracking-widest">
            Celebration Stories
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-text mt-3 mb-4">
            Stories of Unforgettable Moments
          </h2>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            See how people use iLoveShare to turn birthdays, proposals, and milestones into lasting memories.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-brand-border bg-brand-background hover:border-brand-primary/30 hover:shadow-soft transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-brand-accent fill-brand-accent" />
                ))}
              </div>
              <p className="text-brand-muted text-sm leading-relaxed mb-5 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-xl">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm text-brand-text">{t.name}</div>
                  <div className="text-xs text-brand-muted">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
