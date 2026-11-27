import { EXPERIENCE_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { WizardData } from '../wizard';

export function StepExperienceType({ data, onChange }: { data: WizardData; onChange: (d: Partial<WizardData>) => void }) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-brand-text mb-2">What type of experience?</h2>
      <p className="text-brand-muted text-sm mb-6">Choose the occasion you&apos;re celebrating.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {EXPERIENCE_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => onChange({ experienceType: type.id })}
            className={cn(
              'p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:border-brand-primary/50',
              data.experienceType === type.id
                ? 'border-brand-primary bg-brand-primary/10 shadow-soft'
                : 'border-brand-border bg-brand-background'
            )}
          >
            <div className="text-3xl mb-2">{type.emoji}</div>
            <div className={cn('text-sm font-semibold mb-1', data.experienceType === type.id ? 'text-brand-primary' : 'text-brand-text')}>
              {type.label}
            </div>
            <div className="text-xs text-brand-muted">{type.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
