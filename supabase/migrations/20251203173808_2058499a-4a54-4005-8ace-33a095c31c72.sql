-- Fix Bedtime Without Battles: set ALL tracks to free (is_preview = true)
UPDATE audio_tracks 
SET is_preview = true
WHERE series_id = (SELECT id FROM audio_series WHERE slug = 'bedtime-without-battles');

-- Fix Screen Time Sanity: set tracks 4 and 5 to free (is_preview = true)
UPDATE audio_tracks 
SET is_preview = true
WHERE series_id = (SELECT id FROM audio_series WHERE slug = 'screen-time-sanity')
  AND track_number IN (4, 5);