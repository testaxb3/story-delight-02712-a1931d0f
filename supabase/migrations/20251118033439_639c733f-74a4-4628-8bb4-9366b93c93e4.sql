-- Delete the incorrectly formatted script
DELETE FROM scripts WHERE id = '677164ab-c6fd-4de7-80ff-aae7daf66c95';

-- Insert the properly formatted INTENSE bedtime script
INSERT INTO scripts (
  title,
  category,
  profile,
  the_situation,
  what_doesnt_work,
  strategy_steps,
  why_this_works,
  what_to_expect,
  common_variations,
  parent_state_needed,
  difficulty,
  age_min,
  age_max,
  estimated_time_minutes,
  tags
) VALUES (
  'Child refusing bedtime - still wired at 9pm',
  'bedtime',
  'INTENSE',
  'It''s 9pm. Your child is running laps around the living room, climbing furniture, or demanding "just one more thing." **Their body is clearly exhausted** (you can see the tiredness in their eyes), but their brain is stuck in high-alert mode. Every attempt to guide them toward bed is met with resistance, tears, or renewed bursts of energy.',
  '**What makes it worse:** Trying to force them to calm down ("Stop running! Get in bed NOW!"), reasoning with logic ("You''re so tired, you need sleep"), or giving ultimatums. Their amygdala is in overdrive - the reasoning part of their brain is offline. They literally cannot "choose" to calm down.',
  '[
    {
      "step_number": 1,
      "step_title": "Dim everything and drop your voice to a whisper",
      "step_explanation": "Lower all lights immediately - no overhead lights, only soft lamps or night lights. Switch to **whisper mode only**. This sends a biological signal to their brain that it''s winding-down time.\n\nThe INTENSE brain is hypersensitive to environmental stimulation. Bright lights and loud voices keep their nervous system activated.",
      "what_to_say_examples": [
        "\"I''m switching to my sleepy voice now... can you hear me?\"",
        "\"Wow, it got so quiet and cozy in here...\"",
        "\"Let''s see if we can whisper like little mice...\""
      ]
    },
    {
      "step_number": 2,
      "step_title": "Offer a sensory reset activity",
      "step_explanation": "Give them a **regulating physical task** that channels their energy while calming their system:\n\n• Heavy blanket or weighted stuffed animal to hold\n• \"Bear hugs\" (deep pressure hugs for 10 seconds)\n• Slow stretching like a cat\n• Pushing against a wall \"to see if they can move it\"\n\nThese activities activate their parasympathetic nervous system (rest mode).",
      "what_to_say_examples": [
        "\"Can you help me push this wall? Push as hard as you can for 10 seconds...\"",
        "\"Let''s do three giant bear hugs to squeeze out all the wiggles...\"",
        "\"Want to stretch super slow like a sleepy cat?\""
      ]
    },
    {
      "step_number": 3,
      "step_title": "Create a cozy \"nest\" together",
      "step_explanation": "Instead of demanding they get IN bed, invite them to build a cozy sleep nest WITH you. Let them choose their stuffed animals, arrange pillows, pick which blanket.\n\n**The key:** They''re doing something (active) that leads to rest (passive). Their brain accepts this transition because they feel in control.",
      "what_to_say_examples": [
        "\"Should we make your bed super cozy tonight? What do you need?\"",
        "\"Let''s build the best sleep nest ever... which stuffed friends are sleeping with you?\"",
        "\"I wonder if we can make it so cozy you won''t be able to stay awake...\""
      ]
    }
  ]'::jsonb,
  '**Why dimming works:** The INTENSE brain has a hyperactive reticular activating system (RAS) - the part that filters sensory input. Bright lights literally keep it in "alert mode." Dim lighting triggers melatonin release.\n\n**Why physical regulation works:** INTENSE children often have proprioceptive seeking behavior - they NEED physical input to regulate. Deep pressure, heavy work, and stretching activate the vagus nerve, which signals safety and calm.\n\n**Why choice works:** When you FORCE compliance, their brain perceives threat and doubles down on resistance. When you offer collaboration, their prefrontal cortex (thinking brain) can gradually come back online.\n\n**The transition:** You''re not fighting their energy - you''re **redirecting it into calming activities** until their body naturally winds down.',
  '{
    "first_30_seconds": "They may still be resistant or silly, testing whether you''re serious about the new approach. Keep your voice whisper-quiet and lights dim.",
    "by_2_minutes": "You''ll likely see the first signs of regulation - slower movements, deeper breaths, or willingness to engage with the sensory activity you offered.",
    "by_10_minutes": "Most INTENSE children will be noticeably calmer, possibly lying down in their nest, asking for stories or songs. Their fight-or-flight system is deactivating.",
    "dont_expect": [
      "Instant compliance or immediate sleepiness",
      "Them to suddenly become a different child who \"loves bedtime\"",
      "This to work if you skip the dimming or whisper voice"
    ],
    "this_is_success": "Success is seeing them TRANSITION from activated to regulated, even if they don''t fall asleep immediately. If they''re lying calmly in bed instead of running laps, you''ve won."
  }'::jsonb,
  '[
    {
      "variation_scenario": "\"They refuse to stop running/jumping\"",
      "variation_response": "Don''t fight it. Say: \"I can see your body has SO much energy! Let''s do 10 big jumps together to get it all out, then we''ll be ready for rest.\" Count the jumps together, then immediately transition to: \"Wow, that was big energy! Now let''s do slow stretches...\"",
      "why_this_works": "You''re giving their body what it''s asking for (movement) while maintaining control of the transition. After intense movement, the body naturally seeks rest."
    },
    {
      "variation_scenario": "\"They demand water, snacks, or ''one more thing''\"",
      "variation_response": "Stay in whisper mode: \"We can have water in bed. Let''s walk to get it verrrry slowly like sloths...\" Make every request part of the wind-down, not a delay tactic.",
      "why_this_works": "You''re saying yes while keeping momentum toward rest. Their brain learns that cooperation gets needs met faster than resistance."
    },
    {
      "variation_scenario": "\"They escalate to crying or tantrum\"",
      "variation_response": "This means their nervous system is too overwhelmed to regulate. Sit nearby quietly, keep lights dim, and wait. Offer deep pressure: \"Would a hug help?\" Don''t talk much.",
      "why_this_works": "When they''re in meltdown, verbal reasoning doesn''t work. Your calm, quiet presence is the regulation they need. Their brain will reset in 3-5 minutes."
    },
    {
      "variation_scenario": "\"They say they''re not tired\"",
      "variation_response": "Don''t argue. \"Your brain might not feel tired, but your body is getting rest time. Let''s just rest in your cozy nest - you don''t have to sleep yet.\"",
      "why_this_works": "Removes the pressure to \"sleep\" which paradoxically makes sleep more likely. Rest happens when resistance stops."
    }
  ]'::jsonb,
  'You need to be **calm and quiet yourself**. If you''re frustrated, rushed, or loud, their nervous system will mirror yours. This strategy requires 10-15 minutes of consistent, patient presence.',
  'Moderate',
  3,
  8,
  15,
  ARRAY['bedtime', 'hyperactivity', 'resistance', 'evening', 'regulation']
);