import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { WizardData } from '../wizard';

export function StepRecipientInfo({ data, onChange }: { data: WizardData; onChange: (d: Partial<WizardData>) => void }) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-brand-text mb-2">Recipient details</h2>
      <p className="text-brand-muted text-sm mb-6">Tell us about who you&apos;re surprising.</p>

      <div className="space-y-5 max-w-lg">
        <Input
          label="Recipient's name *"
          placeholder="e.g. Priya"
          value={data.recipientName}
          onChange={(e) => onChange({ recipientName: e.target.value })}
        />

        <Input
          label="Your name (Sender) *"
          placeholder="e.g. Rahul"
          value={data.senderName}
          onChange={(e) => onChange({ senderName: e.target.value })}
        />

        <Input
          label="Relationship (optional)"
          placeholder="e.g. Husband, Best friend"
          value={data.relationship}
          onChange={(e) => onChange({ relationship: e.target.value })}
        />

        <Textarea
          label="Personal greeting (optional)"
          placeholder="A short personal greeting that shows before the main experience..."
          value={data.personalGreeting}
          onChange={(e) => onChange({ personalGreeting: e.target.value })}
          className="h-24"
        />
      </div>
    </div>
  );
}
