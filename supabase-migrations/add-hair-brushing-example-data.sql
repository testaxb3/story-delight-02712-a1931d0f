-- Example data for Hair Brushing Battle script
-- This updates the hygiene hair brushing script with new guidance fields

UPDATE scripts
SET
  difficulty_level = 'Moderate',
  age_range = '3-8',
  duration_minutes = 5,

  -- Step 1 guidance
  say_it_like_this_step1 = 'Get down to eye level, speak softly, and acknowledge the physical sensation without dismissing it',
  avoid_step1 = 'Saying "it doesn''t hurt" or "stop being dramatic"',

  -- Step 2 guidance
  say_it_like_this_step2 = 'Offer choices calmly, present all options equally without preference',
  avoid_step2 = 'Forcing your preferred solution or showing impatience',

  -- Step 3 guidance
  say_it_like_this_step3 = 'Hand them the brush gently, step back, let them lead completely',
  avoid_step3 = 'Grabbing the brush back or correcting their technique immediately',

  -- What to expect
  what_to_expect = ARRAY[
    'May take 2-3 tries before they fully trust the process',
    'Works best when child is calm, not mid-tantrum',
    'Adapt the exact words to match your natural speaking style'
  ],

  -- Related scripts (these will need to be replaced with actual script IDs)
  related_script_ids = ARRAY[]::text[]  -- Will be populated after we identify the actual script IDs

WHERE title ILIKE '%hair%brush%' OR title ILIKE '%hygiene%'
  AND category ILIKE '%hygiene%';

-- Note: To properly set related_script_ids, run a query like:
-- UPDATE scripts SET related_script_ids = ARRAY[
--   (SELECT id FROM scripts WHERE title ILIKE '%bath%' LIMIT 1),
--   (SELECT id FROM scripts WHERE title ILIKE '%transition%' LIMIT 1),
--   (SELECT id FROM scripts WHERE title ILIKE '%tantrum%' LIMIT 1)
-- ]
-- WHERE title ILIKE '%hair%brush%';
