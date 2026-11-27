-- =====================================================
-- iLoveShare Database Schema Migration
-- Version: 002
-- Description: Extended schema for creative features,
--   recipients, feedback, themes, and scheduled deliveries
-- =====================================================

-- Extend experiences table safely with new optional columns
ALTER TABLE public.experiences
  ADD COLUMN IF NOT EXISTS passcode TEXT,
  ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'hi')),
  ADD COLUMN IF NOT EXISTS event_details JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS milestones JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS scratch_message TEXT,
  ADD COLUMN IF NOT EXISTS creative_features TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS group_delivery BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS lock_after_response BOOLEAN DEFAULT FALSE;

-- =====================================================
-- EXPERIENCE RECIPIENTS TABLE (Group Delivery)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.experience_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  relationship TEXT,
  personal_token TEXT NOT NULL UNIQUE,
  has_opened BOOLEAN DEFAULT FALSE,
  opened_at TIMESTAMPTZ,
  has_responded BOOLEAN DEFAULT FALSE,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experience_recipients_exp_id
  ON public.experience_recipients(experience_id);
CREATE INDEX IF NOT EXISTS idx_experience_recipients_token
  ON public.experience_recipients(personal_token);

-- =====================================================
-- EXPERIENCE FEEDBACK TABLE (Normalized)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.experience_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  response_id UUID REFERENCES public.experience_responses(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  recipient_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experience_feedback_exp_id
  ON public.experience_feedback(experience_id);

-- =====================================================
-- EXPERIENCE THEMES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.experience_themes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.experience_themes (id, name, description, primary_color, secondary_color, accent_color, is_premium)
VALUES
  ('romantic', 'Romantic', 'Soft roses and deep reds', '#B85C75', '#E8A0AD', '#D9A86C', FALSE),
  ('floral', 'Floral', 'Fresh blooms and nature', '#D9A86C', '#F7D9B4', '#8FA98A', FALSE),
  ('minimal', 'Minimal', 'Clean lines, modern look', '#392832', '#E5E5E5', '#B85C75', FALSE),
  ('cinematic', 'Cinematic', 'Bold and dramatic', '#E94560', '#1A1A2E', '#D9A86C', FALSE),
  ('dreamy', 'Dreamy', 'Soft pastels and magic', '#9B59B6', '#E8D5FF', '#F3E7FF', FALSE),
  ('royal', 'Royal', 'Gold and luxury', '#D4AF37', '#FDF6E0', '#392832', FALSE),
  ('cute', 'Cute', 'Playful and fun', '#FF6B9D', '#FFD6E7', '#FFF0F5', FALSE),
  ('elegant', 'Elegant', 'Timeless sophistication', '#8B7780', '#E8E0E5', '#D9A86C', FALSE),
  ('celebration', 'Celebration', 'Vibrant and festive', '#FF6B35', '#FFE57F', '#B85C75', FALSE)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SCHEDULED DELIVERIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.scheduled_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMPTZ NOT NULL,
  recipient_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scheduled_deliveries_status_time
  ON public.scheduled_deliveries(status, scheduled_for);

-- =====================================================
-- ROW LEVEL SECURITY FOR NEW TABLES
-- =====================================================
ALTER TABLE public.experience_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_deliveries ENABLE ROW LEVEL SECURITY;

-- Recipients policies
CREATE POLICY "Owners can manage recipients"
  ON public.experience_recipients FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.experiences
      WHERE id = experience_id AND user_id = auth.uid()
    )
  );

-- Feedback policies
CREATE POLICY "Public can submit feedback to published experiences"
  ON public.experience_feedback FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.experiences
      WHERE id = experience_id AND status = 'published' AND is_deleted = FALSE
    )
  );

CREATE POLICY "Owners can view feedback"
  ON public.experience_feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.experiences
      WHERE id = experience_id AND user_id = auth.uid()
    )
  );

-- Themes policies
CREATE POLICY "Anyone can view active themes"
  ON public.experience_themes FOR SELECT
  USING (is_active = TRUE);

-- Scheduled deliveries policies
CREATE POLICY "Owners can manage scheduled deliveries"
  ON public.scheduled_deliveries FOR ALL
  USING (auth.uid() = user_id);
