-- Insert audio series
INSERT INTO audio_series (name, slug, description, total_duration, track_count, unlock_key, display_order, icon_name)
VALUES (
  'Understanding Your Child''s Profile',
  'understanding-profiles',
  'Learn to identify and understand your child''s unique brain profile to better support their development.',
  1387,
  5,
  NULL,
  2,
  'Brain'
);

-- Insert tracks (all FREE with is_preview = true)
INSERT INTO audio_tracks (series_id, title, description, audio_url, duration_seconds, track_number, is_preview)
SELECT 
  id,
  'Why Brain Profiles Matter',
  'Understanding why identifying your child''s brain profile is the key to effective parenting strategies.',
  'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/audio-tracks/Track01-WhyProfilesMatter.mp3',
  268,
  1,
  true
FROM audio_series WHERE slug = 'understanding-profiles';

INSERT INTO audio_tracks (series_id, title, description, audio_url, duration_seconds, track_number, is_preview)
SELECT 
  id,
  'The INTENSE Profile',
  'Deep dive into the INTENSE brain profile - characteristics, challenges, and tailored approaches.',
  'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/audio-tracks/Track02-TheIntenseProfile.mp3',
  333,
  2,
  true
FROM audio_series WHERE slug = 'understanding-profiles';

INSERT INTO audio_tracks (series_id, title, description, audio_url, duration_seconds, track_number, is_preview)
SELECT 
  id,
  'The DISTRACTED Profile',
  'Understanding the DISTRACTED brain profile and strategies that actually work.',
  'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/audio-tracks/Track03-TheDistractedProfile.mp3',
  308,
  3,
  true
FROM audio_series WHERE slug = 'understanding-profiles';

INSERT INTO audio_tracks (series_id, title, description, audio_url, duration_seconds, track_number, is_preview)
SELECT 
  id,
  'The DEFIANT Profile',
  'Navigating the DEFIANT brain profile with effective, connection-based strategies.',
  'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/audio-tracks/Track04-TheDefiantProfile.mp3',
  252,
  4,
  true
FROM audio_series WHERE slug = 'understanding-profiles';

INSERT INTO audio_tracks (series_id, title, description, audio_url, duration_seconds, track_number, is_preview)
SELECT 
  id,
  'Mixed Profiles & Next Steps',
  'What to do when your child shows traits from multiple profiles, and your action plan moving forward.',
  'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/audio-tracks/Track05-MixedProfilesNextSteps.mp3',
  226,
  5,
  true
FROM audio_series WHERE slug = 'understanding-profiles';