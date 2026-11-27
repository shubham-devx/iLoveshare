'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface QRCodeCardProps {
  url: string;
  label?: string;
  size?: number;
}

export function QRCodeCard({ url, label = 'iloveshare-surprise', size = 200 }: QRCodeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !url) return;
    QRCode.toCanvas(
      canvasRef.current,
      url,
      {
        width: size,
        margin: 2,
        color: {
          dark: '#392832',
          light: '#FFFFFF',
        },
      },
      (err) => {
        if (!err) setReady(true);
      }
    );
  }, [url, size]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${label.replace(/[^a-z0-9-_]/gi, '-').toLowerCase()}-qr.png`;
    a.click();
    toast.success('QR code downloaded!');
  };

  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white border border-brand-border">
      <canvas ref={canvasRef} className="rounded-xl" />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDownload}
        disabled={!ready}
        className="w-full"
      >
        <Download className="w-4 h-4 mr-2" />
        Download QR Code (PNG)
      </Button>
    </div>
  );
}
