'use client';

import { useState } from 'react';
import { Lock, Unlock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PasscodeGateProps {
  /** The public token of the experience — used to identify it server-side.
   *  The bcrypt hash itself is NEVER sent to the browser. */
  experienceToken: string;
  recipientName: string;
  senderName: string;
  onUnlock: () => void;
  accentColor?: string;
}

export function PasscodeGate({
  experienceToken,
  recipientName,
  senderName,
  onUnlock,
  accentColor = '#B85C75',
}: PasscodeGateProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/passcode/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: experienceToken, passcode: input.trim() }),
      });
      const json = await res.json() as { success?: boolean; error?: string };

      if (json.success) {
        onUnlock();
      } else {
        setError(json.error || 'Incorrect secret code. Please try again.');
        setInput('');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white/90 dark:bg-black/30 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-large">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-5"
          style={{ backgroundColor: accentColor }}
        >
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl font-bold mb-2">Secret Surprise for {recipientName}</h1>
        <p className="text-sm opacity-75 mb-6">
          {senderName} protected this experience with a secret passcode.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter secret passcode..."
            disabled={loading}
            className="w-full h-12 px-4 rounded-xl border border-brand-border bg-white text-brand-text text-center text-base focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button
            type="submit"
            className="w-full text-white"
            style={{ backgroundColor: accentColor }}
            size="lg"
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Unlock className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Checking...' : 'Unlock Surprise'}
          </Button>
        </form>
      </div>
    </div>
  );
}
