-- Insert 2 new INTENSE scripts for Tantrums and Bedtime categories

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
  'Public meltdown - store checkout tantrum',
  'Tantrums',
  'INTENSE',
  3,
  10,
  'Moderate',
  5,
  'You''re at the checkout line. Your INTENSE child sees candy/toys and **demands** it. When you say no, they **explode**: screaming, crying, possibly throwing themselves on the floor. Every eye in the store is on you. The **intensity** is maximum—this isn''t just upset, it''s a **full-system overload** triggered by disappointment meeting public overstimulation.',
  '❌ **Giving in to stop the scene**
→ Teaches that public meltdowns = getting what they want. Reinforces the pattern.

❌ **Threatening or bargaining in panic**
→ "If you don''t stop right now, no screen time for a week!" The INTENSE brain is already flooded—threats escalate the chaos.

❌ **Explaining why they can''t have it**
→ Logic doesn''t work during a meltdown. Their prefrontal cortex is offline.

**Why these backfire:** The INTENSE brain in meltdown **cannot process reasoning or consequences**. They need regulation first, negotiation never.',
  '[
    {
      "step_number": 1,
      "step_title": "Remove from stimulation immediately",
      "step_explanation": "The checkout line = **sensory overload nightmare** for an INTENSE brain already in crisis. The fluorescent lights, beeping scanners, crowd pressure, and the denied reward create a perfect storm.\n\n**Your move:** Without anger or explanation, physically guide them (carry if needed) **away from the scene**. Outside the store, to your car, or to a quiet corner. Priority = **reduce stimulation NOW**.\n\n**The shift:** Going from bright chaos to relative calm **begins** the de-escalation. You''re not punishing—you''re **rescuing** their nervous system.",
      "what_to_say_examples": [
        "We''re going to take a break outside. I''ve got you.",
        "Too much happening in here. Let''s find some quiet."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Silent co-regulation through presence",
      "step_explanation": "Once removed from the chaos, **stay physically close but don''t talk**. Sit on the ground near them if they''re on the floor. Offer a hand if they''ll take it. If they''re hitting/kicking, stay just out of range but **visible and calm**.\n\n**Do NOT:** Lecture, explain, or try to \"teach the lesson\" yet. Their brain is still flooded. Your **calm, silent presence** is the regulation they need.\n\n**Important:** This phase can take **3-8 minutes**. INTENSE brains take longer to downshift. Your patience **is** the intervention.",
      "what_to_say_examples": [
        "I''m right here when you''re ready.",
        "(Just breathe audibly, model calmness through your body)"
      ]
    },
    {
      "step_number": 3,
      "step_title": "Reconnect with simple language",
      "step_explanation": "When their crying shifts from **screaming** to **sobbing** (the signal their nervous system is starting to reset), offer simple connection. Not a lecture—just acknowledgment.\n\n**The key phrase:** Name what happened **without** judgment. \"You really wanted that toy. It''s so hard when we can''t get what we want.\" Then **redirect**: \"When you''re ready, we can finish shopping together.\"\n\n**Why it works:** You''re teaching that **big feelings are okay, but we handle them differently**. They''re learning you won''t abandon them in their worst moments.",
      "what_to_say_examples": [
        "That was really hard. You wanted it so much.",
        "I know. Disappointment feels so big in your body.",
        "You''re calming down. I can see you getting back in control."
      ]
    }
  ]',
  '**The INTENSE brain in public meltdown is experiencing genuine overwhelm.** The store environment (lights, sounds, crowds) + disappointment + their naturally intense emotional processing = **nervous system overload**. \n\nBy **removing stimulation** (step 1), you''re giving their brain the space to downshift. By staying **calm and present** (step 2), you''re being the external regulation they can''t provide themselves. By **acknowledging feelings without giving in** (step 3), you''re teaching that emotions are valid but behavior has limits.\n\n**This approach prevents:** The \"give in to stop the scene\" cycle that makes public outings increasingly difficult. You''re teaching frustration tolerance while maintaining boundaries.',
  '{
    "timeline": [
      {
        "timeframe": "During (0-10 minutes)",
        "expectation": "Expect the tantrum to **continue** for 3-8 minutes after removal. This is normal—their system needs time to discharge the emotion. Stay calm, stay near."
      },
      {
        "timeframe": "After (10-20 minutes)",
        "expectation": "They may be tired, clingy, or quiet. This is the **recovery phase**. Keep your energy low and supportive. Finish shopping if possible, or leave and return another time."
      },
      {
        "timeframe": "Over time (2-4 weeks)",
        "expectation": "With consistency, public meltdowns **decrease in intensity and duration**. They''re learning: \"Mom/Dad doesn''t give in, but they also don''t abandon me.\""
      }
    ],
    "success_indicators": [
      "Meltdowns in public happen less frequently",
      "Recovery time gets shorter (from 10 minutes to 3-5 minutes)",
      "Child can sometimes accept \"no\" without full meltdown",
      "You feel less anxious about public outings"
    ]
  }',
  '{
    "scenarios": [
      {
        "variation": "Child is hitting/kicking during meltdown",
        "response": "**Stay calm, stay safe.** Move just out of reach but remain visible. Say once: \"I won''t let you hit me. I''m staying close until you''re calm.\" Do NOT engage physically unless safety is at risk."
      },
      {
        "variation": "Other adults are judging/commenting",
        "response": "**Ignore them completely** or say calmly: \"We''re handling it.\" Your child''s regulation is more important than strangers'' opinions. Remember: they don''t know your child''s brain."
      },
      {
        "variation": "You''re too embarrassed to stay calm",
        "response": "**Breathe.** Remember: you''re not a bad parent—you''re parenting an INTENSE child through a hard moment. Everyone has meltdowns; you''re teaching yours how to recover."
      },
      {
        "variation": "Child escalates when you try to leave the store",
        "response": "**Commit to removal anyway.** Say: \"I know you''re upset. We still need to go outside.\" Carry if necessary. The boundary is non-negotiable."
      }
    ]
  }',
  'Calm, determined, patient. You must be **the anchor** when they''re in the storm. If you''re panicked or embarrassed, they''ll feel it and escalate further.',
  ARRAY['public', 'tantrums', 'meltdowns', 'store', 'intense', 'regulation', 'emotional-overwhelm'],
  false
),
(
  'Bedtime resistance - won''t stay in bed',
  'Bedtime',
  'INTENSE',
  3,
  9,
  'Hard',
  30,
  'It''s 9 PM. You''ve done the routine: bath, story, tucked them in. You leave the room. **30 seconds later**, they''re out. "I need water." "I heard a noise." "My blanket isn''t right." You put them back. They''re out again. **And again. And again.** The INTENSE child''s brain is **wired for persistence**—once they want something (your presence, to stay up), they will **fight** sleep with **relentless determination**. By 10:30 PM, you''re exhausted, frustrated, and considering just letting them sleep on the couch.',
  '❌ **Lying down with them until they fall asleep**
→ Creates a dependency. They can''t fall asleep without you, which means **no** self-regulation skills and eventual sleep disruptions.

❌ **Getting increasingly angry/threatening**
→ "If you get out of bed ONE more time, I''m taking away your toys!" Fear-based parenting spikes their cortisol, making sleep **harder** to achieve.

❌ **Giving in and letting them stay up**
→ Teaches that persistence wins. Tomorrow night will be worse because they know you''ll cave.

**Why these backfire:** The INTENSE brain **needs clear, consistent boundaries** to feel safe enough to surrender to sleep. Inconsistency = **escalated testing**.',
  '[
    {
      "step_number": 1,
      "step_title": "Create an ironclad bedtime boundary",
      "step_explanation": "Before bedtime even starts, **set the rule clearly**: \"Tonight, after stories, you''ll stay in your bed. If you get out, I will put you back **without talking**. Every time.\"\n\n**The key:** You''re not asking for cooperation—you''re **stating the boundary**. The INTENSE brain needs to know this is **non-negotiable** before the testing begins.\n\n**Important prep:** Make sure all legitimate needs are met BEFORE the final tuck-in: water by the bed, bathroom trip, favorite stuffed animal, nightlight on. Remove their ammunition for excuses.",
      "what_to_say_examples": [
        "After I leave, your job is to stay in bed. My job is to make sure you do.",
        "If you get up, I''ll bring you back—as many times as it takes. No talking, just back to bed."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Execute the boundary without emotion",
      "step_explanation": "The moment they get out of bed, **immediately and calmly** walk them back. **Say nothing.** No eye contact, no explaining, no negotiating. Hand on shoulder, guide them back, tuck them in (or don''t—just put them in bed), and **leave**.\n\n**Repeat:** They will test. They might get up **10, 15, 20 times** the first night. Your job is to be a **calm, silent robot**. No anger, no frustration, no engagement.\n\n**Why no talking?** Every word = **attention** = **reward** for getting out of bed. Silence removes the payoff.",
      "what_to_say_examples": [
        "(Silent—just guide them back physically)",
        "(If they speak: \"Bedtime.\" Then silence.)"
      ]
    },
    {
      "step_number": 3,
      "step_title": "Celebrate morning success",
      "step_explanation": "The next morning, **immediately** praise their effort. Even if they tested 50 times, if they **eventually** stayed in bed and fell asleep, that''s progress.\n\n**The morning message:** \"You stayed in your bed last night! Your body learned to fall asleep on its own. I''m so proud.\" \n\n**Why it matters:** The INTENSE brain responds powerfully to **positive reinforcement**. You''re teaching that **staying in bed = pride and connection**, not just \"avoiding trouble.\"",
      "what_to_say_examples": [
        "You did it! You stayed in bed and your body fell asleep all by itself!",
        "Last night was hard, but you learned something important. Tonight will be even easier."
      ]
    }
  ]',
  '**The INTENSE brain resists bedtime because it wants control and connection.** Getting out of bed = seeing you = getting a reaction (even negative attention is attention). \n\nBy **removing all engagement** during the testing phase (step 2), you''re eliminating the payoff. By being **100% consistent** (step 1), you''re teaching that the boundary is **real**. By **celebrating success** (step 3), you''re reinforcing the behavior you want.\n\n**The first 3 nights will be brutal.** They''ll test harder before they stop. But by night 4-5, most INTENSE kids dramatically reduce the testing because they''ve learned: **Mom/Dad won''t engage, so there''s no point.**',
  '{
    "timeline": [
      {
        "timeframe": "Night 1-3",
        "expectation": "Expect **intense testing**. They may get out of bed 20-50 times. Stay robotic. This is the **extinction burst**—behavior gets worse before it gets better."
      },
      {
        "timeframe": "Night 4-7",
        "expectation": "Testing decreases sharply. They may still test 2-5 times, but they''re learning the boundary is real. **Stay consistent**—any crack will reset progress."
      },
      {
        "timeframe": "Week 2-3",
        "expectation": "Most INTENSE kids stay in bed after 1-2 gentle reminders. They''ve internalized the boundary. Bedtime becomes **predictable** again."
      }
    ],
    "success_indicators": [
      "Child stays in bed with fewer than 3 attempts to get out",
      "Falls asleep within 20-30 minutes of being tucked in",
      "You feel less dread about bedtime",
      "Mornings are calmer because everyone got better sleep"
    ]
  }',
  '{
    "scenarios": [
      {
        "variation": "Child has a legitimate need (bathroom, feels sick)",
        "response": "**Handle it quickly and calmly**, then right back to bed. One sentence: \"Okay, go to the bathroom. Then straight back to bed.\" Do NOT let it become a conversation."
      },
      {
        "variation": "Child cries/screams when you don''t engage",
        "response": "**Let them express the emotion in bed.** Stay outside the door if you need to monitor, but do NOT go back in unless there''s genuine danger. Crying = processing disappointment. It will stop."
      },
      {
        "variation": "You''re exhausted and want to give up",
        "response": "**Remember:** The pain of 3 brutal nights is LESS than the pain of 6 more months of bedtime battles. Push through. Call in backup if you have a partner."
      },
      {
        "variation": "They fall asleep on the floor beside the door",
        "response": "**Leave them there** for the first night. In the morning, explain: \"Your bed is more comfortable. Tonight you''ll sleep in your bed.\" Moving them mid-sleep = waking them = more resistance."
      }
    ]
  }',
  'Calm, robotic, patient. You must be **immovable**—not angry, not punishing, just **certain**. The INTENSE child needs to feel your confidence that this boundary is for their own good.',
  ARRAY['bedtime', 'sleep', 'resistance', 'boundaries', 'intense', 'consistency', 'testing'],
  false
);