'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Star, Calendar } from 'lucide-react';
import type { Experience, ExperienceResponse } from '@/types/database';
import { formatDate } from '@/lib/utils';

interface Props {
  responses: ExperienceResponse[];
  experiences: Experience[];
}

export function ResponsesManager({ responses, experiences }: Props) {
  const expMap = new Map(experiences.map(e => [e.id, e]));

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-brand-text mb-1">Received Responses</h1>
        <p className="text-brand-muted text-sm">See how recipients responded to your surprises.</p>
      </div>

      {responses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">💌</div>
          <h2 className="font-serif text-xl font-bold text-brand-text mb-2">No responses yet</h2>
          <p className="text-brand-muted">When recipients respond to your surprises, their responses will appear here.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {responses.map((response, i) => {
            const exp = expMap.get(response.experience_id);
            return (
              <motion.div
                key={response.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-brand-surface rounded-2xl border border-brand-border p-5 shadow-soft"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-brand-text text-sm">
                      {exp?.title || 'Unknown experience'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-brand-muted mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(response.created_at)}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary">
                    {response.response_value || response.response_type}
                  </span>
                </div>

                {response.star_rating && (
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= response.star_rating! ? 'text-amber-400 fill-amber-400' : 'text-brand-border'}`}
                      />
                    ))}
                  </div>
                )}

                {response.written_feedback && (
                  <div className="p-3 rounded-xl bg-brand-background border border-brand-border">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-brand-muted mt-0.5 flex-shrink-0" />
                      <p className="text-brand-muted text-sm italic">&quot;{response.written_feedback}&quot;</p>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
