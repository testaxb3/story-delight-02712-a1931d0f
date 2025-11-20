-- Hygiene/DISTRACTED: Brushing teeth becomes 18-minute ordeal - constantly stops mid-brush
INSERT INTO public.scripts (
  title,
  category,
  profile,
  age_range,
  age_min,
  age_max,
  the_situation,
  what_doesnt_work,
  strategy_steps,
  why_this_works,
  what_to_expect,
  common_variations,
  parent_state_needed,
  difficulty_level,
  duration_minutes,
  emergency_suitable,
  works_in_public,
  tags
) VALUES (
  'Brushing teeth becomes 18-minute ordeal - constantly stops mid-brush',
  'Hygiene',
  'DISTRACTED',
  '4-11 years',
  4,
  11,
  
  -- THE SITUATION (Timeline Explosion structure)
  '**7:42 PM.** You hand them the toothbrush. Toothpaste is already on it.

**7:43 PM.** They put the brush in their mouth. Three seconds of brushing. Then they stop. They''re staring at the tile pattern on the wall.

**7:44 PM.** "Keep brushing, honey." They snap back. Brush moves again. Four seconds this time. Then they notice the water drop on the faucet. Brush is frozen mid-air. Their mouth is hanging open. Toothpaste foam is starting to drip.

**7:46 PM.** "You need to actually brush." They look confused. "I *am* brushing." The toothbrush hasn''t moved in 90 seconds. They genuinely don''t realize they stopped.

**7:48 PM.** You try again. "Finish brushing." They nod. Two seconds of movement. Then they start humming. The brush stops again. Now they''re conducting an invisible orchestra with the toothbrush. Foam is dripping onto their shirt.

**7:52 PM.** You''re exhausted. They''re still "brushing." The toothbrush has touched their teeth for maybe 11 seconds total. You have a work presentation tomorrow at 8 AM. Bedtime was supposed to be 8:00 PM. It''s now 7:52 PM and *teeth haven''t been brushed yet.*

Your jaw is clenched. Your shoulders are up by your ears. You can feel the tension headache starting.',

  -- WHAT DOESN'T WORK (Common Mistakes + Neuroscience structure)
  '**❌ COMMON MISTAKE #1: Repeating "Keep brushing" every 30 seconds**

You''re standing there like a sports commentator: "Keep going... don''t stop... you''re doing it... keep brushing..."

**Why it fails:** Their brain isn''t *choosing* to stop. Working memory drops the task every 8-12 seconds. Your verbal reminders create auditory input that *further distracts* them. You''re accidentally making it worse.

**The neuroscience:** ADHD brains have 30-40% less activity in the prefrontal cortex during sustained attention tasks. Task maintenance collapses without external structure. Verbal cues alone don''t provide enough structure—they''re too abstract and require processing language while executing a motor task.


**❌ COMMON MISTAKE #2: "You did this yesterday just fine!"**

Yesterday they brushed in 90 seconds flat. Today it''s been 11 minutes. You''re baffled.

**Why it fails:** Yesterday, they were in hyperfocus mode or had just transitioned from a high-stimulus activity. Today, their brain is in low-dopamine mode. **Performance variability isn''t defiance—it''s neurochemistry.** Comparing today to yesterday makes them feel broken.

**The neuroscience:** Dopamine fluctuations in DISTRACTED brains create massive day-to-day performance inconsistency. What worked yesterday might not work today—not because they forgot, but because their brain''s neurochemical state is different.


**❌ COMMON MISTAKE #3: Taking the toothbrush and doing it yourself**

You''re so tired. You just grab the toothbrush and brush their teeth for them.

**Why it fails:** You''re teaching them they don''t need to develop sustained attention for hygiene tasks. Age 4? Maybe okay. Age 9? You''re creating learned helplessness. They need *structure*, not rescue.',

  -- STRATEGY STEPS (varied language - not always "Your move:")
  '[
    {
      "step_number": 1,
      "step_title": "Build the External Timer System",
      "step_explanation": "Set a **visual timer for 2 minutes** right in front of their face. Not on your phone. Not verbal. A physical timer they can see.\n\nSay this:\n→ *\"We''re going to brush until this timer beeps. When it beeps, you''re done. The timer is the boss, not me.\"*\n\n**Critical:** Position the timer at eye level, directly in their line of sight while they''re at the sink. The visual countdown provides the external task maintenance their brain can''t generate internally.",
      "what_to_say_examples": [
        "\"The timer tells you when you''re done. Not me. Not you. The timer.\"",
        "\"Your job is to keep the brush moving until the beep. That''s it.\"",
        "\"If you stop, look at the timer. Is it still going? Then keep brushing.\""
      ]
    },
    {
      "step_number": 2,
      "step_title": "Introduce the Body Anchor Technique",
      "step_explanation": "**Anchor the task to a physical rhythm.** Their brain drops the task, but a motor pattern is harder to drop.\n\nTeach them to brush in circles while **tapping their foot** to a rhythm. The foot tap becomes the external metronome.\n\nSay this:\n→ *\"Brush in circles. Tap your foot at the same time. Brush-tap-brush-tap-brush-tap. When you stop tapping, you know you''ve stopped brushing.\"*\n\n**Why this works:** Pairing the task with a gross motor movement (foot tapping) creates a dual-task system. If they stop brushing, they notice because *the tapping feels wrong without the brushing.*",
      "what_to_say_examples": [
        "\"Tap your foot the whole time. When your foot stops, your brush should stop too.\"",
        "\"Brush-tap, brush-tap, brush-tap. Make it a rhythm.\"",
        "\"If you forget what you''re doing, check your foot. Is it tapping? Good. Keep going.\""
      ]
    },
    {
      "step_number": 3,
      "step_title": "Position Yourself as the Non-Verbal Checkpoint",
      "step_explanation": "Stand beside them—not hovering, not talking. When they stop brushing (and they will), **gently tap their shoulder** and point to the timer.\n\n**DO NOT speak.** The tap + point combo is a physical redirect that doesn''t require language processing.\n\nIf they stop and you tap, they look at the timer, see it''s still running, and resume. No negotiation. No \"why did I stop?\" spiral. Just: tap → timer → resume.\n\n**Key:** You''re not *reminding* them to brush. You''re providing a **sensory interrupt** that resets their attention back to the task.",
      "what_to_say_examples": [
        "\"I''m not going to talk. I''m just going to tap your shoulder if you stop. Then you check the timer.\"",
        "\"Shoulder tap = check the timer. That''s our signal.\"",
        "\"If I tap you, don''t say anything. Just look at the timer and keep going.\""
      ]
    }
  ]'::jsonb,

  -- WHY THIS WORKS
  'DISTRACTED brains have **collapsed working memory.** Working memory is the mental sticky note that holds "I am brushing my teeth" while you execute the task.

**In neurotypical brains:** Working memory holds the task for 60-120 seconds without support.

**In DISTRACTED brains:** Working memory holds the task for 8-12 seconds before it drops completely. They stop brushing not because they *decided* to stop—they stop because *the task fell out of their brain.* They genuinely don''t realize they stopped.

**Why the visual timer works:** It provides **continuous external task maintenance.** The brain doesn''t have to remember "I''m brushing my teeth" because the timer is *showing* them "you''re still brushing your teeth." The visual countdown replaces internal working memory.

**Why the body anchor works:** Motor memory is stored in the cerebellum and basal ganglia—brain regions that are *less impaired* in ADHD. Pairing the task with a motor rhythm (foot tapping) creates a dual-task loop that''s harder to drop. If the rhythm stops, they *feel* the absence immediately.

**Why the non-verbal tap works:** Verbal reminders require language processing, which competes with motor task execution. A physical tap is processed in the somatosensory cortex—it''s a **sensory interrupt** that resets attention without requiring cognitive processing. Tap → timer → resume. No language. No negotiation. Just sensory redirection.',

  -- WHAT TO EXPECT (with this_is_success)
  '{
    "first_30_seconds": "They''ll brush for 5-8 seconds, then stop. You''ll tap their shoulder. They''ll look confused (''I stopped?''), check the timer, resume. This will happen 4-6 times in the first 30 seconds. Do NOT get frustrated. This is their brain learning the system.",
    "by_2_minutes": "By Day 3-4, the number of stops drops from 6 to 2-3. By Week 2, they''ll start *self-checking* the timer without the shoulder tap. You''ll see them glance at the timer mid-distraction and resume without your intervention. THIS is working memory scaffolding becoming internalized.",
    "this_is_success": "Success is when they brush for 2 minutes with 0-1 stops and NO shoulder taps needed. Even better: when they say ''I stopped—let me check the timer'' *on their own.* That''s self-awareness of task dropout. That''s executive function development in real time.",
    "dont_expect": [
      "They will NOT brush perfectly on Day 1. Expect 6+ stops in the first week.",
      "They will NOT ''just remember'' to keep brushing. Their brain physically cannot hold the task without external support.",
      "Do NOT expect them to brush for 2 minutes without looking at the timer. The timer IS the scaffold. It''s supposed to be there.",
      "Do NOT remove the timer after Week 1 thinking ''they''ve got it now.'' Keep the timer for 6-8 weeks minimum until the motor pattern is deeply ingrained."
    ]
  }'::jsonb,

  -- COMMON VARIATIONS
  '[
    {
      "variation_scenario": "They stop brushing and say: \"I WAS brushing! I didn''t stop!\"",
      "variation_response": "Don''t argue. Say: *\"Your brush isn''t moving right now. Check the timer. Is it still going? Okay, keep brushing.\"* They genuinely don''t realize they stopped. Arguing about whether they stopped wastes time and creates shame. Just redirect to the timer."
    },
    {
      "variation_scenario": "They finish brushing but the timer says 47 seconds have passed (not 2 minutes).",
      "variation_response": "They *think* they brushed for 2 minutes because time perception is broken in DISTRACTED brains. Say: *\"The timer says 47 seconds. We need 2 minutes. Let''s keep going until it beeps.\"* The timer is the objective truth when their brain can''t track time."
    },
    {
      "variation_scenario": "They get frustrated and say: \"This is taking FOREVER!\"",
      "variation_response": "Validate + redirect. Say: *\"I know 2 minutes feels long. That''s because your brain wants to move on. But look—only 34 seconds left. You''ve got this.\"* Acknowledge the discomfort without rescuing them from it. The timer gives them a concrete endpoint."
    },
    {
      "variation_scenario": "They brush TOO aggressively trying to \"finish faster\" and hurt their gums.",
      "variation_response": "Stop immediately. Say: *\"Gentle circles. You''re scrubbing too hard. The timer doesn''t care how hard you brush—just that you brush for 2 minutes. Slow down.\"* Redirect the urgency away from speed and toward sustained gentle motion."
    }
  ]'::jsonb,

  -- PARENT STATE NEEDED
  'You need to be **physically present but emotionally neutral.** This is not a power struggle. This is a brain that needs external scaffolding.

**Your energy:** Calm, patient, robotic consistency. You''re not mad. You''re not disappointed. You''re a task support system.

**Your body:** Stand beside them (not behind—that feels like surveillance). Relaxed shoulders. No crossed arms. Your job is to tap and point, not lecture.

**Your mindset:** *\"Their brain is not holding the task. I am the external task holder until their brain learns to do this.\"*

If you feel frustration rising (and you will), remind yourself: **They are not choosing to stop. Their working memory is dropping the task involuntarily.** This is neurology, not defiance.',

  'Moderate',
  3,
  false,
  false,
  ARRAY['hygiene', 'working memory', 'sustained attention', 'executive function', 'time blindness', 'task initiation']
);