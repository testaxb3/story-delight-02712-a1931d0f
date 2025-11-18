-- Create DEFIANT Social script: Won't share toys - insists on controlling play
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
  'Won''t share toys - insists on controlling play',
  'Social',
  'DEFIANT',
  3,
  10,
  'Moderate',
  20,
  
  $$Your DEFIANT child is playing when another child approaches their toys. Your child **immediately** takes control: "You can''t play with that!" or "I''m the boss of this game!" When the other child tries to join or touch anything, your child **escalates**: grabbing toys away, yelling "Mine!", physically blocking access.

The DEFIANT child''s brain is **wired to seek control**—they feel safest when they''re in charge. Sharing feels like **losing power**. By the time you intervene, your child is digging in harder and the other child is upset or walking away.$$,
  
  $$❌ **"You NEED to share right now!"**
→ Forcing sharing triggers their defiance reflex. They dig in harder because you''re taking away their control. They learn: sharing = losing a power battle.

❌ **"If you don''t share, no more playdates!"**
→ Threats make them defensive and reinforce that sharing is punishment, not cooperation. They feel cornered rather than empowered.

❌ **Taking the toy away and giving it to the other child**
→ This proves their fear: sharing = losing. You''ve taken their control AND their property. Next time they''ll guard even more fiercely.

**Why these backfire:** The DEFIANT brain interprets forced sharing as domination. You''ve made sharing about compliance rather than choice, which is the opposite of what they need.$$,
  
  $$[
    {
      "step_number": 1,
      "step_title": "Name their power, offer a choice",
      "step_explanation": "DEFIANT kids need to feel **in control**. Give them the ownership they crave, but frame sharing as **their decision**.\n\n**Your move:** Get down to their eye level and say clearly: **\"These are your toys. You get to decide.\"** Then immediately present two specific options that both work for everyone.\n\n**The shift:** You''re acknowledging their control (which calms the defiance response) while showing them that sharing is a **power move**, not a surrender.",
      "what_to_say_examples": [
        "\"These are yours. You can share for 5 minutes and stay in charge, or keep them to yourself and they go away for the rest of playdate. Your choice.\"",
        "\"You''re the boss of your toys. Do you want to be the teacher and show them how it works, or do you want to play alone?\""
      ]
    },
    {
      "step_number": 2,
      "step_title": "Follow through immediately—no negotiation",
      "step_explanation": "Whatever they choose, **honor it instantly**. No second-guessing, no convincing. If they choose not to share, the toy goes away **immediately and calmly**.\n\n**Your move:** If they say \"Mine!\", simply say: **\"Got it. That means these are done for today.\"** Pick up the toys and remove them without anger or lecture. If they choose to share, step back and let them lead.\n\n**The shift:** DEFIANT kids need to learn that **choices have real consequences**, not threats. When you follow through calmly, they start trusting that you mean what you say—and that they really do have control through their choices.",
      "what_to_say_examples": [
        "\"You chose to keep them. I''ll put these away.\" (Pick up toys calmly, no discussion)",
        "\"Great. You''re teaching them. I''m right here if you need backup.\" (Step away and let them lead)"
      ]
    },
    {
      "step_number": 3,
      "step_title": "Reinforce power through sharing",
      "step_explanation": "After the playdate, **immediately** point out how their choice gave them control. Even if they chose not to share, acknowledge they owned their decision. If they shared, make it crystal clear that sharing = being powerful.\n\n**Your move:** Say specifically: **\"You made a choice today and stuck with it. That''s powerful.\"** If they shared, add: **\"Did you see how [friend] listened to you when you were teaching? You were in charge.\"**\n\n**Why it matters:** The DEFIANT brain responds powerfully to **recognition of their autonomy**. You''re teaching that **sharing is a leadership skill**, not submission. This is the reframe that makes cooperation desirable.",
      "what_to_say_examples": [
        "\"You chose to be the teacher today. I saw [friend] following your lead. That''s real power.\"",
        "\"You decided and stuck with it. Even though it was hard, you were in charge of yourself. That''s strength.\""
      ]
    }
  ]$$::jsonb,
  
  $$**The DEFIANT brain fears losing control more than it wants connection.**

By **naming their power first** (step 1), you're disarming their defiance response—they don''t need to fight when you''ve already acknowledged they''re in charge. By **following through without negotiation** (step 2), you''re teaching that choices are real and consequences aren''t punishment, they''re information. By **reframing sharing as power** (step 3), you''re rewiring their brain to see cooperation as a strength move, not a surrender.

**The first few playdates will be rough.** They''ll test whether you really mean it by choosing not to share. But by playdate 3-4, most DEFIANT kids start experimenting with sharing **because they realize it gives them MORE control** (being the teacher, the leader, the one everyone wants to play with) than guarding toys alone.$$,
  
  $$
  {
    "first_5_minutes": "They''ll likely test you by saying \"Mine!\" to see if you really meant it. **Stay calm.** Follow through immediately by removing the toys without anger. They may escalate briefly (\"No! I changed my mind!\"). Respond: \"You can try again next playdate.\"",
    "by_10_minutes": "If they chose not to share, they''ll watch the other child play with something else and feel left out. **Don''t rescue them.** This is the natural consequence teaching them. If they chose to share, they''ll be hyper-controlling about \"how\" the friend plays. Let it happen unless it becomes mean.",
    "by_week_2": "You''ll see them **start to choose sharing more often** because they''ve learned it actually gives them more control and influence. They may still be bossy about the rules, but they''re engaging. By week 3-4, sharing becomes a **power strategy** they use intentionally.",
    "dont_expect": [
      "Generous, gracious sharing — DEFIANT kids will share on their terms, with their rules, forever. That''s okay. Control + cooperation is success",
      "No conflicts — they''ll still boss other kids around sometimes. You''re aiming for ''bossy AND sharing'' not ''perfectly flexible''"
    ],
    "this_is_success": "**Your DEFIANT child chooses to share 50%+ of the time** and can lead play cooperatively (even if bossily) for 15+ minutes without conflict. They understand that being the \"teacher\" or \"game leader\" is more fun than playing alone."
  }
  $$::jsonb,
  
  $$[
    {
      "variation_scenario": "\"I changed my mind! I want to share now!\"",
      "variation_response": "**\"I hear you. You can try again at the next playdate.\"** Stay firm. Letting them reverse mid-consequence teaches that choices aren''t real. Next time they''ll take the choice more seriously."
    },
    {
      "variation_scenario": "They ''share'' but are so controlling the other child gets frustrated",
      "variation_response": "**Intervene only if it becomes mean.** Say: \"You can be the teacher, but teachers need to let students try. Give them one turn to practice.\" If they can''t, remove the toy: \"Too hard to share right now. We''ll try again later.\""
    },
    {
      "variation_scenario": "The other child grabs the toy first",
      "variation_response": "**\"That''s not okay. [Other child], these are [your child]''s toys. They decide.\"** Model respecting your DEFIANT child''s ownership. Then give your child the same choice structure: \"Do you want to share with turns, or should I put this away?\""
    },
    {
      "variation_scenario": "You feel embarrassed in front of the other parent",
      "variation_response": "**Take a breath.** Parenting DEFIANT kids publicly is hard. Trust your strategy. Say to the other parent if needed: \"We''re working on choices and consequences.\" Most parents respect consistency more than forced sharing."
    }
  ]$$::jsonb,
  
  'Calm, consistent, non-judgmental. You must be **matter-of-fact**—not angry, not embarrassed, just **clear**. The DEFIANT child needs to feel that you''re not trying to control them, just showing them how their choices play out. Your neutral energy makes this about learning, not battling.',
  
  ARRAY['social', 'defiant', 'sharing', 'control', 'playdates', 'cooperation', 'power-struggle'],
  
  false
);