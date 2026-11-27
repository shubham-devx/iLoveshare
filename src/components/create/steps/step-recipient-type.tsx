import { RECIPIENT_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { WizardData } from '../wizard';

export function StepRecipientType({ data, onChange }: { data: WizardData; onChange: (d: Partial<WizardData>) => void }) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-brand-text mb-2">Who is this for?</h2>
      <p className="text-brand-muted text-sm mb-6">Select the relationship with your recipient.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {RECIPIENT_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => onChange({ recipientType: type.id })}
            className={cn(
              'p-4 rounded-2xl border-2 text-center transition-all duration-200 hover:border-brand-primary/50',
              data.recipientType === type.id
                ? 'border-brand-primary bg-brand-primary/10 shadow-soft'
                : 'border-brand-border bg-brand-background'
            )}
          >
            <div className="text-3xl mb-2">{type.emoji}</div>
            <div className={cn(
              'text-sm font-medium',
              data.recipientType === type.id ? 'text-brand-primary' : 'text-brand-text'
            )}>
              {type.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
