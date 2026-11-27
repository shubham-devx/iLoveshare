'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, generateToken } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { StepRecipientType } from './steps/step-recipient-type';
import { StepExperienceType } from './steps/step-experience-type';
import { StepRecipientInfo } from './steps/step-recipient-info';
import { StepMessage } from './steps/step-message';
import { StepAttachments } from './steps/step-attachments';
import { StepDesign } from './steps/step-design';
import { StepAnimations } from './steps/step-animations';
import { StepResponse } from './steps/step-response';
import { StepDelivery } from './steps/step-delivery';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { Experience, EventDetails, TimelineMilestone } from '@/types/database';

export interface WizardData {
  recipientType: string;
  experienceType: string;
  recipientName: string;
  senderName: string;
  relationship: string;
  personalGreeting: string;
  message: string;
  theme: string;
  animations: string[];
  musicEnabled: boolean;
  musicUrl: string;
  responseType: string;
  customResponseLabel: string;
  enableStarRating: boolean;
  enableWrittenFeedback: boolean;
  scheduledAt: string;
  expiresAt: string;
  attachments: File[];
  passcode: string;
  language: 'en' | 'hi';
  scratchMessage: string;
  eventDetails: EventDetails;
  milestones: TimelineMilestone[];
  groupDelivery: boolean;
  lockAfterResponse: boolean;
}

const STEPS = [
  { id: 1, title: 'Recipient', label: 'Who is this for?' },
  { id: 2, title: 'Experience', label: 'What type?' },
  { id: 3, title: 'Info', label: 'Recipient details' },
  { id: 4, title: 'Message', label: 'Your message' },
  { id: 5, title: 'Media', label: 'Photos & files' },
  { id: 6, title: 'Design', label: 'Choose theme' },
  { id: 7, title: 'Animation', label: 'Add magic' },
  { id: 8, title: 'Response', label: 'Set response' },
  { id: 9, title: 'Deliver', label: 'Publish' },
];

interface Props {
  userId: string;
  initialType?: string;
  draftId?: string;
  initialExperience?: Experience | null;
}

export function ExperienceWizard({ userId, initialType, draftId, initialExperience }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(initialType && !initialExperience ? 2 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<WizardData>({
    recipientType: initialExperience?.recipient_type || '',
    experienceType: initialExperience?.type || initialType || '',
    recipientName: initialExperience?.recipient_name || '',
    senderName: initialExperience?.sender_name || '',
    relationship: initialExperience?.relationship || '',
    personalGreeting: initialExperience?.personal_greeting || '',
    message: initialExperience?.message || '',
    theme: initialExperience?.theme || 'romantic',
    animations: initialExperience?.animations || ['confetti', 'hearts'],
    musicEnabled: initialExperience?.music_enabled || false,
    musicUrl: initialExperience?.music_url || '',
    responseType: initialExperience?.response_type || 'thank_you',
    customResponseLabel: initialExperience?.custom_response_label || '',
    enableStarRating: initialExperience?.enable_star_rating ?? true,
    enableWrittenFeedback: initialExperience?.enable_written_feedback ?? true,
    scheduledAt: initialExperience?.scheduled_at ? initialExperience.scheduled_at.slice(0, 16) : '',
    expiresAt: initialExperience?.expires_at ? initialExperience.expires_at.slice(0, 16) : '',
    attachments: [],
    passcode: initialExperience?.passcode || '',
    language: initialExperience?.language || 'en',
    scratchMessage: initialExperience?.scratch_message || '',
    eventDetails: initialExperience?.event_details || {},
    milestones: initialExperience?.milestones || [],
    groupDelivery: initialExperience?.group_delivery || false,
    lockAfterResponse: initialExperience?.lock_after_response || false,
  });

  const updateData = useCallback((updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!data.recipientType;
      case 2: return !!data.experienceType;
      case 3: return !!data.recipientName && !!data.senderName;
      case 4: return !!data.message;
      case 5: return true;
      case 6: return !!data.theme;
      case 7: return true;
      case 8: return !!data.responseType;
      case 9: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const buildPayload = (status: 'draft' | 'published', token: string, title: string) => ({
    user_id: userId,
    title,
    type: data.experienceType || 'custom',
    recipient_type: data.recipientType || 'other',
    recipient_name: data.recipientName || 'Recipient',
    sender_name: data.senderName || 'Sender',
    relationship: data.relationship || null,
    personal_greeting: data.personalGreeting || null,
    message: data.message || null,
    theme: data.theme,
    animations: data.animations,
    music_enabled: data.musicEnabled,
    music_url: data.musicUrl || null,
    response_type: data.responseType,
    custom_response_label: data.customResponseLabel || null,
    enable_star_rating: data.enableStarRating,
    enable_written_feedback: data.enableWrittenFeedback,
    passcode: data.passcode || null,
    language: data.language,
    scratch_message: data.scratchMessage || null,
    event_details: data.eventDetails,
    milestones: data.milestones,
    group_delivery: data.groupDelivery,
    lock_after_response: data.lockAfterResponse,
    token,
    status,
    scheduled_at: data.scheduledAt || null,
    expires_at: data.expiresAt || null,
    published_at: status === 'published' && !data.scheduledAt ? new Date().toISOString() : null,
  });

  const handleSaveDraft = async () => {
    const supabase = createClient();
    const token = initialExperience?.token || generateToken(32);
    const title = data.recipientName
      ? `${data.experienceType.replace(/_/g, ' ')} for ${data.recipientName}`
      : 'Untitled Surprise';

    const payload = buildPayload('draft', token, title);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from('experiences') as any;
    const { error } = draftId && initialExperience
      ? await table.update(payload).eq('id', draftId).eq('user_id', userId)
      : await table.insert(payload);

    if (error) {
      toast.error('Failed to save draft: ' + error.message);
    } else {
      toast.success('Draft saved!');
      router.push(ROUTES.DRAFTS);
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    const supabase = createClient();
    const token = initialExperience?.token || generateToken(32);
    const title = `${data.experienceType.replace(/_/g, ' ')} for ${data.recipientName}`;
    const targetStatus: 'draft' | 'published' = data.scheduledAt ? 'draft' : 'published';
    const payload = buildPayload(targetStatus, token, title);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const table = supabase.from('experiences') as any;
      const { data: experience, error } = (draftId && initialExperience
        ? await table.update(payload).eq('id', draftId).eq('user_id', userId).select().single()
        : await table.insert(payload).select().single()) as {
        data: { id: string; token: string } | null;
        error: Error | null;
      };

      if (error) throw error;
      if (!experience) throw new Error('Failed to save experience');

      // Upload attachments
      if (data.attachments.length > 0) {
        for (const file of data.attachments) {
          const fileExt = file.name.split('.').pop();
          const path = `${userId}/${experience.id}/${Date.now()}.${fileExt}`;
          const bucket = file.type.startsWith('image/')
            ? 'experience-photos'
            : file.type === 'application/pdf'
            ? 'experience-pdfs'
            : 'experience-audio';

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(path, file, { cacheControl: '3600', upsert: false });

          if (!uploadError && uploadData) {
            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase.from('experience_attachments') as any).insert({
              experience_id: experience.id,
              user_id: userId,
              type: file.type.startsWith('image/') ? 'photo' : file.type === 'application/pdf' ? 'pdf' : 'audio',
              url: publicUrl,
              file_name: file.name,
              file_size: file.size,
              mime_type: file.type,
              storage_path: path,
            });
          }
        }
      }

      toast.success('🎉 Surprise published! Share the link with your recipient.');
      router.push(`${ROUTES.SURPRISES}?published=${experience.token}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error('Failed to publish: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepComponents: Record<number, React.ReactNode> = {
    1: <StepRecipientType data={data} onChange={updateData} />,
    2: <StepExperienceType data={data} onChange={updateData} />,
    3: <StepRecipientInfo data={data} onChange={updateData} />,
    4: <StepMessage data={data} onChange={updateData} />,
    5: <StepAttachments data={data} onChange={updateData} />,
    6: <StepDesign data={data} onChange={updateData} />,
    7: <StepAnimations data={data} onChange={updateData} />,
    8: <StepResponse data={data} onChange={updateData} />,
    9: <StepDelivery data={data} onChange={updateData} onPublish={handlePublish} isSubmitting={isSubmitting} />,
  };

  return (
    <div className="bg-brand-surface rounded-3xl border border-brand-border shadow-soft overflow-hidden">
      {/* Progress bar */}
      <div className="px-6 pt-6 pb-4 border-b border-brand-border">
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  step.id === currentStep
                    ? 'bg-brand-primary text-white'
                    : step.id < currentStep
                    ? 'bg-brand-primary/20 text-brand-primary cursor-pointer hover:bg-brand-primary/30'
                    : 'bg-brand-background text-brand-muted cursor-not-allowed'
                )}
              >
                {step.id < currentStep ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-[10px]">
                    {step.id}
                  </span>
                )}
                <span className="hidden sm:inline">{step.title}</span>
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight className="w-3 h-3 text-brand-muted flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Current step info */}
        <div className="mt-3">
          <div className="text-sm text-brand-muted">
            Step {currentStep} of {STEPS.length}:{' '}
            <span className="font-medium text-brand-text">
              {STEPS[currentStep - 1]?.label}
            </span>
          </div>
          <div className="mt-2 h-1 bg-brand-background rounded-full">
            <div
              className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {stepComponents[currentStep]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-6 flex items-center justify-between border-t border-brand-border pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" onClick={handleSaveDraft} className="text-brand-muted">
            Save as Draft
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className="btn-primary flex items-center gap-2"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
