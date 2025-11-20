
-- SCRIPT 1: MORNING ROUTINES - DISTRACTED
-- "Loses shoes/backpack every single morning - can't find essential items"
INSERT INTO scripts (
  title, category, profile, age_min, age_max,
  the_situation, what_doesnt_work, strategy_steps, why_this_works,
  what_to_expect, common_variations, parent_state_needed, tags, emergency_suitable
) VALUES (
  'Loses shoes/backpack every single morning - can''t find essential items',
  'Morning Routines', 'DISTRACTED', 4, 12,
  'It''s 7:45 AM. School starts at 8:15. Your DISTRACTED child is dressed, has eaten breakfast, and now needs to **find their shoes and backpack**. They check the shoe rack—**not there**. They wander to their room—**not there either**. You ask, "Where did you put them yesterday?" They have **zero memory**. Panic sets in. You''re now frantically searching the house, finding one shoe under the couch, the other in the bathroom, and the backpack in the garage. You''re running late. Again.

**This is not defiance. This is not laziness.** The DISTRACTED brain has **severe working memory deficits**—they genuinely cannot remember where they put things 10 minutes ago, let alone yesterday. Their brain doesn''t "attach" items to locations automatically like neurotypical brains do. Every morning becomes a scavenger hunt.',
  '❌ **Yelling "WHERE ARE YOUR SHOES?!" in frustration**
→ Their working memory is already overwhelmed. Adding emotional stress makes it HARDER for them to remember or problem-solve.

❌ **Saying "You need to be more responsible and keep track of your things!"**
→ This is a neurological issue, not a character flaw. They WANT to remember where things are—their brain just doesn''t encode that information reliably.

❌ **Constantly finding items for them every morning**
→ This creates dependency and doesn''t build the external systems their brain desperately needs to function independently.

❌ **Punishing them for losing items**
→ Punishment doesn''t improve working memory. It just makes mornings more stressful and damages your relationship.

**Why these don''t work:**
The DISTRACTED brain **cannot improve its working memory through willpower or consequences**. It needs **external systems** (visual cues, designated spots, routines) to compensate for what the brain cannot do internally.',
  '[
    {
      "step_number": 1,
      "title": "The Launch Pad: One designated spot for ALL essential items",
      "explanation": "The night before (during calm time), you create a **Launch Pad**—a specific physical location (basket, shelf, hook by the door) where EVERY item needed for tomorrow is placed together.\n\n**SAY THIS:**\n\"Tonight before bed, we''re going to build your Launch Pad. That means shoes, backpack, jacket, and [any other essentials] all go in THIS spot. In the morning, you grab everything from here and go.\"\n\n**SHOW THEM:** Walk them to the Launch Pad location. Put the basket/shelf at eye level for them. Use a bright visual marker (colorful bin, label with their name, picture of a rocket ship).\n\n**THE RULE:** Nothing else goes in the Launch Pad. Only tomorrow''s essentials. This eliminates decision fatigue and memory load in the morning.\n\n**Why this works:** The DISTRACTED brain struggles with **spatial memory** (remembering where things are in 3D space). A single, visually distinct Launch Pad creates a **neural shortcut**—one spot, every morning, every time. No memory required."
    },
    {
      "step_number": 2,
      "title": "The Night-Before Checklist: Pre-load their working memory",
      "explanation": "Before bed, you use a **visual checklist** (laminated card, poster on wall, app) that shows PICTURES of each item that goes in the Launch Pad.\n\n**SAY THIS:**\n\"Let''s do the Launch Pad checklist together. First item: shoes. Can you put your shoes in the Launch Pad? Great. Check. Next: backpack...\"\n\n**THE SYSTEM:**\n• Visual checklist with PICTURES (not just words—DISTRACTED brains process images faster)\n• They physically check off each item as they place it in the Launch Pad\n• You supervise the first 2 weeks, then fade to just asking: \"Did you do the Launch Pad checklist?\"\n\n**Why this works:** DISTRACTED children have **poor prospective memory** (remembering to do something in the future). The checklist the night before **pre-loads** their brain with the routine, so in the morning, their working memory isn''t trying to remember 5 things—it just remembers: \"Launch Pad.\""
    },
    {
      "step_number": 3,
      "title": "Morning mantra: ''Check the Launch Pad'' (not ''Where are your shoes?'')",
      "explanation": "In the morning, when they''re ready to leave, you DO NOT ask where their shoes are. You simply say:\n\n**SAY THIS:**\n\"Time to check the Launch Pad.\"\n\nThat''s it. No nagging. No reminders about individual items. Just: \"Check the Launch Pad.\"\n\n**IF THEY FORGOT TO USE IT THE NIGHT BEFORE:**\nStay CALM. Say: \"Looks like the Launch Pad is empty. Let''s find your shoes together quickly, then tonight we''ll make sure the Launch Pad is ready.\"\n\n**Why this works:** The DISTRACTED brain gets OVERWHELMED by multi-step instructions (\"Get your shoes, find your backpack, grab your jacket...\"). A **single-phrase cue** (\"Check the Launch Pad\") reduces cognitive load and becomes a **verbal anchor** for the entire routine. Over time, this phrase triggers the automatic behavior without requiring active memory."
    }
  ]'::jsonb,
  '**Neurologically, DISTRACTED children have:**
• **Severely impaired working memory** (they cannot hold multiple pieces of information in mind—like "where I put my shoes")
• **Poor spatial memory** (they don''t naturally "attach" objects to locations in their mental map)
• **Executive dysfunction** (the brain doesn''t automatically plan ahead or create routines—it lives in the NOW)

When you ask, "Where are your shoes?" their brain is trying to:
1. Search episodic memory (What did I do yesterday after school?)
2. Reconstruct spatial location (Where in the house would shoes be?)
3. Hold that information while also managing morning stress

**This is neurologically impossible for most DISTRACTED brains under time pressure.**

**This strategy works because:**
1. **Launch Pad** → Eliminates the need for spatial memory (one spot, every time)
2. **Night-before checklist** → Pre-loads the routine when their brain is CALM (not rushed)
3. **Single-phrase cue** → Reduces cognitive load in the morning (one instruction, not five)

You''re teaching: *"Your brain doesn''t remember where things are—so we built a system that remembers FOR you."*

The chaos stops when the environment compensates for what the brain cannot do.',
  '{
    "first_30_seconds": "The first morning, they may still ask ''Where are my shoes?'' even though you built the Launch Pad together. Calmly redirect: ''Check the Launch Pad.'' Do NOT answer the question directly—guide them to the system.",
    "by_90_seconds": "If they used the Launch Pad the night before, they will grab everything and be ready in under 2 minutes. If they forgot, help them quickly find items, then calmly re-teach the system tonight.",
    "this_is_success": "Success is NOT perfect memory after one night. Success is gradually reducing morning searches from 15 minutes to 2 minutes over 2-3 weeks as the Launch Pad becomes automatic.",
    "timeline_to_change": "Expect 2-3 weeks for the Launch Pad to become a true habit. The first week, you''ll need to supervise the night-before checklist closely. By week 2, most DISTRACTED kids can do it with just a verbal reminder. By week 3, many will automatically check the Launch Pad without prompting.",
    "dont_expect": [
      "Perfect execution after one night—DISTRACTED brains take 3-4x longer to build automatic routines than neurotypical brains",
      "Them to remember to use the Launch Pad without reminders the first 2 weeks—you WILL need to supervise initially",
      "Zero morning searches ever again—there will be occasional relapses (growth spurts, stress, illness)",
      "Them to generalize this system to other areas of life immediately—the Launch Pad works for mornings; you''ll need separate systems for homework, sports equipment, etc."
    ]
  }'::jsonb,
  '[
    {
      "scenario": "They forgot to use the Launch Pad last night, and now it''s 7:50 AM with no shoes",
      "response": "Stay CALM. Say: ''Okay, let''s do a quick search. You check your room, I''ll check the living room.'' Set a 2-minute timer. Find what you can, leave the rest. Then calmly say: ''Tonight we''ll make sure the Launch Pad is ready so tomorrow is easier.''"
    },
    {
      "scenario": "They put shoes in the Launch Pad but forgot their backpack (which has homework)",
      "response": "Point to the checklist: ''Let''s check the Launch Pad list. Shoes—check. Backpack—where is it?'' Help them quickly find it, then add it to the Launch Pad. No lecture. Tonight, review the checklist together."
    },
    {
      "scenario": "They argue: ''I don''t NEED the Launch Pad, I can remember!''",
      "response": "Say calmly: ''Your brain is amazing at lots of things, but remembering where things are isn''t one of them. The Launch Pad is how we help your brain. Let''s just try it for one week.''"
    },
    {
      "scenario": "Sibling puts their stuff in the Launch Pad, causing confusion",
      "response": "Each child gets their OWN Launch Pad (different colored bins, different locations). Say: ''This is YOUR Launch Pad. That''s [sibling]''s. Your things only go in yours.''"
    },
    {
      "scenario": "They use the Launch Pad perfectly for 2 weeks, then stop",
      "response": "This is normal regression. Don''t shame them. Just calmly restart: ''Looks like we need to reset the Launch Pad habit. Let''s do the checklist together tonight.''"
    }
  ]'::jsonb,
  'Calm, patient, systematic. You must be the **external working memory system**—not frustrated when they forget (their brain literally cannot help it), not micromanaging every item, just calmly guiding them back to the ONE system that works: the Launch Pad. The DISTRACTED child needs you to be their **reliable routine anchor**, not their emergency item-finder.',
  ARRAY['morning-routines','distracted','working-memory','lost-items','organization','executive-function','launch-pad','checklist'],
  false
);

-- SCRIPT 2: MORNING ROUTINES - DISTRACTED
-- "Starts getting ready then disappears - found playing with toys 10 minutes later"
INSERT INTO scripts (
  title, category, profile, age_min, age_max,
  the_situation, what_doesnt_work, strategy_steps, why_this_works,
  what_to_expect, common_variations, parent_state_needed, tags, emergency_suitable
) VALUES (
  'Starts getting ready then disappears - found playing with toys 10 minutes later',
  'Morning Routines', 'DISTRACTED', 4, 11,
  'It''s 7:30 AM. You send your DISTRACTED child to their room to get dressed. You''re making breakfast, packing lunches, getting yourself ready. Ten minutes later, you check on them—and they''re **sitting on the floor, fully engrossed in building a Lego tower, still in pajamas**.

You say, "I told you to get dressed!" They look genuinely CONFUSED: "Oh! I forgot."

**This is not defiance. This is not ignoring you.** The DISTRACTED brain has **severe task initiation and task persistence deficits**. They walked into their room with the INTENTION to get dressed—but their brain saw the Lego tower, got **instantly captured by the more stimulating task**, and **completely forgot the original goal**. The instruction "get dressed" was erased from working memory the moment they saw something more interesting.

Every morning, you send them to do Task A, and they get distracted by B, C, and D—never completing A.',
  '❌ **Yelling "I TOLD YOU TO GET DRESSED! WHY ARE YOU PLAYING?!"**
→ They genuinely forgot. Adding emotional intensity doesn''t improve their working memory—it just makes them feel shame for something their brain cannot control.

❌ **Saying "You need to FOCUS and stop getting distracted!"**
→ This is like telling someone with ADHD to "just pay attention." Their brain doesn''t CHOOSE to get distracted—it''s neurologically wired to be captured by novelty and stimulation.

❌ **Removing all toys from their room**
→ This might reduce ONE distraction, but their brain will just latch onto something else (a book, the window, their own thoughts). You can''t eliminate all stimuli.

❌ **Hovering over them the entire time to keep them on task**
→ This creates dependency and doesn''t teach them the self-regulation skills they''ll need for the rest of their lives.

**Why these don''t work:**
The DISTRACTED brain has **poor executive function**—it cannot hold a goal ("get dressed") in mind while resisting competing stimuli (toys, thoughts, sounds). It needs **external structure and cues** to stay on track.',
  '[
    {
      "step_number": 1,
      "title": "The Body Double: Stay in the room while they complete the task",
      "explanation": "Instead of sending them to their room alone, you **stay physically present** while they get dressed—but you don''t do the task FOR them.\n\n**SAY THIS:**\n\"Time to get dressed. I''m going to stay in here with you while you do it.\"\n\nThen you sit on their bed or stand nearby and do something neutral (check your phone, fold laundry, just be present). You are NOT micromanaging every move—you''re just **being there**.\n\n**Why this works:** The DISTRACTED brain struggles with **task initiation and persistence** when alone. Your physical presence acts as a **cognitive anchor**—it keeps the goal (\"get dressed\") active in their working memory. This is called **body doubling**, and it''s one of the most effective ADHD strategies.\n\n**THE RULE:** You don''t nag or give step-by-step instructions. You just exist in the room. If they start to drift toward toys, you gently redirect: \"Shirt first, then pants.\""
    },
    {
      "step_number": 2,
      "title": "The Outfit Station: Pre-selected clothes in ONE visible spot",
      "explanation": "The night before, you and your child **pick out tomorrow''s outfit together** and place it in ONE visible location (hook on the door, chair, basket).\n\n**SAY THIS (the night before):**\n\"Let''s pick your outfit for tomorrow. What shirt do you want? Okay, here''s the pants. Let''s put them right here on this chair so in the morning, you just grab them and get dressed.\"\n\n**THE SYSTEM:**\n• Outfit is COMPLETE (underwear, socks, shirt, pants—everything)\n• It''s in ONE spot, visually distinct (bright basket, labeled hook)\n• No decisions in the morning—just grab and dress\n\n**Why this works:** The DISTRACTED brain gets **overwhelmed by decision-making**. If they have to CHOOSE an outfit in the morning while their brain is already taxed, they''ll get distracted. Pre-selecting eliminates that cognitive load and reduces the steps between \"go get dressed\" and \"dressed.\""
    },
    {
      "step_number": 3,
      "title": "The 5-Minute Timer: External time pressure (not you)",
      "explanation": "Before they start getting dressed, you set a **visual timer** (phone, Time Timer, hourglass) for 5 minutes and say:\n\n**SAY THIS:**\n\"You have 5 minutes to get dressed. Let''s see if you can beat the timer. I''ll be right here.\"\n\nPlace the timer where they can SEE it. As time runs down, their brain gets **external pressure** (from the timer, not from you).\n\n**IF THE TIMER RUNS OUT:**\nStay calm. Say: \"Timer''s done. Are you dressed? No? Okay, let''s finish up now.\" No punishment, no lecture—just calmly help them complete the task if needed.\n\n**Why this works:** The DISTRACTED brain has **poor time awareness** (time blindness). A visual timer makes time **concrete and visible**, creating urgency without parental nagging. It also gamifies the task (\"beat the timer\"), which adds stimulation their brain craves."
    }
  ]'::jsonb,
  '**Neurologically, DISTRACTED children have:**
• **Severe executive dysfunction** (cannot hold a goal in mind while filtering out distractions)
• **Impaired working memory** (the instruction "get dressed" is erased from memory within 60 seconds if not actively reinforced)
• **Novelty-seeking brain** (their dopamine system is STARVED, so anything new/stimulating instantly captures attention)

When you send them to their room alone, their brain:
1. Walks in with the goal "get dressed"
2. Sees toys/books/window → Dopamine spike
3. Goal "get dressed" is **instantly overwritten** by the more stimulating task
4. 10 minutes later, they genuinely have NO MEMORY of why they went to their room

**Traditional approaches (yelling, punishment, "focus harder") fail because they don''t address the neurological issue: poor executive function.**

**This strategy works because:**
1. **Body doubling** → Your presence keeps the goal active in their working memory
2. **Pre-selected outfit** → Eliminates decision fatigue and reduces distractions
3. **Visual timer** → Makes time concrete and adds external urgency (not from you)

You''re teaching: *"Your brain needs help staying on task—so we built systems (my presence, the outfit station, the timer) that help you succeed."*

The disappearing act stops when the environment supports what the brain cannot do alone.',
  '{
    "first_30_seconds": "Even with you in the room, they may still glance at toys or start to drift. Calmly redirect: ''Shirt on first.'' Don''t engage in conversation about the toys—just gently pull focus back to the task.",
    "by_90_seconds": "With body doubling, most DISTRACTED kids can complete getting dressed in 3-5 minutes instead of the usual 15-20 (or never). The timer creates urgency, and your presence keeps them on track.",
    "this_is_success": "Success is NOT them magically getting dressed alone after one morning. Success is completing the task IN THE ROOM with you there, building the neural pathway for the routine. Over weeks, you can gradually fade your presence.",
    "timeline_to_change": "Expect 3-4 weeks of body doubling before you can start fading. Week 1: You stay the whole time. Week 2-3: You stay but check your phone more. Week 4: You check in after 2 minutes instead of staying the whole time. By week 6-8, some DISTRACTED kids can get dressed alone with just a timer.",
    "dont_expect": [
      "Them to get dressed alone after one week—their brain needs prolonged scaffolding to build this routine",
      "Perfect focus even with you in the room—they will still drift occasionally; that''s neurological, not defiance",
      "Them to beat the timer every time—some mornings they''ll be slower (poor sleep, stress, sensory issues)",
      "This skill to generalize to other tasks immediately—body doubling works for getting dressed; you''ll need similar systems for homework, chores, etc."
    ]
  }'::jsonb,
  '[
    {
      "scenario": "You stay in the room, but they STILL start playing with toys instead of dressing",
      "response": "Calmly say: ''I see the toys are really interesting, but right now we''re getting dressed. Shirt on first, THEN you can play after school.'' If they persist, gently move the toys out of sight: ''These are going on the shelf until you''re dressed.''"
    },
    {
      "scenario": "They get one piece of clothing on (shirt), then freeze and stare at the wall",
      "response": "This is **task persistence failure**. Calmly prompt the NEXT step: ''Great, shirt is on. Now pants.'' Their brain needs step-by-step cues, not one big instruction."
    },
    {
      "scenario": "They beat the timer one morning and are SO proud, then the next morning they ignore the timer completely",
      "response": "This is normal inconsistency with ADHD. Celebrate the wins (''You beat the timer yesterday! Let''s try again today'') but don''t punish the off days. Just calmly continue with body doubling."
    },
    {
      "scenario": "They argue: ''I don''t need you to stay in here, I can do it myself!''",
      "response": "Say: ''I know you want to, and we''re working toward that. Right now, your brain needs the help. Let''s do it together for a few more weeks, then we''ll try you doing it solo.''"
    },
    {
      "scenario": "Sibling doesn''t need body doubling and complains it''s ''unfair'' that you stay with DISTRACTED child",
      "response": "Explain to sibling: ''Everyone''s brain works differently. [DISTRACTED child] needs help with this right now, just like you needed help with [something they struggled with]. Fair means everyone gets what they need.''"
    }
  ]'::jsonb,
  'Patient, calm, present. You must be the **external executive function**—not frustrated when they drift (their brain literally cannot help it), not micromanaging, just calmly being present and gently redirecting when needed. The DISTRACTED child needs you to be their **cognitive anchor**, holding the goal steady while their brain learns the routine.',
  ARRAY['morning-routines','distracted','task-initiation','body-doubling','executive-function','working-memory','time-blindness','focus'],
  false
);
