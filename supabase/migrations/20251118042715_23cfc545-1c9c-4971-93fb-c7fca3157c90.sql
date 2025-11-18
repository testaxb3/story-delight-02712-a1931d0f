-- Create DEFIANT Hygiene script: Refuses bath/shower - says 'you can't make me'
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
  'Refuses bath/shower - says ''you can''t make me''',
  'Hygiene',
  'DEFIANT',
  3,
  10,
  'Moderate',
  15,
  
  $$It's bath time. You announce it's time to get clean. Your DEFIANT child immediately digs in: "No! I'm not taking a bath!" or "You can't make me!" When you try to guide them toward the bathroom, they resist physically, argue, or declare they're "fine" and don't need one.

You know they haven't bathed in 2-3 days. They smell. But forcing them creates a power struggle that leaves everyone exhausted and angry. Bribing works sometimes but you're tired of negotiating basic hygiene every single time.

This isn't really about hating baths. It's about **your announcement feeling like a command that removes their control**. Their brain hears "you have to" and immediately wants to prove they don't. The resistance is automatic—a reflex to protect their autonomy.$$,
  
  $$• "You HAVE to take a bath right now! Go!"
• "Fine! Don't bathe! See if I care when kids say you smell!"
• "If you don't get in the bath, no screen time for a week!"
• "I'm done fighting about this! You're going in whether you like it or not!"
• Physically carrying them to bathroom while they scream
• Bribing with treats every single time ("Bath = dessert!")

→ Demanding compliance: Triggers their defiance reflex—they HAVE to resist to maintain autonomy
→ Threats/future punishments: Doesn't work in the moment, damages relationship over basic hygiene
→ Giving up completely: They learn resistance = winning, hygiene becomes optional
→ Physical force: Creates trauma around bathing, makes future baths even harder
→ Constant bribing: Teaches they should get rewarded for basic self-care, unsustainable$$,
  
  $$[
    {
      "step_number": 1,
      "step_title": "GIVE THEM DECISION-MAKING POWER",
      "step_explanation": "Get down to eye level and immediately hand them choices that make bathing THEIR decision, not your demand.",
      "what_to_say_examples": [
        "Bath time is in 10 minutes. Do you want bubbles or no bubbles?",
        "You need to get clean tonight. Bath or shower? You pick.",
        "Time to wash up. Do you want to go in 5 minutes or 10 minutes? Your choice.",
        "Your body needs cleaning. Do you want me to help or do it yourself?",
        "Bath is happening. Do you want to bring toys in or just wash fast and get out? Up to you."
      ]
    },
    {
      "step_number": 2,
      "step_title": "HOLD THE BOUNDARY (CALM + BRIEF)",
      "step_explanation": "State the non-negotiable limit once, calmly. Don't argue or over-explain. Let them feel their feelings without changing the plan.",
      "what_to_say_examples": [
        "I hear you don't want to. And your body needs washing. That's not changing.",
        "You're upset. That's okay. Bath is still happening.",
        "You can be mad at me AND still get clean. Both are true.",
        "The answer isn't changing. You're getting clean tonight. You just get to pick how.",
        "I know you don't want to. I get it. We're still doing it."
      ]
    },
    {
      "step_number": 3,
      "step_title": "NATURAL CONSEQUENCE + FOLLOW-THROUGH",
      "step_explanation": "If they refuse to choose, you choose calmly. If they won't cooperate, the consequence is immediate and logical—no negotiation, no anger.",
      "what_to_say_examples": [
        "You didn't pick, so I'm picking. Shower. 5 minutes. Let's go.",
        "You chose not to go yourself. I'm walking you there now.",
        "Okay. You're choosing no bath tonight. That means no outside play tomorrow until you're clean. Your choice.",
        "You can walk yourself or I can carry you. 5 seconds. Your call.",
        "Not choosing is choosing. We're doing bath, my way. Next time you can pick."
      ]
    }
  ]$$::jsonb,
  
  $$**The DEFIANT brain resists hygiene not because they hate being clean, but because "you have to" removes their sense of control.**

By **offering real choices first** (step 1), you're acknowledging their need for autonomy—their brain relaxes because they're not being controlled. By **holding the boundary calmly** (step 2), you're showing that their feelings are valid but the limit stands, teaching them emotions don't change reality. By **following through with natural consequences** (step 3), you're letting their choices teach them instead of you forcing them—they learn hygiene happens either their way (easy) or your way (harder), but it happens.

**The first week will be rocky.** They'll test whether you mean it by refusing to choose or escalating. But by week 2-3, most DEFIANT kids start choosing their preferred bath method because they've learned: **fighting costs more autonomy than cooperating.** Choosing how = maintaining control.$$,
  
  $$
  {
    "first_5_minutes": "They may refuse to choose, test limits with 'I'm not doing it!', or escalate briefly. **Stay calm.** Follow through immediately—walk them to bathroom or calmly implement the consequence. No arguing.",
    "by_10_minutes": "If they chose their bath method, they'll cooperate (even if grudgingly). If you had to choose for them, they'll likely comply but be grumpy. Either way, **the bath happens**. Don't lecture afterward.",
    "by_week_2": "They'll start choosing their bath option **before you have to count down or implement consequences** because they've learned: choosing = keeping control. They may still complain, but cooperation increases dramatically.",
    "dont_expect": [
      "Enthusiastic bath-lovers — DEFIANT kids may never LOVE baths, but they'll cooperate when they have choices",
      "No complaints ever — they might grumble while bathing. That's fine. Compliance ≠ happiness",
      "Instant change — first 3-5 baths will be testing. Consistency is everything"
    ],
    "this_is_success": "**Your DEFIANT child chooses their bath method (bubbles, shower, timing, toys) 70%+ of the time** and gets clean within 15 minutes without major power struggles. They may still complain, but they cooperate."
  }
  $$::jsonb,
  
  $$[
    {
      "variation_scenario": "If they refuse to walk to bathroom or go limp",
      "variation_response": "**Okay. You chose not to walk. I'm carrying you.** (Pick them up calmly and carry to bathroom. No anger, no lecture.) Or: **You're choosing no bath tonight. That means no park tomorrow until you're clean.**"
    },
    {
      "variation_scenario": "If they get in but refuse to wash themselves",
      "variation_response": "**You can wash yourself or I can wash you. 10 seconds. Choose.** If they don't pick: **Okay, I'm washing you.** Do it quickly and matter-of-factly. No power struggle."
    },
    {
      "variation_scenario": "If they're genuinely calm and negotiate reasonably afterward",
      "variation_response": "**You asked nicely and calmly. I appreciate that. For tonight, the answer is still bath. But tomorrow we can talk about every-other-day showers if you stay clean.** Acknowledge their tone shift."
    },
    {
      "variation_scenario": "If they melt down during bath (splashing, refusing to rinse, etc.)",
      "variation_response": "**Bath is too hard right now. We're done. Tomorrow we try again.** Drain water, end bath calmly, implement consequence (no screen time until clean tomorrow). Don't force completion through tantrum."
    }
  ]$$::jsonb,
  
  'Calm, matter-of-fact, neutral. Zero frustration in your voice. You are not angry they do not want to bathe—you are just clear it is happening. The calmer you are, the less they feel controlled. Your neutral energy makes this about hygiene, not power.',
  
  ARRAY['hygiene', 'defiant', 'bath', 'shower', 'control', 'power-struggle', 'self-care'],
  
  false
);