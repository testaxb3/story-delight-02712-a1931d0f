-- Create INTENSE Tantrums script: Store tantrum demanding toy at checkout

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
  'Store tantrum - demands toy at checkout',
  'Tantrums',
  'INTENSE',
  3,
  10,
  'Moderate',
  10,
  
  $$You''re at the checkout line. Your INTENSE child spots candy or a toy and **demands** it. When you say no, they **explode**: screaming, crying, possibly throwing themselves on the floor.

Every eye in the store is on you. The **intensity** is maximum—this isn''t just upset, it''s a **full-system overload** triggered by disappointment colliding with public overstimulation.$$,
  
  $$❌ **Giving in to stop the scene**
→ Teaches that public meltdowns = getting what they want. Reinforces the pattern for next time.

❌ **Threatening or bargaining in panic**
→ "If you don''t stop right now, no screen time for a week!" The INTENSE brain is already flooded—threats escalate the chaos.

❌ **Explaining why they can''t have it**
→ Logic doesn''t work during a meltdown. Their prefrontal cortex is offline.

**Why these backfire:** The INTENSE brain in meltdown **cannot process reasoning or consequences**. They need regulation first, negotiation never.$$,
  
  $$[
    {
      "step_number": 1,
      "step_title": "Remove from overstimulation immediately",
      "step_explanation": "The checkout line = **sensory overload nightmare** for an INTENSE brain already in crisis. Fluorescent lights, beeping scanners, crowd pressure, and denied reward create a perfect storm.\n\n**Your move:** Without anger or explanation, physically guide them (carry if needed) **away from the scene**. Outside the store, to your car, or to a quiet corner. Priority = **reduce stimulation NOW**.\n\n**The shift:** Going from bright chaos to relative calm **begins** the de-escalation. You''re not punishing—you''re **rescuing** their nervous system.",
      "what_to_say_examples": [
        "We''re going to take a break outside. I''ve got you.",
        "Too much happening in here. Let''s find some quiet."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Silent co-regulation through presence",
      "step_explanation": "Once removed from the chaos, **stay physically close but don''t talk**. Sit near them if they''re on the floor. Offer a hand if they''ll take it. If they''re hitting/kicking, stay just out of range but **visible and calm**.\n\n**Do NOT:** Lecture, explain, or try to \"teach the lesson\" yet. Their brain is still flooded. Your **calm, silent presence** is the regulation they need.\n\n**Important:** This phase can take **3-8 minutes**. INTENSE brains take longer to downshift. Your patience **is** the intervention.",
      "what_to_say_examples": [
        "I''m right here when you''re ready.",
        "(Just breathe audibly—model calmness through your body)"
      ]
    },
    {
      "step_number": 3,
      "step_title": "Reconnect with simple acknowledgment",
      "step_explanation": "When their crying shifts from **screaming** to **sobbing** (the signal their nervous system is resetting), offer simple connection. Not a lecture—just acknowledgment.\n\n**The key phrase:** Name what happened **without** judgment. \"You really wanted that toy. It''s so hard when we can''t get what we want.\" Then **redirect**: \"When you''re ready, we can finish shopping together.\"\n\n**Why it works:** You''re teaching that **big feelings are okay, but we handle them differently**. They''re learning you won''t abandon them in their worst moments.",
      "what_to_say_examples": [
        "That was really hard. You wanted it so much.",
        "I know. Disappointment feels so big in your body.",
        "You''re calming down. I can see you getting back in control."
      ]
    }
  ]$$::jsonb,
  
  $$**The INTENSE brain in public meltdown is experiencing genuine overwhelm.** Store environment (lights, sounds, crowds) + disappointment + their naturally intense emotional processing = **nervous system overload**.

By **removing stimulation** (step 1), you''re giving their brain the space to downshift from crisis mode. By staying **calm and present** (step 2), you''re being the external regulation they can''t provide themselves yet. By **acknowledging feelings without giving in** (step 3), you''re teaching that emotions are valid but behavior has limits.

**This approach prevents:** The "give in to stop the scene" cycle that makes public outings increasingly difficult. You''re building frustration tolerance while maintaining clear boundaries.$$,
  
  $$
  {
    "first_5_minutes": "Expect the tantrum to **continue or escalate** when you remove them. This is normal—their system needs space to discharge the emotion.",
    "by_10_minutes": "Crying typically shifts from screaming to sobbing. They may become clingy or quiet. This is the **recovery phase**—keep your energy low and supportive.",
    "by_week_2": "With consistency, public meltdowns **decrease in intensity and duration**. Recovery time drops from 10 minutes to 3-5 minutes as they learn you won''t give in but also won''t abandon them.",
    "dont_expect": [
      "Instant calm when removed from the store — discharge takes 3-8 minutes minimum",
      "One perfect response to fix everything — consistency over 2-4 weeks builds the pattern"
    ],
    "this_is_success": "Meltdowns happen **less frequently**, recovery time is **under 5 minutes**, and you feel **less anxious** about public outings knowing you have a plan."
  }
  $$::jsonb,
  
  $$[
    {
      "variation_scenario": "Child is hitting or kicking during meltdown",
      "variation_response": "**Stay calm, stay safe.** Move just out of reach but remain visible. Say once: \"I won''t let you hit me. I''m staying close until you''re calm.\" Do NOT engage physically unless safety is at risk."
    },
    {
      "variation_scenario": "Other adults are judging or commenting",
      "variation_response": "**Ignore them completely** or say calmly: \"We''re handling it.\" Your child''s regulation is more important than strangers'' opinions. Remember: they don''t know your child''s brain."
    },
    {
      "variation_scenario": "You''re too embarrassed to stay calm",
      "variation_response": "**Breathe.** Remember: you''re not a bad parent—you''re parenting an INTENSE child through a hard moment. Everyone has meltdowns; you''re teaching yours how to recover."
    },
    {
      "variation_scenario": "Child escalates when you try to leave the store",
      "variation_response": "**Commit to removal anyway.** Say: \"I know you''re upset. We still need to go outside.\" Carry if necessary. The boundary is non-negotiable."
    }
  ]$$::jsonb,
  
  'Calm, determined, patient. You must be **the anchor** when they''re in the storm. If you''re panicked or embarrassed, they''ll feel it and escalate further.',
  
  ARRAY['tantrums', 'public', 'meltdowns', 'store', 'intense', 'regulation', 'boundaries'],
  
  false
);