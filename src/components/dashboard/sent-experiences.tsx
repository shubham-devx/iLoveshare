'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Send, Eye, Copy, ExternalLink, Calendar } from 'lucide-react';
import type { Experience } from '@/types/database';
import { Button } from '@/components/ui/button';
import { formatDate, getExperienceShareUrl } from '@/lib/utils';
import { toast } from 'sonner';
import { ROUTES } from '@/lib/constants';

interface Props {
  experiences: Experience[];
}

const experienceEmojis: Record<string, string> = {
  birthday: '🎂', anniversary: '💑', love_letter: '💌', proposal: '💍',
  relationship_proposal: '🌹', sorry: '🕊️', celebration: '🎉', wedding: '💒',
  engagement: '💎', congratulations: '🏆', thank_you: '🙏', custom: '✨',
};

export function SentExperiences({ experiences }: Props) {
  const handleCopyLink = (token: string) => {
    navigator.clipboard.writeText(getExperienceShareUrl(token));
    toast.success('Link copied! 📋');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-brand-text mb-1">Sent Experiences</h1>
        <p className="text-brand-muted text-sm">Published surprises that recipients can open.</p>
      </div>

      {experiences.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="font-serif text-xl font-bold text-brand-text mb-2">Nothing sent yet</h2>
          <p className="text-brand-muted mb-6">Create and publish your first surprise to see it here.</p>
          <Link href={ROUTES.CREATE}>
            <Button className="btn-primary">Create a Surprise</Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-brand-surface rounded-2xl border border-brand-border p-5 shadow-soft hover:shadow-medium transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{experienceEmojis[exp.type] || '✨'}</div>
                  <div>
                    <h3 className="font-semibold text-brand-text">{exp.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-brand-muted mt-1">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />{exp.view_count || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.published_at ? formatDate(exp.published_at) : 'Recently'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyLink(exp.token)}
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy Link
                  </Button>
                  <Link href={`/e/${exp.token}`} target="_blank">
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
