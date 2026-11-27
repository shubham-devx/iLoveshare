'use client';

import { useRef, useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface ScratchCardProps {
  secretText: string;
  accentColor?: string;
  language?: 'en' | 'hi';
}

export function ScratchCard({
  secretText,
  accentColor = '#B85C75',
  language = 'en',
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, accentColor);
    grad.addColorStop(1, '#D9A86C');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      language === 'hi' ? '✨ रहस्य देखने के लिए स्क्रैच करें ✨' : '✨ Scratch here to reveal secret ✨',
      canvas.width / 2,
      canvas.height / 2
    );
  }, [accentColor, language]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Check cleared percentage
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) transparent++;
    }
    const totalSampled = pixels.length / 16;
    if (transparent / totalSampled > 0.45) {
      setRevealed(true);
    }
  };

  return (
    <div className="my-6">
      <div className="flex items-center justify-center gap-1.5 text-xs font-medium opacity-75 mb-2">
        <Sparkles className="w-3.5 h-3.5" />
        {language === 'hi' ? 'स्क्रैच कार्ड' : 'Secret Scratch Card'}
      </div>
      <div className="relative w-full max-w-md mx-auto h-32 rounded-2xl overflow-hidden border border-white/40 bg-white/90 dark:bg-black/30 shadow-soft flex items-center justify-center p-4 text-center">
        <p className="font-serif text-lg font-semibold text-brand-text select-none">
          {secretText}
        </p>
        {!revealed && (
          <canvas
            ref={canvasRef}
            width={360}
            height={128}
            onMouseDown={() => { isDrawingRef.current = true; }}
            onMouseUp={() => { isDrawingRef.current = false; }}
            onMouseLeave={() => { isDrawingRef.current = false; }}
            onMouseMove={(e) => {
              if (isDrawingRef.current) scratch(e.clientX, e.clientY);
            }}
            onTouchStart={(e) => {
              isDrawingRef.current = true;
              const t = e.touches[0];
              if (t) scratch(t.clientX, t.clientY);
            }}
            onTouchMove={(e) => {
              const t = e.touches[0];
              if (t) scratch(t.clientX, t.clientY);
            }}
            onTouchEnd={() => { isDrawingRef.current = false; }}
            className="absolute inset-0 w-full h-full cursor-pointer touch-none"
          />
        )}
      </div>
    </div>
  );
}
