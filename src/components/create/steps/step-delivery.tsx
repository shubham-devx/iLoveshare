'use client';

import { useState } from 'react';
import { Copy, QrCode, Eye, Calendar, Clock, Send } from 'lucide-react';
import type { WizardData } from '../wizard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { absoluteUrl } from '@/lib/utils';

interface StepDeliveryProps {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
  onPublish: () => Promise<void>;
  isSubmitting: boolean;
}

export function StepDelivery({ data, onChange, onPublish, isSubmitting }: StepDeliveryProps) {
  const [showSchedule, setShowSchedule] = useState(!!data.scheduledAt);
  const [showExpiry, setShowExpiry] = useState(!!data.expiresAt);

  const previewUrl = absoluteUrl('/e/preview');

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-brand-text mb-2">Delivery settings</h2>
      <p className="text-brand-muted text-sm mb-6">Configure when and how your surprise is delivered.</p>

      {/* Summary */}
      <div className="p-5 rounded-2xl bg-brand-primary/5 border border-brand-primary/20 mb-6">
        <h3 className="font-semibold text-sm text-brand-text mb-3">📋 Surprise Summary</h3>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-brand-muted">Type:</span>
            <span className="text-brand-text font-medium capitalize">{data.experienceType?.replace(/_/g, ' ') || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">For:</span>
            <span className="text-brand-text font-medium">{data.recipientName || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">From:</span>
            <span className="text-brand-text font-medium">{data.senderName || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">Theme:</span>
            <span className="text-brand-text font-medium capitalize">{data.theme}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">Animations:</span>
            <span className="text-brand-text font-medium">{data.animations.length} selected</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">Photos:</span>
            <span className="text-brand-text font-medium">{data.attachments.filter(f => f.type.startsWith('image/')).length} attached</span>
          </div>
        </div>
      </div>

      {/* Delivery options */}
      <div className="max-w-lg space-y-4 mb-8">
        {/* Scheduled delivery */}
        <div className="p-4 rounded-xl border border-brand-border bg-brand-background">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-brand-text">
              <Calendar className="w-4 h-4 text-brand-primary" />
              Schedule delivery (optional)
            </div>
            <button
              onClick={() => {
                setShowSchedule(!showSchedule);
                if (showSchedule) onChange({ scheduledAt: '' });
              }}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${showSchedule ? 'bg-brand-primary' : 'bg-brand-border'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm ${showSchedule ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          {showSchedule && (
            <input
              type="datetime-local"
              value={data.scheduledAt}
              onChange={(e) => onChange({ scheduledAt: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-brand-border bg-brand-surface text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          )}
        </div>

        {/* Expiry date */}
        <div className="p-4 rounded-xl border border-brand-border bg-brand-background">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-brand-text">
              <Clock className="w-4 h-4 text-brand-accent" />
              Set expiry date (optional)
            </div>
            <button
              onClick={() => {
                setShowExpiry(!showExpiry);
                if (showExpiry) onChange({ expiresAt: '' });
              }}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${showExpiry ? 'bg-brand-primary' : 'bg-brand-border'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm ${showExpiry ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          {showExpiry && (
            <input
              type="datetime-local"
              value={data.expiresAt}
              onChange={(e) => onChange({ expiresAt: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-brand-border bg-brand-surface text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          )}
        </div>
      </div>

      {/* Publish button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onPublish}
          loading={isSubmitting}
          className="btn-primary flex-1"
          size="lg"
        >
          <Send className="w-5 h-5 mr-2" />
          {data.scheduledAt ? 'Schedule Surprise 📅' : 'Publish & Get Link 🎉'}
        </Button>
      </div>

      <p className="mt-4 text-xs text-brand-muted">
        🔒 A unique, secure link will be generated. Only people with this link can view your surprise.
      </p>
    </div>
  );
}
