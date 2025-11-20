-- SCRIPT 1: SCREENS - DEFIANT
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
  'Sneaks device after you confiscate it - finds it and uses secretly',
  'Screens',
  'DEFIANT',
  6,
  13,
  'Hard',
  45,
  
  $$You took away the tablet because screen time was over. An hour later, you find your DEFIANT child in their room, tablet in hand, playing games. **How did you get that?** They lie: **I did not. I was just looking at it.** Or they deflect: **You did not say I could not have it, you just said no more screen time.** When you take it again, they **explode** or later sneak it back **again**.

The DEFIANT brain experiences device confiscation as **intolerable loss of autonomy**. Their need for control is so strong that they will **break rules, lie, and sneak** to regain access to what you took. This is not defiance for fun; it is their brain genuinely unable to tolerate **you controlling their access to something they want**. The sneaking is a **power restoration attempt**—if they can get it back, they prove you cannot truly control them. By the time you catch them the third time, you are furious, they are defensive, and trust is eroding.$$,
  
  $$❌ **Hiding the device in increasingly creative places**
→ The DEFIANT brain sees this as a **challenge to outsmart you**. They will search the entire house, find it, and feel triumphant. You are training them to be better sneaks, not better at respecting boundaries.

❌ **Lecturing them about lying and breaking trust**
→ During dysregulation or power struggle, moral lectures **do not penetrate**. Their brain is focused on **regaining control**, not on the ethics of honesty. The lecture just increases their defensiveness.

❌ **Taking away the device for days/weeks as punishment**
→ Extended confiscation without a **restoration path** just increases their **resentment and motivation to sneak**. They feel powerless indefinitely, which fuels more sneaking, not less.

**Why these backfire:** The DEFIANT brain needs **clear consequences paired with autonomy restoration opportunities**. Without a system that acknowledges their need for control while enforcing boundaries, every confiscation becomes a cat-and-mouse game you cannot win.$$,
  
  $$[
    {
      "step_number": 1,
      "step_title": "Create a visible device lockbox with a timer",
      "step_explanation": "Get a physical lockbox (timed safe or locked drawer) where the device goes when confiscated. The device is **visible but inaccessible** until the timer unlocks it. Set the timer for a specific duration (1 hour, 4 hours, 24 hours depending on the offense).\n\n**Your move:** When confiscating, put the device in the lockbox **in front of them** and set the timer. Say: **The device is in the box. The box opens at [specific time]. If you try to get it before then, the timer resets and adds 2 more hours.**\n\n**The shift:** The lockbox removes **you** as the enforcer—they cannot manipulate, sneak, or negotiate with a timer. The boundary is **mechanical, not emotional**. They can see the device, but they cannot access it until time is served.",
      "what_to_say_examples": [
        "The tablet goes in the lockbox now. The timer is set for 2 hours. When it unlocks, you can have it back.",
        "If you try to open this or find the key, the timer resets and adds 2 more hours. Your choice."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Enforce immediate consequence if they sneak or lie",
      "step_explanation": "If you catch them trying to open the box, searching for keys, or sneaking the device any other way, **immediately add time to the lockbox timer** and calmly state the consequence.\n\n**Do NOT:** Get into a debate about whether they were really trying to sneak or just looking. If they are near the box or device when they should not be, it counts. **Action speaks louder than intent.**\n\n**Important:** Say this matter-of-factly, not angrily: **You tried to get the device before the timer. I am adding 2 hours. New unlock time is [time].** Walk away. No lecture, no anger. The consequence is the teacher.",
      "what_to_say_examples": [
        "You were trying to open the box. Timer just reset and added 2 hours. New unlock time is 6 PM.",
        "I found you with the device. That was sneaking. Timer is now set for 24 hours instead of 4."
      ]
    },
    {
      "step_number": 3,
      "step_title": "Restore autonomy when time is served",
      "step_explanation": "When the lockbox timer unlocks, **give them the device back without conditions or lectures**. The consequence is over. Do NOT remind them of what they did wrong or warn them not to do it again.\n\n**The restoration message:** **The timer is done. Here is your device. You earned it back by waiting.** This teaches their brain: **Consequences end. I can regain what I lost by respecting the boundary, not by sneaking.**\n\n**Why it matters:** The DEFIANT brain needs to learn that **cooperation restores power faster than sneaking**. If you hold grudges or extend punishment, they learn that **honesty does not pay**, which increases future sneaking.",
      "what_to_say_examples": [
        "Timer is done. You waited the full time. Here is your tablet back.",
        "You respected the lockbox. Time is up. You earned your device back by following the rule."
      ]
    }
  ]$$::jsonb,
  
  $$**The DEFIANT brain cannot tolerate prolonged loss of control and will actively seek to restore power through rule-breaking.**

By **creating a visible device lockbox with a timer** (step 1), you remove **yourself as the power holder**—the timer is the enforcer, making it impossible for them to manipulate or sneak around **you**. By **enforcing immediate consequence if they sneak or lie** (step 2), you teach their brain that **attempting to regain control through sneaking makes the consequence WORSE**, not better. By **restoring autonomy when time is served** (step 3), you show their brain that **waiting and respecting boundaries is the FASTEST path to getting what they want back**, rewiring their motivation from sneaking to compliance.

**The first 2 weeks they will test the lockbox system relentlessly.** Expect them to **try to open it, search for keys, or attempt to outsmart the timer**. Each time, calmly add hours. But by **week 3**, most DEFIANT kids **stop trying** because their brain has learned: **Sneaking adds time. Waiting removes it. The fastest way to my device is patience, not sneaking.**$$,
  
  $$
  {
    "first_30_minutes": "Expect **intense focus on the lockbox**. They may shake it, try to pry it open, or ask repeatedly when the timer ends. **Do not engage**. Let the timer do the talking.",
    "by_day_3": "Watch for **creative attempts**—asking siblings to get it, claiming they need it for homework, or testing if you will cave. **Hold firm**. Every cave teaches them the boundary is negotiable.",
    "by_week_2": "You will notice they **stop trying to sneak** and start **asking when the timer unlocks**. This is progress—they are accepting the system instead of fighting it.",
    "dont_expect": [
      "Them to like the lockbox—DEFIANT kids will hate losing access. The goal is **behavioral compliance through consistent consequences**, not happiness about the rule",
      "Zero sneaking attempts ever—stressful days or new devices may trigger testing. Re-apply the consequence calmly and it resolves faster each time."
    ],
    "this_is_success": "Success equals they **wait for the timer to unlock** instead of sneaking. Or they sneak once, timer resets, and they **never try again**. Or they ask **how much time is left** instead of trying to circumvent. Behavioral extinction is happening."
  }
  $$::jsonb,
  
  $$[
    {
      "variation_scenario": "They claim they need the device for homework or to call someone",
      "variation_response": "**Anticipate this.** Before locking it: If you need it for homework, ask me BEFORE screen time ends and we will set a homework timer separately. Once it is in the lockbox, it stays there. No exceptions. If genuinely urgent, YOU handle the call on your phone."
    },
    {
      "variation_scenario": "They find a second device (sibling tablet, old phone) and use that instead",
      "variation_response": "**All devices go in the lockbox when one is confiscated.** If they find a workaround, that device also gets locked with timer reset. Make it clear: **When screen time is done or you are in consequence, ALL screens are off-limits.**"
    },
    {
      "variation_scenario": "They have a massive meltdown when you first introduce the lockbox",
      "variation_response": "**Expect this.** Stay calm. Let them melt down. Do NOT remove the device from the box to soothe them. Say: **The timer is running. When it unlocks, you can have it. Your feelings are big right now, and the rule still stands.**"
    },
    {
      "variation_scenario": "Siblings or other adults try to unlock it early to keep the peace",
      "variation_response": "**Lockbox key stays with you ONLY.** Explain to other adults: **We are teaching consequences. If anyone unlocks it early, the entire system fails and sneaking will continue. Everyone must hold the line.**"
    }
  ]$$::jsonb,
  
  'Calm, mechanical, non-negotiable. You must be the system administrator—not angry at their sneaking, not debating the fairness, just implementing the consequence every single time. The DEFIANT child needs to feel that the lockbox is an immovable reality, not a punishment you might waive.',
  
  ARRAY['screens', 'defiant', 'sneaking', 'lying', 'device-confiscation', 'boundaries', 'consequences'],
  
  false
);

-- SCRIPT 2: MEALTIME - DEFIANT
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
  'Eats only the favorite food, refuses everything else on plate',
  'Mealtime',
  'DEFIANT',
  4,
  11,
  'Hard',
  35,
  
  $$Dinner is served: chicken, broccoli, and rice. Your DEFIANT child **immediately picks out the rice**, eats only that, and pushes the chicken and broccoli to the side. You say **You need to eat some chicken and broccoli too.** They say **I do not like it.** You insist. They **refuse**, sitting there for 30 minutes staring at the food, or they melt down. Eventually you give up, they eat only rice, and this pattern repeats **every single meal**.

The DEFIANT brain experiences being told **what to eat as a direct control violation**. Even if they **actually like** chicken and broccoli, the fact that **you are requiring it** makes it unacceptable. Their need for autonomy is so strong that they will **choose hunger over compliance**—going to bed without protein or vegetables is preferable to you dictating their intake. This is not picky eating or sensory sensitivity; it is **pure power struggle over bodily autonomy**. By the time they have been eating only carbs for weeks, you are worried about nutrition and they are entrenched in resistance.$$,
  
  $$❌ **Forcing them to eat a certain number of bites before leaving the table**
→ Force triggers their **autonomy threat response**. They will gag, spit out food, or sit there for hours in defiance. You are escalating the power struggle, not teaching healthy eating.

❌ **Making a separate meal of only their preferred foods**
→ You teach their brain that **refusing equals getting what I want**. They learn that if they hold out long enough, you will cave and make them nuggets. You are reinforcing the selective eating.

❌ **Bribing them with dessert if they eat vegetables**
→ This teaches them that **vegetables are so bad they require payment** and that **dessert is the real valuable food**. You are accidentally creating food hierarchy that increases resistance.

**Why these backfire:** The DEFIANT brain needs **choice within structure**—they must feel they have some control over what goes in their body while still meeting nutritional needs. Without a strategy that offers autonomy AND boundaries, mealtimes become daily wars.$$,
  
  $$[
    {
      "step_number": 1,
      "step_title": "Implement the division of responsibility with choice",
      "step_explanation": "You decide **WHAT foods are served and WHEN**. They decide **WHETHER to eat and HOW MUCH**. But add one critical element: **every meal includes at least one food they like** plus new/challenging foods.\n\n**Your move:** Serve family-style (all food on table in bowls). Say: **Dinner is chicken, broccoli, and rice. You choose what you put on your plate and how much. The kitchen closes after dinner, so eat what you need now.**\n\n**The shift:** You are giving them **autonomy over their plate** while maintaining **nutritional boundaries** (no separate meal). The presence of one preferred food (rice) prevents the full refusal, and exposure to other foods happens without force.",
      "what_to_say_examples": [
        "Here is dinner. You pick what you want and how much. Choose what sounds good to your body.",
        "The kitchen closes at 7 PM. Whatever you eat now is dinner. You decide."
      ]
    },
    {
      "step_number": 2,
      "step_title": "No commentary, no pressure, no negotiation at the table",
      "step_explanation": "If they only put rice on their plate, **say nothing**. Do NOT comment on their choices, remind them to eat protein, or express worry. Eat your own balanced meal and engage in pleasant conversation.\n\n**Do NOT:** Make the meal about food. The more you focus on what they are or are not eating, the more their oppositional brain **digs in**. Silence removes the power struggle.\n\n**Important:** If they ask for seconds of rice, give it—**but only if there is still rice available**. If rice is gone, it is gone. Natural consequence: **If I only eat one food, I might run out.** Do NOT make more of just their preferred food.",
      "what_to_say_examples": [
        "(If they only take rice: say nothing. Eat your meal.)",
        "(If they ask for more rice after finishing: Sure, here is what is left. If it is gone: Sorry, we are out of rice. There is still chicken and broccoli if you are hungry.)"
      ]
    },
    {
      "step_number": 3,
      "step_title": "Close the kitchen with no rescue snacks",
      "step_explanation": "After dinner ends (30 minutes max), **clear all food**. If they ate only rice and are hungry an hour later, **do not offer a snack**. Calmly say: **Dinner is over. The kitchen is closed until breakfast. You can have water.**\n\n**The restoration message:** The next morning, offer a balanced breakfast with again **at least one preferred food**. Do NOT reference the previous night. Their brain gets a **fresh start** to make a different choice.\n\n**Why it matters:** The DEFIANT brain learns through **natural consequences, not lectures**. Hunger after eating only rice teaches: **I need to eat more variety to feel full.** But the consequence must be **predictable and consistent**, not wielded as punishment.",
      "what_to_say_examples": [
        "Dinner is done. Kitchen is closed until breakfast. You can have water if you are thirsty.",
        "(Next morning: Here is breakfast. Eggs, toast, and fruit. You choose what you want.)"
      ]
    }
  ]$$::jsonb,
  
  $$**The DEFIANT brain requires autonomy over eating to feel safe, but also needs structure to develop healthy eating patterns.**

By **implementing division of responsibility with choice** (step 1), you give their brain **decision-making power** (what goes on plate, how much) while maintaining **your job** (what is served, when). By **giving no commentary, pressure, or negotiation at the table** (step 2), you remove the **power struggle fuel**—their oppositional brain has nothing to fight against if you are neutral. By **closing the kitchen with no rescue snacks** (step 3), you create a **natural consequence** (hunger) that teaches their brain **eating variety at mealtime serves ME, not just Mom**, without shaming or forcing.

**The first 2 weeks they will eat ONLY the preferred food to test if you really will not force or rescue.** Expect them to go to bed slightly hungry and ask for snacks. Hold firm. But by **week 4**, most DEFIANT kids start **taking small amounts of other foods** because their brain has learned: **Mom does not care if I eat broccoli, so there is no one to fight. AND if I do not eat enough at dinner, I am hungry later. Maybe I should try the chicken.**$$,
  
  $$
  {
    "first_3_days": "Expect them to **eat only the preferred food** and test whether you will really not force or offer alternatives. **Stay neutral**. Let natural consequences (slight hunger) do the teaching.",
    "by_week_2": "Watch for **small exploratory bites** of previously refused foods. They may take one piece of chicken or one broccoli floret just to see what happens. **Say nothing**. Any comment makes it about you again.",
    "by_week_4": "You will notice they **serve themselves more variety** without prompting. Their brain has learned: **Eating is MY choice, not Mom's battle. And variety keeps me full.**",
    "dont_expect": [
      "Them to eat perfect balanced meals immediately—DEFIANT kids may always prefer carbs. The goal is **increased variety over time** and **reduced mealtime conflict**, not nutritionist-approved plates",
      "Zero nights where they eat only one food—some days they will test or genuinely not be hungry. Consistency over weeks is what changes the pattern, not perfection each meal."
    ],
    "this_is_success": "Success equals mealtimes are **peaceful** (no arguing about food) and they **occasionally try previously refused foods** without being forced. Or they eat only rice one night, are hungry later, and the **next night take more variety**. Learning is happening."
  }
  $$::jsonb,
  
  $$[
    {
      "variation_scenario": "They claim they are starving an hour after dinner",
      "variation_response": "**Validate and hold boundary.** I hear you are hungry. Dinner is over and kitchen is closed. You will have breakfast in [X hours]. Your body is learning how much it needs to eat at mealtime. Offer water, nothing else."
    },
    {
      "variation_scenario": "They refuse to come to the table or sit down at all",
      "variation_response": "**Dinner is happening at this time. You can join us or not, but the food goes away at 7 PM.** Do NOT beg them to come. If they skip dinner entirely, kitchen still closes. Natural consequence: **Skipping dinner means I am hungry until breakfast.**"
    },
    {
      "variation_scenario": "They ask you to make them something different mid-meal",
      "variation_response": "**This is dinner. If you do not want it, that is okay. Kitchen closes at 7 PM.** No anger, no debate. If they are genuinely hungry, they will eat what is available. If not, they learn to eat at mealtimes."
    },
    {
      "variation_scenario": "Other family members comment on their food choices or pressure them",
      "variation_response": "**Get everyone aligned.** Explain to family: **We do not comment on what [child] eats. Their plate is their business. This helps them learn to listen to their body.** If siblings tease, shut it down immediately."
    }
  ]$$::jsonb,
  
  'Calm, neutral, detached from outcomes. You must be the dinner provider, not the food enforcer—not worried about nutrition in any single meal, not controlling their plate, just offering food and letting natural consequences teach. The DEFIANT child needs to feel that eating is THEIR job, not yours to control.',
  
  ARRAY['mealtime', 'defiant', 'picky-eating', 'food-battles', 'autonomy', 'selective-eating', 'division-of-responsibility'],
  
  false
);