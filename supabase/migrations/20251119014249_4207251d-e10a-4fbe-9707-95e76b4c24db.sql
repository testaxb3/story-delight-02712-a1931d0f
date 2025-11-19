-- Create INTENSE script for SCREENS category: "Total meltdown when screen time ends"

INSERT INTO scripts (
  title,
  category,
  profile,
  age_min,
  age_max,
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
  'Total meltdown when screen time ends - complete emotional collapse',
  'Screens',
  'INTENSE',
  4,
  12,
  15,
  
  -- THE SITUATION
  'Your child has been on their tablet/game console for their allotted time. You give the 5-minute warning. They acknowledge it. Time''s up, you ask them to turn it off—and they EXPLODE.

Not just whining. FULL meltdown: screaming, throwing the device (or threatening to), hitting, kicking. "I HATE YOU! YOU NEVER LET ME DO ANYTHING! JUST ONE MORE LEVEL!"

**The intensity is shocking.** They were calm 30 seconds ago. Now they''re sobbing, enraged, completely dysregulated. You''re standing there thinking: "Is this NORMAL? Other kids don''t do this over a tablet."

**This isn''t about the screen.** This is about their INTENSE brain''s dopamine crash + transition difficulty + emotional regulation challenges all colliding at once.

→ **Most parents'' instinct:** Take the device away forcefully, lecture about gratitude, threaten to take screens away entirely.
→ **What happens:** Child escalates to violence, the meltdown lasts 45+ minutes, and they''re MORE obsessed with screens the next day (restriction backfires).
→ **Why this fails:** You''re fighting their brain chemistry when their prefrontal cortex is OFFLINE. They literally cannot "calm down and be reasonable" in this moment.',

  -- WHAT DOESN'T WORK
  '**❌ Taking the device away forcefully**
→ Triggers their fight-or-flight response. They perceive you as a threat to their dopamine source, which their brain treats like survival. Escalates to physical aggression.

**❌ "You had plenty of time! Stop being ungrateful!"**
→ Activates shame on top of dysregulation. Their brain hears: "Your feelings are wrong, and YOU are wrong." Shame deepens the meltdown and damages your connection.

**❌ Immediate consequences: "Fine, no screens tomorrow!"**
→ Creates panic on top of dysregulation. Now they''re melting down about TODAY and TOMORROW. Also: restriction makes screens MORE valuable to their brain (scarcity effect), increasing obsession.

**❌ Trying to reason: "If you calm down, we can talk about extra time tomorrow"**
→ Their prefrontal cortex (reasoning center) is OFFLINE during a meltdown. This is like trying to teach calculus to someone having a panic attack. They physically cannot process logic right now.

**❌ Ignoring the meltdown: "I''ll wait until you calm down"**
→ Their nervous system is in crisis and flooding with stress hormones. Without co-regulation from you, the meltdown intensifies and lasts longer. They need your calm presence to borrow your regulation.',

  -- STRATEGY STEPS (JSON array of objects with step, title, explanation, example_phrases)
  '[
    {
      "step": 1,
      "title": "Physical Safety + Narrate the Dopamine Crash",
      "explanation": "Get within arm''s reach (if they''re not hitting). Remove the device GENTLY if it''s in danger of being thrown, but narrate what you''re doing: ''I''m going to put this somewhere safe so it doesn''t get broken.'' **Then immediately name what''s happening in their brain:**\n\n''Your brain just had a huge change in dopamine. That game/video was giving your brain lots of happy chemicals, and when it stops suddenly, your brain feels PANICKY. This isn''t about the tablet—it''s about the chemicals in your brain right now.''\n\n**This does two things:**\n→ Externalizes the problem (it''s not ''you''re bad,'' it''s ''your brain is struggling'')\n→ Activates their observer brain slightly, which can help them start regulating\n\n**If they''re violent:** Create space, narrate from a distance: ''I see your body is really struggling right now. I''m going to stand right here until your body feels safer.''",
      "example_phrases": [
        "Your brain is having a HUGE dopamine crash right now. That''s why this feels so BIG.",
        "This isn''t about me being mean. Your brain chemicals just changed really fast, and that''s SO hard for INTENSE brains.",
        "I''m going to keep you safe and keep the tablet safe while your brain calms down."
      ]
    },
    {
      "step": 2,
      "title": "Offer a Dopamine Bridge (NOT screen-related)",
      "explanation": "Their brain is in dopamine withdrawal. You can''t eliminate the crash, but you CAN offer a gentler landing. Offer a **high-sensory, high-engagement activity** that provides SOME dopamine without being a screen:\n\n→ ''Want to go jump on the trampoline with me for 2 minutes?''\n→ ''Let''s go get ice from the freezer and crunch it really loud''\n→ ''Should we do 20 jumping jacks together right now?''\n→ ''Want to help me rip up this cardboard box? We can destroy it together''\n\n**Key:** You''re offering **movement, sensory input, or novelty**—things that give their brain a small dopamine hit without reinforcing screen dependence.\n\n**If they refuse everything:** That''s okay. Just sit near them and say: ''I''ll just sit here with you while your brain resets. You don''t have to do anything.''\n\n**DO NOT offer food as a dopamine bridge unless you want to create a food-as-emotional-regulation pattern.**",
      "example_phrases": [
        "Your brain needs something else fun right now. Want to do something wild and physical with me for 2 minutes?",
        "Let''s go outside and run to the mailbox and back as fast as we can.",
        "I know nothing sounds good right now. I''m just going to stay close while your brain figures this out."
      ]
    },
    {
      "step": 3,
      "title": "Plan the Next Screen Session TOGETHER (After Calm)",
      "explanation": "**Wait until they''re FULLY regulated** (usually 20-45 minutes after the meltdown starts). Then—and ONLY then—have this conversation:\n\n''Screen time endings are really hard for your brain. Let''s make a plan together so your brain knows what''s coming next time.''\n\n**Ask them:**\n→ ''What could help you when it''s time to stop? Should I give you 10 minutes warning instead of 5? Should we set a timer that YOU control?''\n→ ''What should we do RIGHT AFTER screens end? Should we have a snack ready? Go outside? Build something?''\n→ ''What can I say that would help your brain instead of making it harder?''\n\n**Write down the plan together.** Put it somewhere visible. Refer to it BEFORE the next screen session: ''Remember, we have a plan for when it''s time to stop.''\n\n**Why this works:** You''re giving them agency and predictability, which are the two things INTENSE brains crave most. They''re more likely to follow a plan THEY helped create.",
      "example_phrases": [
        "Your brain is so smart. What do you think would help it when screen time ends?",
        "Should we try a longer warning next time? Or a countdown timer you can see?",
        "Let''s write down our plan so we both remember it. What should we do RIGHT after you turn off the game?"
      ]
    }
  ]'::jsonb,

  -- WHY THIS WORKS
  '**This strategy works because it targets the THREE brain systems causing the meltdown:**

**1. The Dopamine Crash (Chemical)**
Screens flood the brain with dopamine (the reward chemical). When screens stop abruptly, dopamine levels PLUMMET—this is chemically similar to withdrawal. By naming the dopamine crash, you''re:
→ Externalizing the struggle (it''s not "you''re bad," it''s "your brain chemistry is struggling")
→ Activating their observer brain, which slightly reduces emotional flooding
→ Building their self-awareness: "Oh, THIS is why I feel this way"

**2. The Transition Challenge (Executive Function)**
INTENSE brains struggle with transitions—especially from high-stimulation (screens) to low-stimulation (regular life). This isn''t defiance; their brain needs MORE SUPPORT to shift gears. By offering a dopamine bridge (physical activity, sensory input), you''re giving their brain a stepping stone instead of a cliff.

**3. The Regulation Crisis (Nervous System)**
When their brain is flooded with stress hormones (cortisol, adrenaline), their prefrontal cortex goes OFFLINE. They cannot access logic, empathy, or self-control—these abilities literally disappear during a meltdown. Your calm presence and co-regulation (staying near, narrating, not escalating) helps their nervous system borrow YOUR calm to reset.

**The planning conversation afterward teaches:**
→ **Agency:** "I have some control over what happens"
→ **Predictability:** "I know what''s coming next time"
→ **Self-advocacy:** "I can ask for what my brain needs"

**Research backing:** Studies on reward-processing in kids show that abrupt dopamine drops activate the same brain regions as physical pain. Your child isn''t being dramatic—their brain is genuinely in distress.',

  -- WHAT TO EXPECT (JSON object with timeline keys)
  jsonb_build_object(
    'first_30_seconds', 'They will likely REJECT your narration at first: "I DON''T CARE ABOUT DOPAMINE! I JUST WANT MY TABLET!" This is normal. Their emotional brain is still in control. Stay calm, repeat once: "I know. Your brain is struggling right now, and I''m staying close."',
    'first_5_minutes', 'The meltdown will continue, possibly escalating before it de-escalates. They might scream, cry, throw soft items, say hurtful things. DO NOT take it personally—this is their nervous system in crisis, not an attack on you. Keep breathing, stay present, protect safety.',
    'first_few_times', 'The meltdowns won''t magically disappear. But you''ll notice they''re SHORTER (maybe 30 minutes instead of 60) and slightly less intense. They might pause mid-meltdown when you mention dopamine, even if they don''t fully calm down yet.',
    'first_week', 'After 4-5 screen sessions using this approach, they might start REFERENCING the dopamine crash themselves: "Is this the dopamine thing?" This is HUGE. They''re connecting their feelings to the brain science, which builds self-awareness.',
    'by_week_2', 'They''ll start advocating for parts of the plan: "Can we do the jumping jacks after I turn it off?" They might even suggest modifications: "Can I get a 10-minute warning instead of 5?" This is self-regulation DEVELOPING.',
    'by_week_3', 'The meltdowns reduce in frequency and intensity. Some screen sessions will END without a meltdown at all—especially if you''ve found a good dopamine bridge activity they enjoy. When meltdowns DO happen, they recover faster (15-20 minutes instead of 45).',
    'by_2_months', 'You''ll notice them using the language you taught them: "I think I need to go jump before I get upset" or "This is the dopamine thing, right?" They''re building emotional literacy and self-regulation skills that will serve them for LIFE.',
    'dont_expect', jsonb_build_array(
      'Screen time endings to ever be completely easy. INTENSE brains will always struggle more with transitions than neurotypical brains. But you''re teaching them how to MANAGE the struggle, not eliminate it.',
      'This to work instantly. Brain rewiring takes TIME. Be patient with the process—you''re investing in their long-term emotional regulation, not quick fixes.'
    ),
    'this_is_success', 'Success is NOT "never melts down when screens end." Success is: the meltdowns are shorter, less violent, and they''re learning to IDENTIFY what''s happening in their brain. Success is a 9-year-old who says: "I know I''m going to feel sad when I turn this off, so can we have the plan ready?" That''s emotional intelligence developing in real-time.'
  ),

  -- COMMON VARIATIONS (JSON array of objects with scenario and response)
  '[
    {
      "scenario": "\"They throw/break the device during the meltdown\"",
      "response": "**Stay calm.** Address safety first: \"I see you threw the tablet. I need to keep it safe now.\" Remove it calmly. Do NOT lecture in the moment—this escalates shame and rage.\n\n**After they''re calm (hours later or next day):** \"When your brain has a dopamine crash, it can make your body do things you don''t mean to do. Breaking the tablet means we need a new plan to keep it safe. What should we do differently?\"\n\n**Natural consequence:** If it''s broken, they don''t get screen time until it''s repaired/replaced. But frame it as: \"The tablet needs to be fixed before it can be used\" (neutral fact) not \"You broke it, so you don''t deserve it\" (shame)."
    },
    {
      "scenario": "\"Sibling was watching too, now both are melting down\"",
      "response": "**Triage:** If possible, have another adult/older sibling take one child to a separate space. If you''re alone, address the MOST dysregulated child first:\n\n\"[Child 1], your brain is struggling the most right now. I''m going to help you first, then I''ll help [Child 2].\" To the calmer child: \"I see you''re upset too. I''ll be with you in just a minute. Can you go to [specific place] and I''ll come find you?\"\n\n**After both are calm:** Talk about the dopamine crash affecting BOTH brains. Plan separate dopamine bridge activities if their needs are different."
    },
    {
      "scenario": "\"They had a great day, but still melt down over screens\"",
      "response": "**This is COMMON and can be confusing.** The dopamine crash doesn''t care if they had a good day—it''s a chemical reaction, not an emotional one.\n\n**Narrate this:** \"I know you had a great day today. This meltdown isn''t about your day being bad—it''s just about your brain chemicals changing fast. That can happen even on good days.\"\n\n**Key insight:** The dopamine crash is NEUROCHEMICAL, not emotional. Don''t try to logic them out of it with \"but you had fun today!\""
    },
    {
      "scenario": "\"They refuse the dopamine bridge activity\"",
      "response": "**That''s okay.** Their brain might be too flooded to accept alternatives. Just stay close:\n\n\"I know nothing sounds good right now. I''m going to sit here with you until your brain feels better. You don''t have to do anything.\"\n\n**Your presence alone provides co-regulation.** Don''t take the rejection personally—their brain is just in survival mode."
    },
    {
      "scenario": "\"They bargain: ''Just 5 more minutes! PLEASE!''\"",
      "response": "**Stay firm, but empathetic:** \"I hear you really want more time. Your brain is begging for more dopamine right now. The answer is still no, AND I understand why that feels so hard.\"\n\n**Do NOT negotiate in the moment.** If you give in during a meltdown, you teach their brain: \"Big emotions = I get what I want.\" Instead: \"Let''s talk about screen time rules tomorrow when we''re both calm. Right now, screen time is done.\""
    }
  ]'::jsonb,

  -- PARENT STATE NEEDED
  'This script requires you to be CALM and REGULATED yourself. If you''re already dysregulated (angry, exhausted, touched-out), this will be incredibly hard to execute.

**You need:**
→ **Emotional bandwidth:** This meltdown will last 20-45 minutes. You need to stay present and calm the entire time.
→ **Patience for intensity:** They will say hurtful things, scream, possibly hit. You need to remember: this is their brain in crisis, not a reflection of your parenting.
→ **Ability to not take it personally:** When they scream "I HATE YOU!", your brain needs to translate it to: "My dopamine just crashed and I''m in pain."

**If you''re too depleted:** It''s okay to say: "I''m going to stay in the room, but I need to sit quietly for a minute while you work through this." You don''t have to be PERFECT—just present and safe.

**Self-care reminder:** Screen meltdowns are EXHAUSTING. After it''s over and they''re calm, take 10 minutes for yourself. You just co-regulated a nervous system crisis—that takes enormous energy.',

  -- TAGS
  ARRAY[
    'screen time',
    'dopamine',
    'meltdown',
    'transitions',
    'technology',
    'video games',
    'tablet',
    'emotional regulation',
    'withdrawal',
    'intense',
    'aggression'
  ],

  -- EMERGENCY SUITABLE
  true
);