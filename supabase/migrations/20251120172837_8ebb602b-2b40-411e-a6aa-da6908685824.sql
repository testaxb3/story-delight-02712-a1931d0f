-- SCRIPT 1: TANTRUMS - DEFIANT
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
  'Demands something unreasonable then rages when refused',
  'Tantrums',
  'DEFIANT',
  4,
  11,
  'Hard',
  35,
  
  $$It is 7:00 AM. Your DEFIANT child demands ice cream for breakfast. You say no, we are having cereal. They **explode**: screaming, throwing things, possibly hitting. Or it is 10:30 PM and they demand to watch another show. You say no, it is bedtime. Same explosion. The demand is **obviously unreasonable**, but to them, your refusal is **intolerable**.

The DEFIANT brain experiences being told no as a **direct threat to their autonomy and control**. Their anterior cingulate cortex becomes **hyperactive**, causing them to get neurologically **stuck** on the demand. Meanwhile, their prefrontal cortex—which should help them accept limits—goes **offline** during the emotional surge. This is not manipulation or spoiled behavior; it is **genuine brain dysregulation** triggered by perceived loss of power. By the time you are dealing with the meltdown, reasoning is impossible because their thinking brain is not available.$$,
  
  $$❌ **Explaining why the demand is unreasonable during the tantrum**
→ Their prefrontal cortex is offline. Logic, reasons, and explanations **cannot be processed** during amygdala hijack. You are wasting your breath and escalating their frustration.

❌ **Giving in to stop the tantrum**
→ You teach their brain that **big enough explosion equals getting what I want**. You are training them to rage harder and longer next time because it works.

❌ **Punishing them for having the tantrum**
→ Punishment during dysregulation just adds **shame to overwhelm**. They are not choosing this reaction; their nervous system is in crisis. Consequences come later, not during.

**Why these backfire:** The DEFIANT brain is wired for **power struggles**. Without a strategy that acknowledges their need for autonomy while holding firm boundaries, every unreasonable demand becomes a war you cannot win through force.$$,
  
  $$[
    {
      "step_number": 1,
      "step_title": "Name the limit once, then go silent",
      "step_explanation": "When they make the unreasonable demand, state your boundary **once, clearly, and calmly**: No ice cream for breakfast. We are having cereal. Then **stop talking**.\n\n**Your move:** Do NOT repeat yourself. Do NOT explain. Do NOT justify. The DEFIANT brain hears repetition as **negotiation opportunity**. Silence after your boundary communicates: **This is not a discussion.**\n\n**The shift:** You are refusing to engage in the power struggle. Your silence removes the **fuel** their oppositional brain needs to keep fighting. They cannot argue with silence.",
      "what_to_say_examples": [
        "No ice cream for breakfast. Cereal is on the table.",
        "Bedtime is now. No more TV tonight."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Allow the tantrum without reacting",
      "step_explanation": "They will explode. **Let them.** Stay physically present but emotionally neutral. Do NOT try to stop the tantrum, reason with them, or punish them.\n\n**Do NOT:** Leave the room (abandonment increases their panic) or hover anxiously asking if they are okay (teaches tantrum equals attention). Just **be there, calm, doing something neutral** like checking your phone or folding laundry.\n\n**Important:** Your calm nervous system is teaching theirs: **Big feelings are safe. You are not scared of my rage. The boundary still stands.** This is co-regulation through presence, not engagement.",
      "what_to_say_examples": [
        "I can see you are really upset. I am right here when you are ready to talk.",
        "You can be as mad as you need to be. The answer is still no."
      ]
    },
    {
      "step_number": 3,
      "step_title": "Reconnect and offer choice after regulation",
      "step_explanation": "**Only after** they calm (5-20 minutes), reconnect warmly. Do NOT revisit the demand or lecture. Instead, offer a **small choice** in a related area to restore their sense of autonomy.\n\n**The post-tantrum message:** You were really upset that I said no to ice cream. I get it. You can choose: do you want cereal or toast for breakfast? You cannot control the **no**, but you CAN control something else.\n\n**Why it matters:** The DEFIANT brain needs **power restoration** after losing a battle. Giving them a choice—even tiny—teaches: **I can still have control in other ways. Tantrums do not work, but choices do.**",
      "what_to_say_examples": [
        "I know ice cream sounded really good. That is for dessert. For breakfast, do you want cereal or toast? You pick.",
        "You wanted to watch TV. I said no. Now you get to choose: do you want to read books or play quietly before bed?"
      ]
    }
  ]$$::jsonb,
  
  $$**The DEFIANT brain has an overactive behavioral activation system (BAS) driving intense goal pursuit and an underactive behavioral inhibition system (BIS) that struggles to accept limits.**

By **naming the limit once then going silent** (step 1), you are refusing to feed their need for power struggle—repetition signals negotiation; silence signals finality. By **allowing the tantrum without reacting** (step 2), you are teaching their amygdala that **rage does not change outcomes**, while your calm presence shows **big feelings are safe but ineffective**. By **reconnecting and offering choice after regulation** (step 3), you are restoring their need for autonomy in a **productive way**, rewiring their brain to seek control through cooperation instead of explosion.

**The first 2 weeks will be brutal.** They will rage **longer and louder** (extinction burst) to test if you truly will not cave. But by **week 4**, most DEFIANT kids start **accepting no faster** because their brain has learned: **Fighting does not work. Mom does not negotiate. But I still get choices in other things.**$$,
  
  $$
  {
    "first_5_minutes": "Expect **massive escalation**. They may scream that you are the worst parent, throw things, or storm off. **Do not react**. This is their brain testing whether the boundary is real.",
    "by_10_minutes": "Watch for **the peak then crash**. Most tantrums have a crescendo where the rage is maximum, then it starts diminishing. **Hold steady**. The calming process is happening even if it looks chaotic.",
    "by_week_3": "You will notice they **give up faster**. Tantrums go from 20 minutes to 10, then to 5. They are learning that **no means no, and raging is exhausting with no payoff**.",
    "dont_expect": [
      "Them to stop making unreasonable demands—DEFIANT kids will always push boundaries. The goal is **shorter, less intense tantrums** and faster acceptance, not zero demands",
      "Immediate gratitude for choices offered—they may reject the choices initially out of residual anger. Offer anyway. Over time, they will start taking them."
    ],
    "this_is_success": "Success equals they hear no, get upset, but **do NOT tantrum**—they just complain or stomp off. Or they tantrum for **2 minutes instead of 20**. Reduced intensity and duration is neurological progress."
  }
  $$::jsonb,
  
  $$[
    {
      "variation_scenario": "They escalate to physical aggression—hitting you or throwing things",
      "variation_response": "**Block calmly.** I will not let you hurt me or break things. Move objects, hold their hands if needed—calm but firm. After regulation: Your body was really upset. Hitting is not okay. What can you do next time when you feel that mad?"
    },
    {
      "variation_scenario": "They scream that they hate you or that you are a terrible parent",
      "variation_response": "**Do not take it personally.** Their amygdala is speaking, not their heart. Stay neutral. After calming: You said some really mean things when you were upset. I know you do not really feel that way. When you are mad, you can say I am really angry instead."
    },
    {
      "variation_scenario": "Siblings or other adults try to give in to stop the tantrum",
      "variation_response": "**Protect the boundary across all adults.** Explain to others: We are teaching them that tantrums do not work. If anyone gives in, it undoes all the progress. Everyone must hold the line or the DEFIANT brain learns to find the weak link."
    },
    {
      "variation_scenario": "The demand happens in public and you feel mortified",
      "variation_response": "**Same strategy, harder execution.** State the no once. Stand calmly. Let them tantrum. Ignore stares. Your consistency in public is even MORE important—if they learn public tantrums get a different result, they will weaponize location."
    }
  ]$$::jsonb,
  
  'Calm, unmovable, non-defensive. You must be the wall—not angry, not shaken, just immovable. The DEFIANT child needs to feel that their rage cannot control you or change reality.',
  
  ARRAY['tantrums', 'defiant', 'unreasonable-demands', 'power-struggle', 'boundaries', 'autonomy', 'no'],
  
  false
);

-- SCRIPT 2: BEDTIME - DEFIANT
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
  'Gets out of bed repeatedly - testing boundaries after lights out',
  'Bedtime',
  'DEFIANT',
  3,
  10,
  'Moderate',
  30,
  
  $$You have finished the bedtime routine. Tucked them in. Said goodnight. You walk out. Thirty seconds later, they are out of bed. **I need water.** You get water. Back to bed. Two minutes later: **I have to pee.** Back to bathroom. Back to bed. Three minutes later: **I am scared.** By the 8th trip out of bed, you are **furious** and they are **wide awake**, smiling because they have successfully pulled you back in.

The DEFIANT brain experiences bedtime as **loss of control and connection**. Being told to stay in bed triggers their **oppositional drive**—the more you enforce it, the more they resist. Each time you engage (even angrily), their brain gets a **dopamine hit** from regaining your attention and proving they can make you come back. This is not insomnia or fear; it is **strategic boundary testing** driven by their neurological need to feel powerful. By the 10th time, they have won—they controlled the evening, not you.$$,
  
  $$❌ **Re-engaging every time they get out of bed**
→ Every response—even angry ones—**reinforces** the behavior. The DEFIANT brain learns: **Getting out of bed equals Mom interaction.** You are training them to get up.

❌ **Threatening consequences if they get up one more time**
→ Empty threats teach them you do not mean what you say. If you do not follow through immediately, their brain files it under **Mom is bluffing. I can keep going.**

❌ **Lying down with them until they fall asleep**
→ This becomes the new sleep association. Now they **cannot sleep without you**, and you have created a dependency that steals hours of your evening every night.

**Why these backfire:** The DEFIANT brain is **wired to test limits**. Without a strategy that removes the payoff (your engagement) and establishes non-negotiable boundaries, they will escalate until you break.$$,
  
  $$[
    {
      "step_number": 1,
      "step_title": "Announce the one-return rule before lights out",
      "step_explanation": "BEFORE tucking them in, clearly state the new rule: **After I say goodnight, you can get out of bed ONE time for a real need—water, bathroom, hug. After that, I will not talk to you or come back. You stay in your bed.**\n\n**Your move:** Say this calmly and matter-of-factly, not as a threat. Make sure they understand: **You get one exit. After that, bedtime is done and I am done responding.**\n\n**The shift:** You are giving them **predictable structure** and one opportunity for autonomy (their one exit). This satisfies their need for control while establishing the boundary. Their brain knows the rule before testing begins.",
      "what_to_say_examples": [
        "After I say goodnight, you can come out once if you need something. After that, you stay in bed and I will not come back.",
        "You get one trip out of bed. Use it for something important—water, bathroom, or a hug. Then bedtime is done."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Honor the first exit, then enforce silence",
      "step_explanation": "When they get out the first time, **handle it warmly and quickly**. Get water, take them to bathroom, give the hug—whatever they ask. Then say: **That was your one time. Now it is bedtime. I will not be coming back.**\n\n**Do NOT:** Linger, have conversations, or re-tuck them in elaborately. Handle the request **functionally** then disengage. If they get out again, **do not speak, do not make eye contact**. Physically guide them back to bed in complete silence. Repeat as many times as needed.\n\n**Important:** Your silence is the consequence. The DEFIANT brain **cannot fight with silence**. No reaction = no payoff = behavior extinguishes over time.",
      "what_to_say_examples": [
        "Here is your water. That was your one exit. Goodnight.",
        "(Second exit: complete silence. Guide them back to bed without words or eye contact.)"
      ]
    },
    {
      "step_number": 3,
      "step_title": "Reinforce compliance the next morning",
      "step_explanation": "The next morning, **immediately** acknowledge if they stayed in bed after the first exit (even if it took 5 silent returns to get there). Do NOT focus on the testing; focus on the eventual compliance.\n\n**The morning message:** You stayed in bed last night after I stopped coming back. That is exactly what big kids do. Because you did that, we have extra time for [preferred morning activity].\n\n**Why it matters:** The DEFIANT brain needs to learn that **cooperation equals positive outcomes, not just avoiding punishment**. You are building the pathway: **Staying in bed = Mom is happy + I get something good in the morning.**",
      "what_to_say_examples": [
        "You did a great job staying in bed last night. That is your strong brain working. Let's have extra time for your favorite breakfast.",
        "Last night you stayed in bed after your one exit. I am proud of you. Tonight will be even easier."
      ]
    }
  ]$$::jsonb,
  
  $$**The DEFIANT brain seeks control and connection through boundary testing, especially at bedtime when separation anxiety and autonomy needs peak.**

By **announcing the one-return rule before lights out** (step 1), you are giving their brain **predictable structure and one moment of control** (their choice of what to use the exit for), reducing the need to fight. By **honoring the first exit then enforcing silence** (step 2), you remove the **reinforcement** (your engagement) that fuels repeated exits—silence teaches their brain that **getting up no longer produces Mom**. By **reinforcing compliance the next morning** (step 3), you are creating a **positive reinforcement loop** that rewards staying in bed instead of punishing getting out.

**The first 3 nights will be exhausting.** They will get out **10+ times** testing whether you truly will not engage. You will silently walk them back over and over. But by **night 5**, most DEFIANT kids **stop getting up** because their brain has learned: **Mom does not respond. This is boring. Staying in bed is easier.**$$,
  
  $$
  {
    "first_30_minutes": "Expect **maximum testing**. They may get out 5, 8, 10 times the first night. **Stay silent and consistent**. Every time you speak, you reset their learning. Silence is the teacher.",
    "by_night_3": "Watch for **reduced frequency**. They will still test, but instead of 10 exits it becomes 5, then 3. Their brain is learning the boundary is real.",
    "by_week_2": "You will notice they **use their one exit strategically** (actually getting water instead of random excuses) and then **stay in bed**. The behavior is extinguished.",
    "dont_expect": [
      "Them to fall asleep instantly after you leave—DEFIANT kids may lie awake for 30 minutes. That is fine. The goal is **they stay in bed**, not immediate sleep",
      "Zero exits ever again—stressful nights or changes in routine may trigger testing. Re-apply the silent return and it resolves faster each time."
    ],
    "this_is_success": "Success equals they get out **once**, you handle it, and they **stay in bed after that**. Or they test with 2-3 exits on night one but by night three they stop. Behavioral extinction is happening."
  }
  $$::jsonb,
  
  $$[
    {
      "variation_scenario": "They scream or cry from their bed instead of getting out",
      "variation_response": "**Do not go back.** Crying from bed is **better than getting out**—they are learning the boundary. If it escalates to genuine distress (not manipulation), check once briefly: You are okay. It is bedtime. Then leave again. Do not re-engage."
    },
    {
      "variation_scenario": "They claim they are scared or had a nightmare",
      "variation_response": "**First exit: address it warmly.** Check under bed, leave door cracked, quick hug. Then: That was your one time. Now you are safe and it is bedtime. Second time: silent return. Repeated fear claims are often control-seeking, not genuine fear."
    },
    {
      "variation_scenario": "They get out of bed and play in their room instead of coming to you",
      "variation_response": "**Return them to bed silently.** Remove toys if needed. The rule is **in bed**, not just **in room**. Consistency on the exact boundary is critical or they will find loopholes."
    },
    {
      "variation_scenario": "You have a partner who engages when you are enforcing silence",
      "variation_response": "**Get both adults aligned.** Explain: We are teaching them that bedtime is non-negotiable. If one of us talks or engages after the first exit, it undoes the learning. Both parents must hold the silent return or the DEFIANT brain will exploit the inconsistency."
    }
  ]$$::jsonb,
  
  'Calm, robotic, silent. You must be the unshakable boundary—not angry, not negotiating, just a calm force returning them to bed as many times as it takes. The DEFIANT child needs to feel that their tactics cannot crack you.',
  
  ARRAY['bedtime', 'defiant', 'boundary-testing', 'sleep', 'exits', 'control', 'consistency'],
  
  false
);