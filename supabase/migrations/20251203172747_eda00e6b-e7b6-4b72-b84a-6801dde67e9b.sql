-- Create the "Screen Time Sanity" audio series
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
  'Screen Time Sanity',
  'screen-time-sanity',
  'End the daily screen time battles without guilt or yelling. Five guided audio tracks helping you set boundaries that actually work—and feel good doing it.',
  '📱',
  3,
  5,
  570,
  NULL
);

-- Get the series ID for track insertion
DO $$
DECLARE
  series_uuid UUID;
BEGIN
  SELECT id INTO series_uuid FROM public.audio_series WHERE slug = 'screen-time-sanity';
  
  -- Track 01: The Screen Time Trap
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
    'The Screen Time Trap',
    'Understand why screen time battles feel so impossible—and why the guilt you carry isn''t helping anyone. Time to stop fighting yourself.',
    1,
    115,
    '',
    true,
    ARRAY['screen-time', 'guilt', 'understanding', 'self-compassion']
  );
  
  -- Track 02: The Warning That Works
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
    'The Warning That Works',
    'Learn the exact warning system that prepares your child''s brain for transitions. Transform "time''s up" from a battle cry to a bridge.',
    2,
    110,
    '',
    true,
    ARRAY['warnings', 'transitions', 'preparation', 'brain-science']
  );
  
  -- Track 03: The Extinction Burst
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
    'The Extinction Burst',
    'Why things get worse before they get better—and why that''s actually a sign you''re succeeding. The science of behavior change that changes everything.',
    3,
    115,
    '',
    true,
    ARRAY['extinction-burst', 'behavior-change', 'persistence', 'breakthrough']
  );
  
  -- Track 04: Words That Work
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
    'Words That Work',
    'The exact phrases that work with a dysregulated brain—and why "put it down now" makes everything worse. Speak to the brain that''s listening.',
    4,
    120,
    '',
    false,
    ARRAY['phrases', 'communication', 'dysregulation', 'connection']
  );
  
  -- Track 05: The Other Side
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
    'The Other Side',
    'What life looks like when screen time isn''t a battle anymore. The trust you''re building—and the parent you''re becoming.',
    5,
    110,
    '',
    false,
    ARRAY['transformation', 'trust', 'hope', 'future']
  );
END $$;