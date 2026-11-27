'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'Do recipients need to create an account?',
    a: 'No! Recipients simply open the unique link you share with them. No registration, no login, no app required.',
  },
  {
    q: 'How many photos can I include?',
    a: 'You can add up to 4 beautiful photos, each up to 5MB. We also support PDF attachments and audio voice notes.',
  },
  {
    q: 'Can I schedule a surprise for a specific date and time?',
    a: 'Yes! You can schedule your surprise to activate at exactly the right moment — perfect for midnight birthday reveals.',
  },
  {
    q: 'What happens after the recipient responds?',
    a: 'You\'ll get notified with their response. Their star rating and feedback are saved to your dashboard. The original experience is never deleted.',
  },
  {
    q: 'Is the platform secure?',
    a: 'Absolutely. Each experience has a unique, unguessable token. Your private data is protected with Row Level Security. Recipients can only see what you explicitly share.',
  },
  {
    q: 'Can I edit a surprise after publishing?',
    a: 'Yes, you can edit and update your surprise from your dashboard at any time. You can also archive experiences you no longer want active.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes! You can create and share experiences for free. Premium plans unlock advanced themes, analytics, and more features.',
  },
  {
    q: 'What experience types are supported?',
    a: 'Birthday, Anniversary, Love Letter, Proposal, Relationship Proposal, Sorry/Apology, Celebration Invitation, Wedding Invitation, Engagement, Congratulations, Thank You, and Custom Surprises.',
  },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof faqs[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-brand-primary/5 transition-colors"
      >
        <span className="font-medium text-brand-text pr-4">{faq.q}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-brand-muted flex-shrink-0 transition-transform duration-300',
            isOpen && 'rotate-180 text-brand-primary'
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 pb-5 text-brand-muted text-sm leading-relaxed border-t border-brand-border pt-4">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
            FAQ
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-text mt-3 mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <FAQItem
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
