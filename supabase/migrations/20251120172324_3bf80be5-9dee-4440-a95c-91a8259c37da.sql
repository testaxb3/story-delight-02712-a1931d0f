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
  'Takes forever to eat - drags meals for 45+ minutes',
  'Mealtime',
  'INTENSE',
  4,
  11,
  'Moderate',
  30,
  
  $$It is dinner time. Your INTENSE child sits at the table and takes one bite. Then they stare at the wall. Another bite. Five minutes pass. They play with their fork. Talk about something unrelated. Take another microscopic bite. Forty-five minutes in, half the food is still on their plate, and you are **losing your mind**.

The INTENSE brain has **weak interoceptive awareness**—they genuinely struggle to recognize hunger cues or connect eating with feeling satisfied. Their attention is also **easily pulled away** from the task (eating) to internal thoughts, sensory exploration, or anything more stimulating. This is NOT manipulation or stalling; it is **genuine executive dysfunction** around eating as a goal-directed task. By the time you explode in frustration, they are shocked because to them, they ARE eating.$$,
  
  $$❌ **Sitting there nagging every 30 seconds to take another bite**
→ Constant reminders activate their **oppositional response**—the INTENSE brain resists being controlled. You are turning dinner into a power struggle, making it take LONGER.

❌ **Threatening to take the food away if they do not finish faster**
→ Pressure increases their stress, which **shuts down appetite** further. The INTENSE brain cannot rush a task they are not physiologically engaged with.

❌ **Letting them graze for 2 hours until bedtime**
→ No boundaries teaches their brain that **meals have no structure**. You are reinforcing the endless eating pattern instead of building focused mealtime habits.

**Why these backfire:** The INTENSE brain needs **external structure to compensate for weak internal drive to eat**. Without clear time boundaries and engagement strategies, they will drift indefinitely because eating simply is not compelling enough to hold their focus.$$,
  
  $$[
    {
      "step_number": 1,
      "step_title": "Set a visible timer for mealtime",
      "step_explanation": "Before the meal starts, announce: Dinner time is 25 minutes. Set a **visual timer** they can see (phone timer, kitchen timer, hourglass). When the timer goes off, dinner is done—whether they finished or not.\n\n**Your move:** This is **not a punishment**. Say it neutrally: When the timer rings, we clear plates. If you are still hungry later, you can have [specific snack option]. This gives them **predictability and control** within a boundary.\n\n**The shift:** You are giving their brain an **external deadline** to compensate for their lack of internal urgency. The timer becomes the enforcer, not you.",
      "what_to_say_examples": [
        "Dinner time is 25 minutes starting now. You can see the timer. When it beeps, we are done.",
        "The timer is going. You decide how much you eat in this time. When it rings, plates go away."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Minimize distractions and increase engagement",
      "step_explanation": "The INTENSE brain needs **focused attention on eating**, which means removing competing stimuli and making the meal more engaging.\n\n**Do NOT:** Allow TV, tablets, or toys at the table. These **override eating** as the primary task. Also do NOT allow wandering from the table mid-meal—bodies stay seated during mealtime.\n\n**Important:** Talk to them during the meal (ask about their day, tell a story, play a simple verbal game). Conversation keeps their **prefrontal cortex engaged** with the table, making it harder to drift. You are using social connection to anchor their attention.",
      "what_to_say_examples": [
        "Tell me the funniest thing that happened at school today. Take a bite while you think.",
        "Let's count how many bites we each take. You go first. Now me. Now you again."
      ]
    },
    {
      "step_number": 3,
      "step_title": "Enforce the boundary calmly when time is up",
      "step_explanation": "When the timer rings, **immediately clear the plates**—even if food remains. Do NOT negotiate, extend, or give warnings. This teaches their brain that **the timer is the rule**, not your mood.\n\n**The completion message:** If they protest, validate briefly then hold firm: I know you wanted more time. AND the timer rang. Dinner is over. You can have [snack] before bed if you are hungry later.\n\n**Why it matters:** The INTENSE brain learns structure through **consistent consequences**. If you cave once, you teach them the timer is negotiable. By holding the boundary calmly, you are training their nervous system to **focus during the allotted time** because they know it WILL end.",
      "what_to_say_examples": [
        "Timer rang. Dinner is done. Let's clear your plate. You did a great job sitting with us.",
        "I hear you are still hungry. The timer said dinner time is over. You can have an apple before bed if your tummy needs more."
      ]
    }
  ]$$::jsonb,
  
  $$**The INTENSE brain struggles with sustained attention on low-stimulation tasks like eating.**

By **setting a visible timer** (step 1), you are creating an **external time boundary** that compensates for their weak internal sense of urgency. By **minimizing distractions and increasing engagement** (step 2), you are helping their prefrontal cortex **stay anchored to the meal** instead of drifting. By **enforcing the boundary calmly** (step 3), you are teaching their brain through repetition that **mealtime has structure**, which over weeks builds the neural habit of focused eating.

**The first week they will test the boundary.** Expect tears when the timer rings and food is left. They will say **I was not done** or **that is not fair**. But by **week 3**, most INTENSE kids start **eating more efficiently** because their brain has learned: **The timer is real. I need to eat during mealtime, not after.**$$,
  
  $$
  {
    "first_5_minutes": "Expect **slow start**. They may take 2-3 bites then zone out. **Do NOT nag**. Let the timer do its job. Engage them with conversation to pull focus back to the table.",
    "by_15_minutes": "Watch for the **panic pickup**—around 10 minutes left, many INTENSE kids suddenly realize time is running out and start eating faster. This is their brain learning to respond to the external cue.",
    "by_week_2": "You will notice they **self-regulate pacing** better—checking the timer, taking more consistent bites. The external structure is becoming internalized as habit.",
    "dont_expect": [
      "Them to finish every meal—INTENSE kids may genuinely have lower appetite or higher sensory sensitivity. The goal is **focused effort during mealtime**, not a clean plate",
      "Zero protests when time is up—they will still sometimes want more time. Your job is to hold the boundary kindly, not eliminate their feelings about it."
    ],
    "this_is_success": "Success equals meals consistently finish **within 30 minutes** and they are eating **most of their food** during that window. Or they check the timer and say **I need to eat faster** without you prompting. That is executive function development in action."
  }
  $$::jsonb,
  
  $$[
    {
      "variation_scenario": "They say they are still hungry after the timer and want the meal back",
      "variation_response": "**Hold the boundary.** Dinner is over. You can have a healthy snack in an hour if you are still hungry. Offering the meal again teaches them the timer is meaningless. The consequence (hunger) is the teacher."
    },
    {
      "variation_scenario": "They barely eat anything and then claim starvation an hour later",
      "variation_response": "**Offer a limited snack, not a full meal.** You chose not to eat much at dinner. Your body is telling you it is hungry now. Here is an apple or yogurt. No second dinner. They learn: **Mealtime is when I need to fuel my body.**"
    },
    {
      "variation_scenario": "They get up from the table mid-meal to use the bathroom or get water",
      "variation_response": "**Allow bathroom, nothing else.** Use the bathroom, then right back to your seat. The timer is still running. No wandering, no playing. Bodies stay at the table during mealtime unless it is an urgent need."
    },
    {
      "variation_scenario": "You have a family member who undermines the timer by giving them more food later",
      "variation_response": "**Get everyone on the same page.** Explain to extended family or co-parent: We are teaching focused mealtime. When the timer rings, dinner is done. Consistency is critical. If one adult caves, the INTENSE brain learns to wait for the lenient adult."
    }
  ]$$::jsonb,
  
  'Calm, consistent, non-emotional. You must be the timer enforcer—not angry, not nagging, just neutral. The INTENSE child needs to feel that the structure is not personal, it is just how mealtime works.',
  
  ARRAY['mealtime', 'intense', 'executive-function', 'slow-eating', 'structure', 'attention', 'boundaries'],
  
  false
);