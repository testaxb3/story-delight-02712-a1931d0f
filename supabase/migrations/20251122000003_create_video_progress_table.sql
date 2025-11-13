-- Create video_progress table to track user video watch progress
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

  -- One progress record per user per video
  UNIQUE(user_id, video_id)
);

-- Enable RLS
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own video progress"
  ON public.video_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video progress"
  ON public.video_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video progress"
  ON public.video_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own video progress"
  ON public.video_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS video_progress_user_id_idx ON public.video_progress(user_id);
CREATE INDEX IF NOT EXISTS video_progress_video_id_idx ON public.video_progress(video_id);
CREATE INDEX IF NOT EXISTS video_progress_last_watched_idx ON public.video_progress(last_watched_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_video_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_video_progress_updated_at_trigger
  BEFORE UPDATE ON public.video_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_video_progress_updated_at();

-- Comments
COMMENT ON TABLE public.video_progress IS 'Tracks user progress watching videos';
COMMENT ON COLUMN public.video_progress.progress_seconds IS 'Current playback position in seconds';
COMMENT ON COLUMN public.video_progress.total_duration_seconds IS 'Total video duration in seconds';
COMMENT ON COLUMN public.video_progress.completed IS 'True if user watched 90%+ of the video';
