-- Fix what_to_expect structure for "Mind racing at bedtime" script
UPDATE scripts 
SET what_to_expect = jsonb_build_object(
  'first_30_seconds', 'They might resist at first: ''I don''t want to write. I just want to sleep!'' This is their brain protecting itself from vulnerability. Stay gentle: ''I know. Let''s try this tonight and see if it helps your brain calm down.''',
  'first_5_minutes', 'As you write their worries, they might start crying or their list might get longer before it gets shorter. This is GOOD. The emotional release is their nervous system starting to process what it''s been holding. Just keep writing, keep validating: ''I hear you. That sounds really hard. What else is your brain thinking about?''',
  'first_few_days', 'They''ll call you back multiple times the first 3-4 nights as they test whether this new routine is real. This is NORMAL. Consistency is everything. Each time: validate → brain dump if new worries appear → quick body scan → ''I love you, I''ll see you in the morning.'' No anger, no frustration.',
  'first_week', 'They''ll likely request the brain dump even on nights when their mind isn''t racing—it becomes a connection ritual. This is HEALTHY. The routine is teaching their brain: ''Bedtime isn''t a battle, it''s a safe transition.'' Let it be a positive ritual, not just a crisis tool.',
  'by_week_2', 'You''ll notice they start self-advocating: ''Mom, I need to do a brain dump'' BEFORE you even tuck them in. This is HUGE growth. Their brain is learning to recognize its own patterns and ask for help proactively. Celebrate this.',
  'by_week_3', 'The brain dumps get shorter. They''re processing worries DURING the day instead of stockpiling them for bedtime. You might also notice them doing modified body scans without prompting (''I''m going to feel my feet now'')—this is self-regulation developing.',
  'by_2_months', 'Most nights, they fall asleep within 10-15 minutes of tucking in. The racing mind doesn''t disappear completely (INTENSE brains don''t work that way), but they now have TOOLS to manage it. When worries do spike, they know exactly what to do.',
  'dont_expect', jsonb_build_array(
    'This to ''cure'' their INTENSE brain. They will always be more prone to pre-sleep mental activity than other kids. But you''re teaching them SKILLS to work WITH their brain, not fight it.',
    'Them to fall asleep in 5 minutes like some kids—their brain needs processing time, and that''s okay.'
  ),
  'this_is_success', 'Success is NOT ''never has racing thoughts at bedtime.'' Success is: they RECOGNIZE when their mind is racing, they KNOW what to do about it, and they can ASK for help or APPLY the tools independently. Success is a 10-year-old who says: ''My brain is busy tonight. I''m going to do my body scan.'' That''s self-awareness and self-regulation—the ultimate goal.'
)
WHERE title = 'Mind racing at bedtime - can''t stop thinking about tomorrow';