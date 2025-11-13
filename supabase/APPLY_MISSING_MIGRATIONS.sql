-- ========================================
-- APPLY ALL MISSING MIGRATIONS
-- Execute this in Supabase Dashboard > SQL Editor
-- ========================================

-- 1. Create video_progress table
CREATE TABLE IF NOT EXISTS public.video_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id uuid NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  progress_seconds integer NOT NULL DEFAULT 0,
  total_duration_seconds integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  last_watched_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Enable RLS
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own video progress" ON public.video_progress;
DROP POLICY IF EXISTS "Users can insert their own video progress" ON public.video_progress;
DROP POLICY IF EXISTS "Users can update their own video progress" ON public.video_progress;
DROP POLICY IF EXISTS "Users can delete their own video progress" ON public.video_progress;

-- RLS Policies for video_progress
CREATE POLICY "Users can view their own video progress"
  ON public.video_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video progress"
  ON public.video_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video progress"
  ON public.video_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own video progress"
  ON public.video_progress FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS video_progress_user_id_idx ON public.video_progress(user_id);
CREATE INDEX IF NOT EXISTS video_progress_video_id_idx ON public.video_progress(video_id);
CREATE INDEX IF NOT EXISTS video_progress_last_watched_idx ON public.video_progress(last_watched_at DESC);

-- Trigger function
CREATE OR REPLACE FUNCTION public.update_video_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS update_video_progress_updated_at_trigger ON public.video_progress;
CREATE TRIGGER update_video_progress_updated_at_trigger
  BEFORE UPDATE ON public.video_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_video_progress_updated_at();

-- Comments
COMMENT ON TABLE public.video_progress IS 'Tracks user progress watching videos';
COMMENT ON COLUMN public.video_progress.progress_seconds IS 'Current playback position in seconds';
COMMENT ON COLUMN public.video_progress.total_duration_seconds IS 'Total video duration in seconds';
COMMENT ON COLUMN public.video_progress.completed IS 'True if user watched 90%+ of the video';

-- 2. Add thumbnail_url to videos if not exists
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
COMMENT ON COLUMN public.videos.thumbnail_url IS 'URL to the video thumbnail image';

-- 3. Fix Admin RLS policies for videos
DROP POLICY IF EXISTS "Admins can insert videos" ON public.videos;
DROP POLICY IF EXISTS "Admins can update videos" ON public.videos;
DROP POLICY IF EXISTS "Admins can delete videos" ON public.videos;

CREATE POLICY "Admins can insert videos"
  ON public.videos FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true);

CREATE POLICY "Admins can update videos"
  ON public.videos FOR UPDATE TO authenticated
  USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true)
  WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true);

CREATE POLICY "Admins can delete videos"
  ON public.videos FOR DELETE TO authenticated
  USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true);

-- 4. Fix Admin RLS policies for pdfs
DROP POLICY IF EXISTS "Admins can insert pdfs" ON public.pdfs;
DROP POLICY IF EXISTS "Admins can update pdfs" ON public.pdfs;
DROP POLICY IF EXISTS "Admins can delete pdfs" ON public.pdfs;

CREATE POLICY "Admins can insert pdfs"
  ON public.pdfs FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true);

CREATE POLICY "Admins can update pdfs"
  ON public.pdfs FOR UPDATE TO authenticated
  USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true)
  WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true);

CREATE POLICY "Admins can delete pdfs"
  ON public.pdfs FOR DELETE TO authenticated
  USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true);

-- 5. Fix Admin RLS policies for feed_posts
DROP POLICY IF EXISTS "Admins can insert feed_posts" ON public.feed_posts;
DROP POLICY IF EXISTS "Admins can update feed_posts" ON public.feed_posts;
DROP POLICY IF EXISTS "Admins can delete feed_posts" ON public.feed_posts;

CREATE POLICY "Admins can insert feed_posts"
  ON public.feed_posts FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true);

CREATE POLICY "Admins can update feed_posts"
  ON public.feed_posts FOR UPDATE TO authenticated
  USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true)
  WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true);

CREATE POLICY "Admins can delete feed_posts"
  ON public.feed_posts FOR DELETE TO authenticated
  USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'All migrations applied successfully!';
END $$;
