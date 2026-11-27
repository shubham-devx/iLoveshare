import { useState } from 'react';
import { ANIMATION_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Plus, Trash2, Lock, Sparkles, Globe, Calendar, MapPin } from 'lucide-react';
import type { WizardData } from '../wizard';

const INVITATION_TYPES = ['celebration', 'wedding', 'engagement'];

export function StepAnimations({ data, onChange }: { data: WizardData; onChange: (d: Partial<WizardData>) => void }) {
  const [newMilestone, setNewMilestone] = useState({ date: '', title: '', description: '' });

  const toggleAnimation = (id: string) => {
    const current = data.animations;
    const updated = current.includes(id)
      ? current.filter((a) => a !== id)
      : [...current, id];
    onChange({ animations: updated });
  };

  const addMilestone = () => {
    if (!newMilestone.title.trim()) return;
    onChange({ milestones: [...data.milestones, { ...newMilestone }] });
    setNewMilestone({ date: '', title: '', description: '' });
  };

  const removeMilestone = (index: number) => {
    const updated = [...data.milestones];
    updated.splice(index, 1);
    onChange({ milestones: updated });
  };

  const isInvitation = INVITATION_TYPES.includes(data.experienceType);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-brand-text mb-2">Add animations, music &amp; magic</h2>
        <p className="text-brand-muted text-sm">Customize interactive reveals, language, and special features.</p>
      </div>

      {/* Animations */}
      <div>
        <h3 className="text-sm font-semibold text-brand-text mb-3">Animations &amp; Reveal Style (select any)</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {ANIMATION_OPTIONS.map((anim) => (
            <button
              type="button"
              key={anim.id}
              onClick={() => toggleAnimation(anim.id)}
              className={cn(
                'p-4 rounded-2xl border-2 text-center transition-all duration-200',
                data.animations.includes(anim.id)
                  ? 'border-brand-primary bg-brand-primary/10 shadow-soft'
                  : 'border-brand-border hover:border-brand-primary/40'
              )}
            >
              <div className="text-3xl mb-1">{anim.emoji}</div>
              <div className={cn('text-xs font-medium', data.animations.includes(anim.id) ? 'text-brand-primary' : 'text-brand-muted')}>
                {anim.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Background Music & Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 rounded-xl border border-brand-border bg-brand-background">
          <div>
            <div className="text-sm font-medium text-brand-text">Background Music 🎵</div>
            <div className="text-xs text-brand-muted">Plays after recipient interaction</div>
          </div>
          <button
            type="button"
            onClick={() => onChange({ musicEnabled: !data.musicEnabled })}
            className={cn(
              'w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0',
              data.musicEnabled ? 'bg-brand-primary' : 'bg-brand-border'
            )}
          >
            <div className={cn(
              'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform duration-200 shadow-sm',
              data.musicEnabled ? 'translate-x-5' : 'translate-x-0.5'
            )} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-brand-border bg-brand-background">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-primary" />
            <div>
              <div className="text-sm font-medium text-brand-text">Experience Language</div>
              <div className="text-xs text-brand-muted">UI language for recipient</div>
            </div>
          </div>
          <div className="flex gap-1 bg-brand-surface p-1 rounded-lg border border-brand-border">
            {(['en', 'hi'] as const).map((lang) => (
              <button
                type="button"
                key={lang}
                onClick={() => onChange({ language: lang })}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                  data.language === lang ? 'bg-brand-primary text-white' : 'text-brand-muted hover:text-brand-text'
                )}
              >
                {lang === 'en' ? 'English' : 'हिन्दी'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invitation Event Details */}
      {isInvitation && (
        <div className="p-5 rounded-2xl border border-brand-border bg-brand-background space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-text">
            <Calendar className="w-4 h-4 text-brand-primary" />
            Invitation Event Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="date"
              value={data.eventDetails.eventDate || ''}
              onChange={(e) => onChange({ eventDetails: { ...data.eventDetails, eventDate: e.target.value } })}
              className="h-10 px-3 rounded-xl border border-brand-border bg-brand-surface text-sm text-brand-text"
            />
            <input
              type="time"
              value={data.eventDetails.eventTime || ''}
              onChange={(e) => onChange({ eventDetails: { ...data.eventDetails, eventTime: e.target.value } })}
              className="h-10 px-3 rounded-xl border border-brand-border bg-brand-surface text-sm text-brand-text"
            />
            <div className="relative md:col-span-2">
              <MapPin className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Venue / Location address"
                value={data.eventDetails.location || ''}
                onChange={(e) => onChange({ eventDetails: { ...data.eventDetails, location: e.target.value } })}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-brand-border bg-brand-surface text-sm text-brand-text"
              />
            </div>
            <input
              type="url"
              placeholder="Google Maps link (optional)"
              value={data.eventDetails.mapLink || ''}
              onChange={(e) => onChange({ eventDetails: { ...data.eventDetails, mapLink: e.target.value } })}
              className="md:col-span-2 h-10 px-3 rounded-xl border border-brand-border bg-brand-surface text-sm text-brand-text"
            />
          </div>
        </div>
      )}

      {/* Creative Extras: Scratch Card & Secret Passcode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-brand-border bg-brand-background space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-brand-text">
            <Sparkles className="w-4 h-4 text-brand-accent" />
            Scratch-to-Reveal Secret (optional)
          </div>
          <input
            type="text"
            placeholder="e.g., Dinner at 8 PM tonight! 🍽️"
            value={data.scratchMessage}
            onChange={(e) => onChange({ scratchMessage: e.target.value })}
            className="w-full h-10 px-3 rounded-xl border border-brand-border bg-brand-surface text-sm text-brand-text"
          />
        </div>

        <div className="p-4 rounded-xl border border-brand-border bg-brand-background space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-brand-text">
            <Lock className="w-4 h-4 text-brand-primary" />
            Secret Passcode Lock (optional)
          </div>
          <input
            type="text"
            placeholder="Leave blank for open access"
            value={data.passcode}
            onChange={(e) => onChange({ passcode: e.target.value })}
            className="w-full h-10 px-3 rounded-xl border border-brand-border bg-brand-surface text-sm text-brand-text"
          />
        </div>
      </div>

      {/* Love Timeline / Memory Lane */}
      <div className="p-5 rounded-2xl border border-brand-border bg-brand-background space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-brand-text">Love Timeline / Memory Lane (optional)</h3>
          <p className="text-xs text-brand-muted">Add special milestones or memories to display chronologically.</p>
        </div>

        {data.milestones.length > 0 && (
          <div className="space-y-2">
            {data.milestones.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-brand-surface border border-brand-border">
                <div className="min-w-0">
                  <div className="text-xs text-brand-primary font-medium">{m.date}</div>
                  <div className="text-sm font-semibold text-brand-text truncate">{m.title}</div>
                  {m.description && <div className="text-xs text-brand-muted truncate">{m.description}</div>}
                </div>
                <button
                  type="button"
                  onClick={() => removeMilestone(idx)}
                  className="p-1.5 text-brand-muted hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Date (e.g., May 2023)"
            value={newMilestone.date}
            onChange={(e) => setNewMilestone((prev) => ({ ...prev, date: e.target.value }))}
            className="h-10 px-3 rounded-xl border border-brand-border bg-brand-surface text-sm text-brand-text"
          />
          <input
            type="text"
            placeholder="Milestone title"
            value={newMilestone.title}
            onChange={(e) => setNewMilestone((prev) => ({ ...prev, title: e.target.value }))}
            className="h-10 px-3 rounded-xl border border-brand-border bg-brand-surface text-sm text-brand-text"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Short note"
              value={newMilestone.description}
              onChange={(e) => setNewMilestone((prev) => ({ ...prev, description: e.target.value }))}
              className="flex-1 h-10 px-3 rounded-xl border border-brand-border bg-brand-surface text-sm text-brand-text"
            />
            <button
              type="button"
              onClick={addMilestone}
              className="px-3 h-10 rounded-xl bg-brand-primary text-white text-xs font-medium flex items-center gap-1 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
