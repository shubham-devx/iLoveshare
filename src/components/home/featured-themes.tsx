'use client';

import { motion } from 'framer-motion';
import { DESIGN_THEMES } from '@/lib/constants';

export function FeaturedThemes() {
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
            Design Themes
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-text mt-3 mb-4">
            Beautiful Themes for Every Mood
          </h2>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            Choose from our curated collection of premium themes to match the emotion you want to express.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {DESIGN_THEMES.map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl border border-brand-border cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <div
                className="h-32 w-full"
                style={{
                  background: `linear-gradient(135deg, ${theme.preview}, ${theme.preview}99)`,
                }}
              />
              <div className="p-3 bg-brand-background">
                <h3 className="font-semibold text-sm text-brand-text">{theme.label}</h3>
                <p className="text-xs text-brand-muted mt-0.5">{theme.description}</p>
              </div>
              <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-brand-primary font-medium text-sm">Select Theme</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
