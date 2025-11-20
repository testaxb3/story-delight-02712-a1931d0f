-- SCRIPT 1: MORNING ROUTINE - DEFIANT
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
  'Refuses to get dressed - fights every clothing choice',
  'Morning Routines',
  'DEFIANT',
  3,
  9,
  'Moderate',
  25,
  
  $$It is time to get dressed for school. You pull out clothes. Your DEFIANT child says **No, I do not like that.** You offer different pants. **No, those are itchy.** Different shirt. **No, I want the shirt in the laundry.** You explain it is dirty. They **melt down** or refuse to get dressed entirely. Twenty minutes have passed. They are still in pajamas. You are **furious** and late.

The DEFIANT brain experiences **being told what to wear as a direct attack on their autonomy**. Even if the clothes are perfectly fine, the fact that **you chose them** makes them unacceptable. Their need for control is so strong that they will **choose discomfort over compliance**—staying in pajamas and being late is preferable to wearing clothes you selected. This is not pickiness about texture or style; it is **pure power struggle**. By the time you are wrestling them into clothes, you have both lost.$$,
  
  $$❌ **Continuing to offer different options hoping they will say yes**
→ Each new option you present gives their oppositional brain **another chance to say no**. You are feeding the power struggle by staying engaged in the negotiation.

❌ **Forcing them into clothes physically while they scream**
→ Physical force escalates their **autonomy threat response**. They will fight harder, and you are teaching them that **your control requires violence**, increasing future resistance.

❌ **Letting them wear whatever they want including pajamas to school**
→ If they learn that **refusing long enough equals getting my way**, their brain will apply this strategy to everything else. You have just taught them that defiance works.

**Why these backfire:** The DEFIANT brain is **wired to resist external control**. Without a strategy that transfers the power to them while maintaining necessary boundaries, every morning becomes a clothing war.$$,
  
  $$[
    {
      "step_number": 1,
      "step_title": "Offer two parent-approved choices the night before",
      "step_explanation": "The night before, lay out **two complete outfits** you have pre-selected (weather-appropriate, clean, school-acceptable). Say: **Tomorrow you get to choose: Outfit A or Outfit B. You pick in the morning.**\n\n**Your move:** Both options are ones **you approve**, so you cannot lose. But **they get the final choice**, satisfying their need for control. This removes the morning power struggle entirely because the decision is theirs.\n\n**The shift:** You are giving their brain **autonomy within your structure**. They are not choosing from the entire closet (overwhelming and inviting refusal); they are choosing between two good options. This is **controlled choice**, not free-for-all.",
      "what_to_say_examples": [
        "Tomorrow morning you can wear the blue pants with the dinosaur shirt OR the black pants with the superhero shirt. Which one sounds good?",
        "I laid out two outfits. You get to pick which one you wear tomorrow. You decide."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Set a getting-dressed timer with a consequence",
      "step_explanation": "In the morning, remind them of their choice. Set a **visible timer for 10 minutes**: You have 10 minutes to get dressed in the outfit you chose. When the timer beeps, if you are not dressed, **I will choose** which outfit and help you put it on.\n\n**Do NOT:** Nag, remind, or hover during the 10 minutes. Walk away. Let the timer and the consequence do the work. Their brain needs to learn that **dawdling or refusing equals losing autonomy**.\n\n**Important:** If the timer goes off and they are not dressed, **calmly follow through**. Pick an outfit and dress them **without anger, without lectures**. Matter-of-fact: You ran out of time, so I am helping. Tomorrow you can try again.",
      "what_to_say_examples": [
        "Timer is set. Ten minutes to get dressed. If you are not dressed when it beeps, I will choose and help you.",
        "Time is up. You did not get dressed, so I am picking the blue outfit and putting it on you. Tomorrow you will have another chance."
      ]
    },
    {
      "step_number": 3,
      "step_title": "Celebrate autonomy when they succeed",
      "step_explanation": "On mornings when they **do** get dressed within the timer (even if they grumbled), immediately acknowledge it with **specific praise and a small reward**.\n\n**The morning message:** You got dressed in your timer time! You made the choice and did it yourself. Because you did that, we have extra time for [preferred breakfast or 5 minutes of preferred activity].\n\n**Why it matters:** The DEFIANT brain responds powerfully to **proof that autonomy works**. You are teaching: **When I use my power to cooperate, I get MORE control (extra time, choices). When I fight, I LOSE control (Mom dresses me).** Over weeks, this rewires their motivation.",
      "what_to_say_examples": [
        "You got dressed all by yourself in the time! That is your strong brain choosing well. You get to pick what we have for breakfast.",
        "You did it! You were dressed before the timer. That means we have time for a quick game before school."
      ]
    }
  ]$$::jsonb,
  
  $$**The DEFIANT brain has an overactive need for autonomy and control, especially around body-related tasks like dressing.**

By **offering two parent-approved choices the night before** (step 1), you are eliminating the morning power struggle by **pre-loading their autonomy**—they have decision-making power within safe boundaries. By **setting a getting-dressed timer with a consequence** (step 2), you create **external accountability** that removes you as the enforcer—the timer and natural consequence teach them that **refusing equals losing control**, not gaining it. By **celebrating autonomy when they succeed** (step 3), you are building the neural pathway: **Cooperation gives me MORE power (time, choices), defiance gives me LESS.**

**The first week they will test the timer.** Expect them to **dawdle and see if you really will dress them**. You must follow through calmly every time or their brain learns the consequence is empty. But by **week 2**, most DEFIANT kids start **dressing themselves** because they have learned: **If I do not dress myself, I lose the choice. That feels worse than cooperating.**$$,
  
  $$
  {
    "first_5_minutes": "Expect **resistance to the two-choice system** initially. They may say they hate both outfits. **Hold firm**: These are your choices. You can pick one or I will pick tomorrow morning when the timer goes off.",
    "by_day_3": "Watch for **strategic compliance**. They will get dressed at minute 9 (cutting it close) to maintain control while avoiding the consequence. **That is success**—they are learning the system.",
    "by_week_2": "You will notice they **choose the night before** and get dressed **quickly in the morning** because they want to preserve their autonomy and earn the reward time. The power struggle dissolves.",
    "dont_expect": [
      "Them to be happy about the choices—DEFIANT kids may still complain or express preference for other clothes. The goal is **functional dressing**, not enthusiasm",
      "Zero mornings where you have to dress them—some days they will test or genuinely struggle. Consistent follow-through on those days reinforces the system."
    ],
    "this_is_success": "Success equals they pick an outfit the night before and **get dressed independently** in the morning, even if they grumble. Or they test once, you dress them calmly, and the next day they **dress themselves to avoid losing control**."
  }
  $$::jsonb,
  
  $$[
    {
      "variation_scenario": "They refuse to choose between the two outfits the night before",
      "variation_response": "**No problem. I will choose for you tomorrow morning.** Say it neutrally. In the morning, dress them in one of the pre-selected outfits without negotiation. Natural consequence: **refusing to choose equals someone else chooses**. Next night, offer again."
    },
    {
      "variation_scenario": "They get partially dressed then stop, running out the timer",
      "variation_response": "**Partial dressing does not count.** When timer goes off, calmly finish dressing them: You got your shirt on but not your pants. I am finishing for you. Tomorrow you can try to do the whole thing. All-or-nothing standard prevents gaming the system."
    },
    {
      "variation_scenario": "They demand a third option not on the table",
      "variation_response": "**Those are not the choices today.** Your choices are Outfit A or Outfit B. If you want to help pick tomorrow night, you can. But this morning, these are your options. Do not negotiate or add options mid-morning."
    },
    {
      "variation_scenario": "They cry or tantrum when you dress them after the timer",
      "variation_response": "**Stay calm and finish dressing them.** I know you are upset. You can try again tomorrow to dress yourself. Do not punish the tantrum; the consequence (losing autonomy) is enough. Validate feelings while holding boundary."
    }
  ]$$::jsonb,
  
  'Calm, matter-of-fact, non-reactive. You must be the neutral enforcer—not frustrated, not negotiating, just implementing the system. The DEFIANT child needs to feel that this is a reliable structure, not a personal battle.',
  
  ARRAY['morning-routines', 'defiant', 'getting-dressed', 'clothing', 'autonomy', 'power-struggle', 'timer'],
  
  false
);

-- SCRIPT 2: SOCIAL - DEFIANT
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
  'Bosses other kids around then rages when they leave',
  'Social',
  'DEFIANT',
  4,
  10,
  'Hard',
  40,
  
  $$Your DEFIANT child is playing with other kids. They **immediately take charge**: **You be the dog, I am the owner.** **No, you cannot use that, I need it.** **We are playing MY game, not yours.** The other kids comply for a while, then get frustrated. One kid says **I do not want to play this anymore** and walks away. Your child **explodes**: screaming, crying, possibly trying to physically stop the kid from leaving. **You are a bad friend! I hate you! Come back!**

The DEFIANT brain is **hardwired to seek control in social situations**. They feel **safest and most secure when they are in charge**, dictating the rules and roles. When other kids push back or leave, their brain interprets it as **rejection AND loss of power**—a double threat. This triggers massive dysregulation: rage at losing control mixed with **genuine hurt** that the kids left. This is not meanness; it is their **neurological inability to tolerate shared power** combined with **poor emotional regulation** when social dynamics shift. By the time you intervene, they are inconsolable and the playdate is over.$$,
  
  $$❌ **Telling them to just be nicer or share control**
→ Their brain **cannot do this without explicit skill-building**. Telling them to share power is like telling someone with a broken leg to just walk—they lack the neurological infrastructure.

❌ **Forcing the other kids to stay and keep playing**
→ You teach your child that **other people do not have autonomy**, and you teach the other kids that **their boundaries do not matter**. This creates deeper social damage long-term.

❌ **Punishing them for bossing or having the meltdown**
→ Punishment does not teach the missing skill (collaborative play). They are not choosing this behavior; they genuinely do not know **how** to share control without feeling unsafe.

**Why these backfire:** The DEFIANT brain needs **explicit teaching of power-sharing skills** plus **co-regulation during the inevitable meltdowns** when they lose control. Without both, every playdate ends in crisis.$$,
  
  $$[
    {
      "step_number": 1,
      "step_title": "Pre-teach turn-taking leadership before play",
      "step_explanation": "BEFORE the playdate starts, explicitly teach the concept: **Today you and [friend] will take turns being the leader. First YOU pick the game for 10 minutes. Then THEY pick for 10 minutes. Back and forth.**\n\n**Your move:** Set a visible timer they can see. Say: When the timer beeps, it is [friend name] turn to choose what we play. You had your turn. This happens BEFORE anyone starts playing, so their brain knows the structure in advance.\n\n**The shift:** You are giving their need for control **a designated time slot**, which makes it tolerable. They still get to be in charge—just not **all the time**. The timer is the neutral enforcer, not you.",
      "what_to_say_examples": [
        "You get to be the boss of the first game for 10 minutes. Then [friend] gets to be the boss for 10 minutes. Timer will tell you when to switch.",
        "You both get leader time. You go first. When the timer beeps, it is [friend] turn to choose the game."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Intervene at the first sign of power struggle",
      "step_explanation": "Stay **physically present** during the playdate. The moment you hear your child start bossing (before meltdown), step in immediately with a **redirect to the structure**: **Whose turn is it to be the leader right now? Check the timer.**\n\n**Do NOT:** Wait until the other kid is upset or leaving. Catch it **early**. If it is their turn, validate: **It is your turn, you get to choose.** If it is the other kid's turn: **It is [friend] turn to be the leader. You had your turn. What does [friend] want to play?**\n\n**Important:** If they **refuse** to follow the other kid's leadership during their turn, **pause the playdate for 5 minutes**. Calmly: **You are not ready to let [friend] lead right now. We are taking a break.** Playdate resumes when they agree to try the friend's game.",
      "what_to_say_examples": [
        "I hear you telling [friend] what to do. Whose turn is it to be the leader? Let's check the timer.",
        "Right now it is [friend] turn. You can play their game or we take a break until you are ready."
      ]
    },
    {
      "step_number": 3,
      "step_title": "Co-regulate the meltdown if the friend leaves",
      "step_explanation": "If despite your interventions the other child **chooses to leave** (their right), your DEFIANT child will likely melt down. **Do NOT punish this.** Their nervous system is in crisis.\n\n**The post-meltdown message:** After they calm (10-20 minutes), sit with them: **[Friend] left because they did not want to play anymore. That is their choice. You are upset because you wanted to keep playing AND you wanted to be in charge. Next time, if you let them lead during their turn, they might stay longer.**\n\n**Why it matters:** You are teaching the **cause-and-effect** their brain cannot yet see: **Bossing pushes people away. Sharing control keeps people close.** This is social skill-building through reflection, not punishment.",
      "what_to_say_examples": [
        "You are really sad that [friend] left. It is hard when playdates end. [Friend] left because they did not feel like you let them choose. That is what happens when we do not share the leader job.",
        "I know you wanted to keep playing. Next time we can practice letting [friend] pick the game during their turn so they want to stay longer."
      ]
    }
  ]$$::jsonb,
  
  $$**The DEFIANT brain has an overactive need for control in social contexts and lacks the natural skill of collaborative power-sharing.**

By **pre-teaching turn-taking leadership before play** (step 1), you are giving their brain a **predictable structure** that satisfies their need for control (they still get a turn) while introducing the concept of **shared power**. By **intervening at the first sign of power struggle** (step 2), you prevent the escalation before the other child gets hurt or leaves, teaching your child **in the moment** how to follow the structure. By **co-regulating the meltdown if the friend leaves** (step 3), you are helping their brain **connect the dots** between their bossiness and the social consequence (rejection), building the insight that **cooperation keeps friends, control pushes them away**.

**The first month will have multiple failed playdates.** They will **refuse to let the other kid lead**, friends will leave, meltdowns will happen. But by **playdate 6-8**, most DEFIANT kids start **checking the timer themselves** and tolerating the other kid's turn because their brain has learned: **If I boss the whole time, they leave and I feel worse. If I share, they stay and I still get my turn.**$$,
  
  $$
  {
    "first_15_minutes": "Expect them to **dominate their leadership turn** and then **resist when the timer says it is the other kid's turn**. This is normal. Calmly enforce the pause if they refuse.",
    "by_playdate_3": "Watch for **begrudging compliance**—they will let the other kid lead but complain or sulk. **That is progress**. They are tolerating shared power even though it is uncomfortable.",
    "by_playdate_6": "You will notice they **remind the other kid** when it is their turn to lead (enforcing fairness both ways) and **stay calmer** when it is not their turn. The structure is becoming internalized.",
    "dont_expect": [
      "Them to enjoy being the follower—DEFIANT kids may always prefer leading. The goal is **tolerating shared leadership** without meltdown, not enjoying it",
      "Zero friend departures—some kids will still leave if your child has a bad day. The consequence is the teacher. Fewer departures over time is success."
    ],
    "this_is_success": "Success equals they let the other kid lead **without melting down** during their turn. Or the other kid **stays for the whole playdate** instead of leaving early. Or they ask **whose turn is it?** instead of just bossing. These are social skills developing."
  }
  $$::jsonb,
  
  $$[
    {
      "variation_scenario": "The other child does not want to use the timer system",
      "variation_response": "**Explain to the other parent beforehand.** We are working on turn-taking leadership. Can your child try it for this playdate? If the other kid truly refuses, end the playdate early: **We are practicing a new skill. Let's try again another time.** Do not force it."
    },
    {
      "variation_scenario": "Your child physically tries to stop the other kid from leaving",
      "variation_response": "**Intervene immediately.** Gently block: **[Friend] can leave if they want. We do not grab people.** Let the friend go. Then co-regulate your child through the meltdown. Later discuss: **When you try to force people to stay, it makes them want to leave even more.**"
    },
    {
      "variation_scenario": "They are playing well during the other kid's turn but then melt down after the playdate ends",
      "variation_response": "**This is delayed processing.** They held it together during play but **collapsed after**. Validate: **You did such a hard thing today—letting [friend] lead. Your body is tired from that work. You did great.** This is emotional labor for them."
    },
    {
      "variation_scenario": "They refuse to do the turn-taking and demand to play alone instead",
      "variation_response": "**Honor that choice.** Okay, you are not ready for a playdate today. You can play alone. Cancel or reschedule the playdate. Do not force social interaction when they are dysregulated. Try again another day when they are willing to try the structure."
    }
  ]$$::jsonb,
  
  'Calm, coaching, present. You must be the playdate facilitator—not angry at their bossiness, not embarrassed by meltdowns, just calmly teaching the skill in real time. The DEFIANT child needs to feel you are their social skills coach, not their judge.',
  
  ARRAY['social', 'defiant', 'bossiness', 'playdates', 'control', 'friendship', 'power-sharing', 'turn-taking'],
  
  false
);