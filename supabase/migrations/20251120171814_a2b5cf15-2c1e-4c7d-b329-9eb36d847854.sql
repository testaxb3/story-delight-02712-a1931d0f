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
  'Won''t wake up - lies in bed refusing to get up',
  'Morning Routines',
  'INTENSE',
  5,
  12,
  'Moderate',
  20,
  
  $$It's 7:00 AM. You've called their name three times. Your INTENSE child is still in bed—**eyes open but body refusing to move**. When you try to physically get them up, they **pull the covers over their head**, whine, or start crying. "I'm too tired!" "I can't!" "Five more minutes!"

The INTENSE brain has **extreme difficulty with the sleep-to-wake transition**. Their nervous system takes **longer to fully activate** in the morning—cortisol levels rise more slowly, and their body feels genuinely **heavy and unable to function**. This isn't defiance; it's **physiological sluggishness** colliding with time pressure. By 7:15, you're yelling, they're crying, and the day starts in chaos.$$,
  
  $$❌ **Yelling "GET UP NOW!" or ripping the covers off**
→ Their nervous system is already struggling to activate. Aggression triggers their **threat response**, flooding them with cortisol and making them **more frozen**, not less.

❌ **Negotiating or giving "5 more minutes" repeatedly**
→ The INTENSE brain will take every inch. Inconsistent boundaries teach them that **refusing long enough = avoiding the hard thing**. You're reinforcing the resistance.

❌ **Letting them sleep and then rushing frantically**
→ Panic mode activates their **stress response**, making dressing/eating/transitions even harder. You've just made the entire morning a cortisol nightmare.

**Why these backfire:** The INTENSE brain's **sleep inertia is real**—their body genuinely feels unable to move. But accommodating it without structure just reinforces **learned helplessness**. They need **external activation**, not threats or giving up.$$,
  
  $$[
    {
      "step_number": 1,
      "step_title": "Activate their nervous system gradually",
      "step_explanation": "Your job is to **wake their body, not just their brain**. The INTENSE nervous system needs sensory input to shift from parasympathetic (rest) to sympathetic (action).\n\n**Your move:** Turn on the light (bright light signals cortisol production). Open the curtains. Play upbeat music. Say their name **calmly but clearly**. Then, **touch their shoulder or foot**—physical contact activates their proprioceptive system.\n\n**The shift:** You're giving their brain **external cues** to override the internal \"I can't move\" signal. This isn't optional; it's **physiological scaffolding**.",
      "what_to_say_examples": [
        "Good morning! It's time to wake up. I'm turning on the light to help your body get ready.",
        "I know it feels hard. Let's get your body moving. Sit up first, then we'll do the rest."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Use the body-first sequence",
      "step_explanation": "Do NOT expect them to jump up and get dressed. Their executive function is **offline**. Break it into micro-steps and **do it with them**.\n\n**Do NOT:** Leave the room expecting them to just do it. The INTENSE brain **cannot self-initiate** when sleep inertia is high. They need you **physically present**.\n\n**Important:** Sit them up → feet on floor → stand up → walk to bathroom. **One step at a time, with you guiding**. Say: Let's sit up together. Good. Now feet down. Good. Their body follows **external direction** when internal motivation is missing.",
      "what_to_say_examples": [
        "Okay, first step: sit up. I'll help you. There we go. Now feet on the floor.",
        "Let's walk to the bathroom together. Your body just needs to move first, then you'll feel better."
      ]
    },
    {
      "step_number": 3,
      "step_title": "Build the wake-up reward system",
      "step_explanation": "The next morning, **immediately after they're up**, give positive reinforcement. Even if it took 15 minutes, if they **eventually got up without a full meltdown**, that's progress.\n\n**The morning message:** You got up even though it was hard. That's your strong brain working. Link waking up to something they enjoy: Because you got up, we have time for preferred breakfast or activity.\n\n**Why it matters:** The INTENSE brain responds powerfully to **dopamine rewards**. You're teaching: **waking up hard but doing it anyway equals good feeling plus preferred outcome**. Over weeks, this becomes neural habit.",
      "what_to_say_examples": [
        "I'm proud of you for getting up even though your body felt heavy. That's what strong kids do.",
        "You got up in time! That means we can have your favorite cereal this morning."
      ]
    }
  ]$$::jsonb,
  
  $$**The INTENSE brain has pronounced sleep inertia—their transition from sleep to wakefulness is neurologically slower.**

By **activating their nervous system gradually** (step 1), you're compensating for their delayed cortisol response with **external sensory input**. By **using the body-first sequence** (step 2), you're providing the **executive function scaffolding** their brain can't yet generate. By **building the wake-up reward system** (step 3), you're creating a **dopamine pathway** that makes morning activation easier over time.

**The first week will feel like pulling teeth.** They'll resist **every morning** and you'll feel like a drill sergeant. But by **week 3**, most INTENSE kids start **sitting up on their own** because their brain has learned: **Getting up is hard, but I can do it, and good things happen after.**$$,
  
  $$
  {
    "first_5_minutes": "Expect **resistance and whining**. They may say \"I can't\" or pull covers over their head. **Stay calm and present**—this is their nervous system struggling, not defiance.",
    "by_10_minutes": "Watch for the **turning point**: once they're sitting up with feet on the floor, their body starts activating. **Movement generates alertness**—walking to the bathroom will wake them faster than lying there.",
    "by_week_2": "You'll notice they **sit up faster** when you turn on the light. Their nervous system is learning the pattern: **light plus voice equals time to activate**. Resistance time shrinks from 15 minutes to 5.",
    "dont_expect": [
      "Them to wake up cheerful and energized—INTENSE kids may always struggle with mornings; the goal is **functional compliance**, not happiness",
      "Independence by week 2—they'll need your physical presence for **months** before they can self-initiate. This is brain development, not behavior."
    ],
    "this_is_success": "Success equals they sit up **within 5 minutes** of you entering the room, even if they're grumpy. Or they say \"I don't want to\" but **still move their body**. Compliance despite discomfort is **massive** for the INTENSE brain."
  }
  $$::jsonb,
  
  $$[
    {
      "variation_scenario": "They cry and say \"I'm too tired, I can't do it\"",
      "variation_response": "**Validate, then move.** \"I hear you—your body feels really tired. AND it's time to get up. Let's do it together.\" Empathy plus boundary. Their feeling is real; the consequence (getting up) is still non-negotiable."
    },
    {
      "variation_scenario": "They fall back asleep after you leave the room",
      "variation_response": "**Stay in the room until they're vertical and moving.** You cannot trust the INTENSE brain to self-activate during sleep inertia. Physical presence is the intervention until the habit solidifies."
    },
    {
      "variation_scenario": "You're rushing and don't have time for the gradual process",
      "variation_response": "**Emergency mode:** Physically lift them to sitting (calmly, not angrily). Guide them to bathroom. Get them moving **first**, regulate **after**. On time-crunched days, survival over perfection. But return to gradual activation tomorrow."
    },
    {
      "variation_scenario": "They're genuinely exhausted from poor sleep the night before",
      "variation_response": "**This is real.** If sleep deprivation is chronic, address bedtime separately—earlier bedtime, wind-down routine, sleep hygiene. But **this morning**, they still need to get up. Acknowledge: \"I know you're really tired. Tonight we'll work on better sleep.\""
    }
  ]$$::jsonb,
  
  'Calm, consistent, patient. You must be the external structure—not frustrated, not giving in, just steady. The INTENSE child needs to feel that you will help their body do what their brain cannot yet initiate.',
  
  ARRAY['morning-routines', 'intense', 'transitions', 'waking-up', 'executive-function', 'resistance'],
  
  false
);