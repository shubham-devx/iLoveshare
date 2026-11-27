'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Edit2, Save, Camera } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Profile } from '@/types/database';

interface Props {
  profile: Profile | null;
  userEmail: string;
}

export function ProfileSettings({ profile, userEmail }: Props) {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('profiles') as any)
      .update({ full_name: fullName, bio, updated_at: new Date().toISOString() })
      .eq('id', profile?.id);

    if (error) {
      toast.error('Failed to update profile: ' + error.message);
    } else {
      toast.success('Profile updated! 🎉');
      setEditing(false);
    }
    setIsSaving(false);
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-brand-text mb-1">Your Profile</h1>
        <p className="text-brand-muted text-sm">Manage your personal information.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-soft"
      >
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-2xl font-bold">
              {(fullName || userEmail || 'U')[0].toUpperCase()}
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-brand-text text-lg">{fullName || 'Your Name'}</h2>
            <p className="text-brand-muted text-sm">{userEmail}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">Full Name</label>
            {editing ? (
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-brand-border bg-brand-background text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              />
            ) : (
              <p className="text-brand-text">{fullName || '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">Email Address</label>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-muted" />
              <span className="text-brand-muted text-sm">{userEmail}</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">Bio</label>
            {editing ? (
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                placeholder="Tell us a little about yourself..."
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-background text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 resize-none"
              />
            ) : (
              <p className="text-brand-muted text-sm">{bio || 'No bio added yet.'}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          {editing ? (
            <>
              <Button onClick={handleSave} loading={isSaving} className="btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)} variant="outline">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
