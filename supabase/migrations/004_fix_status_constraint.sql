-- =====================================================
-- Migration 004: Fix status CHECK constraint to allow 'deleted'
-- and add missing UPDATE RLS policy for anon soft-delete path
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop and recreate the status check constraint to include 'deleted'
ALTER TABLE public.experiences
  DROP CONSTRAINT IF EXISTS experiences_status_check;

ALTER TABLE public.experiences
  ADD CONSTRAINT experiences_status_check
  CHECK (status IN ('draft', 'published', 'archived', 'deleted'));

-- Ensure there is a permissive soft-delete UPDATE policy
-- (safe to run even if it already exists)
DROP POLICY IF EXISTS "Users can soft-delete own experiences" ON public.experiences;
CREATE POLICY "Users can soft-delete own experiences"
  ON public.experiences FOR UPDATE
  USING (auth.uid() = user_id);
