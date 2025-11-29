-- Fix script with NULL what_to_expect
UPDATE scripts
SET what_to_expect = '{
  "first_30_seconds": "They may still drift within the first step. That''s normal. Redirect once, calmly.",
  "by_2_minutes": "You''ll have completed 1-2 steps. The checklist will start acting as the ''reminder'' instead of your voice.",
  "this_is_success": "They complete getting dressed with you standing nearby - even if you had to redirect 5+ times. Over time, the redirects decrease.",
  "dont_expect": [
    "Them to suddenly stay focused without your presence - that takes months of practice",
    "The checklist to work immediately - give it 5-7 days of consistent use",
    "Zero drifting - their brain will always wander, you''re just catching it faster"
  ]
}'::jsonb
WHERE id = '3f795810-31bc-4b44-b8cd-289613a74a76';

-- Fix script with lowercase category
UPDATE scripts
SET category = 'Transitions'
WHERE id = 'b84102ab-ed37-4926-b4d5-67d929658614';