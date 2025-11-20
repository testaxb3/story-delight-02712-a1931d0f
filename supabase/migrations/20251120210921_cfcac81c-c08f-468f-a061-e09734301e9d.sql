-- Fix common_variations JSON structure for second script - use correct field names
UPDATE scripts 
SET common_variations = '[
  {
    "variation_scenario": "\"I forgot what I was supposed to do\" (genuine working memory failure)",
    "variation_response": "\"That''s why we wrote it down. Look at the sticky note on the screen. What does it say?\" (Redirect to external memory aid without shame.)"
  },
  {
    "variation_scenario": "\"Can I just finish this video first?\" (negotiation attempt)",
    "variation_response": "\"Timer says 10 minutes. If you use 3 minutes on the video, you have 7 left for your actual task. Your choice.\" (Let them manage the constraint themselves.)"
  },
  {
    "variation_scenario": "They complete the task in 2 minutes, want to keep using the tablet for the remaining 8 minutes",
    "variation_response": "\"Deal is: task done, tablet goes back. But you did it fast! That earns you 10 extra minutes after dinner. Tablet goes here now.\" (Honor the boundary, reward efficiency separately.)"
  },
  {
    "variation_scenario": "\"The timer is broken! It''s going too fast!\"",
    "variation_response": "\"Timer runs at regular speed. It feels fast because you were focused somewhere else. Task time is up — tablet goes here.\" (Acknowledge time blindness without debating.)"
  }
]'::jsonb
WHERE title = 'Opens tablet ''just to check one thing'' - emerges 2 hours later';