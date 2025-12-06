
INSERT INTO scripts (
  title,
  category,
  profile,
  age_min,
  age_max,
  difficulty,
  duration_minutes,
  the_situation,
  what_doesnt_work,
  strategy_steps,
  why_this_works,
  what_to_expect,
  common_variations,
  parent_state_needed,
  tags,
  emergency_suitable
) VALUES (
  'Keeps doing the thing you just asked them to stop - pretends not to hear you',
  'Daily Responsibilities',
  'DEFIANT',
  2,
  6,
  'Moderate',
  3,
  E'You say it clearly: "Please stop jumping on the couch."\n\nYour 3-year-old looks directly at you. Makes eye contact. Maybe even smiles slightly.\n\nThen continues jumping. Bounce. Bounce. Bounce.\n\nYou say it again, louder this time: "I said STOP jumping!"\n\nShe keeps going. Like you''re invisible. Like your words are background noise.\n\nYou feel the frustration rising in your chest. The heat in your face. That familiar mix of anger and helplessness.\n\n"Why won''t she just LISTEN?"\n\nYou''ve tried counting. You''ve tried explaining. You''ve tried raising your voice until it echoes off the walls.\n\nNothing. She just keeps doing the exact thing you asked her to stop.',
  E'**The Volume Escalation**\nSaying "stop" louder and louder from across the room, hoping volume will finally break through. It doesn''t. She''s learned to tune out yelling.\n\n\n**The Reason Lecture**\n"If you keep jumping, you''ll fall and hurt yourself!" Logic bounces off a 3-year-old''s brain like the words never existed.\n\n\n**The Countdown Threat**\n"I''m counting to three... ONE... TWO..." She knows you rarely follow through. The countdown has become meaningless noise.',
  '[
    {
      "step_number": 1,
      "step_title": "Move close and make physical contact",
      "step_explanation": "Words from across the room are easy to ignore. Walk directly to your child, get down to her eye level, and place your hand gently on her shoulder or back. This physical connection says ''I see you, and I''m here.''",
      "what_to_say_examples": [
        "Gently touch her shoulder and wait for eye contact",
        "Say her name softly once she''s looking at you",
        "Keep your hand on her as you speak"
      ]
    },
    {
      "step_number": 2,
      "step_title": "Tell her WHAT TO DO instead",
      "step_explanation": "A toddler brain processes action commands better than ''stop'' commands. ''Stop jumping'' requires her to figure out what to do instead. ''Feet on the floor'' gives her the exact action to take.",
      "what_to_say_examples": [
        "Feet on the floor, please.",
        "Sit on your bottom on the couch.",
        "Stand still like a statue for me."
      ]
    },
    {
      "step_number": 3,
      "step_title": "Guide physically if needed - without anger",
      "step_explanation": "If she doesn''t respond to words, help her body do what you''re asking. Gently lift her off the couch or guide her feet to the floor. This isn''t punishment - it''s helping her succeed at following the instruction.",
      "what_to_say_examples": [
        "I''m going to help your feet find the floor.",
        "Let me help you sit down.",
        "I''ll help you with that."
      ]
    }
  ]'::jsonb,
  E'**The ''Stop'' Problem**\nWhen you say "stop jumping," her brain hears the action word "jumping" loudest. You''re essentially reminding her of what she''s doing. "Feet on floor" gives her a NEW action to focus on.\n\n**Proximity Beats Volume**\nA calm voice from 2 feet away is 10x more effective than yelling from across the room. Physical closeness signals "this is serious" without triggering her defiance response.\n\n**Action Over Argument**\nAt 3, her prefrontal cortex (the reasoning part) is barely online. Explaining WHY she should stop is like speaking a foreign language. But her body can follow simple, clear directions.\n\n**Touch Activates Attention**\nGentle physical contact activates her parasympathetic nervous system, helping her calm down enough to actually hear you. Yelling does the opposite - it triggers fight-or-flight.',
  '{
    "first_30_seconds": "She may look surprised that you came close instead of yelling. Might test once more to see if you''ll actually follow through with physical guidance.",
    "by_2_minutes": "If you consistently move close, give positive instructions, and follow through with gentle physical help, she''ll start responding to your words alone.",
    "this_is_success": "Success is when she stops after ONE close-range positive instruction without needing physical guidance. This takes repetition over days, not minutes.",
    "dont_expect": [
      "Instant compliance the first time",
      "Her to suddenly ''get it'' after one try",
      "This to work if you''re yelling from across the room",
      "Perfect behavior - she''s 3, she''ll test again tomorrow"
    ]
  }'::jsonb,
  '[
    {
      "variation_scenario": "She laughs when you approach and tries to run away",
      "variation_response": "Don''t chase - that makes it a game. Calmly follow, take her hand, and guide her back. Say ''Running is for outside. Inside we walk.''"
    },
    {
      "variation_scenario": "She melts down when you physically guide her",
      "variation_response": "Stay calm and close. ''I know you wanted to keep jumping. The couch isn''t for jumping. You can jump on the floor or go outside.'' Hold the boundary while acknowledging her feelings."
    },
    {
      "variation_scenario": "It works but she does it again 5 minutes later",
      "variation_response": "This is normal at 3. Repeat the same process. Consistency over weeks builds the neural pathways. She''s not being defiant - she''s being 3."
    }
  ]'::jsonb,
  ARRAY['calm', 'patient', 'willing to move close'],
  ARRAY['defiance', 'not listening', 'ignoring', 'testing boundaries', 'toddler', 'preschooler', 'positive instructions', 'redirection'],
  true
);
