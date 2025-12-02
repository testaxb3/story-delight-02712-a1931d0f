-- Insert "The Obedience Audio Tracks" series
INSERT INTO audio_series (name, slug, description, icon_name, display_order, track_count, total_duration)
VALUES (
  'The Obedience Audio Tracks',
  'the-obedience-audio-tracks',
  'A transformative audio series to help you regulate your emotions and respond calmly to your child''s biggest moments.',
  '🎧',
  1,
  11,
  3049
);

-- Insert all 11 audio tracks
INSERT INTO audio_tracks (series_id, title, track_number, duration_seconds, audio_url)
SELECT 
  (SELECT id FROM audio_series WHERE slug = 'the-obedience-audio-tracks'),
  title,
  track_number,
  duration_seconds,
  audio_url
FROM (VALUES
  ('Introduction: The Science of Staying Calm', 1, 243, 'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/audio-tracks/TRACK%2001.mp3'),
  ('Understanding Your Triggers', 2, 320, 'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/audio-tracks/TRACK%2002.mp3'),
  ('The 90-Second Rule', 3, 225, 'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/audio-tracks/TRACK%2003.mp3'),
  ('Breathing Techniques for Parents', 4, 309, 'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/audio-tracks/TRACK%2004.mp3'),
  ('Reframing Your Child''s Behavior', 5, 259, 'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/audio-tracks/TRACK%2005.mp3'),
  ('The Power of the Pause', 6, 297, 'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/audio-tracks/TRACK%2006.mp3'),
  ('Self-Compassion in Parenting', 7, 257, 'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/audio-tracks/TRACK%2007.mp3'),
  ('Repair After Rupture', 8, 278, 'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/audio-tracks/TRACK%2008.mp3'),
  ('Building Your Regulation Toolkit', 9, 230, 'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/audio-tracks/TRACK%2009.mp3'),
  ('Modeling Calm for Your Child', 10, 279, 'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/audio-tracks/TRACK%2010.mp3'),
  ('Your Daily Reset Practice', 11, 352, 'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/audio-tracks/TRACK%2011.mp3')
) AS tracks(title, track_number, duration_seconds, audio_url);