'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownGateProps {
  scheduledAt: string;
  recipientName: string;
  senderName: string;
  onUnlock: () => void;
  accentColor?: string;
}

export function CountdownGate({
  scheduledAt,
  recipientName,
  senderName,
  onUnlock,
  accentColor = '#B85C75',
}: CountdownGateProps) {
  const [remaining, setRemaining] = useState(() => Math.max(0, new Date(scheduledAt).getTime() - Date.now()));

  useEffect(() => {
    const interval = window.setInterval(() => {
      const diff = Math.max(0, new Date(scheduledAt).getTime() - Date.now());
      setRemaining(diff);
      if (diff === 0) {
        window.clearInterval(interval);
        onUnlock();
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [scheduledAt, onUnlock]);

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white/85 dark:bg-black/30 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-large">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-5"
          style={{ backgroundColor: accentColor }}
        >
          <Clock className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-2">Almost Time, {recipientName}!</h1>
        <p className="text-sm opacity-75 mb-6">
          {senderName} scheduled this surprise to unlock soon. Come back when the countdown ends!
        </p>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Days', val: days },
            { label: 'Hours', val: hours },
            { label: 'Mins', val: minutes },
            { label: 'Secs', val: seconds },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-2xl bg-black/5 dark:bg-white/10">
              <div className="font-serif text-2xl font-bold">{String(item.val).padStart(2, '0')}</div>
              <div className="text-[10px] uppercase tracking-wider opacity-70">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
