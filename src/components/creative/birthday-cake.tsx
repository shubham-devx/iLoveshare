'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, VolumeX, Sparkles } from 'lucide-react';

interface BirthdayCakeProps {
  recipientName: string;
  accentColor?: string;
  language?: 'en' | 'hi';
}

const HAPPY_BIRTHDAY_NOTES: Array<[number, number]> = [
  [261.63, 0.3], [261.63, 0.3], [293.66, 0.6], [261.63, 0.6], [349.23, 0.6], [329.63, 1.0],
  [261.63, 0.3], [261.63, 0.3], [293.66, 0.6], [261.63, 0.6], [392.00, 0.6], [349.23, 1.0],
  [261.63, 0.3], [261.63, 0.3], [523.25, 0.6], [440.00, 0.6], [349.23, 0.6], [329.63, 0.6], [293.66, 1.0],
  [466.16, 0.3], [466.16, 0.3], [440.00, 0.6], [349.23, 0.6], [392.00, 0.6], [349.23, 1.2],
];

export function BirthdayCake({
  recipientName,
  accentColor = '#B85C75',
  language = 'en',
}: BirthdayCakeProps) {
  const [candlesLit, setCandlesLit] = useState([true, true, true, true, true]);
  const [tunePlaying, setTunePlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const allBlownOut = candlesLit.every((c) => !c);

  const stopTune = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setTunePlaying(false);
  };

  useEffect(() => {
    return () => {
      stopTune();
    };
  }, []);

  const playBirthdayTune = () => {
    if (tunePlaying) {
      stopTune();
      return;
    }

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;
    setTunePlaying(true);

    let time = ctx.currentTime + 0.05;
    HAPPY_BIRTHDAY_NOTES.forEach(([freq, dur]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(0.18, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + dur * 0.95);
      time += dur * 0.65;
    });

    const totalMs = (time - ctx.currentTime) * 1000;
    const endId = window.setTimeout(() => {
      setTunePlaying(false);
    }, totalMs);
    timeoutsRef.current.push(endId);
  };

  const toggleCandle = (index: number) => {
    setCandlesLit((prev) => prev.map((lit, i) => (i === index ? !lit : lit)));
  };

  const blowAllCandles = () => {
    setCandlesLit([false, false, false, false, false]);
  };

  const relightCandles = () => {
    setCandlesLit([true, true, true, true, true]);
  };

  return (
    <div className="my-6 p-6 rounded-3xl bg-white/80 dark:bg-black/25 backdrop-blur-md border border-white/40 shadow-medium text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          type="button"
          onClick={playBirthdayTune}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white shadow-soft transition-transform hover:scale-105"
          style={{ backgroundColor: accentColor }}
        >
          {tunePlaying ? <VolumeX className="w-4 h-4" /> : <Music className="w-4 h-4" />}
          {tunePlaying
            ? language === 'hi' ? 'संगीत रोकें' : 'Stop Birthday Tune'
            : language === 'hi' ? 'जन्मदिन की धुन बजाएं 🎵' : 'Play Birthday Tune 🎵'}
        </button>
      </div>

      {/* Cake illustration */}
      <div className="relative inline-block pt-10 pb-2 select-none">
        {/* Candles */}
        <div className="flex justify-center gap-4 mb-1">
          {candlesLit.map((lit, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleCandle(i)}
              aria-label={`Candle ${i + 1}`}
              className="relative flex flex-col items-center group cursor-pointer focus:outline-none"
            >
              {lit ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 0.95, 1.15, 1], rotate: [-4, 4, -3, 3, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                  className="w-3 h-5 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 shadow-[0_0_12px_rgba(251,191,36,0.9)] mb-0.5"
                />
              ) : (
                <div className="w-3 h-5 flex items-end justify-center mb-0.5 text-[10px] opacity-60">
                  💨
                </div>
              )}
              <div className="w-2.5 h-8 rounded-t-sm bg-gradient-to-b from-pink-300 to-rose-400 border border-white/50" />
            </button>
          ))}
        </div>

        {/* Top tier */}
        <div className="w-44 h-10 mx-auto rounded-t-2xl bg-gradient-to-b from-[#FFF0F3] to-[#F5C6D0] border-b-4 border-[#E8A0AD] relative shadow-sm flex items-center justify-center">
          <span className="text-[11px] font-serif font-semibold text-[#392832] truncate px-3">
            {recipientName}
          </span>
        </div>
        {/* Bottom tier */}
        <div className="w-56 h-12 mx-auto rounded-t-xl rounded-b-lg bg-gradient-to-b from-[#E8A0AD] to-[#B85C75] shadow-md flex items-center justify-around px-4">
          <span className="text-xs">🍓</span>
          <span className="text-xs">✨</span>
          <span className="text-xs">🍓</span>
        </div>
        {/* Plate */}
        <div className="w-64 h-3 mx-auto rounded-full bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 shadow" />
      </div>

      <div className="mt-4">
        {allBlownOut ? (
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {language === 'hi'
                ? 'आपकी सभी इच्छाएँ पूरी हों! ✨'
                : 'Make a wish! May all your dreams come true! ✨'}
            </p>
            <button
              type="button"
              onClick={relightCandles}
              className="text-xs underline opacity-70 hover:opacity-100"
            >
              {language === 'hi' ? 'मोमबत्तियाँ फिर से जलाएं' : 'Relight candles'}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs opacity-75">
              {language === 'hi'
                ? 'मोमबत्तियाँ बुझाने के लिए उन पर टैप करें!'
                : 'Tap any candle to blow it out, or blow them all out!'}
            </p>
            <button
              type="button"
              onClick={blowAllCandles}
              className="px-4 py-1.5 rounded-full text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
            >
              {language === 'hi' ? 'सभी मोमबत्तियाँ बुझाएं 🌬️' : 'Blow Out All Candles 🌬️'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
