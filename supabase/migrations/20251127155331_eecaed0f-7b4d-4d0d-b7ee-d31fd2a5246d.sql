
INSERT INTO scripts (
  title, category, profile, age_min, age_max, difficulty, duration_minutes,
  the_situation, what_doesnt_work, strategy_steps, why_this_works,
  what_to_expect, common_variations, parent_state_needed, tags, emergency_suitable
) VALUES (
  'Arms crossed, backpack still zipped - ''You can''t make me do homework, it''s MY brain''',
  'Homework',
  'DEFIANT',
  6, 12,
  'Hard',
  12,
  
  E'The backpack hit the floor at 3:47 PM with that familiar thud. Now it''s 4:23 PM and it hasn''t moved an inch.\n\nYour 8-year-old is standing in the kitchen doorway, arms crossed so tight their knuckles are white. The worksheet is due tomorrow - 15 math problems that would take maybe 20 minutes if they''d just START.\n\n"You can''t make me do homework. It''s MY brain and I decide what goes in it."\n\nTheir jaw is set. Eyes narrowed. This isn''t negotiation - this is a fortress.\n\nYou can feel your own shoulders tensing. The afternoon snack sits untouched on the counter. Their younger sibling is watching from the living room, learning exactly how this plays out.\n\nYou''ve tried everything: timers, rewards, consequences, sitting with them, leaving them alone. Nothing works when they''re in THIS mode - the mode where compliance feels like losing.',
  
  E'**❌ COMMON MISTAKE #1: The Logic Lecture**\n\n"If you don''t do your homework, you''ll fail. If you fail, you won''t get into a good college. If you don''t go to college..."\n\nYour DEFIANT child doesn''t hear logic right now. They hear: "I''m trying to control your future too." The fortress gets thicker.\n\n\n**❌ COMMON MISTAKE #2: The Ultimatum**\n\n"Fine. No screens until homework is done. Period."\n\nThey''ll call your bluff or dig in harder. DEFIANT children will sacrifice their own comfort to prove they can''t be controlled. You just turned 15 math problems into a 3-hour power struggle.\n\n\n**❌ COMMON MISTAKE #3: The Guilt Trip**\n\n"I work so hard and you can''t even do 20 minutes of homework?"\n\nNow they feel attacked AND controlled. Their defiance becomes righteous. "See? You don''t even understand me."',
  
  '[
    {
      "step_number": 1,
      "step_title": "Acknowledge Their Autonomy (Mean It)",
      "step_explanation": "DEFIANT children need to feel their autonomy is REAL, not a trick to get compliance. Sit down at their level - not standing over them. Your body language says ''I''m not here to force you.'' Acknowledge their statement as valid, not as a problem to solve.",
      "what_to_say_examples": [
        "You''re right. I literally cannot make your brain do anything. That''s just... true.",
        "Your brain IS yours. You get to decide what you do with it.",
        "I hear you saying this feels like I''m trying to control you. That makes sense."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Name the Real Battle",
      "step_explanation": "DEFIANT children are rarely fighting about homework - they''re fighting about CONTROL. Name it directly. When you name the real issue, the fake battle (homework) loses its power. They feel SEEN, which is different from feeling managed.",
      "what_to_say_examples": [
        "I think this isn''t really about math problems. I think this is about whether anyone can MAKE you do things.",
        "You know what I notice? Every time something feels forced, you push back hard. That''s actually... kind of smart.",
        "Seems like the homework itself isn''t the problem. The problem is it doesn''t feel like YOUR choice."
      ]
    },
    {
      "step_number": 3,
      "step_title": "Offer REAL Choice (With Real Consequences)",
      "step_explanation": "Give them genuine agency - not fake choices. Real choice means they could actually choose NOT to do it, and you''ll let that happen. DEFIANT children can smell fake choices instantly. The consequence isn''t punishment from you - it''s the natural result at school tomorrow.",
      "what_to_say_examples": [
        "Here''s what I can do: I can sit with you while you do it, or I can leave you alone. Your call.",
        "You could do it now, or you could not do it and deal with whatever happens at school tomorrow. Both are actual options.",
        "I''m not going to force this. If you want help problem-solving, I''m here. If you want to handle the consequences yourself, that''s your right."
      ]
    }
  ]',
  
  E'The DEFIANT brain is wired for **autonomy detection**. Their nervous system literally activates threat responses when they sense someone trying to control them - even for "their own good."\n\nThis isn''t bad behavior. It''s a **hypersensitive boundary system**. Evolutionarily, humans who resisted control survived manipulation and exploitation.\n\nWhen you acknowledge their autonomy as REAL (not as a parenting trick), their prefrontal cortex can come back online. The threat response decreases. They can actually THINK about homework instead of fighting about control.\n\nResearch shows DEFIANT children respond dramatically better to **collaborative problem-solving** than to rewards/consequences. They need to feel like partners, not subjects.',
  
  '{
    "first_30_seconds": "They might look suspicious. ''Why aren''t you yelling?'' Their arms may stay crossed but their eyes will be watching you differently - calculating instead of defending.",
    "by_2_minutes": "The fortress posture often softens slightly. They might uncross their arms or sit down. Some kids will test you: ''So I really don''t have to do it?'' Stay calm. ''That''s one option, yes.''",
    "this_is_success": "Success is NOT immediate homework completion. Success is them engaging with you as a person instead of fighting you as an authority. They might say ''Fine, I''ll do it but only because I WANT to.'' That''s perfect. That''s exactly the point.",
    "dont_expect": [
      "Instant compliance or gratitude",
      "Them admitting you were right",
      "This working the first time without testing",
      "A completely pleasant homework session afterward"
    ]
  }',
  
  '[
    {
      "variation_scenario": "They say ''I don''t care about consequences at school''",
      "variation_response": "''Okay. That''s information about how you feel right now. You might feel differently tomorrow, or you might not. Either way, it''s your call.'' Don''t argue about whether they should care. They''re testing if you''ll take the bait."
    },
    {
      "variation_scenario": "They escalate: ''I HATE school! I''m NEVER doing homework AGAIN!''",
      "variation_response": "''That sounds really frustrating. Something about school feels really bad right now.'' Reflect the emotion, not the statement. The extreme statement is an expression of feeling, not a life plan."
    },
    {
      "variation_scenario": "They start the homework but do it badly on purpose",
      "variation_response": "Don''t comment on quality. ''You''re working on it. That''s between you and your teacher.'' Sabotage is still testing if you''ll try to control the HOW after giving up control of the WHETHER."
    }
  ]',
  
  'Calm certainty. You need to genuinely believe they have the right to make this choice - even the wrong one. If you''re faking it, they''ll know. Take a breath before engaging. This is not a battle to win.',
  
  ARRAY['homework', 'defiance', 'autonomy', 'control', 'power-struggle', 'school', 'evening-routine', 'boundaries'],
  false
);
