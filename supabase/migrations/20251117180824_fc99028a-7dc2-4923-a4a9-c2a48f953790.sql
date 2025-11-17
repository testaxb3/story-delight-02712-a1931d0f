-- Add Creative Commons attribution fields to videos table
ALTER TABLE videos
ADD COLUMN IF NOT EXISTS license_type TEXT CHECK (license_type IN ('CC-BY', 'CC-BY-SA', 'CC0', 'Standard')),
ADD COLUMN IF NOT EXISTS creator_name TEXT,
ADD COLUMN IF NOT EXISTS original_url TEXT,
ADD COLUMN IF NOT EXISTS attribution_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verified_date TIMESTAMP WITH TIME ZONE;

-- Add comment explaining the new fields
COMMENT ON COLUMN videos.license_type IS 'YouTube video license type: CC-BY, CC-BY-SA, CC0, or Standard';
COMMENT ON COLUMN videos.creator_name IS 'Name of the video creator/channel for attribution';
COMMENT ON COLUMN videos.original_url IS 'Original YouTube video URL for attribution link';
COMMENT ON COLUMN videos.attribution_required IS 'Whether this video requires visible attribution';
COMMENT ON COLUMN videos.verified_date IS 'When the license was manually verified by admin';