-- Add moderation features to community posts

-- Add flags count and hidden status to posts
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS flags_count integer NOT NULL DEFAULT 0;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS is_spotlight boolean NOT NULL DEFAULT false;

-- Create post_flags table to track who flagged what
CREATE TABLE IF NOT EXISTS public.post_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE public.post_flags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for post_flags
CREATE POLICY "Users can view own flags"
  ON public.post_flags FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add flags"
  ON public.post_flags FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all flags"
  ON public.post_flags FOR SELECT
  TO authenticated
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

CREATE POLICY "Admins can delete flags"
  ON public.post_flags FOR DELETE
  TO authenticated
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

-- Function to auto-hide posts with 3+ flags
CREATE OR REPLACE FUNCTION auto_hide_flagged_posts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update flags count
  UPDATE public.community_posts
  SET flags_count = (
    SELECT COUNT(*) FROM public.post_flags WHERE post_id = NEW.post_id
  )
  WHERE id = NEW.post_id;

  -- Auto-hide if flags >= 3
  UPDATE public.community_posts
  SET is_hidden = true
  WHERE id = NEW.post_id AND flags_count >= 3;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-hide posts
DROP TRIGGER IF EXISTS trigger_auto_hide_posts ON public.post_flags;
CREATE TRIGGER trigger_auto_hide_posts
  AFTER INSERT ON public.post_flags
  FOR EACH ROW
  EXECUTE FUNCTION auto_hide_flagged_posts();

-- Function to auto-promote popular posts to spotlight
CREATE OR REPLACE FUNCTION auto_promote_popular_posts()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-promote to spotlight if likes > 10
  UPDATE public.community_posts
  SET is_spotlight = true
  WHERE id = NEW.post_id
    AND (SELECT COUNT(*) FROM public.post_likes WHERE post_id = NEW.post_id) > 10;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-promote posts
DROP TRIGGER IF EXISTS trigger_auto_promote_posts ON public.post_likes;
CREATE TRIGGER trigger_auto_promote_posts
  AFTER INSERT ON public.post_likes
  FOR EACH ROW
  EXECUTE FUNCTION auto_promote_popular_posts();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_post_flags_post_id ON public.post_flags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_flags_user_id ON public.post_flags(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_hidden ON public.community_posts(is_hidden);
CREATE INDEX IF NOT EXISTS idx_community_posts_spotlight ON public.community_posts(is_spotlight);

-- Update community posts view to exclude hidden posts
DROP VIEW IF EXISTS public.community_posts_with_details CASCADE;
CREATE VIEW public.community_posts_with_details AS
SELECT
  cp.id,
  cp.user_id,
  cp.content,
  cp.image_url,
  cp.created_at,
  cp.updated_at,
  cp.flags_count,
  cp.is_hidden,
  cp.is_spotlight,
  p.name as author_name,
  p.email as author_email,
  (SELECT COUNT(*) FROM public.post_likes pl WHERE pl.post_id = cp.id) as likes_count,
  (SELECT COUNT(*) FROM public.post_comments pc WHERE pc.post_id = cp.id) as comments_count
FROM public.community_posts cp
LEFT JOIN public.profiles p ON cp.user_id = p.id
WHERE cp.is_hidden = false
ORDER BY cp.created_at DESC;
