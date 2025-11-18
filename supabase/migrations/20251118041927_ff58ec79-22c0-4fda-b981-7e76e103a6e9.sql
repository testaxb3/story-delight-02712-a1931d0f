-- Fix common_variations field names for DEFIANT bedtime script
UPDATE scripts
SET common_variations = '[
  {
    "variation_scenario": "\"You can''t make me!\"",
    "variation_response": "\"You''re right. I can''t make you get ready. That''s your choice. And my choice is lights out at 8:30 either way.\" Then walk away."
  },
  {
    "variation_scenario": "\"I hate you!\"",
    "variation_response": "\"I hear you''re angry. That''s okay. Bedtime is still 8:30.\" Stay calm. Do not engage emotionally."
  },
  {
    "variation_scenario": "Child gets ready at 8:29",
    "variation_response": "\"Great choice. You got ready just in time. Let''s read together.\" No lecture about cutting it close. Acknowledge the choice."
  },
  {
    "variation_scenario": "Child melts down when lights go out",
    "variation_response": "\"I know this feels hard. You can try again tomorrow.\" Stay calm. Exit the room. Do not negotiate."
  }
]'::jsonb
WHERE title = 'Bedtime resistance - fighting control' AND profile = 'DEFIANT';