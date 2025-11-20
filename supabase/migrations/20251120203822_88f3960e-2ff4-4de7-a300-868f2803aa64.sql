-- SCREENS - DISTRACTED PROFILE
-- "Opens tablet 'just to check one thing' - emerges 2 hours later"

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
  'Opens tablet ''just to check one thing'' - emerges 2 hours later',
  'Screens',
  'DISTRACTED',
  6,
  13,
  'Moderate',
  8,
  
  'You tell your child: "You can use the tablet to look up that one thing for homework." They grab it eagerly. You check back 10 minutes later — they''re deep into YouTube videos about something completely unrelated. You ask: "Did you find what you needed?" They look confused: **"What? Oh... I forgot."** Two hours have passed. They genuinely have no memory of what they were supposed to do.

This is **task initiation failure + algorithmic capture**. The ADHD brain struggles with working memory and task persistence. When they open the tablet with a specific goal, that goal sits in their working memory — a mental sticky note that gets blown away the moment something more interesting appears. YouTube, TikTok, and game apps are engineered to hijack attention through infinite scroll and autoplay. For DISTRACTED kids, this is cognitive quicksand.

**Key detail:** They''re not being sneaky. They truly forgot their original task the moment the algorithm served up something stimulating. The dopamine hit from the first unrelated video overwrites the initial intention completely.',

  '**❌ "You''re lying! I said homework only!"**
→ Accusations create shame. They genuinely forgot — their working memory failed, they didn''t deliberately ignore you.

**❌ Leaving them unsupervised with device access**
→ Expecting self-monitoring from an ADHD brain is neurologically unrealistic. Their impulse control and time awareness are offline.

**❌ "Just be responsible and stick to your task"**
→ Vague instructions don''t create structure. Their brain needs external scaffolding, not internal willpower.

**❌ Taking away the tablet permanently as punishment**
→ Doesn''t teach skills. They still won''t know how to manage devices in the future — you''re just delaying the problem.',

  '[
    {
      "step_number": 1,
      "step_title": "Pre-Mission Verbal Contract + Physical Timer",
      "step_explanation": "Before handing over the device, make them state the mission out loud. Say: **\"What are you looking up? Tell me in one sentence.\"** Wait for them to articulate it clearly (e.g., \"I''m looking up how photosynthesis works\"). Then set a visible timer for the task (5-10 minutes) and say: **\"Timer is running. When it beeps, you close the app and show me what you found. If you open anything else, timer stops and tablet goes away immediately.\"** Hand them the device only after they verbally agree. This anchors the task in their auditory and verbal memory, making it harder to forget.",
      "what_to_say_examples": [
        "Before I give you the tablet: tell me exactly what you''re looking up. One sentence.",
        "Repeat the rule: Timer beeps = close the app and show me your answer. Got it?",
        "If I come back and you''re watching YouTube videos about sharks, what happens? (Have them answer: tablet goes away.)"
      ]
    },
    {
      "step_number": 2,
      "step_title": "Physical Proximity + Accountability Check-In",
      "step_explanation": "Stay in the same room or nearby area during the timer period. Set a mental checkpoint at the halfway mark (if timer is 10 minutes, check in at 5 minutes). Walk over and say: **\"What did you find so far?\"** Don''t ask if they''re on task — make them demonstrate progress. If they''re off-task (watching unrelated videos, scrolling Instagram), calmly take the device and say: **\"You opened other apps. Timer''s done. Try again tomorrow.\"** No lecture, no anger — just enforce the boundary matter-of-factly. Your physical presence prevents the algorithm from fully capturing them.",
      "what_to_say_examples": [
        "Show me your screen right now. What are you looking at?",
        "Did you find the answer yet? Read it to me.",
        "I see YouTube open. That''s not the search task. Tablet goes away now — we''ll try again tomorrow."
      ]
    },
    {
      "step_number": 3,
      "step_title": "Task Completion = Immediate Close + Reward Clarity",
      "step_explanation": "When the timer beeps, immediately appear next to them. Don''t yell from another room. Say: **\"Timer''s up. Close the app and tell me what you learned.\"** If they completed the task (found the information), praise the execution: **\"You stayed on task! That''s exactly what I asked for.\"** Then clearly state the consequence: **\"Now the tablet goes away. You can use it again tomorrow for another task.\"** If they want to keep using it, redirect: **\"Not today. You did the job — now it''s done.\"** This teaches task closure, a skill ADHD brains desperately need. The reward is your acknowledgment, not extended screen time.",
      "what_to_say_examples": [
        "Timer beeped. Close it now and tell me: what did you learn about photosynthesis?",
        "Good work staying focused! You proved you can do it. Now hand it over.",
        "No extra time. The job is done. Tomorrow you can use it again for another search."
      ]
    }
  ]',

  '**External Working Memory Through Verbal Anchoring**
ADHD brains have weak working memory — they can''t hold goals in mind when distracted. By making them state the task out loud before starting, you activate their auditory memory and create a verbal "anchor" they can recall. Repeating it back to you strengthens encoding.

**Algorithm Resistance Through Time Limits**
YouTube, TikTok, and game apps use **variable reward schedules** (like slot machines) to keep users hooked. The timer creates an external stopping point that overrides the algorithm''s pull. The ADHD brain can''t self-regulate dopamine-seeking, so the timer does it externally.

**Task Closure Training**
DISTRACTED kids rarely finish anything — they start projects and abandon them mid-way. This strategy teaches **task closure**: start a mission, complete it, stop. Over time, this builds the neural pathway for "finish what you start," a critical executive function skill.

**Natural Consequences Without Shame**
Taking the device when they go off-task isn''t punishment — it''s a boundary. You told them the rule, they broke it, the consequence happens. No yelling, no guilt. This teaches cause-and-effect without triggering shame-based resistance.',

  '{
    "first_30_seconds": "They''ll likely protest when you take the device mid-task if they''re off-track: \"But I was almost done!\" (they weren''t). Stay calm and enforce the boundary. Expect pushback the first 3-5 times you implement this.",
    "by_90_seconds": "After completing a successful task, they may beg for \"just 5 more minutes\" of free use. Hold the line. The boundary is the teaching moment. If you cave, you''ve taught them that begging works, not that tasks have endings.",
    "this_is_success": "Success = they complete the original task within the timer limit at least 3 out of 5 attempts. They don''t need to do it perfectly every time. Consistency over perfection. Bonus: after 2 weeks, they start stating the task out loud unprompted before grabbing the device.",
    "dont_expect": [
      "Don''t expect them to self-monitor without the timer. Their internal clock doesn''t work during screen hyperfocus.",
      "Don''t expect them to voluntarily close the app when done. Task closure is a learned skill, not an innate one for ADHD brains.",
      "Don''t expect zero slip-ups. They''ll forget the task sometimes even with this structure. That''s the ADHD — not defiance."
    ]
  }',

  '[
    {
      "scenario": "\"I was just taking a quick break! I was about to go back to the search!\"",
      "response": "\"The rule was: stay on the task until the timer beeps. You opened YouTube. That''s off-task. Try again tomorrow.\" (Don''t negotiate — the boundary is clear.)"
    },
    {
      "scenario": "\"But I DID find the answer! Can''t I just watch one video now?\"",
      "response": "\"You finished the job — awesome! But the rule is: task done = device away. Tomorrow you can do another search.\" (Acknowledge the win, enforce the boundary.)"
    },
    {
      "scenario": "\"I forgot what I was supposed to look up...\"",
      "response": "\"That''s why we say it out loud before starting. Let''s try again: what are you looking up?\" (Re-anchor the task verbally before handing back the device.)"
    },
    {
      "scenario": "\"Why do I have a timer but [sibling] doesn''t?\"",
      "response": "\"Different brains need different tools. Your brain is amazing at lots of things, but it gets pulled into screens easily. The timer helps you stay in control instead of the app controlling you.\""
    }
  ]',

  '**Calm enforcement without moral judgment** — They didn''t "fail" or "misbehave" when they go off-task. Their brain got hijacked by an algorithm designed by engineers with PhDs in behavioral psychology. You''re teaching them to outsmart the algorithm through structure.

**Physical presence during device use** — You can''t supervise from another room. The first 10 times you implement this, you need to be nearby to catch off-task behavior immediately.

**Consistency over weeks, not days** — This skill takes 3-4 weeks of daily practice to stick. If you enforce it sporadically, their brain won''t learn the pattern. Commit to the structure for a month before expecting independence.',

  ARRAY['screens', 'adhd', 'working memory', 'task completion', 'hyperfocus', 'algorithm capture', 'executive function', 'distracted', 'device management', 'time management'],

  false
);