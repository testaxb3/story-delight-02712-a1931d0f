-- BEDTIME SCRIPT FOR DISTRACTED PROFILE
-- Situation: "Just 5 more minutes" turns into 45 minutes - hyperfocus prevents sleep transition

INSERT INTO public.scripts (
  title,
  category,
  profile,
  age_min,
  age_max,
  difficulty_level,
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
  '"Just 5 more minutes" turns into 45 - hyperfocused and unaware time exists',
  'Bedtime',
  'DISTRACTED',
  5,
  12,
  'Moderate',
  8,
  
  -- THE SITUATION (Scene-based structure with micro-details)
  '**9:47pm.** You told them bedtime was 9:00pm.

You''ve said "time for bed" 6 times in the last 40 minutes. Each time, they responded with "just 5 more minutes, I promise" without even looking up from their Lego tower.

They''re sitting cross-legged on the floor, tongue slightly out in concentration, completely absorbed. When you say their name, there''s a 3-second delay before they even register you spoke.

Their hands keep moving—click, click, snap—building the same section over and over because they keep forgetting which piece goes where, but they CANNOT stop.

You can see their eyes are tired (they''re rubbing them every 30 seconds), but their brain is locked onto this task like a tractor beam. The concept of "bedtime" doesn''t compute. Time itself doesn''t exist in their universe right now.

You feel the exhaustion rising in your chest. You''ve been patient. You''ve given warnings. Nothing penetrates the hyperfocus bubble.',
  
  -- WHAT DOESN'T WORK (3 mistake blocks with proper line breaks)
  '**❌ COMMON MISTAKE #1: Verbal warnings from across the room**

"Okay, 5 more minutes, then BED."

**Why it backfires:** Their brain literally doesn''t process verbal information when hyperfocused. The words hit their ears but never reach the processing center. You''re talking to a brick wall. They genuinely don''t hear you.


**❌ COMMON MISTAKE #2: Counting down time verbally**

"You have 3 minutes left... 2 minutes... 1 minute... TIME''S UP!"

**Why it backfires:** Time doesn''t exist for them right now. Saying "2 minutes" is like saying "florp minutes"—it''s meaningless. Their internal clock is broken during hyperfocus. They can''t track time even if they wanted to.


**❌ COMMON MISTAKE #3: Suddenly yanking away the activity**

You grab the Lego tower mid-build and say "THAT''S IT, BEDTIME NOW."

**Why it backfires:** Their nervous system experiences this as a physical assault. You''ve ripped them out of hyperfocus without warning. Expect immediate meltdown, tears, rage, or complete shutdown. You''ve triggered fight-or-flight.',
  
  -- STRATEGY STEPS (JSONB array)
  '[
    {
      "step_number": 1,
      "step_title": "Physical Proximity + Sensory Anchor",
      "step_explanation": "Move into their physical space. Kneel down to their level. Put your hand gently on their shoulder (or near them if they don''t like touch). Wait for their eyes to flick toward you before speaking. You''re creating a sensory anchor that breaks through hyperfocus without triggering fight-or-flight.",
      "what_to_say_examples": [
        "\"[Child''s name].\" (pause, wait for eye contact) \"I need your eyes for 5 seconds.\"",
        "\"Hey buddy.\" (gentle shoulder touch) \"Can you pause and look at me real quick?\"",
        "\"[Name], I''m right here.\" (get in their visual field) \"I need you to hear this.\""
      ]
    },
    {
      "step_number": 2,
      "step_title": "External Time Translation + Visual Countdown",
      "step_explanation": "Their brain can''t feel time, so you translate time into something visible. Set a physical timer they can SEE (phone timer with visual bar, kitchen timer, hourglass). This externalizes time tracking—they don''t have to rely on their broken internal clock.",
      "what_to_say_examples": [
        "\"I''m setting this timer for 5 minutes. When it beeps, we save your work and go to bed. Watch the bar—it shows you how much time is left.\"",
        "\"Here''s the deal: this timer counts down 5 minutes. You can keep building until it goes off. Then we take a photo of your tower and continue tomorrow.\"",
        "\"I''m putting this timer where you can see it. When the red part reaches zero, building time is done. No surprises.\""
      ]
    },
    {
      "step_number": 3,
      "step_title": "Hyperfocus Exit Bridge + Ritual Anchor",
      "step_explanation": "You can''t just stop hyperfocus—you need a bridge OUT of it. Create a micro-ritual that becomes the signal: take a photo, write down what they built, save progress. This gives their brain closure and prevents the \"I wasn''t done!\" meltdown.",
      "what_to_say_examples": [
        "\"When the timer beeps, we take 3 photos of your tower from different angles. Then you can rebuild it exactly tomorrow.\"",
        "\"Timer goes off = we write down what you built on this sticky note. Tomorrow you''ll remember where you left off.\"",
        "\"End of timer means we do our save ritual: one photo, one sentence about what you made, then we turn off the lights.\""
      ]
    }
  ]'::jsonb,
  
  -- WHY THIS WORKS (neuroscience explanation with proper line breaks)
  '**Hyperfocus is a neurological state, not defiance.**

When DISTRACTED brains hyperfocus, the prefrontal cortex (executive function center) goes offline. They literally cannot:
→ Track time internally
→ Shift attention voluntarily
→ Process verbal instructions in the background

**Physical proximity + sensory input breaks through** because it activates different neural pathways (touch, visual) that CAN penetrate hyperfocus.

**Visual timers externalize time tracking.** You''re giving them a tool their brain cannot generate internally. The visual countdown bar replaces their broken internal clock.

**Exit rituals provide closure.** Hyperfocus creates intense task engagement—their brain NEEDS a sense of completion or "saving progress" before it can let go. The photo/note ritual satisfies this neurological need for closure without requiring them to fully finish (which they never would).

**This approach works WITH their neurology, not against it.** You''re not fighting hyperfocus—you''re building scaffolding around it.',
  
  -- WHAT TO EXPECT (JSONB with specific timeline)
  '{
    "first_30_seconds": "They might not even look up when you approach. Keep your hand on their shoulder and wait. It can take 10-15 seconds for them to register your presence. Don''t take it personally—their brain is genuinely elsewhere.",
    "by_2_minutes": "Once the timer is set and visible, they usually relax slightly. The anxiety of \"when will this end?\" disappears because they can SEE the answer. They might glance at the timer every 30 seconds—this is good, it means they''re tracking.",
    "this_is_success": "When the timer goes off and they LET YOU take the photo/write the note without a meltdown. Even if they''re sad or reluctant, if they don''t rage or fight, you''ve successfully exited hyperfocus. Bedtime transition happens within 5 minutes of timer ending.",
    "dont_expect": [
      "DON''T EXPECT: Them to happily stop when the timer goes off. They''ll still be disappointed. Hyperfocus creates intense engagement—ending it ALWAYS feels bad, even with support.",
      "DON''T EXPECT: Them to remember your verbal warnings. Even if they nodded earlier, they genuinely forgot. Their working memory was overridden by hyperfocus.",
      "DON''T EXPECT: This to work the first time if they''ve never used a visual timer before. It takes 2-3 repetitions for the pattern to become familiar and trustworthy."
    ]
  }'::jsonb,
  
  -- COMMON VARIATIONS (JSONB array)
  '[
    {
      "variation_scenario": "They ignore the timer completely and don''t even look at it",
      "variation_response": "Move the timer directly into their visual field (put it ON the Lego tower if necessary). Some kids need the timer to be physically IN their activity space, not off to the side. You can also add an auditory cue: \"Every time the timer beeps (at 1-minute intervals), we check how much time is left together.\""
    },
    {
      "variation_scenario": "The timer goes off and they BEG for \"just 2 more minutes, I''m SO CLOSE to finishing\"",
      "variation_response": "Hold the boundary gently but firmly: \"I hear you. Your brain wants to finish. AND the timer is done, so we do our save ritual now. Tomorrow you can finish—I''ll set a timer then too so you have enough time.\" Do NOT extend the timer or you teach them timers are negotiable."
    },
    {
      "variation_scenario": "They cry or get angry when the timer goes off, even with the photo ritual",
      "variation_response": "Validate the disappointment: \"I know, it''s hard to stop when your brain wants to keep going. That''s how DISTRACTED brains work—they get REALLY into stuff.\" Then follow through with the ritual anyway. The crying is grief, not defiance. Let them feel it while you guide them through the transition."
    }
  ]'::jsonb,
  
  -- PARENT STATE NEEDED
  'You need to be calm and matter-of-fact, not frustrated or resentful. If you approach with "I''ve told you 10 times already!" energy, they''ll feel your irritation and get defensive. Remember: this isn''t defiance, it''s neurology. Your job is to be the external executive function they don''t have right now. Breathe. You''re teaching them a skill (using external time tools) they''ll use forever.',
  
  -- TAGS
  ARRAY['bedtime', 'hyperfocus', 'time blindness', 'transitions', 'distracted', 'timers', 'executive function', 'visual supports', 'task completion'],
  
  -- EMERGENCY SUITABLE
  false
);