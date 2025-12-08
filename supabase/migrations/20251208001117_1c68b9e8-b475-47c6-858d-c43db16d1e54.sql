-- Create Morning Chaos To Calm series
INSERT INTO public.audio_series (name, slug, description, icon_name, display_order, unlock_key, track_count, total_duration)
VALUES (
  'Morning Chaos To Calm',
  'morning-chaos-to-calm',
  'Transform chaotic mornings into calm, connected moments with your child using brain-based strategies.',
  '☀️',
  5,
  'audio_obedience_system',
  10,
  0
);

-- Create tracks for Morning Chaos To Calm
INSERT INTO public.audio_tracks (series_id, track_number, title, description, audio_url, duration_seconds, is_preview)
SELECT 
  id as series_id,
  t.track_number,
  t.title,
  t.description,
  '' as audio_url,
  0 as duration_seconds,
  t.is_preview
FROM audio_series, (VALUES
  (1, 'The Morning Meltdown Trap', 'Understanding why mornings trigger the worst behaviors', true),
  (2, 'Why Mornings Feel Impossible', 'The hidden factors making your mornings chaotic', true),
  (3, 'The Brain Science of Morning Resistance', 'What''s really happening in your child''s brain each morning', true),
  (4, 'The Game-Changing Morning Reset', 'A complete shift in how you approach mornings', false),
  (5, 'The 3-Minute Morning Miracle', 'A quick technique that transforms the entire day', false),
  (6, 'When They Won''t Get Dressed', 'Specific strategies for the dressing battle', false),
  (7, 'The Breakfast Battle Solution', 'Ending mealtime struggles before school', false),
  (8, 'Racing Against The Clock', 'Managing time pressure without losing your calm', false),
  (9, 'Building Your Bulletproof Morning', 'Creating a sustainable morning routine', false),
  (10, 'Your New Morning Reality', 'Maintaining calm mornings long-term', false)
) AS t(track_number, title, description, is_preview)
WHERE audio_series.slug = 'morning-chaos-to-calm';