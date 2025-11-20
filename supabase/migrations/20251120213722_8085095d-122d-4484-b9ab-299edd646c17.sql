-- Fix line breaks in what_doesnt_work for Hygiene/DISTRACTED script
UPDATE public.scripts
SET what_doesnt_work = '**❌ COMMON MISTAKE #1: Repeating "Keep brushing" every 30 seconds**

You''re standing there like a sports commentator: "Keep going... don''t stop... you''re doing it... keep brushing..."

**Why it fails:** Their brain isn''t *choosing* to stop. Working memory drops the task every 8-12 seconds. Your verbal reminders create auditory input that *further distracts* them. You''re accidentally making it worse.

**The neuroscience:** ADHD brains have 30-40% less activity in the prefrontal cortex during sustained attention tasks. Task maintenance collapses without external structure. Verbal cues alone don''t provide enough structure—they''re too abstract and require processing language while executing a motor task.


**❌ COMMON MISTAKE #2: "You did this yesterday just fine!"**

Yesterday they brushed in 90 seconds flat. Today it''s been 11 minutes. You''re baffled.

**Why it fails:** Yesterday, they were in hyperfocus mode or had just transitioned from a high-stimulus activity. Today, their brain is in low-dopamine mode. **Performance variability isn''t defiance—it''s neurochemistry.** Comparing today to yesterday makes them feel broken.

**The neuroscience:** Dopamine fluctuations in DISTRACTED brains create massive day-to-day performance inconsistency. What worked yesterday might not work today—not because they forgot, but because their brain''s neurochemical state is different.


**❌ COMMON MISTAKE #3: Taking the toothbrush and doing it yourself**

You''re so tired. You just grab the toothbrush and brush their teeth for them.

**Why it fails:** You''re teaching them they don''t need to develop sustained attention for hygiene tasks. Age 4? Maybe okay. Age 9? You''re creating learned helplessness. They need *structure*, not rescue.'
WHERE title = 'Brushing teeth becomes 18-minute ordeal - constantly stops mid-brush'
AND category = 'Hygiene'
AND profile = 'DISTRACTED';