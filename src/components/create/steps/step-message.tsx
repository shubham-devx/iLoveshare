'use client';

import { useState } from 'react';
import type { WizardData } from '../wizard';
import { cn } from '@/lib/utils';

const SUGGESTIONS: Record<string, string[]> = {
  birthday: [
    'Wishing you a day filled with laughter, love, and all the things that bring you joy.',
    'On your special day, I want you to know just how much you mean to me.',
    'May this birthday mark the beginning of the most beautiful chapter of your life.',
  ],
  anniversary: [
    'Every day with you is a gift. Thank you for being my greatest adventure.',
    'Looking back, I cannot imagine a single day without you by my side.',
    'You are my today and all of my tomorrows.',
  ],
  proposal: [
    'You are the person I want to wake up next to every single morning.',
    'I knew the moment I met you that you were the one.',
    'Life is better, brighter, and more beautiful because of you.',
  ],
  default: [
    'You deserve every happiness this world has to offer.',
    'Thinking of you and wanted to make you smile.',
    'You mean more to me than words can express.',
  ],
};

export function StepMessage({ data, onChange }: { data: WizardData; onChange: (d: Partial<WizardData>) => void }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = SUGGESTIONS[data.experienceType] || SUGGESTIONS.default;
  const charCount = data.message.length;
  const maxChars = 2000;

  const insertSuggestion = (text: string) => {
    onChange({ message: data.message ? `${data.message}\n\n${text}` : text });
    setShowSuggestions(false);
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-brand-text mb-2">Write your message</h2>
      <p className="text-brand-muted text-sm mb-6">
        Pour your heart out. This is what {data.recipientName || 'your recipient'} will read.
      </p>

      <div className="max-w-2xl">
        {/* Quick suggestions */}
        <div className="mb-4">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-sm text-brand-primary hover:underline"
          >
            ✨ Show message suggestions
          </button>
          {showSuggestions && (
            <div className="mt-3 space-y-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => insertSuggestion(s)}
                  className="w-full text-left p-3 rounded-xl border border-brand-border bg-brand-background hover:border-brand-primary/40 text-sm text-brand-muted hover:text-brand-text transition-all"
                >
                  &ldquo;{s}&rdquo;
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message editor */}
        <div className="relative">
          <textarea
            value={data.message}
            onChange={(e) => onChange({ message: e.target.value.slice(0, maxChars) })}
            placeholder={`Write your heartfelt message for ${data.recipientName || 'your recipient'}...\n\nYou can write multiple paragraphs. Express everything you feel.`}
            className="w-full min-h-[300px] p-5 rounded-2xl border border-brand-border bg-brand-background text-brand-text placeholder:text-brand-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-none leading-relaxed"
          />
          <div className={cn(
            'absolute bottom-3 right-3 text-xs',
            charCount > maxChars * 0.9 ? 'text-brand-primary' : 'text-brand-muted'
          )}>
            {charCount}/{maxChars}
          </div>
        </div>

        {!data.message && (
          <p className="mt-2 text-xs text-red-500">Please write a message to continue.</p>
        )}
      </div>
    </div>
  );
}
