-- Add thumbnail_url column to videos table
ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Add comment to document the column
COMMENT ON COLUMN public.videos.thumbnail_url IS 'URL to the video thumbnail image for display in cards and lists';
