-- Add new fields to group_posts table for enhanced post cards
ALTER TABLE public.group_posts 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
ADD COLUMN IF NOT EXISTS result_type TEXT CHECK (result_type IN ('success', 'partial', 'needs_practice'));

-- Update script_used to be more structured
COMMENT ON COLUMN public.group_posts.title IS 'Post title - e.g., "Finally got him to sleep without a fight!"';
COMMENT ON COLUMN public.group_posts.image_url IS 'Optional image URL for post';
COMMENT ON COLUMN public.group_posts.script_used IS 'Name of script used - e.g., "Bedtime Routine"';
COMMENT ON COLUMN public.group_posts.duration_minutes IS 'How long the script/activity took';
COMMENT ON COLUMN public.group_posts.result_type IS 'Result of using the script: success, partial, or needs_practice';