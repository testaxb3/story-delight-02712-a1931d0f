-- SCREENS - DISTRACTED PROFILE
-- "Agrees to turn off tablet - genuinely forgets 30 seconds later"

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
  'Agrees to turn off tablet - genuinely forgets 30 seconds later',
  'Screens',
  'DISTRACTED',
  5,
  12,
  'Moderate',
  10,
  
  -- THE SITUATION
  'Your child is deep into a game or video. You say "5 more minutes, then we turn it off." They nod and say "okay!" — genuinely meaning it. But 5 minutes pass, you come back, and they look at you in complete shock: **"What? You never told me!"** They''re not lying. They truly don''t remember. Their brain was so locked into the screen that your words never made it past working memory.

This isn''t defiance. This is **hyperfocus** — the ADHD brain''s superpower and kryptonite. When a DISTRACTED child is engaged in something highly stimulating (screens deliver dopamine hits every few seconds), their prefrontal cortex essentially goes offline. They can''t hold your instruction in mind while simultaneously processing the game. The agreement happened, but it never got encoded into memory.

**Key detail:** They''re not manipulating you. If you quiz them 10 seconds after you spoke, they often can''t recall what you said. The screen occupied 100% of their cognitive bandwidth.',

  -- WHAT DOESN'T WORK
  '**❌ Verbal warnings from across the room**
  → Their auditory processing is suppressed during hyperfocus. Your words don''t register.

**❌ "You said okay! Why are you lying?"**
  → Accusations trigger shame and defensiveness. They genuinely don''t remember agreeing.

**❌ Sudden shutdown: "Time''s up, hand it over NOW"**
  → Rips them out of hyperfocus without transition time. Causes emotional dysregulation and meltdowns.

**❌ Expecting them to self-monitor time**
  → Time blindness is a core ADHD symptom. They physically can''t track time while hyperfocused.',

  -- STRATEGY STEPS (JSON)
  '[
    {
      "number": 1,
      "title": "Physical Anchor + Visual Timer",
      "explanation": "Stand next to them (not across the room). Gently place your hand on their shoulder to pull their attention from the screen. Say: **\"Look at me for 3 seconds.\"** Wait until they make eye contact. Then show them a visual timer (phone timer, Time Timer, kitchen timer) and say: **\"When this timer beeps, screen turns off. Watch me set it.\"** Let them see you press start. Place the timer in their peripheral vision — on the table next to them, propped against a wall they can see.",
      "example_phrases": [
        "\"I need your eyes on me for 3 seconds before I talk. Ready? 1... 2... 3.\"",
        "\"This timer is going next to you. When it beeps, the screen goes off — no arguing, no negotiating. Deal?\"",
        "\"Can you repeat back to me: what happens when the timer beeps?\""
      ]
    },
    {
      "number": 2,
      "title": "Body-Based Countdown (Last 60 Seconds)",
      "explanation": "When the timer has 60 seconds left, physically return to where they are. Tap their shoulder again. Say: **\"One minute left. I''m staying here until the timer beeps.\"** Stand or sit next to them silently. Your physical presence acts as an external cue that the transition is coming. At 30 seconds, say: **\"30 seconds — start wrapping up.\"** At 10 seconds, count down out loud: **\"10... 9... 8...\"** This forces their brain to split attention between the screen and your voice, breaking the hyperfocus gradually.",
      "example_phrases": [
        "\"One minute left. I''m staying right here with you until time''s up.\"",
        "\"30 seconds now — say goodbye to this level.\"",
        "\"10... 9... 8... 7... Time to finish the round.\""
      ]
    },
    {
      "number": 3,
      "title": "Immediate Handoff + Dopamine Bridge",
      "explanation": "When the timer beeps, hold out your hand and say: **\"Time''s up. Tablet goes here.\"** Stay calm and neutral — this isn''t a punishment, it''s a fact. If they protest (\"Wait, just one more—\"), interrupt with: **\"The timer beeped. That''s the rule. Tablet now, then you can [preferred activity].\"** As soon as they hand it over, immediately offer a dopamine bridge: a physical, engaging activity like jumping jacks, a quick game of catch, or a snack mission (\"Go grab the crackers from the pantry\"). This gives their brain something to do in the dopamine void left by the screen.",
      "example_phrases": [
        "\"Timer beeped. Tablet in my hand now — then we do jumping jacks.\"",
        "\"No more screen time right now. Let''s go bounce on the trampoline for 2 minutes.\"",
        "\"You followed the rule! High five. Now let''s go get a snack together.\""
      ]
    }
  ]',

  -- WHY THIS WORKS
  '**Hyperfocus Override Through Multi-Sensory Anchoring**
  DISTRACTED brains in hyperfocus mode have suppressed "top-down" attention (the part that notices time passing or remembers instructions). Your strategy works because it activates "bottom-up" attention through multiple sensory channels:
  • **Touch** (shoulder tap) → Pulls them out of screen tunnel vision
  • **Visual** (timer in peripheral vision) → Provides external time tracking
  • **Auditory + Proximity** (your voice + physical presence) → Forces divided attention, gradually breaking hyperfocus

**Working Memory Support**
  By staying physically present during the last 60 seconds, you become an external working memory aid. Your body is the reminder. This compensates for their inability to hold "screen time is ending" in their mind while hyperfocused.

**Dopamine Void Prevention**
  Screens flood the ADHD brain with dopamine. When the screen suddenly stops, there''s a neurochemical crash → irritability, sadness, or rage. The "dopamine bridge" (physical activity immediately after) gives the brain a less intense but still rewarding stimulus, smoothing the transition and preventing emotional dysregulation.',

  -- WHAT TO EXPECT (JSON)
  '{
    "first_30_seconds": "They may still protest when you tap their shoulder (\"Mom, just let me finish!\"), but you''ll notice their eyes actually leave the screen to look at you — proving they can hear you when you use physical anchoring. Expect initial resistance to handing over the device when the timer beeps.",
    "by_90_seconds": "If you stay physically present during the countdown, they''ll start glancing at the timer themselves in the last 30 seconds. This self-monitoring is a major win — they''re internalizing the external cue.",
    "this_is_success": "Success = they hand over the device within 10 seconds of the timer beeping, even if they grumble. They don''t need to be happy about it. Compliance without a meltdown is the goal. Bonus: after 5-7 consistent uses, they''ll start asking YOU to set the timer before they start screen time.",
    "dont_expect": [
      "Don''t expect them to remember your warning if you only said it verbally from another room — their brain genuinely didn''t encode it.",
      "Don''t expect cheerful acceptance when the timer beeps. Disappointment is normal; meltdown is what we''re preventing.",
      "Don''t expect them to internalize time awareness quickly. Even after weeks of this strategy, they''ll still need the external timer — time blindness doesn''t disappear."
    ]
  }',

  -- COMMON VARIATIONS (JSON)
  '[
    {
      "scenario": "\"The timer didn''t beep!\" (it did, they didn''t notice)",
      "response": "\"I heard it beep, and I was right here. The screen goes off now. We can check the timer together if you want — see, it says 0:00.\" (Show evidence, stay neutral, don''t argue.)"
    },
    {
      "scenario": "\"Just let me save my game first!\" (stalling tactic)",
      "response": "\"You have 10 seconds to tap save. I''m counting. 10... 9... 8...\" (Give them agency within a tight boundary.)"
    },
    {
      "scenario": "Mid-tantrum: throws the tablet, screams \"I hate you!\"",
      "response": "\"I know you''re upset. The rule doesn''t change. When you''re calm, we''ll talk about what to do next time so this feels easier.\" (Don''t engage mid-meltdown; address it after regulation.)"
    },
    {
      "scenario": "\"Why does [sibling] get more screen time than me?\"",
      "response": "\"Different brains need different rules. Your brain works best with a timer and a countdown. That''s not a punishment — it''s what helps you feel good after screens instead of awful.\""
    }
  ]',

  -- PARENT STATE NEEDED
  '**Calm, robotic neutrality** — This is not a moral issue; it''s a neurological one. Your child isn''t "bad" for forgetting or protesting. They have a brain that hyperfocuses and lacks internal time perception. You''re providing the external structure their brain can''t generate on its own.

**Physical presence** — You must be in the same room during the last 60 seconds. Yelling from the kitchen won''t work. Your body is the intervention.

**Patience for repetition** — They''ll need this exact routine every single time for months. ADHD brains don''t generalize well. Don''t expect them to "learn" and start doing it independently. The timer is a permanent accommodation, not a training tool.',

  -- TAGS
  ARRAY['screens', 'adhd', 'hyperfocus', 'transitions', 'time blindness', 'working memory', 'dopamine', 'visual timer', 'screen time', 'distracted'],

  -- EMERGENCY SUITABLE
  false
);