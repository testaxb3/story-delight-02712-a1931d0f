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
  'Leaving the playground - refuses to stop playing and go home',
  'Transitions',
  'INTENSE',
  3,
  10,
  'Moderate',
  25,
  
  $$It is time to leave the playground. You announce it is time to go. Your INTENSE child **ignores you completely** or screams **NO! Five more minutes!** When you try to physically guide them to the car, they go **limp, run away, or have a full meltdown**—screaming, crying, possibly hitting.

The INTENSE brain has **extreme difficulty with transitions**, especially from high-dopamine activities (playing) to low-dopamine ones (leaving, car ride, going home). Their prefrontal cortex struggles to **shift gears**—they are neurologically **stuck in play mode**, and your command to leave feels like a **threat to their autonomy and fun**. By the time you are dragging them to the car, both of you are dysregulated, and the transition has become a battle.$$,
  
  $$❌ **Announcing time to go with no warning while they are mid-play**
→ The INTENSE brain cannot pivot instantly. Surprise transitions activate their **fight-or-flight response**. They genuinely did not have time to mentally prepare, so they resist.

❌ **Negotiating more time after saying it is time to leave**
→ Giving in teaches their brain that **refusing and crying equals getting more playtime**. You are reinforcing the meltdown, not teaching transition skills.

❌ **Threatening or bribing to get them to leave**
→ If it works, you have trained them that **leaving requires a reward**. If it does not, you have added emotional pressure to an already hard moment, escalating the crisis.

**Why these backfire:** The INTENSE brain needs **predictable transition structure** to shift from one activity to another. Without preparation time and clear boundaries, their nervous system perceives the transition as **sudden loss of control**, triggering massive resistance.$$,
  
  $$[
    {
      "step_number": 1,
      "step_title": "Give a countdown with visual or physical cues",
      "step_explanation": "Before announcing it is time to leave, give their brain **time to prepare**. Start with a 10-minute warning, then 5 minutes, then 2 minutes.\n\n**Your move:** Use a **visual timer they can see** (phone timer, watch) or set an alarm. Say: We are leaving in 10 minutes. When the timer beeps, it is time to go. At 5 minutes, repeat. At 2 minutes, start moving closer to them physically.\n\n**The shift:** You are giving their prefrontal cortex **advance notice** to begin disengaging from play. The timer is the enforcer, not you, which reduces power struggle.",
      "what_to_say_examples": [
        "We have 10 more minutes at the playground. I'm setting the timer so you know when it's time to leave.",
        "Five minutes left. When the timer beeps, we are going to the car. You decide what you want to do in these last 5 minutes."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Offer a transition choice or ritual",
      "step_explanation": "When the timer goes off, do NOT just say **let's go**. Give them **one small choice** to preserve autonomy during the hard moment.\n\n**Do NOT:** Offer open-ended choices like **do you want to leave now?** That invites refusal. Instead, offer **two acceptable options** that both end in leaving.\n\n**Important:** Say: Time to go. Do you want to go down the slide one last time or swing one last time? Or: Do you want to walk to the car or hop like a bunny? You are using their **need for control** to facilitate cooperation instead of fighting it.",
      "what_to_say_examples": [
        "Timer is done. Time to head to the car. Do you want to race me there or walk holding my hand?",
        "It's time to leave. You can choose: one last slide or we go straight to the car. Your choice."
      ]
    },
    {
      "step_number": 3,
      "step_title": "Follow through calmly if they refuse",
      "step_explanation": "If they still refuse after the choice, **calmly and physically guide them to the car**. No anger, no lectures, no negotiation. Their body goes to the car even if their emotions are still at the playground.\n\n**The boundary message:** I know you want to stay. AND it is time to leave. I am going to help your body go to the car. You can be mad about it, and we are still leaving.\n\n**Why it matters:** The INTENSE brain learns boundaries through **consistent follow-through**. If you cave after the meltdown starts, you teach them that **big feelings change the rule**. By calmly enforcing the boundary while validating their feelings, you are teaching: **Transitions are hard AND they still happen.**",
      "what_to_say_examples": [
        "I hear you are really upset. It is hard to leave when you are having fun. AND we are leaving now. Let's walk together.",
        "Your body is going to the car. You can cry about it if you need to. I am right here with you."
      ]
    }
  ]$$::jsonb,
  
  $$**The INTENSE brain has weak executive function around transitions—shifting from one activity to another requires significant prefrontal effort.**

By **giving a countdown with visual cues** (step 1), you are compensating for their brain's inability to **track time and prepare internally**. By **offering a transition choice or ritual** (step 2), you are giving their amygdala a **sense of control** during the moment of loss, reducing resistance. By **following through calmly if they refuse** (step 3), you are teaching their brain through repetition that **transitions are non-negotiable**, which over time builds the neural pathway of acceptance.

**The first month will be exhausting.** They will melt down **every single playground exit** testing whether the timer is real. But by **week 5**, most INTENSE kids start **checking the timer themselves** and initiating leaving because their brain has learned: **The timer means we leave. Fighting does not change it.**$$,
  
  $$
  {
    "first_5_minutes": "Expect **protest when you announce the countdown**. They may say **no timer** or **I do not want to leave**. **Stay calm**—you are not asking permission, you are giving information. The timer starts regardless.",
    "by_10_minutes": "Watch for **increased intensity at the 2-minute mark**. Many INTENSE kids try to squeeze every second and resist harder as the end approaches. This is normal. Hold the boundary.",
    "by_week_3": "You will notice they **accept the timer as reality** and start self-regulating—saying things like **I have 5 more minutes so I am going to swing**. Their brain is internalizing the structure.",
    "dont_expect": [
      "Them to be happy about leaving—INTENSE kids will often still be upset or disappointed. The goal is **cooperation despite feelings**, not cheerful compliance",
      "Zero meltdowns—some days will be harder than others depending on their regulation that day. Progress is **faster recovery and less physical resistance**, not zero protest."
    ],
    "this_is_success": "Success equals they **walk to the car when the timer beeps** even if they are crying or complaining. Or they ask **how much time is left** and adjust their play accordingly. That is executive function and emotional regulation working together."
  }
  $$::jsonb,
  
  $$[
    {
      "variation_scenario": "They beg for 5 more minutes when the timer goes off",
      "variation_response": "**No negotiation.** Timer is done. Time to leave. I know you want more time. AND the timer said it is time to go. If you negotiate even once, you teach them the timer is meaningless. Consistency is everything."
    },
    {
      "variation_scenario": "They run away from you when it is time to leave",
      "variation_response": "**Stay calm and pursue calmly.** Do NOT yell or chase frantically—that turns it into a game. Walk steadily toward them, saying: It is time to leave. I am coming to help you. When you reach them, guide them physically to the car without anger."
    },
    {
      "variation_scenario": "Other kids are still playing and they protest that it is unfair",
      "variation_response": "**Validate and hold boundary.** I know other kids are still here. Every family has their own leaving time. Ours is now. Acknowledge the feeling, do not debate fairness. Their schedule is not your schedule."
    },
    {
      "variation_scenario": "You are running late and do not have time for the full countdown",
      "variation_response": "**Emergency mode: shorter countdown.** We are leaving in 2 minutes. Timer is starting now. Still give SOME warning rather than zero. Even 2 minutes is better than surprise. Then follow through immediately when time is up."
    }
  ]$$::jsonb,
  
  'Calm, firm, non-reactive. You must be the steady anchor—not frustrated, not giving in, just consistent. The INTENSE child needs to feel that leaving is not personal, it is just what happens when playtime is over.',
  
  ARRAY['transitions', 'intense', 'playground', 'executive-function', 'leaving', 'boundaries', 'countdown'],
  
  false
);