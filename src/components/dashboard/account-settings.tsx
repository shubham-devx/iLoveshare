'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Trash2, AlertTriangle, Eye, EyeOff, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

interface Props {
  userId: string;
  userEmail: string;
}

export function AccountSettings({ userId, userEmail }: Props) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPw, setIsChangingPw] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success('Signed out successfully.');
    router.push(ROUTES.HOME);
    router.refresh();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setIsChangingPw(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error('Failed to change password: ' + error.message);
    } else {
      toast.success('Password changed successfully! 🔐');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setIsChangingPw(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    setIsDeleting(true);
    const supabase = createClient();
    // Soft-delete profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('profiles') as any).update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    }).eq('id', userId);

    await supabase.auth.signOut();
    toast.success('Account deleted. We\'re sorry to see you go. 💔');
    router.push(ROUTES.HOME);
  };

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-brand-text mb-1">Account Settings</h1>
        <p className="text-brand-muted text-sm">Manage your security and account preferences.</p>
      </div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-soft"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-brand-text">Change Password</h2>
            <p className="text-brand-muted text-xs">Use a strong password of at least 8 characters.</p>
          </div>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full h-11 px-4 pr-10 rounded-xl border border-brand-border bg-brand-background text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full h-11 px-4 pr-10 rounded-xl border border-brand-border bg-brand-background text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" loading={isChangingPw} className="btn-primary">
            Update Password
          </Button>
        </form>
      </motion.div>

      {/* Session / Sign Out */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-soft flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-brand-text">Sign Out</h2>
            <p className="text-brand-muted text-xs">Signed in as {userEmail}</p>
          </div>
        </div>
        <Button
          variant="outline"
          loading={isSigningOut}
          onClick={handleSignOut}
          className="border-brand-border text-brand-text hover:border-red-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-brand-surface rounded-2xl border border-red-200 dark:border-red-900 p-6 shadow-soft"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
            <p className="text-brand-muted text-xs">These actions are irreversible.</p>
          </div>
        </div>
        <p className="text-sm text-brand-muted mb-4">
          Deleting your account will permanently remove all your experiences, attachments, and data.
          This action cannot be undone.
        </p>
        <Button
          variant="outline"
          onClick={() => setShowDeleteModal(true)}
          className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-brand-surface rounded-2xl p-6 max-w-sm w-full border border-red-200 shadow-large">
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="font-serif text-xl font-bold text-brand-text mb-2">Delete Account</h3>
              <p className="text-brand-muted text-sm">
                This will permanently delete your account and all associated data.
                Type <strong>DELETE</strong> to confirm.
              </p>
            </div>
            <input
              type="text"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full h-11 px-4 rounded-xl border border-red-300 bg-brand-background text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-red-300 mb-4"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleDeleteAccount}
                loading={isDeleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white border-0"
              >
                Delete Forever
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
