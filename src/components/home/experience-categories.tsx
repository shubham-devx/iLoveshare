'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { EXPERIENCE_TYPES, ROUTES } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';

export function ExperienceCategories() {
  return (
    <section className="py-24 bg-brand-surface">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-brand-primary text-sm font-medium uppercase tracking-widest">
            Experiences
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-text mt-3 mb-4">
            What Would You Like to Create?
          </h2>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            From heartfelt birthday surprises to life-changing proposals — every occasion deserves something extraordinary.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {EXPERIENCE_TYPES.map((type, i) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                href={`${ROUTES.CREATE}?type=${type.id}`}
                className="group block p-5 rounded-2xl border border-brand-border bg-brand-background hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all duration-300 card-hover"
              >
                <div className="text-4xl mb-3">{type.emoji}</div>
                <h3 className="font-semibold text-sm text-brand-text group-hover:text-brand-primary transition-colors mb-1">
                  {type.label}
                </h3>
                <p className="text-xs text-brand-muted">{type.description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Create <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
