-- Create video_bookmarks table for synced favorites
CREATE TABLE IF NOT EXISTS public.video_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Enable RLS
ALTER TABLE public.video_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for video_bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON public.video_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
  ON public.video_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON public.video_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_video_bookmarks_user_id ON public.video_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_video_bookmarks_video_id ON public.video_bookmarks(video_id);

-- Add comments
COMMENT ON TABLE public.video_bookmarks IS 'Stores user video bookmarks/favorites synced across devices';
COMMENT ON COLUMN public.video_bookmarks.user_id IS 'User who bookmarked the video';
COMMENT ON COLUMN public.video_bookmarks.video_id IS 'ID of the bookmarked video';