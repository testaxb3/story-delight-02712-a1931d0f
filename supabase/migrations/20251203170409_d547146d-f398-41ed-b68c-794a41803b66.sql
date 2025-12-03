-- Create the "Bedtime Without Battles" audio series
INSERT INTO public.audio_series (
  name,
  slug,
  description,
  icon_name,
  display_order,
  track_count,
  total_duration,
  unlock_key
) VALUES (
  'Bedtime Without Battles',
  'bedtime-without-battles',
  'Transform chaotic bedtimes into peaceful connections. Five guided audio tracks helping you respond with calm confidence when bedtime feels like a battlefield.',
  '🌙',
  2,
  5,
  570,
  NULL
);

-- Get the series ID for track insertion
DO $$
DECLARE
  series_uuid UUID;
BEGIN
  SELECT id INTO series_uuid FROM public.audio_series WHERE slug = 'bedtime-without-battles';
  
  -- Track 01: The Bedtime Battle
  INSERT INTO public.audio_tracks (
    series_id,
    title,
    description,
    track_number,
    duration_seconds,
    audio_url,
    is_preview,
    tags
  ) VALUES (
    series_uuid,
    'The Bedtime Battle',
    'Understand why bedtime resistance isn''t defiance—it''s disconnection. Learn to see the real need behind "I don''t want to go to bed."',
    1,
    120,
    '',
    true,
    ARRAY['bedtime', 'resistance', 'connection', 'understanding']
  );
  
  -- Track 02: The Stalling Game
  INSERT INTO public.audio_tracks (
    series_id,
    title,
    description,
    track_number,
    duration_seconds,
    audio_url,
    is_preview,
    tags
  ) VALUES (
    series_uuid,
    'The Stalling Game',
    'Reframe endless requests for water, bathroom, and snacks. Discover compassionate strategies that acknowledge the need while holding the boundary.',
    2,
    115,
    '',
    true,
    ARRAY['stalling', 'boundaries', 'compassion', 'requests']
  );
  
  -- Track 03: Racing Mind at Night
  INSERT INTO public.audio_tracks (
    series_id,
    title,
    description,
    track_number,
    duration_seconds,
    audio_url,
    is_preview,
    tags
  ) VALUES (
    series_uuid,
    'Racing Mind at Night',
    'When your child''s mind won''t quiet down. Learn to honor their thoughts while guiding them toward sleep with the "thought jar" technique.',
    3,
    110,
    '',
    true,
    ARRAY['racing-thoughts', 'anxiety', 'thought-jar', 'calm']
  );
  
  -- Track 04: The Last Request
  INSERT INTO public.audio_tracks (
    series_id,
    title,
    description,
    track_number,
    duration_seconds,
    audio_url,
    is_preview,
    tags
  ) VALUES (
    series_uuid,
    'The Last Request',
    'Transform "one more thing" from frustration to connection. Understand why children reach for you at the threshold of sleep.',
    4,
    125,
    '',
    false,
    ARRAY['last-request', 'connection', 'threshold', 'patience']
  );
  
  -- Track 05: When Bedtime Goes Wrong
  INSERT INTO public.audio_tracks (
    series_id,
    title,
    description,
    track_number,
    duration_seconds,
    audio_url,
    is_preview,
    tags
  ) VALUES (
    series_uuid,
    'When Bedtime Goes Wrong',
    'Self-compassion for difficult nights. One hard bedtime doesn''t define you—tomorrow is a fresh start with the same loving parent.',
    5,
    100,
    '',
    false,
    ARRAY['self-compassion', 'recovery', 'fresh-start', 'grace']
  );
END $$;