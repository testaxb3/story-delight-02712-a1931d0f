-- Script 1: SOCIAL for INTENSE
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
  'Social rejection - child excluded from play',
  'social',
  'INTENSE',
  E'**The moment:** Your child comes to you crying or angry because other kids won''t let them join a game, said "we don''t want to play with you," or excluded them from a group activity.

**What''s really happening:** The INTENSE brain experiences social rejection as *physical pain*. Their anterior cingulate cortex (the brain''s "pain center") activates just as strongly from social exclusion as from physical hurt. Their emotional reaction isn''t "overreacting" — it''s genuinely overwhelming.

**Goal right now:** Validate their pain, co-regulate their nervous system, and give them tools to process rejection without internalizing it as "I''m unlovable."',
  E'**Worsens the situation:**

• **"They''re just playing. Don''t be so sensitive."** → Dismissing their pain teaches them their feelings are wrong, increasing shame.

• **"Go ask again. I''m sure they''ll let you play."** → Forcing them back into rejection compounds the hurt and can create social anxiety.

• **"Those kids aren''t nice. You don''t want to play with them anyway."** → This teaches them to avoid all social challenges, not resilience.

**Why these backfire:** The INTENSE brain is already flooded with cortisol (stress hormone). Logic and minimization don''t calm the nervous system — they activate more defensiveness.',
  '[
    {
      "step_number": 1,
      "step_title": "Name the pain and co-regulate",
      "step_explanation": "Sit at their level and **acknowledge the emotional pain as real**. Use physical co-regulation:\n\n• Offer a hug or place a hand on their shoulder (if they accept touch)\n• Take slow, exaggerated breaths and invite them to match you\n• Say exactly what happened without judgment\n\n**The key:** You''re teaching them their feelings are valid while showing them how to calm the storm.",
      "what_to_say_examples": [
        "\"That really hurt your feelings when they said you couldn''t play. I see how much that hurts.\"",
        "\"Being left out feels terrible. Let''s take some big breaths together...\"",
        "\"Your heart is feeling really sad right now. That makes sense.\""
      ]
    },
    {
      "step_number": 2,
      "step_title": "Reframe rejection as information, not identity",
      "step_explanation": "Help them understand that **being excluded doesn''t mean they''re unworthy** — it means that specific group wasn''t the right fit *in that moment*.\n\n• Separate the behavior from their identity: \"They chose not to include you\" vs. \"You''re unlikeable\"\n• Normalize rejection: \"This happens to everyone sometimes, even grown-ups\"\n• Empower them: \"You get to choose what to do next\"\n\n**Important:** Don''t force positivity. Just shift from \"I''m broken\" to \"This situation didn''t work out.\"",
      "what_to_say_examples": [
        "\"They were already playing their game. That doesn''t mean anything about YOU.\"",
        "\"Sometimes groups are already full or kids want to play with just certain friends. It''s not about you being good or bad.\"",
        "\"I know it hurts. And you''re still a great kid who deserves friends.\""
      ]
    },
    {
      "step_number": 3,
      "step_title": "Offer a choice: re-engage or redirect",
      "step_explanation": "Give them **autonomy** over what happens next. The INTENSE brain needs to feel in control after feeling powerless.\n\nOptions:\n\n• **Try a different approach:** \"Want to bring a cool toy and see if they''re interested?\"\n• **Find a different group:** \"Let''s see who else is playing something fun.\"\n• **Take a break:** \"Want to do something with me for a bit, then try again?\"\n\n**Never force them to \"get over it\" and rejoin immediately.** Healing takes time.",
      "what_to_say_examples": [
        "\"What do you want to do? We can try talking to them again, find other kids, or take a break.\"",
        "\"You get to choose. There''s no wrong answer.\"",
        "\"Sometimes taking a break helps. Want to swing together for a few minutes?\""
      ]
    }
  ]'::jsonb,
  E'**Why validation works:** When you acknowledge their pain without judgment, you activate their ventral vagal system (the calming nerve). This is how they learn to self-soothe later — by internalizing your compassionate voice.

**Why reframing works:** The INTENSE brain tends toward black-and-white thinking: "They rejected me = I''m unlovable forever." Helping them see rejection as *situational* (not personal) prevents shame spirals and builds resilience.

**Why choice works:** After rejection, they feel powerless. Offering choices restores agency and activates their prefrontal cortex (thinking brain), pulling them out of fight-or-flight mode.

**Long-term impact:** You''re teaching them that rejection is painful but *survivable*, and that their worth isn''t determined by one group''s acceptance. This is the foundation of healthy self-esteem.',
  '{
    "first_30_seconds": "They may still be crying, angry, or shutting down. Stay calm and present. Don''t rush them to \"feel better.\"",
    "by_2_minutes": "You''ll likely see them start to calm down — slower breathing, less tension in their body. They may lean into you or start talking about what happened.",
    "by_10_minutes": "Most INTENSE kids will be ready to make a choice about what to do next. Some will want to try again, others will want to play alone or with you for a bit.",
    "dont_expect": [
      "Them to immediately bounce back or forget the rejection",
      "A perfect resolution where the other kids apologize",
      "This to work if you minimize their feelings or force them to \"get over it\""
    ],
    "this_is_success": "Success is seeing them move from emotional flooding to calm decision-making, even if they choose NOT to rejoin the group. Healing matters more than forcing social interaction."
  }'::jsonb,
  '[
    {
      "variation_scenario": "\"They want revenge or to say mean things back\"",
      "variation_response": "Validate the anger WITHOUT endorsing retaliation: \"You''re so mad you want to hurt them back. That makes sense. AND, saying mean things will make it worse. Let''s find a way to feel better without hurting anyone.\" Redirect to physical release (running, squeezing a ball).",
      "why_this_works": "You''re teaching emotional regulation: feelings are valid, but we choose our actions. The INTENSE brain needs to discharge anger safely before rational thought returns."
    },
    {
      "variation_scenario": "\"They shut down and say ''I don''t care'' but clearly do\"",
      "variation_response": "Don''t argue with their defense mechanism. Say: \"I hear you saying you don''t care. Your body looks like it still hurts though. I''m here when you''re ready to talk.\" Stay nearby but give space.",
      "why_this_works": "Shutting down is a protective response. Forcing them to \"admit\" they care activates more shame. Your calm presence says ''I see you'' without pressure."
    },
    {
      "variation_scenario": "\"They say ''Nobody likes me'' or ''I have no friends''\"",
      "variation_response": "Don''t contradict with logic. Instead: \"Right now it feels like nobody likes you. That feeling is really hard. Let''s think about times when friends DID want to play with you...\" Gently remind them of positive social moments without dismissing current pain.",
      "why_this_works": "The INTENSE brain in distress can''t access positive memories. You''re helping them see a broader picture without invalidating their current suffering."
    },
    {
      "variation_scenario": "\"They refuse to ever try playing with those kids again\"",
      "variation_response": "Don''t force it. Say: \"Okay, you don''t have to play with them today. Maybe another day you''ll feel differently, or maybe you won''t. That''s up to you.\" Respect their boundary.",
      "why_this_works": "Forcing social interaction after rejection can create lasting social anxiety. They need time to heal. Trust that they''ll re-engage when ready."
    }
  ]'::jsonb,
  'You need to be **calm, present, and non-judgmental**. If you''re anxious about their social success or frustrated by their "overreaction," they''ll sense it and feel worse. Your emotional steadiness is their anchor.',
  'Moderate',
  3,
  10,
  15,
  ARRAY['social', 'rejection', 'exclusion', 'feelings', 'friendship']
);

-- Script 2: MORNING ROUTINE for INTENSE
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
  'Morning chaos - child refusing to get ready',
  'morning_routines',
  'INTENSE',
  E'**The moment:** It''s a school morning. Your child is still in pajamas, arguing about clothes, refusing to brush teeth, or melting down over breakfast. The clock is ticking, you''re stressed, and nothing is moving forward.

**What''s really happening:** The INTENSE brain struggles with **transitions** (sleep → awake → dressed → out the door). Each step requires executive function (planning, sequencing, impulse control) — which is *lowest* in the morning when their prefrontal cortex is still "waking up." Add time pressure, and their stress response activates.

**Goal this morning:** Create predictability, reduce decision fatigue, and use external structure to compensate for their not-yet-online executive function.',
  E'**Worsens the situation:**

• **"Hurry up! We''re going to be late!"** → Time pressure spikes their cortisol. They literally *can''t* move faster when stressed.

• **"Why can''t you just get dressed? It''s not hard!"** → Shaming their struggle increases resistance and meltdown risk.

• **Giving too many choices in the morning** → Decision-making requires brain energy they don''t have yet. Overwhelm freezes them.

**Why these backfire:** The INTENSE brain in the morning is running on autopilot (limbic system). Urgency, shame, and complexity all activate their threat response instead of helping them focus.',
  '[
    {
      "step_number": 1,
      "step_title": "Front-load preparation the night before",
      "step_explanation": "Remove as many morning decisions as possible by preparing the night before when their brain has more capacity:\n\n• Lay out clothes together (let them choose the night before)\n• Pack backpack and put it by the door\n• Decide on breakfast the night before\n• Set out toothbrush/hairbrush in obvious spot\n\n**The key:** You''re offloading cognitive load from their weakest time of day to their strongest.",
      "what_to_say_examples": [
        "\"Let''s pick tomorrow''s outfit together right now so morning is easier.\"",
        "\"What do you want for breakfast tomorrow? Let''s decide now.\"",
        "\"Everything ready by the door — one less thing to think about in the morning!\""
      ]
    },
    {
      "step_number": 2,
      "step_title": "Use a visual routine chart with timers",
      "step_explanation": "The INTENSE brain needs **external structure** when internal executive function is offline. Create a visual morning checklist with pictures:\n\n1. Get dressed\n2. Eat breakfast\n3. Brush teeth\n4. Shoes & backpack\n\nUse a timer for each step (not as pressure, but as structure): \"You have 10 minutes for breakfast. I''ll set the timer.\"\n\n**Important:** The routine chart is the boss, not you. This reduces power struggles.",
      "what_to_say_examples": [
        "\"Let''s check the chart — what''s the first thing?\"",
        "\"Timer says 5 minutes left for getting dressed. Can you beat it?\"",
        "\"The routine is the same every day. No surprises!\""
      ]
    },
    {
      "step_number": 3,
      "step_title": "Offer connection before compliance",
      "step_explanation": "The INTENSE brain resists demands when it doesn''t feel connected. Before asking them to DO anything, **spend 2-3 minutes connecting**:\n\n• Sit on their bed and chat about their dreams\n• Give them a hug or back rub\n• Play their favorite song while they wake up\n• Offer a special \"morning treat\" (not food — maybe choosing music for the car)\n\n**The shift:** When they feel seen and valued first, cooperation follows naturally.",
      "what_to_say_examples": [
        "\"Good morning! Tell me one thing you''re looking forward to today before we start the routine.\"",
        "\"Let''s have a 30-second dance party, then we''ll get dressed!\"",
        "\"I love mornings with you. Let''s do this together.\""
      ]
    }
  ]'::jsonb,
  E'**Why preparation works:** The INTENSE brain in the morning lacks the executive function for decision-making and planning. When you remove decisions (by preparing the night before), you remove obstacles.

**Why visual routines work:** The INTENSE brain is often visual-dominant. A chart provides external structure their internal executive function can''t yet provide. Timers add urgency without your nagging, reducing power struggles.

**Why connection works:** The INTENSE brain is relationship-driven. When they feel disconnected or unseen, their defiance reflex activates ("I won''t do what you want"). Connection first = cooperation follows. It''s not "spoiling" — it''s priming their nervous system for regulation.

**The morning shift:** You''re not making them independent overnight — you''re scaffolding their weak executive function until it develops (usually by age 10-12). This is support, not enabling.',
  '{
    "first_30_seconds": "They may still be groggy, resistant, or grumpy. Don''t take it personally. Stay calm and start with connection.",
    "by_2_minutes": "You''ll see them start engaging with the routine if you keep it low-pressure. They may check the chart or respond to the timer.",
    "by_10_minutes": "Most INTENSE kids will be moving through the routine if you''ve front-loaded prep and kept connection high. They won''t be fast, but they''ll be progressing.",
    "dont_expect": [
      "Speed or enthusiasm — mornings are hard for the INTENSE brain",
      "Perfection — some resistance is normal",
      "This to work without prep the night before or if you''re rushing/nagging"
    ],
    "this_is_success": "Success is getting out the door with minimal conflict, even if it takes longer than you''d like. You''re building habits that will eventually become automatic."
  }'::jsonb,
  '[
    {
      "variation_scenario": "\"They refuse to get out of bed at all\"",
      "variation_response": "Don''t pull them out or nag. Try: \"I know it''s hard to wake up. I''m going to turn on your favorite song and give you 5 minutes. Then I''ll come help you get up.\" Offer physical help (pulling blankets back gently, helping them sit up).",
      "why_this_works": "The INTENSE brain transitions slowly. Forcing them out of bed activates fight-or-flight. Gentle support + structure = easier wake-up."
    },
    {
      "variation_scenario": "\"They have a meltdown over clothing (too tight, wrong texture, etc.)\"",
      "variation_response": "Don''t fight it. The INTENSE brain has heightened sensory sensitivity. Say: \"Those pants feel wrong today. Let''s find something comfortable.\" Keep backup \"safe clothes\" that always feel okay.",
      "why_this_works": "Sensory discomfort is REAL for the INTENSE brain — not manipulation. Forcing uncomfortable clothes guarantees a bad morning. Accommodation = regulation."
    },
    {
      "variation_scenario": "\"They say they''re not hungry or refuse breakfast\"",
      "variation_response": "Don''t force eating. Offer a portable option: \"Okay, I''m packing a granola bar and banana for the car. You can eat when your body is ready.\" Let appetite return naturally after waking.",
      "why_this_works": "The INTENSE brain''s digestive system is slow to wake up. Forcing breakfast can cause nausea or power struggles. Portable food removes the battle."
    },
    {
      "variation_scenario": "\"Everything was fine until you said ''5 minutes until we leave'' and they melted down\"",
      "variation_response": "Time warnings can trigger panic in the INTENSE brain. Instead of countdowns, use the routine chart: \"We''re on the last step! Almost done!\" Focus on progress, not time pressure.",
      "why_this_works": "Countdowns activate their stress response (\"I''m running out of time!\"). Progress-focused language keeps them calm and moving forward."
    }
  ]'::jsonb,
  'You need to be **calm, prepared, and patient**. If you''re stressed about being late or frustrated by their slowness, they''ll mirror your stress and move even slower. Your calm = their calm.',
  'Moderate',
  3,
  10,
  30,
  ARRAY['morning routine', 'transitions', 'getting ready', 'school prep', 'executive function']
);