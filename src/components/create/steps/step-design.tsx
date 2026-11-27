import { DESIGN_THEMES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { WizardData } from '../wizard';

export function StepDesign({ data, onChange }: { data: WizardData; onChange: (d: Partial<WizardData>) => void }) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-brand-text mb-2">Choose your design theme</h2>
      <p className="text-brand-muted text-sm mb-6">Select a visual style that matches the emotion you want to express.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {DESIGN_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onChange({ theme: theme.id })}
            className={cn(
              'rounded-2xl border-2 overflow-hidden text-left transition-all duration-200',
              data.theme === theme.id
                ? 'border-brand-primary shadow-medium scale-[1.02]'
                : 'border-brand-border hover:border-brand-primary/40'
            )}
          >
            <div
              className="h-20 w-full"
              style={{ background: `linear-gradient(135deg, ${theme.preview}, ${theme.preview}99)` }}
            />
            <div className="p-3 bg-brand-background">
              <div className={cn('text-sm font-semibold', data.theme === theme.id ? 'text-brand-primary' : 'text-brand-text')}>
                {theme.label}
              </div>
              <div className="text-xs text-brand-muted mt-0.5">{theme.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
