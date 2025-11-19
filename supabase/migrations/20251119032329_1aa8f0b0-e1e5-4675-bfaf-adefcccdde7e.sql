-- Create INTENSE script for Mealtime category
INSERT INTO scripts (
  title,
  category,
  profile,
  age_min,
  age_max,
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
  'Refuses to eat - textures trigger complete sensory meltdown',
  'Mealtime',
  'INTENSE',
  3,
  10,
  15,
  
  'Your child sits at the table, looks at their plate, and immediately pushes it away. "I can''t eat this!" They''re not being difficult - their sensory system is screaming danger signals. The texture of that food feels wrong in a way you can''t understand. Their body goes into fight-or-flight. Every meal becomes a battle you didn''t start.',
  
  '❌ **"Just try one bite"** → Feels like forcing them to touch something that burns

→ Their nervous system is already in alarm mode - pressure makes it worse

❌ **"You ate this last week!"** → INTENSE sensory thresholds change daily

→ What was tolerable Tuesday feels unbearable Thursday

❌ **"You''ll sit here until you eat"** → Activates defiance response on top of sensory overload

→ Now you''re fighting TWO nervous system responses, not one',
  
  '[
    {
      "step": 1,
      "title": "Name the sensory alarm",
      "explanation": "Get down to their eye level. Use calm, matter-of-fact tone:\n\n\"Your body is sending you big signals about that food. Let me see if I can help.\"\n\nPause. Let them breathe.",
      "phrases": [
        "Your senses are working really hard right now",
        "I see your body saying no to that texture",
        "Let''s figure out what your mouth can handle today"
      ]
    },
    {
      "step": 2,
      "title": "Offer the safety audit",
      "explanation": "Give them control over the sensory experience:\n\n\"Point to one food on your plate that feels safest right now. You don''t have to eat it - just point.\"\n\nWait. Don''t rush. Let them scan their plate without pressure.",
      "phrases": [
        "Which food feels like your body could handle it?",
        "Is there anything here that doesn''t make your mouth feel worried?",
        "What would make this plate feel safer for your senses?"
      ]
    },
    {
      "step": 3,
      "title": "Offer the exposure ladder",
      "explanation": "Give them graduated options that respect their nervous system:\n\n\"You don''t have to eat it. Can you just smell it? Or touch it with your finger? Or lick it once? You choose.\"\n\nThis gives their sensory system a chance to adapt without the threat of forcing it down.",
      "phrases": [
        "What''s the smallest thing you could do with this food?",
        "Can your senses just investigate it, not eat it?",
        "Let''s let your body get used to it before your mouth tries"
      ]
    }
  ]'::jsonb,
  
  '**Why This Works:**

INTENSE children have **sensory processing sensitivity** - their nervous systems detect and amplify sensory information that others barely notice. Research shows their interoceptive awareness (internal body signals) is hyperactive.

**The texture aversion isn''t pickiness - it''s a neurological alarm system:**
• Their sensory cortex flags certain textures as threat-level stimuli
• The amygdala (fear center) activates before the food touches their mouth
• Their body enters sympathetic nervous system arousal (fight-or-flight)

**Naming the sensory alarm** → Validates their experience, reduces shame, shifts from "bad behavior" to "overwhelmed nervous system"

**The safety audit** → Restores their sense of control, which is the antidote to nervous system dysregulation

**The exposure ladder** → Allows habituation without flooding their system - gradual exposure is how sensory sensitivities actually improve',
  
  '{
    "first_30_seconds": "They may still refuse to engage. Their nervous system is convinced the food is dangerous. Stay calm. Your regulation helps their regulation.",
    "by_90_seconds": "If they point to a safe food or agree to smell/touch something, their nervous system is starting to shift from threat to curiosity. Even micro-engagement is progress.",
    "this_is_success": "Success is ANY sensory interaction with food without a meltdown - pointing, smelling, touching, licking. You''re rewiring their nervous system''s relationship with food textures. This is how real change happens.",
    "dont_expect": [
      "Don''t expect them to suddenly eat the food - sensory desensitization takes weeks of exposure",
      "Don''t expect consistency - their sensory thresholds fluctuate based on stress, sleep, and nervous system state",
      "Don''t expect logic to work - their sensory system operates below conscious control"
    ]
  }'::jsonb,
  
  '[
    {
      "scenario": "They refuse to even look at the plate",
      "response": "\"You don''t have to look at it. Can you just tell me what you''re worried your mouth will feel?\" Name the fear before addressing the food."
    },
    {
      "scenario": "They only eat 3 foods total",
      "response": "\"Your safe foods are perfect. Can we put one new food on the table - not your plate, just nearby - so your senses can get used to seeing it?\" Proximity exposure without pressure."
    },
    {
      "scenario": "They gag at the smell before tasting",
      "response": "\"Your nose is very sensitive today. Let''s move that food further away. What smells feel okay right now?\" Honor their sensory reality."
    },
    {
      "scenario": "They eat something one day, refuse it the next",
      "response": "\"Your sensory system changes. What worked yesterday might not work today, and that''s okay. What feels possible right now?\" Normalize the variability."
    }
  ]'::jsonb,
  
  '**You must be regulated to help them regulate.**

INTENSE children''s sensory issues trigger parental anxiety ("Will they ever eat normally?") and frustration ("They ate this last week!"). Your stress escalates their nervous system dysregulation.

**Before you sit down for the meal:**
• Take 3 slow exhales - longer out-breath than in-breath
• Remind yourself: "Their sensory system is not defying me - it''s protecting them from perceived threat"
• Release the expectation that they''ll eat normally - you''re doing sensory exposure therapy, not a normal meal

**Your calm, matter-of-fact presence** is the environmental safety cue their nervous system needs to shift from threat-detection mode to curiosity mode.',
  
  ARRAY[
    'mealtime',
    'sensory',
    'textures',
    'food refusal',
    'picky eating',
    'intense',
    'sensory processing',
    'food aversion',
    'nervous system'
  ],
  
  false
);