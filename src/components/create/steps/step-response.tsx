import { RESPONSE_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { WizardData } from '../wizard';
import { Input } from '@/components/ui/input';

export function StepResponse({ data, onChange }: { data: WizardData; onChange: (d: Partial<WizardData>) => void }) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-brand-text mb-2">Configure response</h2>
      <p className="text-brand-muted text-sm mb-6">What would you like your recipient to respond with?</p>

      <div className="max-w-lg space-y-6">
        <div className="space-y-3">
          {RESPONSE_TYPES.map((rt) => (
            <button
              key={rt.id}
              onClick={() => onChange({ responseType: rt.id })}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all duration-200',
                data.responseType === rt.id
                  ? 'border-brand-primary bg-brand-primary/10'
                  : 'border-brand-border hover:border-brand-primary/40'
              )}
            >
              <div className={cn('font-semibold text-sm', data.responseType === rt.id ? 'text-brand-primary' : 'text-brand-text')}>
                {rt.label}
              </div>
              <div className="text-xs text-brand-muted">{rt.description}</div>
            </button>
          ))}
        </div>

        {data.responseType === 'custom' && (
          <Input
            label="Custom response button label"
            placeholder="e.g. I Accept Your Apology"
            value={data.customResponseLabel}
            onChange={(e) => onChange({ customResponseLabel: e.target.value })}
          />
        )}

        <div className="space-y-3 pt-4 border-t border-brand-border">
          <h3 className="text-sm font-semibold text-brand-text">Feedback options</h3>

          {[
            { key: 'enableStarRating', label: '⭐ Star rating (1–5)', desc: 'Ask recipient to rate the experience' },
            { key: 'enableWrittenFeedback', label: '📝 Written feedback', desc: 'Allow recipient to leave a message' },
          ].map((opt) => (
            <div key={opt.key} className="flex items-center justify-between p-3 rounded-xl border border-brand-border bg-brand-background">
              <div>
                <div className="text-sm font-medium text-brand-text">{opt.label}</div>
                <div className="text-xs text-brand-muted">{opt.desc}</div>
              </div>
              <button
                onClick={() => onChange({ [opt.key]: !data[opt.key as keyof WizardData] } as Partial<WizardData>)}
                className={cn(
                  'w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0',
                  data[opt.key as keyof WizardData] ? 'bg-brand-primary' : 'bg-brand-border'
                )}
              >
                <div className={cn(
                  'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform duration-200 shadow-sm',
                  data[opt.key as keyof WizardData] ? 'translate-x-5' : 'translate-x-0.5'
                )} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
