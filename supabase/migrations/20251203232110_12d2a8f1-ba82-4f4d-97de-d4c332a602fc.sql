-- Create "The Calm Parent's Daily Reset" series with audio_obedience_system unlock_key
INSERT INTO audio_series (
  name, slug, description, icon_name, display_order, 
  track_count, total_duration, unlock_key, cover_image
) VALUES (
  'The Calm Parent''s Daily Reset',
  'the-calm-parents-daily-reset',
  'A 10-part guided audio journey to transform how you respond to your child''s biggest emotions. Learn to regulate yourself first, so you can connect before you correct.',
  '🧘',
  4,
  10,
  2200,
  'audio_obedience_system',
  NULL
);

-- Insert all 10 tracks (3 free, 7 premium)
INSERT INTO audio_tracks (
  series_id, track_number, title, description, 
  audio_url, duration_seconds, is_preview
) VALUES 
-- FREE TRACKS (1-3)
((SELECT id FROM audio_series WHERE slug = 'the-calm-parents-daily-reset'), 1, 
 'The Storm Inside', 
 'Why your reaction to your child''s meltdown matters more than the meltdown itself',
 '', 220, true),

((SELECT id FROM audio_series WHERE slug = 'the-calm-parents-daily-reset'), 2, 
 'Your Child''s Brain Under Stress', 
 'Understanding what happens in your child''s brain during emotional moments',
 '', 220, true),

((SELECT id FROM audio_series WHERE slug = 'the-calm-parents-daily-reset'), 3, 
 'The Regulation Myth', 
 'Why telling yourself to "calm down" doesn''t work—and what does',
 '', 220, true),

-- PREMIUM TRACKS (4-10)
((SELECT id FROM audio_series WHERE slug = 'the-calm-parents-daily-reset'), 4, 
 'Your Physical Anchor', 
 'Discover the physical tool you can use anywhere, anytime',
 '', 220, false),

((SELECT id FROM audio_series WHERE slug = 'the-calm-parents-daily-reset'), 5, 
 'The Co-Regulation Dance', 
 'How your calm becomes their calm through mirror neurons',
 '', 220, false),

((SELECT id FROM audio_series WHERE slug = 'the-calm-parents-daily-reset'), 6, 
 'From Reacting TO to Responding WITH', 
 'The shift from fixing behavior to connecting with your child',
 '', 220, false),

((SELECT id FROM audio_series WHERE slug = 'the-calm-parents-daily-reset'), 7, 
 'Words That Heal vs. Words That Hurt', 
 'Specific word swaps that transform escalation into connection',
 '', 220, false),

((SELECT id FROM audio_series WHERE slug = 'the-calm-parents-daily-reset'), 8, 
 'Repair After the Storm', 
 'How to reconnect after you''ve lost your calm',
 '', 220, false),

((SELECT id FROM audio_series WHERE slug = 'the-calm-parents-daily-reset'), 9, 
 'Boundaries With Connection', 
 'Being a sturdy tree—firm trunk, flexible branches',
 '', 220, false),

((SELECT id FROM audio_series WHERE slug = 'the-calm-parents-daily-reset'), 10, 
 'Your Daily Practice', 
 'A simple 2-minute morning and evening routine',
 '', 220, false);