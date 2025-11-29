
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
  'Teaching them to tie shoes - 3 weeks later they''ve learned the history of shoelaces, invented 4 new knots, but still can''t tie a basic bow',
  'Learning',
  'DISTRACTED',
  5,
  9,
  'Hard',
  12,
  E'Week 1, Day 1: You sit down to teach them to tie shoes.\n"Cross the laces, make a loop, wrap around..."\n\n"Wait - why are they called ''laces''? Who invented shoelaces? Did cavemen have shoelaces? What did THEY wear on their feet?"\n\nYou answer briefly. Try to redirect.\n\n"But HOW did they make rope without machines? Did they use animal hair? What animals have the strongest hair?"\n\nTwenty minutes later, you''ve covered ancient Rome, industrial revolution, and yak wool. The shoes are still untied.\n\n\nWeek 2: You try again. Different approach. YouTube tutorial.\n\nThey watch for 11 seconds before: "Why does the bunny go AROUND the tree? Why not THROUGH the tree? What if the bunny was a different animal? I''m going to invent a new way. I''ll call it the DRAGON method."\n\nThey spend 45 minutes creating elaborate knot designs that look impressive but don''t actually hold. They''ve named each one. "The Dragon Twist." "The Spaghetti Spiral." "The Chaos Pretzel."\n\nYou''re now 14 days in. The basic bow remains unlearned.\n\n\nWeek 3: Occupational therapist suggests breaking it into steps. "Just focus on making the first loop today."\n\n"Why is it called a LOOP? Is it related to LOOP-the-loop? Can shoelaces do loop-the-loops? What if I tied them to a toy and SPUN them really fast..."\n\nYou find them 20 minutes later, shoelaces tied to a fidget spinner, conducting "physics experiments" in the backyard.\n\n\nCurrent status: Your child can explain the tensile strength of cotton vs. polyester laces. They know that aglets (the plastic tips) were invented in 1790. They''ve created a taxonomy of knot categories.\n\nBasic bow? Still can''t do it. They''re wearing Velcro.',
  E'First you try: patience and repetition.\n"Let''s just practice the same way, over and over."\n\nThey make the first loop. Then wonder why loops exist. Then wonder about circles in general. Then they''re explaining their theory about why planets are round. The shoe sits forgotten.\n\n\nSecond you try: eliminating distractions.\nEmpty room. Just you, them, and the shoe.\n\nTheir brain creates distractions from nothing. The texture of the carpet. The way light hits the wall. A memory of something that happened at school three weeks ago that they suddenly NEED to tell you about right now.\n\n\nThird you try: making it "fun" with games and songs.\n"The bunny goes around the tree and down the hole!"\n\nNow they''re obsessed with bunnies. "What DO bunnies do in their holes? How deep do the holes go? Can we dig one in the backyard? I want to see what''s underground..."\n\nYou''ve made it worse. Every teaching attempt generates three new tangents. They''re learning everything EXCEPT the skill you''re teaching. Their brain makes connections you never imagined—just not the connection you need.',
  '[
    {
      "step_number": 1,
      "step_title": "Make the tangent the reward",
      "step_explanation": "Instead of fighting the tangent, harness it. Their curious brain now has MOTIVATION to complete the boring step—because the interesting stuff comes AFTER.",
      "what_to_say_examples": [
        "I love that you want to know about aglets! Here''s the deal: tie this bow, and we''ll watch a video about who invented them.",
        "Your curious brain gets fed, but AFTER the bow. One bow = five minutes of shoelace research together.",
        "The tangent isn''t going anywhere. It''s waiting for you. Bow first, then we explore."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Physical anchors, not mental instructions",
      "step_explanation": "Their working memory gets hijacked by interesting thoughts. Don''t rely on it. Use physical tape markers on the laces, photo sequence cards propped in front of them, or their hands physically positioned by yours.",
      "what_to_say_examples": [
        "Your job isn''t to remember the steps. Your job is to match what you see in this picture.",
        "See the red tape? Cross the laces right there. Brain can wander—hands follow the markers.",
        "I''m going to put your fingers in position. You don''t have to think. Just feel where they go."
      ]
    },
    {
      "step_number": 3,
      "step_title": "Name the superpower, then focus it",
      "step_explanation": "Their brain ISN''T broken. It''s a connection-making machine running on overdrive. Acknowledge this explicitly, then redirect that same power toward the task.",
      "what_to_say_examples": [
        "You just connected shoelaces to physics. That''s incredible. That''s your superpower brain.",
        "Now let''s use that same brain to crack THIS puzzle—the basic bow. Same brain, different target.",
        "Your brain finds patterns everywhere. Let''s find the pattern in THIS. What do you notice about how the loops cross?"
      ]
    }
  ]'::jsonb,
  E'DISTRACTED brains don''t have an attention DEFICIT—they have attention ABUNDANCE pointed in all directions simultaneously.\n\nTraditional teaching assumes: Input → Processing → Output.\nDISTRACTED learning actually works: Input → 47 Connections → 46 Tangents → Maybe Output.\n\nThese strategies work because they:\n\n• Stop treating tangents as the enemy (they ARE the learning)\n• Remove working memory from the equation (external anchors)\n• Frame their brain as a superpower, not a problem\n• Create motivation pathways their brain actually responds to\n\nThe goal isn''t to "fix" how they learn. It''s to build a bridge between how they naturally process and the skill you need them to acquire.',
  '{
    "first_30_seconds": "They''ll test if you REALLY mean they can explore the tangent after. ''So if I tie it, we ACTUALLY look up shoelace history?'' Yes. Really. Follow through or you lose all credibility.",
    "by_2_minutes": "The external anchors (pictures, tape markers) reduce the ''hold steps in brain'' load. They can tangent-think AND follow the visual. Both happen simultaneously.",
    "this_is_success": "When they tie the bow AND excitedly tell you three facts about shoelaces. The tangent learning didn''t stop—it just got sequenced AFTER the skill. Their brain is still their brain, just organized.",
    "dont_expect": [
      "Linear, focused learning like other kids - their path will always zigzag",
      "Them to suddenly stop making connections - that''s their brain''s operating system",
      "Quick mastery - skills take longer because each session includes exploration time",
      "The tangents to feel ''productive'' to you - they''re productive to THEIR brain''s development"
    ]
  }'::jsonb,
  '[
    {
      "variation_scenario": "They master the skill in a weird, unconventional way that technically works but looks nothing like what you taught",
      "variation_response": "If the shoe stays tied, it''s a win. Their brain found its own path. The ''Dragon Twist'' method? If it works, it works. Celebrate the problem-solving, not the conformity."
    },
    {
      "variation_scenario": "They regress after seeming to learn it, forgetting the skill days later",
      "variation_response": "Working memory didn''t consolidate it to long-term yet. More repetitions needed, but don''t panic. Pull out the visual anchors again. Their brain was busy processing all those connections—the motor skill got deprioritized."
    },
    {
      "variation_scenario": "They refuse to try because ''Velcro is easier and shoelaces are pointless anyway''",
      "variation_response": "Fair point, honestly. But frame it as: ''Your brain loves solving puzzles. This is just another puzzle. Velcro is easy—this is a CHALLENGE for your superpower brain.'' Appeal to their curiosity, not obligation."
    }
  ]'::jsonb,
  E'You need patience measured in weeks, not minutes. Accept that teaching this child ANY skill will include tangent time—budget for it. Your frustration is valid, but their brain isn''t malfunctioning. It''s doing exactly what it''s built to do: connect everything to everything. Your job is to be the bridge between their natural processing style and the skill acquisition you need.',
  ARRAY['learning', 'skill-acquisition', 'tangential-thinking', 'curiosity', 'focus', 'teaching', 'motor-skills', 'patience'],
  false
);
