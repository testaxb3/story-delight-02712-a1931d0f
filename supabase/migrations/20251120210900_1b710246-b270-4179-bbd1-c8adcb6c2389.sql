-- Fix common_variations JSON structure - use correct field names
UPDATE scripts 
SET common_variations = '[
  {
    "variation_scenario": "\"The timer didn''t beep!\" (it did, they didn''t notice)",
    "variation_response": "\"I heard it beep, and I was right here. The screen goes off now. We can check the timer together if you want — see, it says 0:00.\" (Show evidence, stay neutral, don''t argue.)"
  },
  {
    "variation_scenario": "\"Just let me save my game first!\" (stalling tactic)",
    "variation_response": "\"You have 10 seconds to tap save. I''m counting. 10... 9... 8...\" (Give them agency within a tight boundary.)"
  },
  {
    "variation_scenario": "Mid-tantrum: throws the tablet, screams \"I hate you!\"",
    "variation_response": "\"I know you''re upset. The rule doesn''t change. When you''re calm, we''ll talk about what to do next time so this feels easier.\" (Don''t engage mid-meltdown; address it after regulation.)"
  },
  {
    "variation_scenario": "\"Why does [sibling] get more screen time than me?\"",
    "variation_response": "\"Different brains need different rules. Your brain works best with a timer and a countdown. That''s not a punishment — it''s what helps you feel good after screens instead of awful.\""
  }
]'::jsonb
WHERE title = 'Agrees to turn off tablet - genuinely forgets 30 seconds later';