INSERT INTO public.scripts (
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
  '"You''re so STUPID!" - Child uses hurtful names during power struggles',
  'Social',
  'DEFIANT',
  4,
  10,
  'Hard',
  8,
  E'The word hits you like a slap.\n\n"You''re so STUPID!"\n\nYour child spits it out - jaw clenched, eyes narrowed, fists balled at their sides. Maybe you just said no to a sleepover. Maybe you asked them to turn off the game. Maybe you reminded them about homework for the fourth time.\n\nThe specific trigger almost doesn''t matter. What matters is this:\nYour 7-year-old just looked you dead in the eye and called you stupid. Or "the worst mom ever." Or "I hate you." Or worse.\n\nYour face flushes. Your chest tightens. Part of you wants to yell back. Part of you wants to cry. Part of you thinks: "Where did my sweet kid go?"\n\nThey''re standing there, chin up, defiant - waiting to see what you''ll do next.\nTesting if their words have power over you.',
  E'**First instinct**: Match their energy. "How DARE you talk to me like that!"\n\nYou feel disrespected. You want them to know this is NOT okay. So you raise your voice. You lecture about respect. You demand an apology RIGHT NOW.\n\n**What happens**: They dig in harder. "Well you ARE stupid! You''re MEAN too!"\n\n\n**Second instinct**: Immediate punishment. "That''s it - no screens for a WEEK!"\n\nYou need consequences. They can''t just SAY things like that. So you pull out the big guns. You threaten. You escalate the stakes.\n\n**What happens**: They either explode bigger ("I DON''T CARE! I HATE THIS FAMILY!") or go cold and silent - but nothing is resolved.\n\n\n**Third instinct**: Withdraw emotionally. You go quiet. Give them the cold shoulder. Make them feel your hurt through silence.\n\n**What happens**: They learn that words ARE weapons. That they CAN hurt you. That name-calling works to get a reaction and shift power.\n\n→ Every approach that focuses on the WORDS instead of what''s BEHIND them fails.\n→ When you fight the words, you prove the words have power.\n→ DEFIANT children use verbal attacks to regain control when they feel powerless.',
  '[
    {
      "step_number": 1,
      "step_title": "ABSORB WITHOUT REACTING",
      "step_explanation": "Your first job is to prove the words don''t control you. Take a breath. Keep your face neutral. Don''t flinch, lecture, or defend yourself. The calmer you stay, the less power the insult has.",
      "what_to_say_examples": [
        "Wow. You''re really upset.",
        "That sounded really angry.",
        "You used a big word. You must be feeling something big.",
        "I heard you."
      ]
    },
    {
      "step_number": 2,
      "step_title": "NAME THE REAL EMOTION (NOT THE WORD)",
      "step_explanation": "Behind \"You''re stupid\" is usually frustration, powerlessness, or hurt. Name that instead of addressing the insult. This shows you see THEM, not just their behavior.",
      "what_to_say_examples": [
        "You''re frustrated that I said no.",
        "You wanted that really badly, and you''re mad at me for the answer.",
        "Something about this feels really unfair to you.",
        "You''re trying to hurt me because something is hurting you."
      ]
    },
    {
      "step_number": 3,
      "step_title": "SET THE BOUNDARY WITHOUT ESCALATING",
      "step_explanation": "Calmly state that name-calling won''t change the situation. Not as a punishment threat - just as information. Keep your voice flat and factual.",
      "what_to_say_examples": [
        "Calling me names won''t change my answer. And it won''t make me yell at you either.",
        "You can be mad at me. The answer is still no.",
        "I''m not going to fight about the words. When you''re ready, we can talk about the real problem.",
        "I don''t like being called that. And I''m still here. What do you actually need?"
      ]
    },
    {
      "step_number": 4,
      "step_title": "RECONNECT AFTER THE STORM",
      "step_explanation": "Later - not immediately - circle back. This isn''t about forcing an apology. It''s about understanding what drove them there and teaching better tools.",
      "what_to_say_examples": [
        "Earlier, you called me stupid. I didn''t like it. But I''m more curious about what was happening FOR YOU in that moment.",
        "When you''re really mad at me, you can say: ''I''m SO frustrated with you right now.'' That tells me what you need.",
        "What were you actually trying to tell me when you said that?",
        "I love you even when we fight. And we can find better ways to be mad at each other."
      ]
    }
  ]'::jsonb,
  E'DEFIANT children use name-calling as a **power move**. When they feel controlled, they reach for the sharpest weapon they have: words.\n\nIf you react with anger, you prove the words work.\nIf you collapse emotionally, you prove the words work.\nIf you punish harshly, you start a control war - which they''re wired to fight.\n\nBy staying calm and naming the REAL emotion underneath, you:\n1. Show the words don''t control you (removing their power)\n2. See past the behavior to the child who''s struggling\n3. Model how to handle big feelings without verbal attacks\n4. Keep the relationship intact even during conflict\n\nThe DEFIANT brain is watching: "Can I push you away? Can I make you lose control?"\nWhen your answer is "No, I''m still here and I''m not fighting you" - they lose the game. And eventually, they stop playing it.',
  '{
    "first_30_seconds": "They may escalate or repeat the insult louder, testing if you''ll crack",
    "by_2_minutes": "When you don''t react, they often pause - confused that their weapon didn''t land",
    "by_3_minutes": "The intensity usually drops when they realize you''re not engaging the battle",
    "this_is_success": "They stop using insults to get a rise out of you. When frustrated, they might still say mean things - but less often and with less venom. Eventually: ''I''m SO MAD at you!'' instead of ''I hate you!''",
    "dont_expect": [
      "An immediate apology (forced apologies mean nothing)",
      "Them to suddenly stop feeling angry",
      "Perfect language the next time they''re upset",
      "This to work after just one time - consistency matters"
    ]
  }'::jsonb,
  '[
    {
      "variation_scenario": "If they say \"I HATE YOU\"",
      "variation_response": "I know it feels that way right now. I still love you. And my answer is still no."
    },
    {
      "variation_scenario": "If they escalate to physical aggression",
      "variation_response": "Words are okay even when they''re hard. Hitting isn''t. I''m going to keep us both safe."
    },
    {
      "variation_scenario": "If they say something REALLY hurtful (targeting insecurities)",
      "variation_response": "That one hurt. I''m going to take a minute. (Model healthy boundaries by stepping back briefly)"
    },
    {
      "variation_scenario": "If it happens in public",
      "variation_response": "We''ll talk about this at home. Right now, let''s finish here."
    }
  ]'::jsonb,
  E'Grounded, thick-skinned, curious.\n\nYou''re the adult. Their words can''t actually hurt you unless you let them. This doesn''t mean you''re a doormat - it means you''re unshakeable. Your job isn''t to WIN the argument - it''s to stay connected through it. Think: curious scientist, not wounded target.',
  ARRAY['name-calling', 'verbal-insults', 'power-struggle', 'emotional-regulation', 'defiance', 'respect', 'boundaries'],
  true
);