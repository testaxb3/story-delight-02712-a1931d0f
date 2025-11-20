-- BEDTIME / INTENSE Script: Sensory-Driven Bed Remaking
-- Quality Framework Applied: Scene-Based situation, Escalation Sequence for mistakes
-- Pre-Creation Validation: Unique scenario (not "won't stay in bed" or "racing mind"), 
-- hyper-specific observable behavior (strips bed at 10PM, sensory complaint), 
-- exact timing and physical details included

INSERT INTO scripts (
  title,
  category,
  profile,
  age_min,
  age_max,
  difficulty_level,
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
  'Strips entire bed at 10PM - sheets feel "wrong" and must remake bed perfectly',
  'Bedtime',
  'INTENSE',
  5,
  11,
  'Moderate',
  8,
  
  -- THE SITUATION (Scene-Based Structure)
  'It''s 10:14 PM. Your child has been "in bed" since 8:30 PM. You''ve already done the routine: bath, pajamas, story, lights out. You''re finally sitting down when you hear it—the distinctive sound of sheets being ripped off the mattress.

You walk to their room. Every single item is on the floor: fitted sheet, flat sheet, duvet, pillows, stuffed animals. Your child is standing on the bare mattress, face flushed, tears starting. "It feels WRONG. The bumps are wrong. I need to fix it. I can''t sleep like this."

You notice: one small wrinkle where the fitted sheet bunched near the corner. That''s it. That''s the "wrong" that triggered a complete bed teardown 90 minutes after bedtime.',
  
  -- WHAT DOESN'T WORK (Escalation Sequence)
  '**❌ COMMON MISTAKE 1: "The sheets are fine, just get back in bed"**

→ Why it fails: You''re telling their nervous system to ignore a signal it''s screaming about.

→ The neuroscience: INTENSE brains have heightened interoceptive awareness—they genuinely feel sensory input more intensely. That wrinkle ISN''T "fine" to their nervous system. Dismissing it escalates the sensory distress.


**❌ COMMON MISTAKE 2: Helping them remake the bed while saying "This is the last time"**

→ Why it fails: You''re solving the problem but creating a pattern: strip bed → parent fixes → relief.

→ The neuroscience: You''ve just reinforced that when sensory discomfort happens, the solution is parent intervention + complete bed remake. You''ll be doing this tomorrow night too.


**❌ COMMON MISTAKE 3: Anger response: "You''ve been in bed for 90 minutes and NOW the sheets are wrong?!"**

→ Why it fails: Shame floods an already dysregulated nervous system.

→ The neuroscience: The amygdala is already firing (sensory threat detected). Adding parental anger triggers additional cortisol. Now they''re dealing with sensory overwhelm AND attachment rupture. Sleep becomes even more impossible.',
  
  -- STRATEGY STEPS (JSON structure)
  '[
    {
      "step_number": 1,
      "step_title": "Validate the Sensory Reality",
      "step_explanation": "Sit on the floor next to the bare mattress. Don''t touch the sheets yet. Make eye contact if they''ll give it, or sit parallel if they won''t. Say in a neutral, almost curious tone: \"Your body is telling you something feels wrong. I believe you. Let''s figure out what your body needs.\" Pause. Let that sink in. You''re not saying the sheets ARE wrong—you''re saying their FEELING is real. This distinction matters to the INTENSE brain that''s used to being told it''s \"too much.\"",
      "what_to_say_examples": [
        "\"I see you pulled everything off. Your body is giving you information.\"",
        "\"You''re not being difficult—you''re feeling something that''s hard to ignore.\"",
        "\"Let''s figure out what will help your body feel okay enough to rest.\""
      ]
    },
    {
      "step_number": 2,
      "step_title": "Offer The Two-Sheet Choice",
      "step_explanation": "Here''s the key: you prepared for this earlier. You have TWO complete sheet sets accessible (or you''ll implement this tomorrow). Present the choice: \"We have the blue sheets that are cool and smooth, or the gray sheets that are softer and warmer. Which one does your body think it needs tonight?\" They choose. You do NOT offer to remake their current sheets. The current sheets failed the sensory test. Remove that option. This prevents the 18-minute negotiation about \"maybe if we just smooth it better.\"",
      "what_to_say_examples": [
        "\"Blue sheets: cool and smooth. Gray sheets: soft and warm. Pick what your body needs.\"",
        "\"Point to which one. We''re going with that one tonight.\"",
        "\"No mixing—one full set. Choose now.\""
      ]
    },
    {
      "step_number": 3,
      "step_title": "Collaborate on The Remake with Role Assignment",
      "step_explanation": "Say: \"You make it how your body needs it. I''m the corner-tucker. You direct me.\" This is CRITICAL: they''re in charge of the sensory standard, you''re the physical assistant. Hand them the fitted sheet. Let them place it. You tuck the corners when they signal. They place the flat sheet, you tuck the end. They arrange pillows, you hold them steady. You are NOT doing it FOR them. You are ASSISTING their sensory regulation. When done: \"Check it. Does your body say okay?\" If they say yes, you leave immediately. No lingering. \"Goodnight. See you in the morning.\"",
      "what_to_say_examples": [
        "\"You''re the inspector. I''m the corner-tucker. Tell me when to tuck.\"",
        "\"Your hands do the smoothing. My hands do the tucking. Go.\"",
        "\"Feel it with your hand. Does this pass your body''s test? Yes or no.\""
      ]
    }
  ]'::jsonb,
  
  -- WHY THIS WORKS
  'INTENSE children have a lower threshold for sensory stimuli—their tactile receptors genuinely register input more intensely than neurotypical children. Research on sensory processing (Miller et al., 2012) shows this isn''t "pickiness"—it''s measurable nervous system difference.

The wrinkle that you don''t feel IS registering as aversive to their system. Fighting that is fighting their neurology.

The Two-Sheet Choice works because: (1) It validates sensory reality without judgment, (2) It gives them agency over the solution (control is regulating for INTENSE brains), (3) It makes YOU the assistant, not the fixer—they''re building the skill of sensory problem-solving.

The role assignment (inspector/tucker) prevents learned helplessness. They''re not watching you fix it—they''re directing the fix with you as support.

The immediate exit after approval prevents re-checking spirals. You trust their nervous system''s answer.',
  
  -- WHAT TO EXPECT (JSON structure)
  '{
    "first_30_seconds": "They might be skeptical of the choice offer. \"What if BOTH feel wrong?\" Hold firm: \"Pick the one that sounds better. We''ll know in 10 seconds if it works.\" Don''t offer a third option. Two is enough for decision-making without overwhelm.",
    "by_2_minutes": "They''ve chosen and started the remake. You''re tucking corners as directed. Watch for: they''re touching/smoothing the sheets repeatedly with their palm—this is self-regulation through tactile input. Don''t comment on it. It''s working.",
    "by_5_minutes": "Bed is remade. They''re doing the final check—running their hand across the surface, pressing the pillow. This is their nervous system asking: \"Safe now?\" When they stop checking and look at you, that''s your cue: \"Goodnight\" and exit.",
    "this_is_success": "Success = They stayed in the bed you remade together for the rest of the night, even if it took 8 minutes to remake. You didn''t fix it FOR them, you assisted them in fixing it. That''s the win. Tomorrow night you''ll prepare the two-sheet choice BEFORE bed, cutting the timeline.",
    "dont_expect": [
      "Don''t expect them to admit the sheets are \"fine\" after 30 seconds. Their nervous system needs the physical reset of remaking.",
      "Don''t expect this to be a one-time event. INTENSE children will need sensory resets periodically. You''re building a SYSTEM, not a one-off fix.",
      "Don''t expect them to choose quickly. They might touch both sheet sets before deciding. That''s sensory information gathering—let them.",
      "Don''t expect gratitude. They''re exhausted and dysregulated. A neutral \"okay\" when the bed passes their check IS the thank you."
    ]
  }'::jsonb,
  
  -- COMMON VARIATIONS (JSON structure)
  '[
    {
      "variation_scenario": "They strip the bed, you offer the choice, they say: \"I want THESE sheets but fixed right.\"",
      "variation_response": "Hold the boundary: \"These sheets already had their chance tonight. Your body said no. We''re using fresh sheets. Blue or gray?\" If they escalate: \"I understand you want these. Tonight we''re choosing from what''s available. Point to one.\" Do NOT re-offer the rejected sheets. That creates a negotiation loop."
    },
    {
      "variation_scenario": "They choose a sheet set, start the remake, then say: \"Actually this one feels wrong too. I want the other one.\"",
      "variation_response": "One switch allowed: \"Okay. One switch. We''re using gray now. This is the final choice.\" If they try to switch again: \"This is the one we''re using. Your body will adjust in a few minutes. Let''s finish making it.\" Unlimited switching becomes a delay tactic, not sensory regulation."
    },
    {
      "variation_scenario": "It''s 11:30 PM and they''ve now stripped the bed TWICE. You''re beyond exhausted.",
      "variation_response": "This is a sign the sensory issues are bigger than a sheet problem. Say: \"We''re keeping these sheets tonight. I''m sitting right here in this chair until you fall asleep.\" Sit. Stay. Your calm presence becomes the regulation tool when sensory interventions have failed. In the morning, consider whether medication, OT eval, or sleep environment changes are needed."
    }
  ]'::jsonb,
  
  -- PARENT STATE NEEDED
  'You need: **Neutral acceptance of sensory reality**. This is hard because it''s 10 PM and you''re exhausted and the sheets look FINE to you. But your nervous system is not their nervous system. 

You also need: **Clear boundaries around the solution**. You''re validating the feeling (real) without creating unlimited options (chaotic). Two choices. One remake. Done.

If you''re feeling rage rising (\"ARE YOU KIDDING ME RIGHT NOW\"), that''s your cue to take three deep breaths before entering their room. Your dysregulation will amplify theirs. They need you regulated to co-regulate with you.',
  
  ARRAY[
    'bedtime',
    'sensory processing',
    'intense',
    'perfectionism',
    'sheets',
    'tactile sensitivity',
    'nighttime',
    'sleep resistance',
    'control needs',
    'validation'
  ],
  
  false
);