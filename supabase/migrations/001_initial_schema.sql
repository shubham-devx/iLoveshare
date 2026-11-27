-- =====================================================
-- iLoveShare Database Schema Migration
-- Version: 001
-- Description: Initial schema setup
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ
);

-- =====================================================
-- EXPERIENCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'custom',
  recipient_type TEXT NOT NULL DEFAULT 'other',
  recipient_name TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  relationship TEXT,
  personal_greeting TEXT,
  message TEXT,
  theme TEXT NOT NULL DEFAULT 'romantic',
  animations TEXT[] DEFAULT '{}',
  music_enabled BOOLEAN DEFAULT FALSE,
  music_url TEXT,
  response_type TEXT NOT NULL DEFAULT 'thank_you',
  custom_response_label TEXT,
  enable_star_rating BOOLEAN DEFAULT TRUE,
  enable_written_feedback BOOLEAN DEFAULT TRUE,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'deleted')),
  scheduled_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  view_count INTEGER DEFAULT 0,
  response_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ
);

-- =====================================================
-- EXPERIENCE ATTACHMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.experience_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('photo', 'pdf', 'audio')),
  url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EXPERIENCE RESPONSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.experience_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  response_type TEXT NOT NULL,
  response_value TEXT,
  respondent_name TEXT,
  star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
  written_feedback TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EXPERIENCE ANALYTICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.experience_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  experience_id UUID REFERENCES public.experiences(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON public.experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_token ON public.experiences(token);
CREATE INDEX IF NOT EXISTS idx_experiences_status ON public.experiences(status);
CREATE INDEX IF NOT EXISTS idx_experiences_is_deleted ON public.experiences(is_deleted);
CREATE INDEX IF NOT EXISTS idx_attachments_experience_id ON public.experience_attachments(experience_id);
CREATE INDEX IF NOT EXISTS idx_responses_experience_id ON public.experience_responses(experience_id);
CREATE INDEX IF NOT EXISTS idx_analytics_experience_id ON public.experience_analytics(experience_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-increment response_count
CREATE OR REPLACE FUNCTION public.increment_response_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.experiences
  SET response_count = response_count + 1
  WHERE id = NEW.experience_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_response_created
  AFTER INSERT ON public.experience_responses
  FOR EACH ROW EXECUTE FUNCTION public.increment_response_count();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- EXPERIENCES POLICIES
CREATE POLICY "Users can view own experiences"
  ON public.experiences FOR SELECT
  USING (auth.uid() = user_id AND is_deleted = FALSE);

CREATE POLICY "Public can view published experiences by token"
  ON public.experiences FOR SELECT
  USING (status = 'published' AND is_deleted = FALSE);

CREATE POLICY "Users can insert own experiences"
  ON public.experiences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own experiences"
  ON public.experiences FOR UPDATE
  USING (auth.uid() = user_id AND is_deleted = FALSE);

CREATE POLICY "Users can soft-delete own experiences"
  ON public.experiences FOR UPDATE
  USING (auth.uid() = user_id);

-- ATTACHMENTS POLICIES
CREATE POLICY "Users can view own attachments"
  ON public.experience_attachments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view attachments of published experiences"
  ON public.experience_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.experiences
      WHERE id = experience_id
      AND status = 'published'
      AND is_deleted = FALSE
    )
  );

CREATE POLICY "Users can insert own attachments"
  ON public.experience_attachments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own attachments"
  ON public.experience_attachments FOR DELETE
  USING (auth.uid() = user_id);

-- RESPONSES POLICIES
CREATE POLICY "Public can submit responses to published experiences"
  ON public.experience_responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.experiences
      WHERE id = experience_id
      AND status = 'published'
      AND is_deleted = FALSE
    )
  );

CREATE POLICY "Experience owners can view responses"
  ON public.experience_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.experiences
      WHERE id = experience_id
      AND user_id = auth.uid()
    )
  );

-- ANALYTICS POLICIES
CREATE POLICY "Public can insert analytics"
  ON public.experience_analytics FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Experience owners can view analytics"
  ON public.experience_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.experiences
      WHERE id = experience_id
      AND user_id = auth.uid()
    )
  );

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- STORAGE BUCKETS (Run these in Supabase Dashboard)
-- =====================================================

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('experience-photos', 'experience-photos', true);

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('experience-pdfs', 'experience-pdfs', true);

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('experience-audio', 'experience-audio', true);

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('profile-images', 'profile-images', true);

-- Storage policies
-- CREATE POLICY "Users can upload own photos"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'experience-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Public can read photos"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'experience-photos');
