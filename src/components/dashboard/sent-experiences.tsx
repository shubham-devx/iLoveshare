'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Eye, Copy, ExternalLink, Calendar, Trash2, AlertTriangle } from 'lucide-react';
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

export function SentExperiences({ experiences: initialExperiences }: Props) {
  const router = useRouter();
  const [experiences, setExperiences] = useState(initialExperiences);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleCopyLink = (token: string) => {
    navigator.clipboard.writeText(getExperienceShareUrl(token));
    toast.success('Link copied! 📋');
  };

  const handleDeleteOne = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to delete invitation.');
      } else {
        setExperiences((prev) => prev.filter((e) => e.id !== id));
        toast.success('Invitation deleted from history.');
        router.refresh();
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      const res = await fetch('/api/experiences?scope=sent', { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to clear history.');
      } else {
        setExperiences([]);
        setShowClearModal(false);
        toast.success('Sent history cleared.');
        router.refresh();
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-text mb-1">Sent Experiences</h1>
          <p className="text-brand-muted text-sm">Published surprises and invitations that recipients can open.</p>
        </div>
        {experiences.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowClearModal(true)}
            className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Clear History
          </Button>
        )}
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
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="text-3xl flex-shrink-0">{experienceEmojis[exp.type] || '✨'}</div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-brand-text truncate">{exp.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-brand-muted mt-1 flex-wrap">
                      <span>For {exp.recipient_name}</span>
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
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyLink(exp.token)}
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy Link
                  </Button>
                  <Link href={`/e/${exp.token}`} target="_blank">
                    <Button size="sm" variant="ghost" title="Open link">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    loading={deletingId === exp.id}
                    onClick={() => handleDeleteOne(exp.id)}
                    title="Delete from history"
                    className="text-brand-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Clear All History confirmation modal */}
      <AnimatePresence>
        {showClearModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowClearModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-surface rounded-2xl p-6 max-w-md w-full shadow-large border border-brand-border"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-brand-text">Clear Sent History?</h3>
                  <p className="text-brand-muted text-sm mt-1">
                    This will delete all {experiences.length} sent invitation(s) from your history. Recipient links will stop working.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowClearModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  loading={isClearing}
                  onClick={handleClearAll}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
