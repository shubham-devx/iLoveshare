'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileText, Edit, Trash2, Calendar } from 'lucide-react';
import type { Experience } from '@/types/database';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  drafts: Experience[];
  userId: string;
}

const experienceEmojis: Record<string, string> = {
  birthday: '🎂', anniversary: '💑', love_letter: '💌', proposal: '💍',
  relationship_proposal: '🌹', sorry: '🕊️', celebration: '🎉', wedding: '💒',
  engagement: '💎', congratulations: '🏆', thank_you: '🙏', custom: '✨',
};

export function DraftsManager({ drafts: initialDrafts }: Props) {
  const router = useRouter();
  const [drafts, setDrafts] = useState(initialDrafts);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setDrafts(prev => prev.filter(d => d.id !== id));
        toast.success('Draft deleted.');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to delete draft.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-brand-text mb-1">Drafts</h1>
        <p className="text-brand-muted text-sm">Your unfinished surprises. Continue where you left off.</p>
      </div>

      {drafts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">📝</div>
          <h2 className="font-serif text-xl font-bold text-brand-text mb-2">No drafts yet</h2>
          <p className="text-brand-muted mb-6">When you save a surprise as a draft, it will appear here.</p>
          <Link href={ROUTES.CREATE}>
            <Button className="btn-primary">Create a Surprise</Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {drafts.map((draft, i) => (
            <motion.div
              key={draft.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-brand-surface rounded-2xl border border-brand-border p-5 flex items-center justify-between gap-4 shadow-soft hover:shadow-medium transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{experienceEmojis[draft.type] || '✨'}</div>
                <div>
                  <h3 className="font-semibold text-brand-text">{draft.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-brand-muted mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>Last edited {formatDate(draft.updated_at)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`${ROUTES.CREATE}?draft=${draft.id}`}>
                  <Button size="sm" variant="outline">
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Continue
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(draft.id)}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
