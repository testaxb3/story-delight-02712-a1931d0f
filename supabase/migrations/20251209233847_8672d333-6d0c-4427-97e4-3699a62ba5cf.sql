-- Create new free audio series: Ending The Screen Wars
INSERT INTO public.audio_series (
  name,
  slug,
  description,
  icon_name,
  display_order,
  unlock_key,
  track_count,
  total_duration
) VALUES (
  'Ending The Screen Wars',
  'ending-the-screen-wars',
  'Transform screen time battles into peaceful transitions. Learn science-backed strategies to help your child develop a healthy relationship with devices.',
  'Smartphone',
  10,
  NULL, -- NULL unlock_key = free for all
  10,
  0 -- Will be updated as tracks are added
);

-- Get the series ID for inserting tracks
DO $$
DECLARE
  v_series_id UUID;
BEGIN
  SELECT id INTO v_series_id FROM public.audio_series WHERE slug = 'ending-the-screen-wars';
  
  -- Insert all 10 tracks (all free with is_preview=true)
  INSERT INTO public.audio_tracks (series_id, track_number, title, description, audio_url, duration_seconds, is_preview, tags) VALUES
  (v_series_id, 1, 'The Zombie Effect', 'Understanding what really happens to your child''s brain during extended screen time—and why it''s not their fault.', '', 0, true, ARRAY['screen-time', 'neuroscience', 'understanding']),
  (v_series_id, 2, 'The Dopamine Hijack', 'How apps and games are designed to trap your child''s attention, and how to break the cycle.', '', 0, true, ARRAY['screen-time', 'dopamine', 'addiction']),
  (v_series_id, 3, 'The Educational Lie', 'The truth about "educational" apps and games—what actually helps your child learn and what doesn''t.', '', 0, true, ARRAY['screen-time', 'education', 'learning']),
  (v_series_id, 4, 'The No-War Announcement', 'How to announce new screen limits without triggering World War III in your home.', '', 0, true, ARRAY['screen-time', 'boundaries', 'communication']),
  (v_series_id, 5, 'Surviving The Withdrawal', 'What to expect in the first 72 hours of reduced screen time, and exactly what to say during meltdowns.', '', 0, true, ARRAY['screen-time', 'withdrawal', 'tantrums']),
  (v_series_id, 6, 'The Boredom Superpower', 'Why boredom is your child''s secret weapon for creativity—and how to protect it.', '', 0, true, ARRAY['screen-time', 'boredom', 'creativity']),
  (v_series_id, 7, 'The Invisible Invitation', 'Replace screen time with connection time using activities that actually compete with devices.', '', 0, true, ARRAY['screen-time', 'connection', 'activities']),
  (v_series_id, 8, 'The Restaurant Rescue', 'Specific scripts for the most common screen time battles: restaurants, car rides, and waiting rooms.', '', 0, true, ARRAY['screen-time', 'public', 'scripts']),
  (v_series_id, 9, 'The Guilt-Free Reset', 'How to model healthy screen habits yourself without becoming a hypocrite.', '', 0, true, ARRAY['screen-time', 'modeling', 'parents']),
  (v_series_id, 10, 'The Child Returns', 'Signs your child is developing a healthy relationship with screens—and how to celebrate without backsliding.', '', 0, true, ARRAY['screen-time', 'success', 'maintenance']);
END $$;