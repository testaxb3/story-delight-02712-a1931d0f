-- Add column for transcript segments (synced lyrics)
ALTER TABLE audio_tracks 
ADD COLUMN IF NOT EXISTS transcript_segments JSONB;

-- Add comment for documentation
COMMENT ON COLUMN audio_tracks.transcript_segments IS 'JSON containing synced transcript segments with start/end times for lyrics display';

-- Index for efficient queries checking if transcript exists
CREATE INDEX IF NOT EXISTS idx_audio_tracks_has_transcript 
ON audio_tracks ((transcript_segments IS NOT NULL));