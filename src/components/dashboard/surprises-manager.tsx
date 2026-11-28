'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, Edit, Copy, Share2, Trash2, Archive, BarChart3,
  Link, ExternalLink, QrCode, AlertTriangle, X, Files
} from 'lucide-react';
import type { Experience } from '@/types/database';
import { Button } from '@/components/ui/button';
import { QRCodeCard } from '@/components/ui/qr-code';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { formatDate, generateToken, getExperienceShareUrl, cn } from '@/lib/utils';
import Link2 from 'next/link';
import { ROUTES } from '@/lib/constants';

interface Props {
  experiences: Experience[];
  userId: string;
  newlyPublishedToken?: string;
}

const statusColors: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
  published: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400',
  archived: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400',
};

const experienceEmojis: Record<string, string> = {
  birthday: '🎂', anniversary: '💑', love_letter: '💌', proposal: '💍',
  relationship_proposal: '🌹', sorry: '🕊️', celebration: '🎉', wedding: '💒',
  engagement: '💎', congratulations: '🏆', thank_you: '🙏', custom: '✨',
};

export function SurprisesManager({ experiences: initialExperiences, userId, newlyPublishedToken }: Props) {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; experience: Experience | null }>({
    open: false,
    experience: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [shareModal, setShareModal] = useState<{ open: boolean; token: string | null }>({
    open: !!newlyPublishedToken,
    token: newlyPublishedToken || null,
  });

  const filtered = experiences.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const handleCopyLink = (token: string) => {
    navigator.clipboard.writeText(getExperienceShareUrl(token));
    toast.success('Link copied to clipboard! 📋');
  };

  const handleDuplicate = async (exp: Experience) => {
    setDuplicatingId(exp.id);
    const supabase = createClient();
    const newToken = generateToken(32);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: duplicated, error } = await (supabase.from('experiences') as any)
      .insert({
        user_id: userId,
        title: `${exp.title} (Copy)`,
        type: exp.type,
        recipient_type: exp.recipient_type,
        recipient_name: exp.recipient_name,
        sender_name: exp.sender_name,
        relationship: exp.relationship,
        personal_greeting: exp.personal_greeting,
        message: exp.message,
        theme: exp.theme,
        animations: exp.animations,
        music_enabled: exp.music_enabled,
        music_url: exp.music_url,
        response_type: exp.response_type,
        custom_response_label: exp.custom_response_label,
        enable_star_rating: exp.enable_star_rating,
        enable_written_feedback: exp.enable_written_feedback,
        passcode: exp.passcode,
        language: exp.language,
        event_details: exp.event_details,
        milestones: exp.milestones,
        scratch_message: exp.scratch_message,
        creative_features: exp.creative_features,
        group_delivery: exp.group_delivery,
        lock_after_response: exp.lock_after_response,
        token: newToken,
        status: 'draft',
      })
      .select()
      .single();

    if (error || !duplicated) {
      toast.error('Failed to duplicate: ' + (error?.message || 'Unknown error'));
    } else {
      setExperiences((prev) => [duplicated as Experience, ...prev]);
      toast.success('Surprise duplicated as draft!');
    }
    setDuplicatingId(null);
  };

  const handleDelete = async () => {
    if (!deleteModal.experience) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/experiences/${deleteModal.experience.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to delete. Please try again.');
      } else {
        setExperiences((prev) => prev.filter((e) => e.id !== deleteModal.experience!.id));
        toast.success('Surprise deleted successfully.');
        setDeleteModal({ open: false, experience: null });
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchive = async (experience: Experience) => {
    const supabase = createClient();
    const newStatus = experience.status === 'archived' ? 'published' : 'archived';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('experiences') as any)
      .update({ status: newStatus })
      .eq('id', experience.id)
      .eq('user_id', userId);

    if (!error) {
      setExperiences((prev) =>
        prev.map((e) => e.id === experience.id ? { ...e, status: newStatus as typeof experience.status } : e)
      );
      toast.success(newStatus === 'archived' ? 'Archived.' : 'Restored to published.');
    }
  };

  const handlePublish = async (experience: Experience) => {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('experiences') as any)
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', experience.id)
      .eq('user_id', userId);

    if (!error) {
      setExperiences((prev) =>
        prev.map((e) => e.id === experience.id ? { ...e, status: 'published' } : e)
      );
      toast.success('Published! 🎉');
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'published', 'draft', 'archived'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize',
              filter === f
                ? 'bg-brand-primary text-white shadow-soft'
                : 'bg-brand-background text-brand-muted border border-brand-border hover:border-brand-primary/40'
            )}
          >
            {f} ({f === 'all' ? experiences.length : experiences.filter(e => e.status === f).length})
          </button>
        ))}
      </div>

      {/* Experiences grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎊</div>
          <h3 className="font-serif text-xl font-semibold text-brand-text mb-2">
            {filter === 'all' ? 'No surprises yet' : `No ${filter} surprises`}
          </h3>
          <p className="text-brand-muted text-sm mb-6">
            {filter === 'all' ? 'Create your first personalized experience!' : `You have no ${filter} surprises.`}
          </p>
          {filter === 'all' && (
            <Link2 href={ROUTES.CREATE}>
              <Button className="btn-primary">Create Your First Surprise ✨</Button>
            </Link2>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl border border-brand-border bg-brand-surface hover:border-brand-primary/30 hover:shadow-soft transition-all"
            >
              <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                  {experienceEmojis[exp.type] || '✨'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-brand-text truncate">{exp.title}</h3>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium border', statusColors[exp.status] || statusColors.draft)}>
                      {exp.status}
                    </span>
                  </div>
                  <div className="text-xs text-brand-muted mb-3">
                    For {exp.recipient_name} · From {exp.sender_name} · {formatDate(exp.created_at)}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-brand-muted flex-wrap">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {exp.view_count} views
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" /> {exp.response_count} responses
                    </span>
                    {exp.theme && (
                      <span className="capitalize">🎨 {exp.theme}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0 flex-wrap justify-end">
                  {exp.status === 'published' && (
                    <>
                      <a
                        href={`/e/${exp.token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Preview"
                        className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleCopyLink(exp.token)}
                        title="Copy link"
                        className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                      >
                        <Link className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShareModal({ open: true, token: exp.token })}
                        title="Share & QR Code"
                        className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShareModal({ open: true, token: exp.token })}
                        title="Share"
                        className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {exp.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(exp)}
                      title="Publish"
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-brand-primary border border-brand-primary/30 hover:bg-brand-primary/10 transition-colors"
                    >
                      Publish
                    </button>
                  )}

                  <Link2
                    href={`${ROUTES.CREATE}?draft=${exp.id}`}
                    title="Edit"
                    className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link2>

                  <button
                    onClick={() => handleDuplicate(exp)}
                    disabled={duplicatingId === exp.id}
                    title="Duplicate"
                    className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors disabled:opacity-50"
                  >
                    <Files className="w-4 h-4" />
                  </button>

                  <Link2
                    href={ROUTES.ANALYTICS}
                    title="View Analytics"
                    className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Link2>

                  <button
                    onClick={() => handleArchive(exp)}
                    title={exp.status === 'archived' ? 'Restore' : 'Archive'}
                    className="p-2 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-background transition-colors"
                  >
                    <Archive className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteModal({ open: true, experience: exp })}
                    title="Delete"
                    className="p-2 rounded-lg text-brand-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteModal.open && deleteModal.experience && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteModal({ open: false, experience: null })}
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
                  <h3 className="font-serif text-xl font-bold text-brand-text">Delete Surprise?</h3>
                  <p className="text-brand-muted text-sm mt-1">
                    This will remove <strong>&ldquo;{deleteModal.experience.title}&rdquo;</strong> along with its attachments and recipient access.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-6">
                <p className="text-xs text-red-700 dark:text-red-400">
                  ⚠️ The recipient&apos;s link will stop working immediately. Unrelated surprises and account data will remain untouched.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeleteModal({ open: false, experience: null })}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  loading={isDeleting}
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Confirm Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share & QR modal */}
      <AnimatePresence>
        {shareModal.open && shareModal.token && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShareModal({ open: false, token: null })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-brand-surface rounded-2xl p-6 max-w-md w-full shadow-large border border-brand-border max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShareModal({ open: false, token: null })}
                aria-label="Close share modal"
                className="absolute top-4 right-4 p-1 text-brand-muted hover:text-brand-primary"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="font-serif text-2xl font-bold text-brand-text mb-1">Your surprise is live!</h3>
                <p className="text-brand-muted text-sm">
                  Share this link or QR code with {experiences.find(e => e.token === shareModal.token)?.recipient_name || 'your recipient'}.
                </p>
              </div>

              <div className="mb-4">
                <QRCodeCard
                  url={getExperienceShareUrl(shareModal.token)}
                  label={experiences.find(e => e.token === shareModal.token)?.recipient_name || 'iloveshare'}
                />
              </div>

              <div className="p-3 rounded-xl bg-brand-background border border-brand-border mb-4 flex items-center gap-2">
                <code className="text-xs text-brand-text flex-1 truncate">
                  {getExperienceShareUrl(shareModal.token)}
                </code>
                <button
                  onClick={() => handleCopyLink(shareModal.token!)}
                  aria-label="Copy link"
                  className="p-1.5 rounded-lg text-brand-primary hover:bg-brand-primary/10 flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleCopyLink(shareModal.token!)}
                  className="flex-1 btn-primary"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <a
                  href={`/e/${shareModal.token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
