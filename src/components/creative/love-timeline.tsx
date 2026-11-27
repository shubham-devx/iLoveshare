'use client';

import { motion } from 'framer-motion';
import { Heart, Calendar } from 'lucide-react';
import type { TimelineMilestone } from '@/types/database';

interface LoveTimelineProps {
  milestones: TimelineMilestone[];
  accentColor?: string;
  language?: 'en' | 'hi';
}

export function LoveTimeline({
  milestones,
  accentColor = '#B85C75',
  language = 'en',
}: LoveTimelineProps) {
  if (!milestones || milestones.length === 0) return null;

  return (
    <div className="my-8 text-left">
      <h3 className="font-serif text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <Heart className="w-5 h-5" style={{ color: accentColor }} />
        {language === 'hi' ? 'हमारी यादें और सफ़र' : 'Our Timeline & Memories'}
      </h3>

      <div className="relative pl-6 border-l-2 space-y-5" style={{ borderColor: `${accentColor}40` }}>
        {milestones.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative bg-white/75 dark:bg-black/25 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-soft"
          >
            <div
              className="w-3.5 h-3.5 rounded-full absolute -left-[31px] top-5 border-2 border-white"
              style={{ backgroundColor: accentColor }}
            />
            <div className="flex items-center gap-1.5 text-xs opacity-70 mb-1">
              <Calendar className="w-3 h-3" />
              <span>{m.date}</span>
            </div>
            <h4 className="font-serif font-semibold text-base mb-1">{m.title}</h4>
            <p className="text-sm opacity-80 leading-relaxed">{m.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
