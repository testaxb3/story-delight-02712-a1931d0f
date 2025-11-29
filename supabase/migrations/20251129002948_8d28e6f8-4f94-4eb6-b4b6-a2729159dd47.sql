
INSERT INTO public.scripts (
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
  '"I''M READY!" - Standing at the door in pajamas, one sock, no shoes, backpack somewhere, genuinely confused why you''re upset',
  'Morning Routines',
  'DISTRACTED',
  4,
  8,
  'Moderate',
  6,
  E'From their perspective, they ARE ready.\n\nThey got up. They went to their room. They touched their clothes. They did... things. Morning things. Getting-ready things.\n\nNow they''re standing at the front door, backpack strap over one shoulder (backpack is open, lunch box still on the counter), wearing:\n- Yesterday''s pajama top (inside out)\n- One sock (the other one is on their stuffed bear upstairs)\n- No shoes\n- Hair looking like they fought a pillow and lost\n\n"I''M READY! Why aren''t we LEAVING? You said be ready at 7:30!"\n\nThey''re pointing at the clock. It says 7:28. They''re *early*. They''re PROUD of being early. They did EVERYTHING right.\n\nYou''re staring at them, coffee cup frozen mid-air, trying to process how a human can be 0% ready and 100% confident simultaneously.\n\n"Honey... where are your pants?"\n\nThey look down. Genuine shock. "Oh."\n\nThis is DISTRACTED reality: their brain genuinely cannot track multiple incomplete tasks. They touched the pants. They *intended* to wear the pants. In their mind, that step is DONE.',
  E'**The first instinct: a detailed inventory.**\n\n"You don''t have shoes. Your backpack is empty. Where''s your lunch? Your shirt is inside out. That''s not even TODAY''S shirt."\n\nEach item feels like an attack to them. They''re not hearing a checklist—they''re hearing: "You failed. You failed. You failed. You failed."\n\n\n**The second instinct: exasperation.**\n\n"HOW can you think you''re ready?! LOOK at yourself!"\n\nBut here''s the thing: they DID look at themselves. They saw a person standing at the door with a backpack. That''s what "ready" looks like. The missing components are invisible to their brain.\n\n\n**The third instinct: taking over completely.**\n\nYou dress them. You pack them. You do everything while they stand there.\n\nNow they''ve learned nothing, you''re exhausted, and tomorrow will be identical. This approach fails because it treats the symptom (being undressed) instead of the cause (they can''t track incomplete tasks).',
  '[
    {
      "step_number": 1,
      "step_title": "Validate Their Effort First",
      "step_explanation": "They genuinely believe they completed the task. Starting with criticism will trigger shame and shutdown. Acknowledge what they DID accomplish before addressing gaps.",
      "what_to_say_examples": [
        "You got yourself to the door on time. That''s great.",
        "I can see you worked on getting ready. Let''s do a quick body scan together.",
        "You remembered your backpack! Now let''s check what else we need."
      ]
    },
    {
      "step_number": 2,
      "step_title": "External Checklist, Not Memory",
      "step_explanation": "Their brain cannot hold multiple incomplete items. Create a physical checklist posted by the door they can touch and verify. HEAD (hair brushed), BODY (shirt, pants), FEET (socks, shoes), HANDS (backpack packed, lunch inside).",
      "what_to_say_examples": [
        "Let''s check our door list together. Head—is your hair done?",
        "Touch each thing on the list and say it out loud with me.",
        "The list helps us both remember. Even grown-ups use lists."
      ]
    },
    {
      "step_number": 3,
      "step_title": "''Ready'' Becomes a Ritual, Not a Feeling",
      "step_explanation": "''Ready'' should mean ''checklist complete,'' not ''I feel done.'' Create a physical ritual: touch each item, say it aloud, get a checkmark. This builds external verification their brain can trust.",
      "what_to_say_examples": [
        "Ready means all four checks are done. Let''s count them.",
        "When you can touch all four things, you''re officially ready.",
        "Say ''check'' for each one you have. Head? Check! Body? Check!"
      ]
    }
  ]'::jsonb,
  E'DISTRACTED brains don''t track "incomplete." Once a task is started, their working memory marks it as handled and moves on—even if only 10% was actually done.\n\nA physical checklist externalizes the tracking. Their brain doesn''t have to hold the information because it''s right there on the wall.\n\nTouching + speaking creates sensory confirmation. When they physically touch their shoes and say "shoes—check," their brain gets concrete evidence that can''t be disputed or forgotten.\n\nOver time, this external scaffold becomes internalized. But even adults with DISTRACTED brains often keep checklists their whole lives—and that''s not failure, it''s smart adaptation.',
  '{
    "first_30_seconds": "They might resist the checklist initially—''I KNOW what ready means!'' Stay calm. ''I know you know. The list helps us both.''",
    "by_2_minutes": "Once the routine is established (3-5 mornings), they''ll start checking automatically before announcing they''re ready.",
    "this_is_success": "When they stop at the door, touch each item on the list without prompting, and genuinely catch missing items themselves before you say anything.",
    "dont_expect": [
      "Perfect readiness without the checklist—their brain needs external scaffolding",
      "Them to ''just remember'' after doing it once—repetition builds the neural pathway",
      "Zero forgotten items—some days will still have gaps, and that''s normal DISTRACTED reality"
    ]
  }'::jsonb,
  '[
    {
      "variation_scenario": "They get defensive: ''You always think I''m not ready!''",
      "variation_response": "''I know you worked hard. The checklist isn''t about not trusting you—it''s a tool that helps both of us. Even I use lists for important things.''"
    },
    {
      "variation_scenario": "They rush through the checklist without actually checking",
      "variation_response": "''Slow down. Touch each thing. If you can''t touch it, it''s not done yet. That''s what the list is for.''"
    },
    {
      "variation_scenario": "They''re missing something but insist they checked",
      "variation_response": "''Let''s go through it together. Head—touch your hair. Is it brushed? Body—touch your shirt. Is it the right way?'' Make it physical."
    }
  ]'::jsonb,
  E'**Before:** Take a breath. They''re not being defiant or lazy. Their brain genuinely processed "getting ready" as complete. Your frustration is valid, but expressing it will only add shame to confusion.\n\n**During:** Be a calm narrator, not a critic. You''re helping them build a skill their brain doesn''t do automatically. Think of it like teaching them to tie shoes—you wouldn''t yell at them for not knowing how.\n\n**Your anchor thought:** "They believe they''re ready. My job is to give them tools to see what I see."',
  ARRAY['morning', 'getting-ready', 'checklist', 'routine', 'self-awareness', 'executive-function', 'task-completion'],
  false
);
