-- Insert INTENSE script: My 6 year old doesn't want to do homework
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
  'My 6 year old doesn''t want to do homework',
  'School',
  'INTENSE',
  5,
  8,
  'Moderate',
  15,
  
  -- THE SITUATION (Parent POV)
  '**3:47 PM. Kitchen table.**

Your 6-year-old just walked in from school. Backpack hits the floor with a thud. You can see it in her eyes—she''s already running on empty.

"Hey sweetie, time for homework."

Her body freezes. Eyes instantly fill with tears. Fists clench at her sides.

**"I ALREADY DID SCHOOL ALL DAY!"**

She drops to the floor like her legs gave out. Arms crossed. Jaw set. The homework sheet is right there on the counter—8 simple math problems. Maybe 10 minutes of actual work.

To you, it''s one page.

To her, it''s **Mount Everest**.

You glance at the clock. You still need to make dinner. You''re exhausted from your own day. You just want this to be **over**.

But she''s planted on that floor like a boulder. And you can feel your own frustration rising.',

  -- WHAT DOESN'T WORK (Escalation Sequence)
  '❌ **COMMON MISTAKE #1: "The faster you do it, the faster it''s over"**

**What happens:**
You try logic. You explain that homework only takes 10 minutes. She screams louder. Now she''s crying AND yelling.

**Why it fails:**
Logic doesn''t penetrate a nervous system in overdrive. Her amygdala (emotional brain) is running the show. Your words sound like background noise.

**The neuroscience:**
When an INTENSE child is dysregulated, their prefrontal cortex (logic center) goes offline. Rational arguments feel like **pressure**, not persuasion.


❌ **COMMON MISTAKE #2: "No TV until homework is done"**

**What happens:**
You pull out consequences. "No screen time tonight if you don''t sit down right now." She throws herself backward, screaming "I DON''T CARE!"

**Why it fails:**
Threats escalate emotional intensity. Her brain interprets your consequence as an **attack**, triggering fight-or-flight even harder.

**The neuroscience:**
Punishment activates the stress response. Cortisol floods her system. Now she''s not just resisting homework—she''s in **survival mode**.


❌ **COMMON MISTAKE #3: "It''s just one page!"**

**What happens:**
You try to minimize the task. "It''s so easy! Look, only 8 problems!" She yells: "YOU DON''T UNDERSTAND!"

**Why it fails:**
Minimizing her feelings **invalidates** her experience. It makes her feel unheard, which increases resistance.

**The neuroscience:**
Dismissing emotions activates the social pain centers in her brain (same regions as physical pain). Now she''s fighting you **and** the homework.',

  -- STRATEGY STEPS (Coaching Format)
  '[
    {
      "step_number": 1,
      "step_title": "Pause Before Push (The 15-Minute Rule)",
      "step_explanation": "Give her 15-20 minutes of **transition time** immediately after school. No academics. No pressure. Just recharge time.\n\n**The shift:** Instead of demanding homework the second she walks in, you create a buffer zone. Let her have a snack, move her body, decompress.\n\n**What this looks like:**\n\"I see you. School was long. Let''s get a snack first. We''ll talk about homework in 15 minutes.\"\n\nShe might still protest, but you''re **not engaging** yet. You''re giving her nervous system permission to land.",
      "what_to_say_examples": [
        "\"School days are hard. Let''s take a break first.\"",
        "\"Homework happens, but not this second. Snack time first.\"",
        "\"I hear you. Let your brain rest for a bit.\""
      ]
    },
    {
      "step_number": 2,
      "step_title": "Make It Tiny (Micro-Steps That Don''t Overwhelm)",
      "step_explanation": "After the break, don''t say \"Do your homework.\" Break it into the **smallest possible step**.\n\n**The shift:** INTENSE brains shut down when tasks feel massive. By making the first step ridiculously small, you bypass the overwhelm.\n\n**What this looks like:**\n\"Let''s just write your name at the top. That''s it. Nothing else.\"\n\nShe writes her name. You celebrate: \"Done! One step complete.\"\n\nThen: \"Okay, let''s do problem number 1. Just one.\"\n\n**Do NOT** say \"Now let''s do all 8.\" You''re teaching her brain: **Small wins = progress**.",
      "what_to_say_examples": [
        "\"Just write your name. That''s the only job right now.\"",
        "\"One problem. Not eight. Just one.\"",
        "\"You did one! That''s progress. Let''s do one more.\""
      ]
    },
    {
      "step_number": 3,
      "step_title": "Body Before Brain (Movement Unlocks Focus)",
      "step_explanation": "Right before sitting down, give her **5 minutes of physical movement**. Jumping jacks, a dance party, running up and down the stairs—anything that gets her body moving.\n\n**The shift:** Physical activity burns off excess cortisol and activates her prefrontal cortex (the part that helps her focus).\n\n**What this looks like:**\n\"Before we sit, let''s do 20 jumping jacks together. Ready? Let''s go!\"\n\nOr: \"Pick a song. We''re dancing for one full song before homework.\"\n\n**Why this works:** Movement shifts her out of freeze mode and into **action mode**. By the time she sits, her brain is more regulated.",
      "what_to_say_examples": [
        "\"Let''s burn some energy first. 20 jumping jacks—go!\"",
        "\"Dance party for 3 minutes, then we sit. Deal?\"",
        "\"Race me to the end of the hallway and back. Then homework.\""
      ]
    }
  ]'::jsonb,

  -- WHY THIS WORKS
  '**The INTENSE brain after 6-7 hours of school is neurologicallyexhausted.**

Her prefrontal cortex—the part responsible for focus, impulse control, and emotional regulation—has been working overtime all day. By 3:47 PM, it''s running on **fumes**.

Asking her to do homework immediately after school is like asking a phone with 2% battery to run a demanding app. It''s going to crash.

**What the science says:**

**1. Transition time allows neural recovery.**
Studies show that children (especially INTENSE ones) need a "decompression window" after school. Without it, their stress hormones stay elevated, making focus nearly impossible.

**2. Micro-steps bypass overwhelm.**
Breaking tasks into tiny chunks activates the brain''s reward system (dopamine release) with each small win. This builds momentum instead of resistance.

**3. Movement regulates the nervous system.**
Physical activity reduces cortisol (stress hormone) and increases dopamine and serotonin (focus and mood). A 5-minute movement break can shift her from "shutdown mode" to "ready mode."

**The result:**
You''re not forcing compliance. You''re **partnering with her nervous system**—setting her up to succeed instead of demanding performance when her brain can''t deliver.',

  -- WHAT TO EXPECT
  '{
    "first_30_seconds": "She may still resist initially, but the intensity will be lower. Instead of a full meltdown, you might get grumbling or negotiation.",
    "by_2_minutes": "If you stay calm and hold the boundary with compassion, she starts to regulate. Her body language softens. She might sigh and say ''Fine'' or slowly move toward the table.",
    "this_is_success": "After a few days of this routine, she starts to **anticipate** the structure. She walks in, grabs her snack, and asks ''Can I do my break now?'' No meltdown. No floor protest. She knows homework is coming, but she trusts the transition time.",
    "dont_expect": [
      "Immediate enthusiasm for homework",
      "Zero complaints or resistance",
      "Instant change on day one—this is a pattern you''re building over time"
    ]
  }'::jsonb,

  -- COMMON VARIATIONS
  '[
    {
      "variation_scenario": "She says: \"I''m too tired! I can''t do it!\"",
      "variation_response": "Validate, then offer a choice:\n\n\"I hear you. School is exhausting. Here''s the deal: homework happens, but you choose—snack break first or movement break first?\"\n\nYou''re giving her **autonomy** within the structure. The boundary (homework happens) stays firm, but she gets to pick the path."
    },
    {
      "variation_scenario": "She asks: \"Can I just do it tomorrow morning?\"",
      "variation_response": "Hold the boundary with empathy:\n\n\"I get it—tomorrow sounds easier. But homework happens today. You pick: do it now after your break, or right after dinner?\"\n\nAgain, she gets a choice, but the non-negotiable stays."
    },
    {
      "variation_scenario": "She starts the homework but stops after 1 problem and says \"I''m done!\"",
      "variation_response": "Celebrate the win, then ask for one more:\n\n\"Yes! One problem done. Nice work. Now take 3 deep breaths with me. [Breathe together.] Okay, let''s do just one more.\"\n\nYou''re scaffolding her stamina in tiny increments."
    },
    {
      "variation_scenario": "Full meltdown—crying on the floor, refusing to move.",
      "variation_response": "Stay calm. Don''t match her intensity. Sit nearby (not hovering) and say:\n\n\"I''m here when you''re ready. I''m not going anywhere.\"\n\nLet the storm pass. When she starts to calm (even slightly), offer the transition: \"Okay. Let''s get that snack now.\""
    }
  ]'::jsonb,

  -- PARENT STATE NEEDED
  '**You are the calm anchor.**

Your energy regulates hers. If you''re frustrated, rushed, and tense, she **feels** it—and it escalates her.

Before you even mention homework, take 3 deep breaths yourself. Remind yourself: *This isn''t defiance. This is her nervous system asking for help.*

**The truth:**
Giving her 10-15 minutes to decompress might feel like a "waste of time" when you''re already stressed. But here''s the math:

- **Forcing homework immediately** = 45 minutes of battle, tears, and exhaustion.
- **Giving transition time** = 15-minute break + 10 minutes of calm homework = 25 minutes total.

You''re not being "soft." You''re being **strategic**.

Stay steady. She''s watching you to see if this is safe.',

  -- TAGS
  ARRAY['homework', 'school', 'resistance', 'after school', 'meltdown', 'first grade', 'transitions', '6 year old', 'exhaustion', 'school burnout'],

  -- EMERGENCY SUITABLE
  false
);