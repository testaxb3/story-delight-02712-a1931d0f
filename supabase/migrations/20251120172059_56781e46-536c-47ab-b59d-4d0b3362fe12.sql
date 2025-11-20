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
  'Loses game and explodes - cannot handle losing',
  'Social',
  'INTENSE',
  5,
  12,
  'Hard',
  40,
  
  $$You're playing a board game, video game, or sport with your INTENSE child. They're losing. Within seconds of realizing they won't win, they **explode**: flipping the board, throwing controllers, screaming "This is STUPID!" or "You CHEATED!", possibly storming off in tears or rage.

The INTENSE brain has **extreme difficulty tolerating frustration and perceived failure**. Losing activates their threat detection system—their amygdala interprets it as **rejection or inadequacy**, flooding them with cortisol and shame. This isn't poor sportsmanship; it's **emotional dysregulation** triggered by their brain's inability to separate **losing a game** from **being a loser**. By the time you try to reason with them, they're in full meltdown.$$,
  
  $$❌ **Saying "It's just a game, stop being a sore loser"**
→ To the INTENSE brain, it is NOT just a game. Minimizing their distress teaches them their feelings are wrong, increasing shame and future explosions.

❌ **Forcing them to finish the game or apologize immediately**
→ They're in amygdala hijack. Demanding behavior change during dysregulation just escalates the crisis. Apologies come AFTER regulation, not during.

❌ **Letting them win to avoid the meltdown**
→ This teaches their brain that **explosion equals getting what I want**. You're reinforcing the tantrum, not teaching frustration tolerance.

**Why these backfire:** The INTENSE brain genuinely experiences losing as **ego threat**. Their self-worth is fragile and **performance-based**. Without teaching them to separate **outcome from identity**, every loss will trigger the same crisis.$$,
  
  $$[
    {
      "step_number": 1,
      "step_title": "Pause the game and regulate first",
      "step_explanation": "The moment you see the meltdown starting—voice rising, body tensing—**stop the game immediately**. Do NOT try to continue or force them to finish.\n\n**Your move:** Say calmly: We are pausing this game right now. Your body needs a break. Remove the game from sight if needed. If they're already in full explosion, let them storm off—**do not chase them**. Give them 5-10 minutes alone to start down-regulating.\n\n**The shift:** You're teaching their brain that **big feelings require a pause, not a push-through**. Games are for fun; when they stop being fun, we stop.",
      "what_to_say_examples": [
        "I can see this game is making you really upset. We're pausing it right now so you can feel better.",
        "Your body is telling me it needs a break. Let's stop and come back to this later if you want."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Validate the feeling, separate from behavior",
      "step_explanation": "After they've calmed enough to hear you (5-15 minutes), sit with them and **acknowledge the pain of losing without condoning the explosion**.\n\n**Do NOT:** Launch into a lecture about sportsmanship or winning and losing. Their nervous system is still fragile. Lead with empathy.\n\n**Important:** Use this exact framework: I can see losing felt really bad—like it meant something about YOU. AND throwing the game was not okay. We need to work on what to do when your body feels that way. You are separating **feeling (valid) from action (not acceptable)**.",
      "what_to_say_examples": [
        "Losing feels terrible to you—like you failed. I get that. AND we can't throw things when we're upset. Let's figure out what you can do instead.",
        "I know it hurts when you don't win. Your brain makes it feel like a really big deal. But your brother didn't cheat—he just won this time."
      ]
    },
    {
      "step_number": 3,
      "step_title": "Build frustration tolerance gradually",
      "step_explanation": "Over the next weeks, intentionally play **low-stakes games where losing is likely**. Start with games that take 5 minutes, not 30. When they start getting upset, **pause before explosion** and practice the regulation skill.\n\n**The practice message:** Your job is to notice when your body starts feeling upset and ask for a break BEFORE you explode. That is what strong brains do—they notice the feeling early.\n\n**Why it matters:** The INTENSE brain needs **repeated exposure to losing in safe conditions** to build the neural pathway: **I can lose and still be okay**. You are literally rewiring their threat detection system through practice.",
      "what_to_say_examples": [
        "I'm proud of you for pausing when you felt upset, even though you didn't win. That's the skill we're building.",
        "Let's play one more round. If you start feeling that upset feeling, tell me and we'll take a break together."
      ]
    }
  ]$$::jsonb,
  
  $$**The INTENSE brain links performance to self-worth more strongly than typical brains.**

By **pausing the game and regulating first** (step 1), you're teaching their amygdala that **losing does not equal danger**—you are creating safety in the moment of perceived threat. By **validating the feeling while separating it from behavior** (step 2), you're teaching them that **big feelings are okay, but big reactions are not**. By **building frustration tolerance gradually** (step 3), you're giving their prefrontal cortex repeated practice **inhibiting the amygdala's panic response**.

**The first month will be brutal.** They'll rage-quit games, refuse to play, or only want games they can dominate. But by **week 6**, most INTENSE kids start **pausing themselves** when they feel the upset rising because their brain has learned: **I can lose and Mom still thinks I'm okay.**$$,
  
  $$
  {
    "first_5_minutes": "Expect **massive resistance** to stopping the game. They may scream that you are ruining it or that it is not fair. **Stay calm**—this is their dysregulation talking, not logic.",
    "by_10_minutes": "Watch for the **physical signs of regulation**: crying slows, breathing deepens, body unclenches. **Do NOT rush this**. Some INTENSE kids need 20 minutes to fully calm after a losing-triggered meltdown.",
    "by_week_3": "You will notice they **ask to pause** before the full explosion. This is MASSIVE progress—they are starting to recognize the early warning signs in their body and use the tool you taught.",
    "dont_expect": [
      "Them to enjoy losing or be a gracious loser immediately—the goal is **regulated response to losing**, not happiness about it",
      "Perfect behavior every time—INTENSE kids will still struggle with high-stakes losses (tournaments, competitions). Progress is **fewer explosions and faster recovery**, not zero frustration."
    ],
    "this_is_success": "Success equals they lose a game and say **I am really mad** but do NOT throw, scream, or storm off. Or they ask to stop playing before the meltdown. Naming the feeling without exploding is **neurological mastery** for the INTENSE brain."
  }
  $$::jsonb,
  
  $$[
    {
      "variation_scenario": "They accuse you or others of cheating when they lose",
      "variation_response": "**This is their brain trying to protect their ego.** Say calmly: I hear you think I cheated. I did not. You are upset because you lost, and your brain is trying to make sense of that. After regulation, revisit: Losing does not mean the other person cheated. It just means they won this time."
    },
    {
      "variation_scenario": "They refuse to ever play games again after a big explosion",
      "variation_response": "**Respect the boundary short-term, rebuild long-term.** Give them a week. Then introduce a **cooperative game** (you work together, not compete). Gradually reintroduce competitive games when they are ready. Forcing too soon re-traumatizes."
    },
    {
      "variation_scenario": "Siblings or friends refuse to play with them because of the meltdowns",
      "variation_response": "**This is real social consequence.** Acknowledge it: Other kids do not want to play when games end in explosions. That makes sense. We are working on teaching your body to handle losing better so friends will want to play again. Then actively practice the skill."
    },
    {
      "variation_scenario": "They cry instead of rage—meltdown is internal, not external",
      "variation_response": "**Internal dysregulation is still dysregulation.** Pause the game. Sit with them. Validate: Losing feels really sad to you. Let's take a break. The same regulation process applies whether they explode outward or inward."
    }
  ]$$::jsonb,
  
  'Calm, non-judgmental, patient. You must be the anchor—not competitive, not dismissive, just steady. The INTENSE child needs to feel that losing a game does not change how you see them.',
  
  ARRAY['social', 'intense', 'frustration-tolerance', 'games', 'competition', 'emotional-regulation', 'sportsmanship'],
  
  false
);