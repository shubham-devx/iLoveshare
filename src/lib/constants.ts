// iLoveShare - Core Constants

export const APP_NAME = 'iLoveShare';
export const APP_TAGLINE = 'Every feeling deserves a beautiful way to be shared.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const APP_DESCRIPTION =
  'iLoveShare is a premium digital celebration platform where you can create and send personalized digital experiences to partners, family, and friends.';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// File upload limits
export const MAX_PHOTOS = 4;
export const MAX_PHOTO_SIZE_MB = 5;
export const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
export const MAX_PDF_SIZE_MB = 10;
export const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024;
export const MAX_AUDIO_SIZE_MB = 20;
export const MAX_AUDIO_SIZE_BYTES = MAX_AUDIO_SIZE_MB * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_PDF_TYPES = ['application/pdf'];
export const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac'];

// Experience types
export const EXPERIENCE_TYPES = [
  { id: 'birthday', label: 'Birthday Surprise', emoji: '🎂', description: 'Celebrate their special day' },
  { id: 'anniversary', label: 'Anniversary', emoji: '💑', description: 'Cherish your milestone' },
  { id: 'love_letter', label: 'Love Letter', emoji: '💌', description: 'Pour your heart out' },
  { id: 'proposal', label: 'Marriage Proposal', emoji: '💍', description: 'Pop the big question' },
  { id: 'relationship_proposal', label: 'Relationship Proposal', emoji: '🌹', description: 'Ask them to be yours' },
  { id: 'sorry', label: 'Sorry / Apology', emoji: '🕊️', description: 'Mend what matters' },
  { id: 'celebration', label: 'Celebration Invitation', emoji: '🎉', description: 'Invite them to celebrate' },
  { id: 'wedding', label: 'Wedding Invitation', emoji: '💒', description: 'Share your special day' },
  { id: 'engagement', label: 'Engagement', emoji: '💎', description: 'Announce your engagement' },
  { id: 'congratulations', label: 'Congratulations', emoji: '🏆', description: 'Celebrate their achievement' },
  { id: 'thank_you', label: 'Thank You', emoji: '🙏', description: 'Express your gratitude' },
  { id: 'custom', label: 'Custom Surprise', emoji: '✨', description: 'Create something unique' },
] as const;

// Recipient types
export const RECIPIENT_TYPES = [
  { id: 'partner', label: 'Partner', emoji: '💕' },
  { id: 'wife', label: 'Wife / Husband', emoji: '💍' },
  { id: 'girlfriend', label: 'Girlfriend / Boyfriend', emoji: '🌹' },
  { id: 'mother', label: 'Mother / Father', emoji: '👨‍👩‍👧' },
  { id: 'sibling', label: 'Brother / Sister', emoji: '👫' },
  { id: 'friend', label: 'Friend', emoji: '🤝' },
  { id: 'family', label: 'Family', emoji: '🏠' },
  { id: 'other', label: 'Other', emoji: '💫' },
] as const;

// Design themes
export const DESIGN_THEMES = [
  { id: 'romantic', label: 'Romantic', description: 'Soft roses and deep reds', preview: '#B85C75' },
  { id: 'floral', label: 'Floral', description: 'Fresh blooms and nature', preview: '#D9A86C' },
  { id: 'minimal', label: 'Minimal', description: 'Clean lines, modern look', preview: '#392832' },
  { id: 'cinematic', label: 'Cinematic', description: 'Bold and dramatic', preview: '#211923' },
  { id: 'dreamy', label: 'Dreamy', description: 'Soft pastels and magic', preview: '#E8A0AD' },
  { id: 'royal', label: 'Royal', description: 'Gold and luxury', preview: '#D4AF37' },
  { id: 'cute', label: 'Cute', description: 'Playful and fun', preview: '#FF9BB5' },
  { id: 'elegant', label: 'Elegant', description: 'Timeless sophistication', preview: '#8B7780' },
  { id: 'celebration', label: 'Celebration', description: 'Vibrant and festive', preview: '#FF6B35' },
] as const;

// Animation options
export const ANIMATION_OPTIONS = [
  { id: 'confetti', label: 'Confetti', emoji: '🎊' },
  { id: 'hearts', label: 'Floating Hearts', emoji: '💕' },
  { id: 'flowers', label: 'Flowers', emoji: '🌸' },
  { id: 'balloons', label: 'Balloons', emoji: '🎈' },
  { id: 'fireworks', label: 'Fireworks', emoji: '🎆' },
  { id: 'gift', label: 'Gift Opening', emoji: '🎁' },
  { id: 'envelope', label: 'Envelope Opening', emoji: '💌' },
  { id: 'cake', label: 'Birthday Cake', emoji: '🎂' },
  { id: 'stars', label: 'Twinkling Stars', emoji: '⭐' },
] as const;

// Response types
export const RESPONSE_TYPES = [
  { id: 'thank_you', label: 'Thank You', description: 'Simple acknowledgment' },
  { id: 'accepted', label: 'Accepted', description: 'Positive acceptance' },
  { id: 'yes_no', label: 'Yes / No', description: 'Binary choice' },
  { id: 'rsvp', label: 'RSVP', description: 'Event attendance' },
  { id: 'custom', label: 'Custom Response', description: 'Your own text' },
] as const;

// Storage bucket names
export const STORAGE_BUCKETS = {
  EXPERIENCE_PHOTOS: 'experience-photos',
  EXPERIENCE_PDFS: 'experience-pdfs',
  EXPERIENCE_AUDIO: 'experience-audio',
  PROFILE_IMAGES: 'profile-images',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  EXPLORE: '/explore',
  HOW_IT_WORKS: '/how-it-works',
  PRICING: '/pricing',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  CREATE: '/dashboard/create',
  SURPRISES: '/dashboard/surprises',
  DRAFTS: '/dashboard/drafts',
  ANALYTICS: '/dashboard/analytics',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
  EXPERIENCE: '/e', // Public experience: /e/[token]
} as const;
