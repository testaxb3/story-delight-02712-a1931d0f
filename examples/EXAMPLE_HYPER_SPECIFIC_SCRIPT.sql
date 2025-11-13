-- EXAMPLE: Hyper-Specific Script in New Format
-- This demonstrates the complete transformation from generic to hyper-specific

-- Water Temperature Feels 'Wrong' - Refuses to Enter Tub
INSERT INTO scripts (
  -- BASIC INFO
  title,
  category,
  profile,
  tags,

  -- AGE & DIFFICULTY
  age_min,
  age_max,
  difficulty,
  duration_minutes,

  -- LOCATION & CONTEXT (kept for filtering)
  location_type,
  time_optimal,
  parent_state,
  emergency_suitable,
  works_in_public,
  requires_preparation,

  -- OLD FIELDS (kept for backward compatibility during transition)
  wrong_way,
  phrase_1,
  phrase_1_action,
  phrase_2,
  phrase_2_action,
  phrase_3,
  phrase_3_action,
  neurological_tip,
  estimated_time_minutes,

  -- NEW HYPER-SPECIFIC STRUCTURE
  the_situation,
  what_doesnt_work,
  strategy_steps,
  why_this_works,
  what_to_expect,
  common_variations,
  parent_state_needed,
  related_script_ids

) VALUES (
  -- BASIC INFO
  'Water temperature feels ''wrong'' - refuses to enter tub',
  'Hygiene',
  'INTENSE',
  ARRAY['bath', 'hygiene', 'sensory', 'temperature', 'water', 'evening routine'],

  -- AGE & DIFFICULTY
  3,
  10,
  'Moderate',
  5,

  -- LOCATION & CONTEXT
  ARRAY['home', 'bathroom'],
  ARRAY['evening'],
  ARRAY['exhausted', 'frustrated', 'rushed'],
  false,
  false,
  false,

  -- OLD FIELDS (backward compatibility - can be NULL later)
  'The water is FINE! I just tested it myself! Stop being dramatic and get in NOW!',
  'Yeah, it doesn''t feel right to you.',
  'Sit at their level. Speak softly. Don''t argue about temperature.',
  'I know it feels too hot/cold right now, AND you still gotta get clean.',
  'Offer them control: add cold water, test with hand, or feet first.',
  'You make it the right temp. I''ll wait.',
  'Let them adjust within safe limits.',
  'INTENSE kids = sensory processing overdrive. Control activates prefrontal cortex, not amygdala.',
  5,

  -- NEW HYPER-SPECIFIC STRUCTURE

  -- THE SITUATION (2-3 paragraphs, vivid, relatable)
  'Child sees or touches the bathwater and immediately freaks out. Says it''s "too hot," "too cold," "feels weird," or "hurts my skin" even though you just tested it and the temperature is perfectly normal.

They may cry, refuse to get in, try to escape the bathroom, or have a full meltdown. This isn''t defiance - their sensory system genuinely perceives the water temperature as threatening or painful, even when it''s objectively fine.

You''re exhausted, they need to be clean, and you just want bedtime to happen without a 45-minute battle.',

  -- WHAT DOESN'T WORK (bullets + consequences)
  '• "The water is FINE! I just tested it myself!"
• "You took a bath yesterday with no problem!"
• "Stop being so dramatic. Get in NOW!"
• "If you don''t get in, no iPad tomorrow."

→ Forcing them in physically: Makes sensory sensitivity worse over time and creates bath trauma
→ Arguing about whether water is "actually" wrong: You''re debating their neurological reality (impossible to win)
→ Rushing through while they''re distressed: Confirms "bath = dangerous" in their brain',

  -- STRATEGY STEPS (JSONB array of step objects)
  '[
    {
      "step_number": 1,
      "step_title": "ACKNOWLEDGE IT''S REAL TO THEM",
      "step_explanation": "Don''t argue about whether the water is \"actually\" hot/cold. To their nervous system, it IS wrong right now.",
      "what_to_say_examples": [
        "Yeah, it doesn''t feel right to you.",
        "I know it feels too hot/cold right now.",
        "Your body is telling you something''s off.",
        "That''s real for you. I get it."
      ]
    },
    {
      "step_number": 2,
      "step_title": "HOLD THE BOUNDARY (bath still happens)",
      "step_explanation": "Don''t debate IF they bathe - just HOW. Remove the power struggle about whether bath happens.",
      "what_to_say_examples": [
        "You still gotta get clean tonight.",
        "Bath is happening, but we can adjust it.",
        "Not skipping bath, but let''s figure this out together.",
        "Bodies need washing. Let''s make it work for you."
      ]
    },
    {
      "step_number": 3,
      "step_title": "GIVE THEM CONTROL (within limits)",
      "step_explanation": "Let them fix the \"wrong\" temperature themselves within safe boundaries. This activates problem-solving instead of panic.",
      "what_to_say_examples": [
        "Wanna add more cold water? Go ahead.",
        "Test it with your hand first, tell me what you need.",
        "You make it the right temp. I''ll wait.",
        "You get 2 adjustments, then we''re bathing. Choose carefully.",
        "Just your feet first. Stand in it for 10 seconds.",
        "Wet your arms, see how it feels."
      ]
    }
  ]'::jsonb,

  -- WHY THIS WORKS (30% reduced per user request)
  'INTENSE kids have hyperactive sensory processing (insular cortex overdrive). Water temperature that feels "normal" to you genuinely registers as painful or threatening to them.

Arguing about whether it''s "actually fine" doesn''t work because you''re debating their neurological reality. It''s like telling someone with a migraine "the lights aren''t that bright."

Giving them control activates their prefrontal cortex (decision-making) instead of amygdala (panic). They stop fighting YOU and start solving THE PROBLEM.

Graduated exposure (feet first, then body) prevents full overwhelm. Their nervous system can adapt gradually instead of hitting panic mode instantly.',

  -- WHAT TO EXPECT (JSONB timeline object)
  '{
    "first_30_seconds": "Still resistant, but less screaming. May test water multiple times with hands. Breathing starts to slow down. Body tension reduces slightly.",
    "by_2_minutes": "Usually in bath (may still be standing, not sitting - that''s fine). Still complaining but cooperating. Tension in face and shoulders visibly reduces. May start playing or washing self.",
    "dont_expect": [
      "Instant happy cooperation",
      "No complaints at all",
      "Them to admit you were right about temperature",
      "Perfect bathing behavior"
    ],
    "this_is_success": "They get in bath without escalating to full meltdown. Still grumpy? Normal. Still complaining? Expected. Did they eventually bathe? WIN."
  }'::jsonb,

  -- COMMON VARIATIONS (JSONB array)
  '[
    {
      "variation_scenario": "If they keep adding cold water forever",
      "variation_response": "You get 2 adjustments, then we''re bathing. Pick carefully."
    },
    {
      "variation_scenario": "If they refuse to even test the water",
      "variation_response": "Not getting in yet. Just touch it with one finger. That''s all I''m asking."
    },
    {
      "variation_scenario": "If they say it''s perfect then change their mind 30 seconds later",
      "variation_response": "Your body changed its mind. That happens. One more adjustment, then we go."
    },
    {
      "variation_scenario": "If they''re so dysregulated they can''t engage with ANY option",
      "variation_response": "Abort mission. Say: ''Bodies can skip one night. Let''s do washcloth on face and hands.'' Quick wipe down = clean enough. Try again tomorrow."
    }
  ]'::jsonb,

  -- PARENT STATE NEEDED
  'Calm, patient, non-reactive. If you''re frustrated/rushed, they feel it and get worse.',

  -- RELATED SCRIPTS (array of UUIDs - would be real IDs in production)
  ARRAY[]::uuid[]
);

-- Notes on this script:
-- ✅ Title is hyper-specific: "Water temperature feels 'wrong'" not "Bath Time Sensory Issues"
-- ✅ The Situation is vivid, 3 paragraphs, parent thinks "YES this is my life"
-- ✅ What Doesn't Work has actual quotes parents say + consequences
-- ✅ Strategy has 3 steps with 4-6 natural phrase examples each
-- ✅ Why This Works is reduced 30%, essential neuroscience only
-- ✅ What to Expect has realistic timeline + "Don't Expect" section
-- ✅ Common Variations covers 4 edge cases
-- ✅ Language is natural, conversational, how parents actually talk

-- VALUE PERCEPTION: This feels like a $200 custom consultation, not a $10 generic ebook
