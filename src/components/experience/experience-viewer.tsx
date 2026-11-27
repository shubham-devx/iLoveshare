'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Volume2,
  VolumeX,
  Star,
  Send,
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  FileText,
  Download,
  Globe,
} from 'lucide-react';
import type { Experience, ExperienceAttachment } from '@/types/database';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { BirthdayCake } from '@/components/creative/birthday-cake';
import { ScratchCard } from '@/components/creative/scratch-card';
import { GiftBoxReveal } from '@/components/creative/gift-box-reveal';
import { EnvelopeReveal } from '@/components/creative/envelope-reveal';
import { LoveTimeline } from '@/components/creative/love-timeline';
import { CountdownGate } from '@/components/creative/countdown-gate';
import { PasscodeGate } from '@/components/creative/passcode-gate';

interface Props {
  experience: Experience;
  attachments: ExperienceAttachment[];
  initiallyScheduledFuture?: boolean;
}

type Phase = 'welcome' | 'reveal' | 'gallery' | 'respond' | 'feedback' | 'complete';

const CONFETTI_PIECES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: (i * 29 + 7) % 100,
  rotate: ((i * 73) % 720) - 360,
  duration: 2.2 + (i % 5) * 0.5,
  delay: (i % 7) * 0.3,
}));

const FLOATING_HEARTS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: (i * 31 + 11) % 95,
  duration: 2.5 + (i % 4) * 0.6,
  delay: (i % 6) * 0.5,
}));

export function ExperienceViewer({
  experience,
  attachments,
  initiallyScheduledFuture = false,
}: Props) {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [responseValue, setResponseValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>(experience.language || 'en');
  const [countdownDone, setCountdownDone] = useState(!initiallyScheduledFuture);
  const [passcodeUnlocked, setPasscodeUnlocked] = useState(!experience.passcode);
  const audioRef = useRef<HTMLAudioElement>(null);

  const photos = attachments.filter((a) => a.type === 'photo');
  const audios = attachments.filter((a) => a.type === 'audio');
  const pdfs = attachments.filter((a) => a.type === 'pdf');

  const themeConfig = {
    romantic: { bg: 'from-[#FFF0F3] to-[#FFE4EA]', accent: '#B85C75', textColor: '#392832' },
    floral: { bg: 'from-[#FFF8F0] to-[#FEECD3]', accent: '#D9A86C', textColor: '#392832' },
    minimal: { bg: 'from-[#F8F8F8] to-[#EFEFEF]', accent: '#392832', textColor: '#392832' },
    cinematic: { bg: 'from-[#1A1A2E] to-[#16213E]', accent: '#E94560', textColor: '#FFFFFF' },
    dreamy: { bg: 'from-[#F3E7FF] to-[#E8D5FF]', accent: '#9B59B6', textColor: '#392832' },
    royal: { bg: 'from-[#FDF6E0] to-[#F7E8C0]', accent: '#D4AF37', textColor: '#392832' },
    cute: { bg: 'from-[#FFF0F5] to-[#FFD6E7]', accent: '#FF6B9D', textColor: '#392832' },
    elegant: { bg: 'from-[#F5F5F5] to-[#E8E0E5]', accent: '#8B7780', textColor: '#392832' },
    celebration: { bg: 'from-[#FFF8E1] to-[#FFE57F]', accent: '#FF6B35', textColor: '#392832' },
  };

  const theme = themeConfig[experience.theme as keyof typeof themeConfig] || themeConfig.romantic;
  const hasAnimations = experience.animations || [];

  const experienceEmojis: Record<string, string> = {
    birthday: '🎂',
    anniversary: '💑',
    love_letter: '💌',
    proposal: '💍',
    relationship_proposal: '🌹',
    sorry: '🕊️',
    celebration: '🎉',
    wedding: '💒',
    engagement: '💎',
    congratulations: '🏆',
    thank_you: '🙏',
    custom: '✨',
  };

  const experienceEmoji = experienceEmojis[experience.type] || '✨';

  // Lock check after response if configured
  if (
    experience.lock_after_response &&
    !experience.group_delivery &&
    (experience.response_count || 0) > 0 &&
    !submitted
  ) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-6 text-center`}
        style={{ color: theme.textColor }}
      >
        <div className="max-w-md bg-white/85 dark:bg-black/30 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-large">
          <div className="text-5xl mb-4">💝</div>
          <h1 className="font-serif text-2xl font-bold mb-2">
            {language === 'hi' ? 'प्रतिक्रिया पहले ही दर्ज हो चुकी है' : 'Response Already Recorded'}
          </h1>
          <p className="text-sm opacity-75 mb-6">
            {language === 'hi'
              ? `${experience.recipient_name}, इस सरप्राइज के लिए आपकी प्रतिक्रिया सुरक्षित रूप से दर्ज की जा चुकी है।`
              : `Thank you, ${experience.recipient_name}! A response for this experience has already been submitted.`}
          </p>
          <Link href="/" className="text-sm underline opacity-75 hover:opacity-100">
            Powered by iLoveShare
          </Link>
        </div>
      </div>
    );
  }

  // Countdown gate
  if (!countdownDone && experience.scheduled_at) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg}`} style={{ color: theme.textColor }}>
        <CountdownGate
          scheduledAt={experience.scheduled_at}
          recipientName={experience.recipient_name}
          senderName={experience.sender_name}
          onUnlock={() => setCountdownDone(true)}
          accentColor={theme.accent}
        />
      </div>
    );
  }

  // Secret passcode gate
  if (!passcodeUnlocked && experience.passcode) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg}`} style={{ color: theme.textColor }}>
        <PasscodeGate
          expectedPasscode={experience.passcode}
          recipientName={experience.recipient_name}
          senderName={experience.sender_name}
          onUnlock={() => setPasscodeUnlocked(true)}
          accentColor={theme.accent}
        />
      </div>
    );
  }

  const handlePlayMusic = () => {
    if (audioRef.current && audios.length > 0) {
      if (musicPlaying) {
        audioRef.current.pause();
        setMusicPlaying(false);
      } else {
        audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {});
      }
    }
  };

  const handleOpenExperience = () => {
    if (experience.music_enabled && audioRef.current && audios.length > 0) {
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {});
    }
    setPhase('reveal');
  };

  const handleRespond = async (value: string) => {
    if (submitted) return;
    setResponseValue(value);

    if (!experience.enable_star_rating && !experience.enable_written_feedback) {
      await submitResponse(value, 0, '');
    } else {
      setPhase('feedback');
    }
  };

  const submitResponse = async (value: string, stars: number, fbText: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: experience.token,
          response_type: experience.response_type,
          response_value: value,
          respondent_name: experience.recipient_name,
          star_rating: stars > 0 ? stars : null,
          written_feedback: fbText.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to submit response. Please try again.');
      } else {
        setSubmitted(true);
        setPhase('complete');
        toast.success('Response sent! 💕');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFeedback = () => {
    submitResponse(responseValue, rating, feedback);
  };

  const eventDetails = experience.event_details;
  const hasEventDetails =
    eventDetails &&
    (eventDetails.eventDate || eventDetails.eventTime || eventDetails.location || eventDetails.mapLink);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.bg} relative overflow-hidden`}
      style={{ color: theme.textColor }}
    >
      {/* Background animations */}
      {hasAnimations.includes('confetti') && phase !== 'welcome' && <ConfettiEffect />}
      {hasAnimations.includes('hearts') && phase !== 'welcome' && <FloatingHeartsEffect />}
      {hasAnimations.includes('balloons') && phase !== 'welcome' && <BalloonsEffect />}
      {hasAnimations.includes('flowers') && phase !== 'welcome' && <FlowersEffect />}
      {hasAnimations.includes('fireworks') && phase !== 'welcome' && <FireworksEffect />}

      {/* Audio player (hidden) */}
      {audios.length > 0 && <audio ref={audioRef} src={audios[0].url} loop />}

      {/* Top right controls: Language toggle + Music */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
          className="px-3 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-medium flex items-center gap-1.5 text-xs font-semibold hover:scale-105 transition-transform text-[#392832]"
          aria-label="Toggle language"
        >
          <Globe className="w-3.5 h-3.5" style={{ color: theme.accent }} />
          {language === 'en' ? 'हिन्दी' : 'English'}
        </button>

        {audios.length > 0 && (
          <button
            type="button"
            onClick={handlePlayMusic}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-medium flex items-center justify-center hover:scale-105 transition-transform"
            aria-label="Toggle music"
          >
            {musicPlaying ? (
              <Volume2 className="w-5 h-5" style={{ color: theme.accent }} />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-500" />
            )}
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative z-20">
        <AnimatePresence mode="wait">
          {/* PHASE 1: WELCOME */}
          {phase === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full"
            >
              {hasAnimations.includes('gift') ? (
                <GiftBoxReveal
                  recipientName={experience.recipient_name}
                  senderName={experience.sender_name}
                  onOpen={handleOpenExperience}
                  accentColor={theme.accent}
                  language={language}
                />
              ) : hasAnimations.includes('envelope') ? (
                <EnvelopeReveal
                  recipientName={experience.recipient_name}
                  senderName={experience.sender_name}
                  onOpen={handleOpenExperience}
                  accentColor={theme.accent}
                  language={language}
                />
              ) : (
                <div className="text-center max-w-lg mx-auto">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-7xl mb-6"
                  >
                    {experienceEmoji}
                  </motion.div>

                  <p className="text-sm uppercase tracking-widest opacity-60 mb-2">
                    {language === 'hi' ? 'खास आपके लिए' : 'A Special Surprise For'}
                  </p>
                  <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                    {experience.recipient_name}
                  </h1>
                  <p className="opacity-75 text-lg mb-8">
                    {language === 'hi' ? (
                      <>
                        <span className="font-semibold">{experience.sender_name}</span> ने आपके लिए कुछ खास बनाया है
                      </>
                    ) : (
                      <>
                        From <span className="font-semibold">{experience.sender_name}</span> — created just for you
                      </>
                    )}
                  </p>

                  {experience.personal_greeting && (
                    <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/40 mb-8 italic">
                      &ldquo;{experience.personal_greeting}&rdquo;
                    </div>
                  )}

                  <Button
                    size="xl"
                    onClick={handleOpenExperience}
                    className="px-10 py-4 text-base shadow-large hover:scale-105 transition-transform text-white"
                    style={{ backgroundColor: theme.accent }}
                  >
                    {language === 'hi' ? 'अपना सरप्राइज खोलें ✨' : 'Open Your Surprise ✨'}
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* PHASE 2: REVEAL */}
          {phase === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="max-w-2xl w-full"
            >
              <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-large border border-white/50">
                <div className="text-center mb-6">
                  <span className="text-5xl mb-3 block">{experienceEmoji}</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold mb-1">
                    {language === 'hi' ? `प्रिय ${experience.recipient_name},` : `Dear ${experience.recipient_name},`}
                  </h2>
                  {experience.relationship && (
                    <p className="text-sm opacity-60">{experience.relationship}</p>
                  )}
                </div>

                {/* Birthday Cake + Tune */}
                {(experience.type === 'birthday' || hasAnimations.includes('cake')) && (
                  <BirthdayCake
                    recipientName={experience.recipient_name}
                    accentColor={theme.accent}
                    language={language}
                  />
                )}

                {/* Event details for invitations */}
                {hasEventDetails && (
                  <div className="my-6 p-5 rounded-2xl bg-black/5 dark:bg-white/10 border border-white/30 space-y-2.5 text-sm">
                    <h3 className="font-serif font-bold text-base mb-2">
                      {language === 'hi' ? 'कार्यक्रम विवरण' : 'Event Details'}
                    </h3>
                    {eventDetails.eventDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 opacity-70" />
                        <span>{eventDetails.eventDate}</span>
                      </div>
                    )}
                    {eventDetails.eventTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 opacity-70" />
                        <span>{eventDetails.eventTime}</span>
                      </div>
                    )}
                    {eventDetails.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 opacity-70" />
                        <span>{eventDetails.location}</span>
                      </div>
                    )}
                    {eventDetails.mapLink && (
                      <a
                        href={eventDetails.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold underline mt-1"
                        style={{ color: theme.accent }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {language === 'hi' ? 'मैप पर देखें' : 'Open in Google Maps'}
                      </a>
                    )}
                  </div>
                )}

                {/* Message */}
                <div className="prose prose-sm md:prose-base max-w-none mb-8 whitespace-pre-wrap leading-relaxed text-center font-serif text-lg md:text-xl">
                  {experience.message}
                </div>

                {/* Scratch Card */}
                {experience.scratch_message && (
                  <ScratchCard
                    secretText={experience.scratch_message}
                    accentColor={theme.accent}
                    language={language}
                  />
                )}

                {/* Love Timeline / Memory Lane */}
                {experience.milestones && experience.milestones.length > 0 && (
                  <LoveTimeline
                    milestones={experience.milestones}
                    accentColor={theme.accent}
                    language={language}
                  />
                )}

                {/* Photos */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {photos.map((photo) => (
                      <div key={photo.id} className="aspect-square rounded-2xl overflow-hidden shadow-soft">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.url}
                          alt={photo.file_name || 'Memory photo'}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* PDFs */}
                {pdfs.length > 0 && (
                  <div className="mb-6 space-y-2">
                    {pdfs.map((pdf) => (
                      <a
                        key={pdf.id}
                        href={pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-5 h-5 flex-shrink-0" style={{ color: theme.accent }} />
                          <span className="text-sm font-medium truncate">{pdf.file_name}</span>
                        </div>
                        <Download className="w-4 h-4 flex-shrink-0 opacity-70" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Audio */}
                {audios.length > 0 && (
                  <div className="mb-8 p-4 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePlayMusic}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: theme.accent }}
                    >
                      {musicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{audios[0].file_name}</p>
                      <p className="text-xs opacity-60">
                        {musicPlaying
                          ? language === 'hi' ? 'चल रहा है...' : 'Playing...'
                          : language === 'hi' ? 'वॉइस नोट सुनने के लिए टैप करें' : 'Tap to play voice note'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Sign off */}
                <div className="text-center pt-4 border-t border-black/10 dark:border-white/10 mb-8">
                  <p className="text-sm opacity-60">
                    {language === 'hi' ? 'प्यार और स्नेह के साथ,' : 'With love & warmth,'}
                  </p>
                  <p className="font-serif text-xl font-bold mt-1">{experience.sender_name}</p>
                </div>

                {/* Response buttons */}
                <ResponseSection
                  experience={experience}
                  onRespond={handleRespond}
                  submitted={submitted}
                  accentColor={theme.accent}
                  language={language}
                />
              </div>
            </motion.div>
          )}

          {/* PHASE 3: FEEDBACK */}
          {phase === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full bg-white/90 dark:bg-black/50 backdrop-blur-xl rounded-3xl p-8 shadow-large border border-white/50 text-center"
            >
              <div className="text-5xl mb-4">💕</div>
              <h2 className="font-serif text-2xl font-bold mb-2">
                {language === 'hi' ? 'आपकी प्रतिक्रिया दर्ज हो गई!' : 'Your response was recorded!'}
              </h2>
              <p className="text-sm opacity-75 mb-6">
                {language === 'hi'
                  ? `आपने "${responseValue}" चुना। क्या आप अनुभव को रेट करना चाहेंगे?`
                  : `You responded: "${responseValue}". Would you like to rate the experience?`}
              </p>

              {/* Star rating */}
              {experience.enable_star_rating && (
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3">
                    {language === 'hi' ? 'इस सरप्राइज को रेट करें' : 'Rate this surprise'}
                  </p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1 transition-transform hover:scale-125"
                      >
                        <Star
                          className={cn(
                            'w-8 h-8 transition-colors',
                            (hoveredRating || rating) >= star
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Written feedback */}
              {experience.enable_written_feedback && (
                <div className="mb-6">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={
                      language === 'hi'
                        ? `${experience.sender_name} के लिए एक प्यारा संदेश लिखें (वैकल्पिक)...`
                        : `Leave a sweet note for ${experience.sender_name} (optional)...`
                    }
                    rows={3}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-white/80 text-gray-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleSubmitFeedback}
                  loading={isSubmitting}
                  className="flex-1 text-white"
                  style={{ backgroundColor: theme.accent }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {language === 'hi' ? 'फीडबैक भेजें' : 'Send Feedback'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => submitResponse(responseValue, 0, '')}
                >
                  {language === 'hi' ? 'छोड़ें' : 'Skip'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* PHASE 4: COMPLETE */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-md mx-auto"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-large"
                style={{ backgroundColor: theme.accent }}
              >
                <CheckCircle className="w-10 h-10" />
              </motion.div>
              <h2 className="font-serif text-3xl font-bold mb-3">
                {language === 'hi' ? 'धन्यवाद! 💕' : 'Thank You! 💕'}
              </h2>
              <p className="opacity-75 mb-8">
                {language === 'hi'
                  ? `आपकी प्रतिक्रिया ${experience.sender_name} को भेज दी गई है।`
                  : `Your response and feedback have been shared with ${experience.sender_name}. They're going to love knowing you opened this!`}
              </p>
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/40">
                <p className="text-xs opacity-60">
                  {language === 'hi' ? 'आप भी किसी खास के लिए सरप्राइज बना सकते हैं।' : 'Want to make someone else\'s day special?'}
                </p>
                <Link
                  href="/"
                  className="text-sm font-semibold hover:underline mt-1 inline-block"
                  style={{ color: theme.accent }}
                >
                  {language === 'hi' ? 'iLoveShare पर बनाएं →' : 'Create on iLoveShare →'}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer credit */}
      <div className="fixed bottom-4 left-0 right-0 text-center z-20 pointer-events-none">
        <span className="text-xs opacity-40 flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 fill-current" /> on iLoveShare
        </span>
      </div>
    </div>
  );
}

function ResponseSection({
  experience,
  onRespond,
  submitted,
  accentColor,
  language,
}: {
  experience: Experience;
  onRespond: (value: string) => void;
  submitted: boolean;
  accentColor: string;
  language: 'en' | 'hi';
}) {
  if (submitted) {
    return (
      <div className="text-center p-4 rounded-2xl bg-green-100 border border-green-300">
        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
        <p className="text-green-700 font-medium text-sm">
          {language === 'hi' ? 'प्रतिक्रिया भेज दी गई!' : 'Response sent!'}
        </p>
      </div>
    );
  }

  const responseType = experience.response_type;

  if (responseType === 'yes_no' || experience.type === 'proposal' || experience.type === 'relationship_proposal') {
    return (
      <div className="flex gap-4 justify-center">
        <button
          type="button"
          onClick={() => onRespond('Yes')}
          className="flex-1 max-w-[170px] py-4 rounded-2xl text-white font-semibold shadow-large hover:scale-105 transition-transform"
          style={{ backgroundColor: accentColor }}
        >
          {language === 'hi' ? 'हाँ! 💕' : 'Yes! 💕'}
        </button>
        <button
          type="button"
          onClick={() => onRespond('No')}
          className="flex-1 max-w-[170px] py-4 rounded-2xl bg-gray-200 text-gray-700 font-semibold hover:scale-105 transition-transform"
        >
          {language === 'hi' ? 'नहीं' : 'No'}
        </button>
      </div>
    );
  }

  if (responseType === 'rsvp') {
    const options =
      language === 'hi'
        ? ['आ रहा/रही हूँ 🎉', 'शायद 🤔', 'नहीं आ पाऊँगा/पाऊँगी 😢']
        : ['Attending 🎉', 'Maybe 🤔', 'Cannot Attend 😢'];
    return (
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => onRespond(opt)}
            className="w-full py-3 rounded-2xl text-white font-semibold shadow-soft hover:scale-[1.02] transition-transform"
            style={{ backgroundColor: accentColor }}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }

  if (responseType === 'accepted' || experience.type === 'sorry') {
    const acceptLabel =
      experience.type === 'sorry'
        ? language === 'hi' ? 'माफ़ किया ✓' : 'Accept Forgiveness ✓'
        : language === 'hi' ? 'स्वीकार है ✓' : 'Accept ✓';
    const declineLabel = language === 'hi' ? 'अस्वीकार' : 'Decline';
    return (
      <div className="flex gap-3 justify-center">
        <button
          type="button"
          onClick={() => onRespond('Accepted')}
          className="px-8 py-3 rounded-2xl text-white font-semibold shadow-large hover:scale-105 transition-transform"
          style={{ backgroundColor: accentColor }}
        >
          {acceptLabel}
        </button>
        <button
          type="button"
          onClick={() => onRespond('Declined')}
          className="px-8 py-3 rounded-2xl bg-gray-200 text-gray-700 font-semibold hover:scale-105 transition-transform"
        >
          {declineLabel}
        </button>
      </div>
    );
  }

  const label =
    responseType === 'custom' && experience.custom_response_label
      ? experience.custom_response_label
      : language === 'hi'
      ? 'धन्यवाद भेजें 💌'
      : 'Send a Thank You 💌';

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={() => onRespond('Thank You')}
        className="px-10 py-4 rounded-2xl text-white font-semibold text-lg shadow-large hover:scale-105 transition-transform"
        style={{ backgroundColor: accentColor }}
      >
        {label}
      </button>
    </div>
  );
}

function ConfettiEffect() {
  const confettiColors = ['#B85C75', '#D9A86C', '#E8A0AD', '#392832', '#FFD700'];

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {CONFETTI_PIECES.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: confettiColors[piece.id % confettiColors.length],
            left: `${piece.left}%`,
            top: '-20px',
          }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, piece.rotate],
            opacity: [1, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

function FloatingHeartsEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {FLOATING_HEARTS.map((h) => (
        <motion.div
          key={h.id}
          className="absolute text-2xl"
          style={{ left: `${h.left}%`, bottom: '-10px' }}
          animate={{ y: [0, -140], opacity: [1, 0] }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity }}
        >
          {'❤️💕💖💗💓'[h.id % 5]}
        </motion.div>
      ))}
    </div>
  );
}

function BalloonsEffect() {
  const balloons = ['🎈', '🎀', '🎊'];
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          style={{ left: `${10 + i * 11}%`, bottom: '-50px' }}
          animate={{ y: [0, -180], rotate: [-5, 5, -5] }}
          transition={{ duration: 4 + i * 0.5, delay: i * 0.3, repeat: Infinity }}
        >
          {balloons[i % 3]}
        </motion.div>
      ))}
    </div>
  );
}

function FlowersEffect() {
  const flowers = ['🌸', '🌹', '🌺', '🌷'];
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{ left: `${(i * 19 + 5) % 95}%`, top: '-20px' }}
          animate={{ y: ['0vh', '105vh'], rotate: [0, 360], opacity: [0.9, 0] }}
          transition={{ duration: 4 + (i % 4), delay: i * 0.4, repeat: Infinity, ease: 'linear' }}
        >
          {flowers[i % flowers.length]}
        </motion.div>
      ))}
    </div>
  );
}

function FireworksEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          style={{ left: `${12 + i * 15}%`, top: `${12 + (i % 3) * 15}%` }}
          animate={{ scale: [0.3, 1.5, 0.3], opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, delay: i * 0.5, repeat: Infinity }}
        >
          🎆
        </motion.div>
      ))}
    </div>
  );
}
