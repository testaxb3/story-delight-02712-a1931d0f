-- Fix common_variations field names for INTENSE bedtime script
UPDATE scripts
SET common_variations = '[
  {
    "variation_scenario": "\"You can''t make me!\"",
    "variation_response": "\"You''re right. I can''t make you stay in bed. That''s your choice. And my choice is to keep bringing you back. Every. Single. Time.\" Then walk them back silently."
  },
  {
    "variation_scenario": "\"I hate you!\"",
    "variation_response": "\"I hear you''re angry. Bedtime is still bedtime.\" Stay calm. Return them to bed without engaging."
  },
  {
    "variation_scenario": "Child asks for water/bathroom repeatedly",
    "variation_response": "\"One water trip, one bathroom trip. After that, I''ll keep bringing you back.\" Then follow through consistently."
  },
  {
    "variation_scenario": "\"I''m scared/lonely\"",
    "variation_response": "\"I know. I''m right outside. You''re safe. Time to rest now.\" Brief validation, then exit. Don''t negotiate or extend conversation."
  }
]'::jsonb
WHERE title = 'Bedtime resistance - won''t stay in bed' AND profile = 'INTENSE';