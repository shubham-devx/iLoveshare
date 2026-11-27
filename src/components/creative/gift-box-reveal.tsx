'use client';

import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

interface GiftBoxRevealProps {
  recipientName: string;
  senderName: string;
  onOpen: () => void;
  accentColor?: string;
  language?: 'en' | 'hi';
}

export function GiftBoxReveal({
  recipientName,
  senderName,
  onOpen,
  accentColor = '#B85C75',
  language = 'en',
}: GiftBoxRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-md mx-auto"
    >
      <motion.button
        type="button"
        onClick={onOpen}
        whileHover={{ scale: 1.06, rotate: [-1, 1, -1, 0] }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="w-36 h-36 mx-auto mb-6 rounded-3xl flex flex-col items-center justify-center shadow-large text-white cursor-pointer relative"
        style={{ backgroundColor: accentColor }}
      >
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-amber-300/60" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-amber-300/60" />
        <Gift className="w-14 h-14 relative z-10" />
      </motion.button>

      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
        {language === 'hi' ? `${recipientName} के लिए एक तोहफ़ा!` : `A Gift for ${recipientName}`}
      </h1>
      <p className="opacity-80 mb-6">
        {language === 'hi'
          ? `${senderName} ने आपके लिए एक खास सरप्राइज भेजा है।`
          : `${senderName} wrapped something special for you. Tap the gift box to open it!`}
      </p>
      <button
        type="button"
        onClick={onOpen}
        className="px-8 py-3.5 rounded-2xl text-white font-semibold shadow-large hover:scale-105 transition-transform"
        style={{ backgroundColor: accentColor }}
      >
        {language === 'hi' ? 'तोहफ़ा खोलें 🎁' : 'Unwrap Gift 🎁'}
      </button>
    </motion.div>
  );
}
