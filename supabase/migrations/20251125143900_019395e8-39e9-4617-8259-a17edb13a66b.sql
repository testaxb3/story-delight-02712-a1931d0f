-- Insert DISTRACTED + Homework Script: "20-minute worksheet takes 3 hours"
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
  '20-minute worksheet takes 3 hours - they''ve left the table 12 times and haven''t written a single word',
  'Homework',
  'DISTRACTED',
  6,
  12,
  'Moderate',
  45,
  
  -- THE SITUATION (Parent POV structure)
  '**4:30 PM. Kitchen table.**

You handed them a simple math worksheet 40 minutes ago. Fifteen problems. Should take 20 minutes, max.

They''ve sat down **12 times**. They''ve gotten up **12 times**.

"I need water." Back. "I need to go to the bathroom." Back. "This pencil doesn''t work." Back. "I just need to check something real quick." Back. "Can I have a snack first?"

The worksheet? **Completely blank.** Not. One. Number. Written.

Your laptop is open. 23 unread emails stare at you. Your shoulders are up to your ears. Your jaw is clenched so tight it hurts.

**"I''M ABOUT TO START!"** they yell from the living room, having wandered away again.

You close your eyes. Count to five. This exact scene has played out every single day this week.',
  
  -- WHAT DOESN'T WORK
  '**❌ COMMON MISTAKE #1: "Just sit down and DO IT!"**
→ **Why it fails:**
The problem isn''t motivation. It''s not laziness. Their brain is physically struggling to sustain attention on a boring task. Yelling at them to "just focus" is like yelling at someone with bad eyesight to "just see better."

Their prefrontal cortex—the part responsible for focus, planning, and impulse control—is **underactivated** in DISTRACTED brains. Commanding them to focus is like asking a car with no gas to drive faster.


**❌ COMMON MISTAKE #2: Homework battles and punishments**
→ **Why it fails:**
"No screen time until it''s done!" "You''re losing your iPad for a week!"

Threats activate the **amygdala** (fear center), which shuts down the **prefrontal cortex** even more. Now they''re stressed AND can''t focus. You''ve made the problem worse.

Punishment doesn''t teach focus. It teaches avoidance.


**❌ COMMON MISTAKE #3: Hovering over them the entire time**
→ **Why it fails:**
Sitting next to them, redirecting every 30 seconds: "Eyes on the paper. Stop looking at that. Focus."

This creates **learned helplessness**. They start to believe they CAN''T do homework without you. Plus, your presence becomes a source of anxiety: "Mom''s watching. I''m messing up. She''s getting frustrated."

They need scaffolding, not surveillance.


**❌ COMMON MISTAKE #4: Bribing with rewards**
→ **Why it fails:**
"Finish your homework and you can have 30 minutes of screen time."

This creates a **transactional relationship** with learning. Homework becomes something you endure to get a prize, not something you engage with. When the reward disappears, so does any motivation.',
  
  -- STRATEGY STEPS (JSON)
  '[
    {
      "step_number": 1,
      "step_title": "Body First, Brain Second",
      "step_explanation": "The DISTRACTED brain needs **movement** to activate the prefrontal cortex. Dopamine and norepinephrine—chemicals critical for focus—are released during physical activity.\n\nBEFORE homework starts, do 5-10 minutes of physical movement. Not as punishment. Not as a reward. As **brain prep**.\n\nThis isn''t optional. This is the neurological ON switch.",
      "what_to_say_examples": [
        "**Before we start homework, we''re doing our brain wake-up. Pick one: 20 jumping jacks, run around the house twice, or dance to one song.**",
        "**Your body helps your brain focus. Let''s get your wiggles out first, then we sit down.**",
        "**I know it sounds backwards, but moving BEFORE homework makes it go faster. Trust me.**"
      ]
    },
    {
      "step_number": 2,
      "step_title": "The Ritual Box",
      "step_explanation": "DISTRACTED kids will find ANY reason to get up: thirsty, need a different pencil, suddenly starving, urgent bathroom trip.\n\nThese aren''t manipulation tactics—they''re genuine impulses. But every interruption = losing focus = starting over.\n\nThe Ritual Box eliminates escape hatches. BEFORE homework starts, everything they might \"need\" is prepared and visible:\n• Water bottle (full)\n• Small snack (already on table)\n• Correct pencils (sharpened, in reach)\n• Bathroom break (done)\n• Timer (set)\n\n**If it''s not in the box, it doesn''t exist during homework time.**",
      "what_to_say_examples": [
        "**Before we start, let''s set up your Ritual Box. Water? Check. Snack? Check. Pencils? Check. Bathroom? Go now.**",
        "**Once we start the timer, we''re not getting up. Everything you need is already here.**",
        "**\"I need water\" won''t work once we begin—the water is right there. Let''s make sure we have everything NOW.**"
      ]
    },
    {
      "step_number": 3,
      "step_title": "Pomodoro for Kids",
      "step_explanation": "DISTRACTED brains can''t sustain focus for 30-40 minutes. They need **micro-sprints** with built-in breaks.\n\nUse a **visual timer** (not phone—too distracting). Start with 5-minute work blocks, 2-minute breaks.\n\n**5 minutes of work = celebration.** Not for finishing. For TRYING.\n\nAfter 5 minutes: \"Great! You stayed at the table for the whole timer. Break time—stretch, walk around, grab a sip of water. Then we do another 5.\"\n\nThe goal isn''t perfection. It''s **momentum**. Small wins build confidence.",
      "what_to_say_examples": [
        "**We''re doing 5 minutes of work, then a 2-minute break. Timer starts... now.**",
        "**You stayed focused for the whole 5 minutes! That''s a win. Go take your break—walk around, stretch, then we go again.**",
        "**Timer''s about to go off. You did THREE problems in 5 minutes—that''s huge. Break time.**"
      ]
    }
  ]',
  
  -- WHY THIS WORKS
  'DISTRACTED brains are not broken. They''re **under-stimulated**.

The prefrontal cortex—the brain''s "CEO" responsible for focus, planning, and impulse control—is **underactive** in children with attention challenges. This isn''t a character flaw. It''s neurobiology.

**Movement increases dopamine and norepinephrine**, two chemicals that "wake up" the prefrontal cortex. Studies show that just 10 minutes of moderate physical activity improves attention for up to 2 hours (Pontifex et al., 2013).

**The Ritual Box removes "escape hatches."** Every time they get up, their brain resets. They lose their place. Starting over is exhausting. By eliminating reasons to leave the table, you force engagement with the task.

**Pomodoro builds momentum through micro-wins.** DISTRACTED kids experience homework as an **endless, overwhelming mountain**. Breaking it into 5-minute chunks makes it manageable. Each completed block = dopamine hit = motivation to continue.

You''re not forcing focus. You''re **creating the conditions where focus becomes possible**.',
  
  -- WHAT TO EXPECT (JSON)
  '{
    "first_30_seconds": "Resistance. Eye rolls. \"This is dumb!\" \"I don''t need to move first!\" They might test the Ritual Box rule: \"But I really need my OTHER pencil.\" Hold the boundary calmly: \"Everything you need is already here.\"",
    "by_2_minutes": "After 1-2 weeks of consistency, they start requesting the system themselves. \"Mom, can we do the brain wake-up?\" \"Where''s the timer?\" The ritual becomes comforting because it WORKS. They feel the difference.",
    "this_is_success": "Two weeks in, they finish a 20-minute worksheet in ONE Pomodoro cycle (15 minutes total with breaks). They look up, surprised: \"Wait, I''m done?\" That breakthrough—that realization that homework doesn''t have to be torture—is the victory.",
    "dont_expect": [
      "That it works immediately. The first 3-5 sessions will feel clunky. They''re learning a new system.",
      "That it eliminates 100% of distractions. Some getting-up will still happen. Progress, not perfection.",
      "That they''ll remember the ritual on their own. YOU are the external scaffolding right now. After 4-6 weeks, it becomes habit.",
      "That every homework session will be smooth. Bad days happen. Tired days happen. That''s normal."
    ]
  }',
  
  -- COMMON VARIATIONS (JSON)
  '[
    {
      "variation_scenario": "**\"The pencil is too sharp/dull/wrong color!\"** (mid-homework)",
      "variation_response": "**\"All the pencils are in the Ritual Box. Choose one now, and that''s the pencil for this whole session.\"**\n\nDon''t engage in pencil debates. It''s a distraction tactic (even if unconscious). The rule is: what''s in the box is what we use."
    },
    {
      "variation_scenario": "**\"I''m hungry!\"** (3 minutes into work block)",
      "variation_response": "**\"Snack time happens during your 2-minute break. You have 2 more minutes on the timer, then you can eat.\"**\n\nHunger is real, but it can wait 120 seconds. Don''t reward work-avoidance with immediate food."
    },
    {
      "variation_scenario": "**\"I don''t understand this problem!\"** (panicking)",
      "variation_response": "**\"Circle it. We''ll do it together at the end. Keep going on the ones you DO understand.\"**\n\nDon''t let one hard problem derail the entire session. Teach them to skip and return. Momentum matters more than perfection."
    },
    {
      "variation_scenario": "**\"The timer is annoying!\"** (covering ears)",
      "variation_response": "**\"Timer stays. But we can try a quieter one, or a visual-only timer that just lights up.\"**\n\nThe timer is non-negotiable, but the FORMAT can be adjusted. Find one that works for their sensory needs."
    }
  ]',
  
  -- PARENT STATE NEEDED
  '**Calm, but prepared.**

This system requires **20 minutes of buffer time**. Don''t try to implement it when you''re rushing to make dinner, on a work call, or 10 minutes before bedtime.

You need to be **physically present** for the first 2-3 weeks. Not hovering, not correcting every mistake, but THERE. Visible. Available.

Your job during homework:
✅ Reset the timer
✅ Celebrate each completed block
✅ Gently redirect if they wander off mid-timer
✅ Stay calm when they test boundaries

Your job is NOT:
❌ Do the homework for them
❌ Explain every problem
❌ Get frustrated when they struggle

**You are the scaffolding.** Steady, reliable, non-reactive. Over time, the scaffolding fades. But right now, you''re building the structure.',
  
  -- TAGS
  ARRAY['homework', 'focus', 'distraction', 'getting up', 'procrastination', 'math', 'worksheets', 'pomodoro', 'ritual', 'adhd', 'executive function', 'prefrontal cortex', 'movement', 'brain activation'],
  
  -- EMERGENCY SUITABLE
  false
);