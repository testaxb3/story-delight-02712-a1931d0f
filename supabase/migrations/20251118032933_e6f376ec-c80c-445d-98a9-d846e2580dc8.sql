-- Insert new bedtime script for INTENSE brain profile
INSERT INTO scripts (
  title,
  category,
  profile,
  age_min,
  age_max,
  duration_minutes,
  difficulty,
  emergency_suitable,
  works_in_public,
  requires_preparation,
  location_type,
  parent_state,
  tags,
  the_situation,
  what_doesnt_work,
  strategy_steps,
  why_this_works,
  what_to_expect,
  common_variations,
  parent_state_needed
) VALUES (
  'Child refusing bedtime - still wired at 9pm',
  'bedtime',
  'INTENSE',
  3,
  10,
  15,
  'Moderate',
  false,
  false,
  true,
  ARRAY['home'],
  ARRAY['exhausted', 'frustrated'],
  ARRAY['bedtime', 'sleep', 'hyperactive', 'intense', 'routine', 'wind-down'],
  
  -- THE SITUATION
  'Your INTENSE child is still running around at 9pm, physically bouncing off walls or hyperfocused on an activity. Their brain is in **overdrive mode** - pupils dilated, speaking rapidly, body moving constantly. When you announce bedtime, they either:

• Insist they''re "not tired AT ALL!" (even though you can see the exhaustion under the hyperactivity)
• Become MORE energetic, as if bedtime triggered an adrenaline surge
• Start a new project or game right as you''re trying to transition
• Melt down completely at the mention of stopping

**The INTENSE brain paradox:** They''re simultaneously **exhausted** AND **wired**. Their nervous system is stuck in high gear and doesn''t know how to downshift. Traditional "calming" approaches feel like you''re asking them to stop a speeding train with their bare hands.',

  -- WHAT DOESN''T WORK
  '• **"You need to calm down and go to bed NOW"**
→ Their brain CAN''T calm down on command. This creates shame around something they have zero control over.

• **Turning off all lights and screens abruptly**
→ Sudden sensory deprivation feels jarring to their system. They need a **gradual sensory ramp-down**, not a cliff.

• **"If you don''t go to bed, no screen time tomorrow!"**
→ Threats activate their **fight response** when their nervous system is already dysregulated. You''re adding fuel to the fire.

• **Keeping them awake until they "crash"**
→ INTENSE brains don''t crash cleanly. They melt down. And that cortisol surge makes sleep even harder.

**Why these backfire:** INTENSE brains experience **hyperarousal** - their internal engine is revving too high. Demanding immediate shutdown or threatening consequences doesn''t give their nervous system the **structured off-ramp** it desperately needs.',

  -- STRATEGY STEPS
  jsonb_build_array(
    jsonb_build_object(
      'step_number', 1,
      'step_title', 'Acknowledge the engine, don''t fight it',
      'step_explanation', 'Your child''s brain is genuinely stuck in high gear. Name what you see without judgment, validating their internal experience.',
      'what_to_say_examples', ARRAY[
        '"Wow, your body has SO much energy right now. I can see your brain is still in GO mode."',
        '"I get it - it doesn''t feel like bedtime inside you yet. Your engine is still running fast."',
        '"Your INTENSE brain is doing that thing where it doesn''t want to power down. That''s really hard."'
      ]
    ),
    jsonb_build_object(
      'step_number', 2,
      'step_title', 'Offer a physical energy release (5 minutes)',
      'step_explanation', 'Give their body a structured way to burn off the excess activation. This isn''t "giving in" - it''s meeting their nervous system where it is.',
      'what_to_say_examples', ARRAY[
        '"Let''s do 5 minutes of big movements to help your body get ready. Jump on the bed, do wall pushes, or run in place."',
        '"Your body needs to move this energy out. Pick: 20 jumping jacks or sprint to your room and back 3 times."',
        '"I''m setting a timer for 5 minutes. Move however your body wants - then we''ll start the wind-down."'
      ]
    ),
    jsonb_build_object(
      'step_number', 3,
      'step_title', 'Transition with sensory downshift',
      'step_explanation', 'After physical release, shift to heavy work + dim lighting. This signals their nervous system to start the downregulation process.',
      'what_to_say_examples', ARRAY[
        '"Now let''s do something that tells your brain it''s safe to slow down. Let''s push against the wall together or do some stretches."',
        '"Time for the sleepy part. Dim lights on, and you can choose: deep pressure massage or burrito blanket wrap?"',
        '"Your body did great moving. Now we''re going to help it shift gears. Let''s do some slow, heavy pushes against the door frame."'
      ]
    ),
    jsonb_build_object(
      'step_number', 4,
      'step_title', 'Predictable final routine (10 minutes max)',
      'step_explanation', 'INTENSE brains need **predictability** in the final stretch. Keep it short, structured, and non-negotiable.',
      'what_to_say_examples', ARRAY[
        '"Bathroom, teeth, one book, lights out. Same as always. Let''s go."',
        '"You know the drill: PJs, bathroom, pick your book. 10 minutes total."',
        '"I''m going to walk you through each step. First: bathroom. Then teeth. Then story time."'
      ]
    ),
    jsonb_build_object(
      'step_number', 5,
      'step_title', 'Stay with regulation, not entertainment',
      'step_explanation', 'If they''re still wired in bed, your job is to be a calm, boring presence. No new stories, no negotiations, no engaging.',
      'what_to_say_examples', ARRAY[
        '"I''m right here. Your body is learning to wind down. I''ll stay until you''re asleep."',
        '"I know your brain is still buzzing. That''s okay. Just rest your body. I''m not leaving."',
        '"You don''t have to fall asleep right now. Just let your body be still. I''m here."'
      ]
    )
  ),

  -- WHY THIS WORKS
  '**1. Physical release before downshift** = You''re not fighting their biology. INTENSE brains have **excess norepinephrine** (activation chemical) at night. Movement helps metabolize it. Studies show 5-10 minutes of intense physical activity can reduce sleep latency by up to 30% in hyperactive children.

**2. Heavy work activates the parasympathetic system** = Deep pressure (pushing walls, tight hugs, weighted blankets) triggers the **vagus nerve**, which tells the brain "it''s safe to rest." For INTENSE brains stuck in sympathetic overdrive, this is the biological off-switch.

**3. Predictable routine = cognitive relief** = When bedtime steps are **exactly the same** every night, their prefrontal cortex doesn''t have to make decisions. Decision-making requires energy. Removing choices in the final 10 minutes reduces cognitive load and resistance.

**4. Co-regulation over independence** = INTENSE kids'' nervous systems are **borrowing your calm**. Your physical presence (even if boring) keeps their stress response from escalating. This isn''t "babying them" - it''s providing the external regulation their brain needs to develop internal regulation over time.

**5. You''re teaching the downshift pattern** = Repeated exposure to this sequence (move → heavy work → predictable routine → boring presence) trains their nervous system to recognize the pattern. After 2-3 weeks, their brain starts anticipating the downshift and initiating it on its own.',

  -- WHAT TO EXPECT
  jsonb_build_object(
    'first_30_seconds', 'Expect resistance or denial ("I''m not tired!"). Don''t argue. Acknowledge their feeling and move straight to Step 1: "I know. Your body has big energy. Let''s work with that."',
    'by_2_minutes', 'If you offer physical movement, you''ll likely see them take it enthusiastically. They needed permission to move. As they jump/run/push, watch their facial tension start to soften slightly.',
    'by_10_minutes', 'During the heavy work phase, you may see the first yawn or eye rub. Their body is starting to recognize the pattern. If they resist the wind-down, stay calm and boring: "This is what we do. Let''s keep going."',
    'by_15_minutes', 'In bed, they might still be chatty or wiggly. That''s normal. Your job is to be present but unengaging. Offer a hand on their back for deep pressure, but don''t start new conversations.',
    'dont_expect', ARRAY[
      'Immediate compliance when you first announce bedtime',
      'Them to "calm down" without movement first',
      'A quick 5-minute tuck-in like other kids',
      'This to work perfectly the first night - consistency over 1-2 weeks is what creates the pattern'
    ],
    'this_is_success', 'Success = Your child goes through the routine without major meltdowns AND eventually falls asleep (even if it takes 30-45 minutes initially). Over time (2-3 weeks), you''ll notice: less resistance at announcement, faster physical wind-down, and earlier sleep onset. The goal isn''t "instant sleep" - it''s **teaching their nervous system the downregulation pathway**.'
  ),

  -- COMMON VARIATIONS
  jsonb_build_array(
    jsonb_build_object(
      'variation_scenario', 'What if they refuse the physical movement option?',
      'variation_response', '"That''s okay. Let''s go straight to heavy work. Come push against this wall with me for 2 minutes. Use all your strength."',
      'why_this_works', 'Some INTENSE kids resist structured movement but respond better to **resistance-based** heavy work. Wall pushes, door frame holds, or tight hugs still activate proprioception (body awareness), which triggers the calming response.'
    ),
    jsonb_build_object(
      'variation_scenario', 'What if they melt down completely when I say it''s time to transition to the routine?',
      'variation_response', '"I see you''re really upset. I''m going to sit right here. When you''re ready, we''ll start with just one thing: bathroom. That''s all."',
      'why_this_works', 'Breaking the routine into **single-step instructions** reduces overwhelm. Don''t stack multiple demands ("brush teeth, get PJs, pick a book"). One step at a time prevents task paralysis.'
    ),
    jsonb_build_object(
      'variation_scenario', 'What if they want me to stay in the room for an hour?',
      'variation_response', '"I''ll stay for 15 minutes. I''ll set a timer. When it goes off, I''ll check on you every 5 minutes until you''re asleep."',
      'why_this_works', 'Gradual withdrawal with **predictable check-ins** prevents abandonment panic while teaching independence. The timer makes it concrete (no abstract "soon" - INTENSE brains need specifics).'
    ),
    jsonb_build_object(
      'variation_scenario', 'What if they''re still wide awake after the whole routine?',
      'variation_response', '"Your body is still waking up. That''s okay. You can look at books quietly in bed, but your body stays in bed. I''ll check on you in 15 minutes."',
      'why_this_works', 'Forcing sleep creates anxiety. Allowing **quiet rest** in bed removes performance pressure while maintaining the boundary. Many INTENSE kids fall asleep mid-page when given low-pressure alone time.'
    )
  ),

  -- PARENT STATE NEEDED
  'You need to be **calm and boring** - like a neutral observer. If you''re stressed or rushing them, your nervous system will activate theirs. They''re reading your body language more than your words. Think: "I''m a sleepy lighthouse - steady, predictable, not engaging with the storm." Take 3 deep breaths before starting the routine. This is about **co-regulation**, not control.'
);