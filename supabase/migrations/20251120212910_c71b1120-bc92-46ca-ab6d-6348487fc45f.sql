
-- Fix the what_to_expect JSON for the script just created
UPDATE scripts 
SET what_to_expect = '{
  "first_30_seconds": "They''ll be confused or defensive: \"But I wasn''t done explaining!\" or \"We were having fun!\" They genuinely believed the playdate was going well. Expect resistance. Their friend might visibly relax once freed from the monologue prison. Your child might feel embarrassed or frustrated when they realize they missed the cues.",
  "by_2_minutes": "By attempt 5-7, they''ll start pausing on their own to check: \"Wait, am I talking too much?\" The first few self-checks will be clunky—mid-sentence interruptions, awkward pivots. That''s progress. After 2-3 weeks, they might start ASKING their friend: \"Do you want to hear more or should we play?\" That''s the breakthrough.",
  "this_is_success": "Your child pauses mid-story, looks at their friend, and asks: \"Do you want to keep hearing about this or should we play something?\" That''s it. That''s the win. Even if it takes 3 weeks to get there.",
  "dont_expect": [
    "That they''ll naturally notice social cues without prompting (this takes YEARS of explicit teaching)",
    "That one conversation fixes the pattern (social skills are built through repetition, not insight)",
    "That they won''t hyperfocus again next playdate (they will—this is ongoing practice)",
    "That their friend won''t need rescue sometimes (some playdates will still require intervention)"
  ]
}'::jsonb
WHERE title = 'Playdate monologue - talks AT friend for 40 minutes straight about single topic';
