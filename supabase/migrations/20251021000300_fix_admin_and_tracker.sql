-- Fix Admin panel issues and tracker_days constraint

-- 1. Fix tracker_days UNIQUE constraint for ON CONFLICT
-- First, drop the old unique constraint if it exists (only user_id, day_number)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'tracker_days_user_id_day_number_key'
  ) THEN
    ALTER TABLE public.tracker_days DROP CONSTRAINT tracker_days_user_id_day_number_key;
  END IF;
END $$;

-- Create new UNIQUE constraint with all three columns
CREATE UNIQUE INDEX IF NOT EXISTS tracker_days_user_child_day_unique
  ON public.tracker_days(user_id, child_profile_id, day_number);

-- Add comment
COMMENT ON INDEX tracker_days_user_child_day_unique IS 'Ensures one tracker entry per user, child, and day combination';

-- 2. Add missing columns to videos table for admin functionality
ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS premium_only BOOLEAN NOT NULL DEFAULT false;

-- Add comment
COMMENT ON COLUMN public.videos.premium_only IS 'Whether this video is only available to premium users';

-- 3. Add missing columns to pdfs table for admin functionality
ALTER TABLE public.pdfs
  ADD COLUMN IF NOT EXISTS premium_only BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS file_size TEXT,
  ADD COLUMN IF NOT EXISTS page_count INTEGER;

-- Update pdfs table structure to match admin requirements
-- Rename 'url' to 'file_url' if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pdfs'
    AND column_name = 'url'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.pdfs RENAME COLUMN url TO file_url;
  END IF;

  -- Add file_url if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pdfs'
    AND column_name = 'file_url'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.pdfs ADD COLUMN file_url TEXT NOT NULL DEFAULT '';
  END IF;
END $$;

-- Add comments
COMMENT ON COLUMN public.pdfs.premium_only IS 'Whether this PDF is only available to premium users';
COMMENT ON COLUMN public.pdfs.file_size IS 'Human-readable file size (e.g., "2.5 MB")';
COMMENT ON COLUMN public.pdfs.page_count IS 'Number of pages in the PDF';

-- 4. Ensure pdfs table has all required columns
ALTER TABLE public.pdfs
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Drop old 'premium' column if it exists (renamed to premium_only)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pdfs'
    AND column_name = 'premium'
    AND table_schema = 'public'
  ) THEN
    -- Copy data from 'premium' to 'premium_only' if needed
    UPDATE public.pdfs SET premium_only = premium WHERE premium IS NOT NULL;
    -- Drop the old column
    ALTER TABLE public.pdfs DROP COLUMN premium;
  END IF;
END $$;

-- 5. Add locked column to videos if it doesn't exist (for progressive unlock feature)
ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS locked BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.videos.locked IS 'Whether this video is locked until prerequisites are met';

-- 6. Ensure feed_posts table has published column
ALTER TABLE public.feed_posts
  ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN public.feed_posts.published IS 'Whether this feed post is published and visible to users';

-- 7. Create indexes for better admin panel performance
CREATE INDEX IF NOT EXISTS videos_section_order_idx ON public.videos(section, order_index);
CREATE INDEX IF NOT EXISTS pdfs_category_idx ON public.pdfs(category);
CREATE INDEX IF NOT EXISTS scripts_category_profile_idx ON public.scripts(category, profile);

-- Add comments to clarify admin functionality
COMMENT ON TABLE public.videos IS 'Educational video lessons with sections and progressive unlock';
COMMENT ON TABLE public.pdfs IS 'Downloadable PDF resources organized by category';
COMMENT ON TABLE public.feed_posts IS 'Admin-created educational content posts shown in user feed';
