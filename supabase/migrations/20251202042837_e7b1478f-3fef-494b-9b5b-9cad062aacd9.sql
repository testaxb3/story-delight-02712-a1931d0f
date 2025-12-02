-- Mark first 3 audio tracks as preview (free)
UPDATE audio_tracks 
SET is_preview = true 
WHERE track_number <= 3;