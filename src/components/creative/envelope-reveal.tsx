'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

interface EnvelopeRevealProps {
  recipientName: string;
  senderName: string;
  onOpen: () => void;
  accentColor?: string;
  language?: 'en' | 'hi';
}

export function EnvelopeReveal({
  recipientName,
  senderName,
  onOpen,
  accentColor = '#B85C75',
  language = 'en',
}: EnvelopeRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md mx-auto"
    >
      <motion.button
        type="button"
        onClick={onOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="relative w-64 h-44 mx-auto mb-6 rounded-2xl bg-white/90 border-2 border-amber-200 shadow-large flex flex-col items-center justify-center cursor-pointer"
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md mb-2"
          style={{ backgroundColor: accentColor }}
        >
          <Mail className="w-7 h-7" />
        </div>
        <span className="font-serif text-sm font-semibold text-[#392832]">
          {language === 'hi' ? `${recipientName} के नाम` : `For ${recipientName}`}
        </span>
        <span className="text-[11px] text-[#8B7780]">
          {language === 'hi' ? `प्रेषक: ${senderName}` : `From ${senderName}`}
        </span>
      </motion.button>

      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
        {language === 'hi' ? 'आपके लिए एक पत्र है 💌' : 'You Have a Sealed Letter 💌'}
      </h1>
      <p className="opacity-80 mb-6">
        {language === 'hi'
          ? 'लिफ़ाफ़ा खोलने के लिए नीचे टैप करें।'
          : 'Tap below to break the seal and read your message.'}
      </p>
      <button
        type="button"
        onClick={onOpen}
        className="px-8 py-3.5 rounded-2xl text-white font-semibold shadow-large hover:scale-105 transition-transform"
        style={{ backgroundColor: accentColor }}
      >
        {language === 'hi' ? 'लिफ़ाफ़ा खोलें ✉️' : 'Open Envelope ✉️'}
      </button>
    </motion.div>
  );
}
