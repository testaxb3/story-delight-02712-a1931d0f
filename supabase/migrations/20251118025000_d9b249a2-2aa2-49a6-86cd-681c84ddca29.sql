-- Insert new INTENSE transitions script
INSERT INTO scripts (
  title,
  category,
  profile,
  tags,
  
  -- Legacy fields (backward compatibility)
  wrong_way,
  phrase_1,
  phrase_1_action,
  phrase_2,
  phrase_2_action,
  phrase_3,
  phrase_3_action,
  neurological_tip,
  
  -- New hyper-specific fields
  the_situation,
  what_doesnt_work,
  strategy_steps,
  why_this_works,
  what_to_expect,
  common_variations,
  parent_state_needed,
  
  -- Metadata
  age_min,
  age_max,
  difficulty_level,
  expected_time_seconds,
  requires_preparation,
  works_in_public,
  emergency_suitable
) VALUES (
  'Stopping Play to Leave the House',
  'transitions',
  'INTENSE',
  ARRAY['leaving', 'time pressure', 'morning', 'resistance'],
  
  -- Legacy fields
  'Stop playing right now! We need to go! Why do you always make us late?',
  'I see you''re really into that game.',
  'Kneel down to eye level',
  'It''s hard to stop something fun, AND we need to leave in 3 minutes.',
  'Hold their hand gently',
  'Would you rather pause it now or finish this level first?',
  'Stand and gesture toward door',
  'Intense brains have difficulty with abrupt transitions because their prefrontal cortex needs time to shift focus. The 3-minute warning activates their internal clock, reducing the shock of the transition.',
  
  -- New hyper-specific fields
  'Your INTENSE child is deeply absorbed in play (Legos, video game, art project). You need to leave for school/appointment in 5 minutes. Every attempt to interrupt them triggers immediate meltdown. The clock is ticking, you''re stressed, and you can feel the situation about to explode.',
  
  'What makes it worse: Announcing "We''re leaving NOW!", turning off screens without warning, rushing them physically, showing your stress/anger, threatening consequences, comparing to siblings who "listen better". Why it backfires: INTENSE brains are hyperfocused - sudden interruptions feel like physical pain. Your stress hormones trigger their stress response, creating a negativity spiral.',
  
  '[
    {
      "step_number": 1,
      "action": "Connect",
      "example_phrase": "I see you''re really into that game.",
      "physical_action": "Kneel to eye level, calm body language",
      "duration_seconds": 10,
      "why_it_works": "Acknowledges their current state without judgment"
    },
    {
      "step_number": 2,
      "action": "Validate + Reality",
      "example_phrase": "It''s hard to stop something fun, AND we need to leave in 3 minutes.",
      "physical_action": "Gentle hand on shoulder",
      "duration_seconds": 15,
      "why_it_works": "Validates emotion + introduces time boundary with AND instead of BUT"
    },
    {
      "step_number": 3,
      "action": "Choice",
      "example_phrase": "Would you rather pause it now or finish this level first?",
      "physical_action": "Stand ready but not rushing",
      "duration_seconds": 180,
      "why_it_works": "Gives control back to the child, reducing resistance"
    }
  ]'::jsonb,
  
  'INTENSE brains experience hyperfocus - their attention is like a spotlight that''s hard to redirect. The 3-minute warning activates their internal "transition timer" in the prefrontal cortex. Offering choice releases dopamine (motivation chemical) and reduces amygdala activation (fight/flight). Your calm nervous system regulates theirs through co-regulation.',
  
  '{
    "timeline": [
      {
        "time_marker": "Immediately",
        "what_happens": "Child may ignore you or show frustration - this is normal processing time"
      },
      {
        "time_marker": "30-60 seconds",
        "what_happens": "Child will likely choose an option and begin mental preparation to transition"
      },
      {
        "time_marker": "By 3 minutes",
        "what_happens": "80% success rate - child transitions with minimal resistance"
      }
    ],
    "success_criteria": [
      "Child transitions within 3-5 minutes",
      "No physical meltdown",
      "You remain calm"
    ],
    "if_it_doesnt_work": "Try adding a 5-minute warning before the 3-minute one. Some INTENSE kids need double warning."
  }'::jsonb,
  
  '[
    {
      "scenario": "Child refuses both choices and says NO",
      "response": "Okay, I hear you don''t want either option. In 2 minutes I''ll need to turn it off myself. I''ll be right here when you''re ready.",
      "why_this_works": "Maintains boundary while giving one more minute of autonomy"
    },
    {
      "scenario": "Sibling is ready and getting impatient",
      "response": "To sibling: Thanks for being ready! Can you grab your backpack? To INTENSE child: 2 minutes left, buddy.",
      "why_this_works": "Acknowledges cooperative sibling without shaming the INTENSE one"
    },
    {
      "scenario": "You''re already late and can''t wait 3 minutes",
      "response": "I know this is sudden. 30 seconds to say goodbye to your game. I''ll carry you if needed.",
      "why_this_works": "Honest about time limit + clear consequence without anger"
    }
  ]'::jsonb,
  
  'Calm but firm. You need to feel like you have 5 minutes even if you only have 3 - your stress will transfer to them. If you''re already panicked, take 3 deep breaths BEFORE approaching them.',
  
  -- Metadata
  3,  -- age_min
  12, -- age_max
  'Moderate',
  300, -- 5 minutes total
  false,
  true,
  false
);