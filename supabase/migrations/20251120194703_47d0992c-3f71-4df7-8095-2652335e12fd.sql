
-- Delete the buggy script
DELETE FROM scripts 
WHERE title = 'Takes 45+ minutes to eat breakfast - constantly distracted while eating';

-- Create properly structured script for MORNING ROUTINES - DISTRACTED
INSERT INTO scripts (
  title, category, profile, age_min, age_max,
  difficulty, duration_minutes,
  the_situation, what_doesnt_work, 
  strategy_steps, why_this_works,
  what_to_expect, common_variations, parent_state_needed,
  tags, emergency_suitable
) VALUES (
  'Takes 45+ minutes to eat breakfast - constantly distracted while eating',
  'Morning Routines', 'DISTRACTED', 4, 11,
  'Moderate', 15,
  
  -- THE SITUATION
  'It''s 7:15 AM. Your DISTRACTED child has been sitting at the breakfast table for **30 minutes**—bowl of cereal still half-full, eyes wandering to the window, fingers playing with the spoon, body slumped sideways.

You''ve said "Finish your breakfast" **eight times**. Each time, they take one bite, then drift again—staring at the cereal box, humming, asking random questions: "Why is the sky blue?" "Can we get a pet lizard?"

**Meanwhile:** The clock is ticking. The school bus leaves in 20 minutes. They''re still in pajamas. The breakfast bowl sits there, mocking you.

**The DISTRACTED brain during boring tasks:** Their prefrontal cortex (attention control center) is **chronically under-stimulated**. Eating breakfast = **zero novelty, zero dopamine**. Their brain literally cannot generate enough internal motivation to sustain attention on a repetitive, unstimulating task like chewing and swallowing. So it searches for **anything** more interesting—the dog walking by, a crack in the wall, a random thought about dinosaurs.

**You''re not dealing with defiance or laziness.** You''re dealing with a brain that **cannot self-regulate attention** on low-stimulation tasks.',

  -- WHAT DOESN'T WORK
  '❌ **Nagging every 30 seconds: "Eat! Stop playing! Focus!"**
→ Why it backfires: Their brain tunes you out after the third repetition. Nagging becomes background noise. Plus, your frustration creates **emotional dysregulation** on top of attention dysregulation.

❌ **Sitting with them in silence, hoping they''ll just finish**
→ Why it backfires: The DISTRACTED brain needs **external structure and pacing**. Without verbal cues, they drift indefinitely. Silence = zero stimulation = complete attention collapse.

❌ **Threatening: "If you don''t finish, no screen time today!"**
→ Why it backfires: Distant consequences (hours away) don''t activate ADHD brains. They need **immediate, concrete feedback**—not abstract future punishments.

❌ **Forcing bites: "You''re not leaving this table until the bowl is empty!"**
→ Why it backfires: Now breakfast becomes a **power struggle**. You''re fighting executive dysfunction with force, which only creates stress, tears, and damaged parent-child trust.

**→ Why these backfire:** None of these address the **root cause**—the DISTRACTED brain''s inability to sustain attention on boring tasks without **external pacing and structure**.',

  -- STRATEGY STEPS (JSON)
  '[
    {
      "step_number": 1,
      "step_title": "The Visual Timer: Make time concrete and visible",
      "step_explanation": "Before they start eating, you set a **visual timer** (Time Timer, hourglass, phone timer with visible countdown) for **15 minutes** and place it directly in front of them on the table.\n\n**SAY THIS:**\n\"You have 15 minutes to finish breakfast. When the timer beeps, breakfast is done—whether the bowl is empty or not. Let''s see if you can beat it.\"\n\nThe timer sits **ON THE TABLE**, in their line of sight. As the red section shrinks (Time Timer) or sand drains (hourglass), their brain gets **constant visual feedback** about time passing.\n\n**Why this works:** The DISTRACTED brain has **severe time blindness**—15 minutes feels like 5 minutes or 50 minutes; they genuinely have no internal sense of time. A visual timer makes time **concrete and external**, creating urgency without you nagging. It also **gamifies** the task (\"beat the timer\"), adding the stimulation their brain craves.",
      "what_to_say_examples": [
        "You have 15 minutes to finish breakfast. When the timer beeps, breakfast is done. Let''s see if you can beat it.",
        "Look—timer is starting! You got this."
      ]
    },
    {
      "step_number": 2,
      "step_title": "The Narration Technique: Give their brain constant micro-stimulation",
      "step_explanation": "While they eat, you sit nearby (not hovering, just present) and provide **gentle, frequent verbal cues**—not nagging, but **narration** that keeps their brain anchored to the task.\n\n**SAY THIS (every 60-90 seconds):**\n• \"Three more bites.\"\n• \"Timer says 10 minutes left.\"\n• \"Nice, you''re halfway done.\"\n• \"Two more spoonfuls, then you''re finished.\"\n\nYour tone is **calm, factual, rhythmic**—like a GPS giving directions. You''re not emotionally invested in each bite; you''re just providing **external regulation** their brain cannot generate internally.\n\n**Why this works:** The DISTRACTED brain drifts because there''s no internal \"anchor\" keeping attention on the task. Your gentle, frequent verbal cues act as **micro-redirects**—pulling their attention back to eating every 60-90 seconds before they fully drift away. This is called **external pacing**, and it''s one of the most effective ADHD strategies for boring tasks.",
      "what_to_say_examples": [
        "Three more bites.",
        "Timer says 10 minutes left.",
        "Nice, you''re halfway done.",
        "Two more spoonfuls, then you''re finished."
      ]
    },
    {
      "step_number": 3,
      "step_title": "The Natural Consequence: When the timer ends, breakfast ends",
      "step_explanation": "When the 15-minute timer beeps, you calmly say:\n\n**SAY THIS:**\n\"Timer''s done. Breakfast is over. Let''s put the bowl away and get ready for school.\"\n\nIf the bowl is still half-full, you do NOT force more bites, scold, or continue the meal. You just **calmly implement the consequence**: breakfast time is over.\n\n**IF THEY PROTEST (\"But I''m still hungry!\"):**\nStay calm: \"You had 15 minutes. The timer is done. You can have a snack at recess.\" Then move on to the next part of the morning routine.\n\n**Why this works:** The DISTRACTED brain learns through **consistent, immediate consequences**—not lectures or threats. Over time (usually 5-7 days), their brain starts to recognize: *If I don''t eat during timer time, I don''t get to eat.* This creates **internal urgency** where none existed before. The timer becomes the authority, not you—removing power struggles.",
      "what_to_say_examples": [
        "Timer''s done. Breakfast is over. Let''s put the bowl away and get ready for school.",
        "You had 15 minutes. The timer is done. You can have a snack at recess if you''re hungry."
      ]
    }
  ]'::jsonb,

  -- WHY THIS WORKS
  '**The DISTRACTED brain lacks two critical executive functions for task completion:**

1. **Time awareness:** They have no internal clock. 15 minutes passes unnoticed because their prefrontal cortex isn''t tracking time.
2. **Sustained attention on boring tasks:** Eating cereal = zero novelty, zero dopamine. Their brain disengages automatically.

**This strategy compensates for both deficits:**

• **The visual timer** makes time **external and visible**—their eyes see time shrinking, which activates urgency circuits in the brain.
• **Your narration** provides **external pacing**—like a metronome for their attention. Each verbal cue pulls them back before they fully drift.
• **The natural consequence** (timer ends = breakfast ends) creates **immediate feedback**. The DISTRACTED brain learns best from **consistent, immediate results**, not distant threats.

**Neuroscience insight:** ADHD brains don''t produce enough dopamine for "boring but necessary" tasks. The timer adds **novelty and challenge** (beat the clock!), which increases dopamine just enough to sustain attention. Your verbal cues act as **external frontal lobe support**—doing the job their underdeveloped prefrontal cortex can''t yet do alone.

**Over time (10-14 days):** Their brain starts to anticipate the timer routine. The external structure becomes internalized habit. They begin eating faster **without** constant prompting because the timer has trained their brain to associate breakfast with urgency.',

  -- WHAT TO EXPECT (JSON with proper field names)
  '{
    "first_30_seconds": "They might test the boundary: \"Can I have more time?\" Stay firm. \"Nope, 15 minutes is what we have. Timer is starting now.\"",
    "this_is_success": "Success = they finish breakfast in 15 minutes (even if you had to narrate every 60 seconds). Success does NOT mean they suddenly eat independently with zero support. The DISTRACTED brain needs external regulation—that''s normal.",
    "dont_expect": [
      "Them to suddenly eat breakfast independently without verbal cues. They NEED your narration—that''s the scaffolding.",
      "Perfect focus from Day 1. The first few days, they''ll still drift—but slightly less each time.",
      "Zero resistance. Some mornings they''ll argue or test. Stay calm, stay consistent."
    ]
  }'::jsonb,

  -- COMMON VARIATIONS (JSON)
  '[
    {
      "scenario": "The timer beeps, bowl is still half-full, and they cry: \"But I''m still hungry!\"",
      "response": "Stay calm: \"You had 15 minutes. Timer is done. You can have a snack at recess if you''re hungry.\" Do NOT extend breakfast time or give \"just two more bites.\" The consequence must be consistent or the timer becomes meaningless."
    },
    {
      "scenario": "They eat quickly for the first 5 minutes, then completely drift for the remaining 10",
      "response": "Increase narration frequency: Every 60 seconds, say: \"Three more bites. Timer says 8 minutes left.\" The narration is the key—without it, the timer alone won''t work for most DISTRACTED brains."
    },
    {
      "scenario": "They argue: \"The timer is stressing me out!\"",
      "response": "Validate, then redirect: \"I know it feels rushed. Your brain just needs help tracking time. Let''s practice using it together.\" The timer creates healthy urgency, not anxiety—but if they''re genuinely overwhelmed, increase the time to 20 minutes initially, then gradually reduce."
    },
    {
      "scenario": "Sibling finishes breakfast in 5 minutes and leaves the table, distracting DISTRACTED child",
      "response": "Ask sibling to stay at the table doing a quiet activity (reading, drawing) until DISTRACTED child is done, OR have DISTRACTED child eat 5 minutes earlier than sibling to avoid comparison."
    },
    {
      "scenario": "They finish breakfast in 10 minutes one day (huge win!), then take 25 minutes the next day",
      "response": "This inconsistency is normal with ADHD—brain performance varies day to day based on sleep, stress, hormone fluctuations. Celebrate the wins, stay calm on the off days, keep using the system consistently."
    }
  ]'::jsonb,

  -- PARENT STATE NEEDED
  'Calm, rhythmic, robotic. You must be the **external timer and pacer**—not frustrated when they drift (their brain literally cannot help it), not emotionally invested in each bite, just calmly providing **verbal cues every 60-90 seconds** like a GPS. The DISTRACTED child needs you to be their **attention anchor**, gently pulling them back to the task before they fully float away.',

  -- TAGS
  ARRAY['breakfast', 'eating slow', 'distracted eating', 'morning routine', 'time blindness', 'ADHD', 'timer', 'pacing'],

  -- EMERGENCY SUITABLE
  false
);
