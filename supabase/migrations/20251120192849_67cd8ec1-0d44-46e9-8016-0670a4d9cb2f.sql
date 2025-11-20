
-- MORNING ROUTINES - DISTRACTED
-- "Takes 45+ minutes to eat breakfast - constantly distracted while eating"
INSERT INTO scripts (
  title, category, profile, age_min, age_max,
  the_situation, what_doesnt_work, strategy_steps, why_this_works,
  what_to_expect, common_variations, parent_state_needed, tags, emergency_suitable
) VALUES (
  'Takes 45+ minutes to eat breakfast - constantly distracted while eating',
  'Morning Routines', 'DISTRACTED', 4, 11,
  'It''s 7:15 AM. School starts at 8:00. Your DISTRACTED child sits down to eat breakfast—cereal, toast, eggs, whatever you''ve prepared. You check back 10 minutes later: they''ve taken TWO bites. They''re staring at the cereal box. Or humming a song. Or building a tower with their cup and spoon.

You say, "EAT! We need to leave in 20 minutes!" They take another bite... then get distracted again. By 7:50 AM, the bowl is still half-full, and you''re in full panic mode—forcing bites, threatening consequences, or just giving up and sending them to school hungry.

**This is not defiance. This is not dawdling.** The DISTRACTED brain has **severe sustained attention deficits**—they cannot maintain focus on a single, unstimulating task (eating) for more than 30-60 seconds without their attention **involuntarily drifting** to something—ANYTHING—more interesting. Their brain is STARVED for stimulation, and eating plain cereal is neurologically BORING.

Every morning becomes a battle between "eat your breakfast" and their brain''s desperate hunt for dopamine.',
  '❌ **Yelling "STOP PLAYING AND EAT!" every 2 minutes**
→ Their attention drift is involuntary—it happens unconsciously. Yelling creates stress, which actually WORSENS their ability to focus on boring tasks.

❌ **Saying "You need to focus on your food!"**
→ This is like telling someone with ADHD to "just concentrate." Their brain doesn''t CHOOSE to drift—it''s neurologically incapable of sustaining attention on unstimulating tasks without external support.

❌ **Removing all visual stimuli (cereal boxes, toys) from the table**
→ This might reduce ONE distraction, but their brain will just latch onto internal thoughts, sounds, or their own hands. You can''t eliminate stimulation entirely.

❌ **Threatening consequences: "If you don''t finish, no dessert tonight!"**
→ Future consequences (hours away) are neurologically invisible to the DISTRACTED brain. They cannot motivate behavior in the moment.

**Why these don''t work:**
The DISTRACTED brain has **poor sustained attention and time blindness**. It needs **immediate, engaging stimuli** (not punishment) to stay on task.',
  '[
    {
      "step_number": 1,
      "title": "The Visual Timer: Make time concrete and visible",
      "explanation": "Before they start eating, you set a **visual timer** (Time Timer, hourglass, phone timer with visible countdown) for 15 minutes and place it directly in front of them on the table.\n\n**SAY THIS:**\n\"You have 15 minutes to finish breakfast. When the timer beeps, breakfast is done—whether the bowl is empty or not. Let''s see if you can beat it.\"\n\nThe timer sits ON THE TABLE, in their line of sight. As the red section shrinks (Time Timer) or sand drains (hourglass), their brain gets **constant visual feedback** about time passing.\n\n**Why this works:** The DISTRACTED brain has **severe time blindness**—15 minutes feels like 5 minutes or 50 minutes; they genuinely have no internal sense of time. A visual timer makes time **concrete and external**, creating urgency without you nagging. It also **gamifies** the task (\"beat the timer\"), adding the stimulation their brain craves."
    },
    {
      "step_number": 2,
      "title": "The Narration Technique: Give their brain constant micro-stimulation",
      "explanation": "While they eat, you sit nearby (not hovering, just present) and provide **gentle, frequent verbal cues**—not nagging, but **narration** that keeps their brain anchored to the task.\n\n**SAY THIS (every 60-90 seconds):**\n• \"Three more bites.\" (Not \"Hurry up!\" or \"Stop playing!\"—just a neutral cue)\n• \"Timer says 10 minutes left.\"\n• \"Nice, you''re halfway done.\"\n• \"Two more spoonfuls, then you''re finished.\"\n\nYour tone is **calm, factual, rhythmic**—like a GPS giving directions. You''re not emotionally invested in each bite; you''re just providing **external regulation** their brain cannot generate internally.\n\n**Why this works:** The DISTRACTED brain drifts because there''s no internal \"anchor\" keeping attention on the task. Your gentle, frequent verbal cues act as **micro-redirects**—pulling their attention back to eating every 60-90 seconds before they fully drift away. This is called **external pacing**, and it''s one of the most effective ADHD strategies for boring tasks."
    },
    {
      "step_number": 3,
      "title": "Natural consequence: When the timer beeps, breakfast is done",
      "explanation": "When the 15-minute timer beeps, you calmly say:\n\n**SAY THIS:**\n\"Timer''s done. Breakfast is over. Let''s put the bowl away and get ready for school.\"\n\nIf the bowl is still half-full, you do NOT force more bites, scold, or continue the meal. You just **calmly implement the consequence**: breakfast time is over.\n\n**IF THEY PROTEST (\"But I''m still hungry!\"):**\nStay calm: \"You had 15 minutes. The timer is done. You can have a snack at recess.\" Then move on to the next part of the morning routine.\n\n**Why this works:** The DISTRACTED brain learns through **immediate, consistent consequences** (not threats). When they experience hunger at 10 AM because they didn''t finish breakfast, their brain starts to **associate \"not eating during timer\" with \"being hungry later.\"** Over time (2-3 weeks), this creates internal motivation to stay on task during the 15-minute window."
    }
  ]'::jsonb,
  '**Neurologically, DISTRACTED children have:**
• **Severe sustained attention deficits** (cannot focus on unstimulating tasks for more than 30-60 seconds without involuntary drift)
• **Dopamine-starved brain** (eating plain food provides almost zero stimulation, so the brain constantly seeks novelty)
• **Time blindness** (no internal sense of time passing—15 minutes could feel like 5 or 50)

When you say, "Eat your breakfast," their brain:
1. Starts eating (initial compliance)
2. Within 60 seconds, attention **involuntarily drifts** to cereal box/song/thought (dopamine-seeking)
3. Forgets they were eating—genuinely surprised when you say "You''ve only had two bites!"

**Traditional approaches (yelling, removing distractions, threatening) fail because they don''t provide the external structure the DISTRACTED brain needs to sustain attention.**

**This strategy works because:**
1. **Visual timer** → Makes time concrete and adds urgency (stimulation)
2. **Narration** → Provides constant external regulation (micro-redirects every 60-90 seconds)
3. **Natural consequence** → Teaches through immediate reality (hunger at 10 AM) instead of abstract threats

You''re teaching: *"Your brain can''t track time or stay focused alone—so we built systems (timer, my cues) that help you succeed. If you don''t use the time, you experience the real consequence (hunger)."*

The 45-minute breakfast saga ends when external structure compensates for what the brain cannot do.',
  '{
    "first_30_seconds": "When you first set the timer, they may ignore it completely and continue drifting. That''s expected—start using the narration technique immediately: \"Timer started. Take a bite.\"",
    "by_90_seconds": "With the visual timer AND your narration, most DISTRACTED kids can reduce breakfast time from 45+ minutes to 15-20 minutes. They will still drift, but your cues catch them faster.",
    "this_is_success": "Success is NOT perfect focus on eating. Success is completing breakfast in 15-20 minutes instead of 45+ minutes, with fewer power struggles. Some drifting is neurologically inevitable—we''re just reducing the DURATION of each drift.",
    "timeline_to_change": "Expect 2-3 weeks for the pattern to stabilize. Week 1: They may test the boundary (\"What happens if I don''t finish?\")—you calmly implement the consequence (breakfast ends, they''re hungry later). Week 2-3: Their brain starts to connect \"eat during timer = not hungry later,\" and breakfast time improves.",
    "dont_expect": [
      "Perfect focus on food—their brain will ALWAYS drift; we''re just managing it better",
      "Them to finish every breakfast in 15 minutes immediately—some mornings they''ll be slower (poor sleep, stress)",
      "Zero narration needed after one week—most DISTRACTED kids need verbal cues for months or even years",
      "This skill to generalize to dinner or other meals immediately—you''ll need the same system for each mealtime"
    ]
  }'::jsonb,
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
  'Calm, rhythmic, robotic. You must be the **external timer and pacer**—not frustrated when they drift (their brain literally cannot help it), not emotionally invested in each bite, just calmly providing **verbal cues every 60-90 seconds** like a GPS. The DISTRACTED child needs you to be their **attention anchor**, gently pulling them back to the task before they fully float away.',
  ARRAY['morning-routines','distracted','mealtime','sustained-attention','time-blindness','visual-timer','external-pacing','breakfast'],
  false
);
