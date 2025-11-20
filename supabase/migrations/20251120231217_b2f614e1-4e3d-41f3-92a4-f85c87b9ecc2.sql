-- Script: Social situation for INTENSE profile
-- "Demands everyone play 'the right way' - stops game to correct every rule violation"

INSERT INTO public.scripts (
  title,
  category,
  profile,
  age_min,
  age_max,
  difficulty_level,
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
  'Demands everyone play "the right way" - stops game to correct every rule violation',
  'Social',
  'INTENSE',
  5,
  11,
  'Moderate',
  8,
  
  -- THE SITUATION (Scene-Based Structure)
  'It''s 3:47 PM. Four kids are playing a board game on your living room floor. Your child suddenly stands up, face flushed, pointing at another player: **"That''s not how you do it! You have to roll BEFORE you move! Start over!"** The other child looks confused—they''d already moved their piece three spaces. Your child reaches across the board, grabs the piece, and firmly places it back at the starting position.

The other kids exchange glances. One sighs. Another rolls their eyes. Your child doesn''t notice—they''re laser-focused on the violation, voice rising: **"This is the RULE! If we don''t follow it, the WHOLE GAME doesn''t work!"**

You can see it in their body: jaw tight, shoulders hunched forward, hands gesturing emphatically. They''re not being mean—they genuinely believe the game will collapse into chaos if this one mistake isn''t corrected. The other kids start to lose interest. One stands up: **"I don''t want to play anymore."** Your child''s face crumples in confusion: **"But we''re only on round two!"**',
  
  -- WHAT DOESN'T WORK (Common Mistakes + Neuroscience)
  '**❌ COMMON MISTAKE #1: "Come on, let them play how they want. It''s just a game."**

**Why it fails:** To your INTENSE child, this **isn''t** "just a game." Their brain experiences rule violations as genuine threats to order and fairness. Dismissing their concern feels like you''re invalidating their reality—and triggers deeper defensiveness.

**The neuroscience:** INTENSE brains have hyperactive justice sensitivity. When they perceive unfairness (even minor rule bending), their amygdala fires as if responding to actual danger. Telling them "it doesn''t matter" doesn''t calm this response—it intensifies it.


**❌ COMMON MISTAKE #2: "You''re being bossy. Apologize to everyone right now."**

**Why it fails:** Forcing an immediate apology while they''re still emotionally activated short-circuits any chance for genuine reflection. They''re not ready to see the other perspective yet—they''re still stuck in "the rule was broken" mode.

**The neuroscience:** The prefrontal cortex (responsible for perspective-taking) goes offline during emotional intensity. Demanding empathy before regulation is like asking someone to solve algebra while their fire alarm is blaring—biologically impossible.


**❌ COMMON MISTAKE #3: "If you can''t play nicely, you''re done. Go to your room."**

**Why it fails:** This teaches them that caring about rules is wrong, rather than teaching them **how to care in a socially flexible way**. They internalize: "My instincts are bad"—not "I need to adjust my approach."

**The neuroscience:** INTENSE children need to learn **intensity management**, not intensity suppression. Punishment doesn''t teach the regulatory skill—it just adds shame to the existing emotional overwhelm.',
  
  -- STRATEGY STEPS (JSONB)
  '[
    {
      "step_number": 1,
      "step_title": "Validate the care, name the pattern",
      "step_explanation": "Pull your child aside (away from the group). Crouch to their eye level. Say calmly: **\"I can see you really care about playing the game correctly. That matters to you.\"** Pause. Then: **\"And I noticed—when you care this much, your voice gets louder and your body gets tense. The other kids don''t understand that you''re trying to help. They just feel bossed.\"**",
      "what_to_say_examples": [
        "\"You care about fairness. That''s actually a good thing.\"",
        "\"And when you care this much, your intensity shows. Let me show you what the other kids are seeing.\"",
        "\"I''m not saying you''re wrong about the rule. I''m saying your delivery is making kids not want to play with you.\""
      ]
    },
    {
      "step_number": 2,
      "step_title": "Teach \"Rules Reminder\" vs. \"Rules Enforcer\" language",
      "step_explanation": "Explain the difference: **Rules Enforcer** = \"You did it wrong! Start over!\" (feels bossy). **Rules Reminder** = \"Hey, I think we might''ve skipped the roll—want to double-check?\" (feels collaborative). Show them physically: tight, pointing finger (enforcer) vs. open hand, questioning tone (reminder). Practice both versions with you role-playing the other kid.",
      "what_to_say_examples": [
        "\"Let''s try it again. Pretend I''m the kid who moved without rolling. How can you say it so I don''t feel attacked?\"",
        "\"What if you said: ''Wait, I think we missed a step—can we check the rules?'' Instead of ''That''s wrong!''\""
      ]
    },
    {
      "step_number": 3,
      "step_title": "Offer a \"Rules Keeper\" role with boundaries",
      "step_explanation": "Suggest they become the **official Rules Keeper** for the game—but with a rule for the role: they can only **point out** a violation, not **fix it themselves**. Example: \"I noticed we might''ve skipped the roll.\" Then the group **votes** on whether to rewind or keep going. This channels their intensity into a legitimate role while building flexibility.",
      "what_to_say_examples": [
        "\"You''re really good at noticing details. Want to be the Rules Keeper? Your job is to point things out, and then we all decide together.\"",
        "\"If most kids vote to keep playing, we keep playing. That''s the Rules Keeper deal.\""
      ]
    },
    {
      "step_number": 4,
      "step_title": "Return to the group with a re-entry script",
      "step_explanation": "Walk back together. Have your child say: **\"Sorry I got intense. I just really care about the rules. Can I keep playing?\"** You stay nearby for the first 5 minutes, ready to give a subtle hand signal if you see their body tensing up again (a gentle reminder to use \"Rules Reminder\" language).",
      "what_to_say_examples": [
        "\"I''m going to stay close for a bit. If I tap my shoulder like this, it means: check your intensity.\"",
        "\"You don''t have to be perfect. Just try the new language once. That''s all I''m asking.\""
      ]
    }
  ]',
  
  -- WHY THIS WORKS
  '**The neuroscience of INTENSE rule rigidity:**
INTENSE children often have heightened **cognitive inflexibility**—their brains struggle to switch between "the rule" and "the social context." This isn''t stubbornness; it''s a neurological difficulty with **set-shifting** (the ability to adjust mental frameworks quickly). Their prefrontal cortex is still developing the capacity to hold two truths simultaneously: "This rule matters" AND "Social harmony also matters."

**Why validation comes first:**
When you validate their care about rules, you''re meeting them where they are neurologically. Their justice sensitivity isn''t a flaw—it''s a feature of their INTENSE wiring. Once they feel **seen** (not shamed), their nervous system can downregulate enough to access the prefrontal cortex for learning.

**Why "Rules Keeper" works:**
This strategy **channels intensity rather than suppresses it**. You''re not asking them to stop caring—you''re teaching them to care *collaboratively*. The role gives them structure (INTENSE brains love structure) while the voting mechanism builds **cognitive flexibility** in real-time. Over repetitions, their brain learns: "I can care deeply AND adapt to the group."

**The hand signal system:**
External cues work because INTENSE children often lack internal awareness of their escalating intensity. The signal acts as a **pre-frontal cortex bypass**—a physical reminder that triggers self-monitoring before full activation.',
  
  -- WHAT TO EXPECT (JSONB)
  '{
    "first_30_seconds": "When you pull them aside, expect defensiveness: \"But I was RIGHT!\" Their body will still be tense. Validating their care (not their delivery) should soften their jaw slightly within 15-20 seconds.",
    "by_2_minutes": "During the Rules Reminder practice, they''ll likely say the words but with residual edge in their tone. That''s okay—you''re building the neural pathway. By minute 3, their breathing should normalize.",
    "by_5_minutes": "Back with the group, watch their hands and shoulders. If they tense up at another \"violation,\" your hand signal should catch them before they verbally correct. They may pause, take a breath, then use gentler language (even imperfectly).",
    "this_is_success": "Success = they catch themselves ONCE during the rest of the playdate, even if imperfectly. Example: They start to say \"That''s wrong!\" but shift mid-sentence to \"Wait, can we check that?\" The neural pathway is forming. Celebrate this micro-win privately later.",
    "dont_expect": [
      "Perfect execution immediately—their brain needs 10-15 repetitions to rewire the pattern",
      "Them to stop caring about rules—you''re teaching flexible caring, not apathy",
      "Other kids to instantly forget the earlier intensity—rebuilding social trust takes time",
      "Zero mistakes for the rest of the playdate—intensity will flare again; use the signal"
    ]
  }',
  
  -- COMMON VARIATIONS (JSONB)
  '[
    {
      "variation_scenario": "**Variation: During the \"Rules Keeper\" role, they get overruled by the group vote and start to melt down**",
      "variation_response": "Pause the game. Pull them aside again: **\"I know it feels wrong to keep playing when the rule was broken. Your brain is telling you: THIS IS UNFAIR. And you''re right—it is bending the rule. But here''s what I need you to learn: sometimes we choose connection over correctness.\"** Offer a choice: \"Do you want to keep playing with bent rules, or step away for 2 minutes to calm down and then rejoin?\" If they choose to step away, normalize it: **\"That''s a really mature choice. You''re listening to your body.\"**"
    },
    {
      "variation_scenario": "**Variation: They refuse to apologize because \"I didn''t do anything wrong—they broke the rule!\"**",
      "variation_response": "Don''t force the apology. Instead, reframe: **\"You''re right—you weren''t wrong about the rule. But the way you said it made the other kids feel bad. That''s the part we''re apologizing for: the delivery, not the noticing.\"** If they still resist, offer a substitute: **\"How about: ''Sorry I got loud. I was just trying to help.''** That acknowledges impact without requiring them to say they were \"wrong.\""
    },
    {
      "variation_scenario": "**Variation: The other kids refuse to let them be Rules Keeper because they don''t trust them**",
      "variation_response": "Respect the group boundary. Say to your child: **\"They''re not ready for that role yet. That''s their choice. What we can do is practice Rules Reminder language right now, just you and me, so next playdate they see you''ve changed.\"** Then role-play 3-5 scenarios at home over the next week. Consistency rebuilds trust faster than one-time apologies."
    }
  ]',
  
  -- PARENT STATE NEEDED
  'You need to be **calm but firm**—not apologetic for your child, but not defensive either. Your energy should communicate: *"My child is learning. This is a growth moment."* If you feel embarrassed by the other parents watching, take a breath first. Your child will mirror your nervous system—if you''re flustered, they''ll escalate. If you''re steady, they''ll borrow your regulation.

**Physical readiness:** Be prepared to crouch to their level (not tower over them) and stay close during re-entry. Your proximity acts as a co-regulator.',
  
  -- TAGS
  ARRAY['social skills', 'rule rigidity', 'group play', 'bossiness', 'cognitive flexibility', 'peer relationships', 'playdates', 'cooperation', 'justice sensitivity'],
  
  -- EMERGENCY SUITABLE
  false
);