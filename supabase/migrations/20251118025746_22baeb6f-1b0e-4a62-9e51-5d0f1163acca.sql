-- Update the script with correct field structure
UPDATE scripts 
SET 
  what_to_expect = '{
    "first_30_seconds": "They might not respond, might grunt ''uh-huh'' without looking at you, or say ''NOT NOW!'' This is normal - their brain is still processing that you spoke.",
    "by_90_seconds": "You''ll see micro-signs of cognitive shift: a slight pause in their activity, a glance toward you, or they start narrating what they''re doing (''I''m almost done with...'') - this means their brain is starting to shift gears.",
    "by_2_minutes": "Most INTENSE kids (80% success rate) will choose one of your options and begin the mental prep to stop. Some will negotiate (''Can I have 4 minutes?'') - hold your boundary but acknowledge the request.",
    "by_3_minutes": "If you held calm and offered real choice, they''ll usually comply with minimal resistance. There might be a dramatic sigh or ''UGH, FINE'' but they''ll move. If they don''t, proceed to the backup plan (see variations).",
    "dont_expect": [
      "Instant compliance - their brain needs transition time",
      "Cheerful cooperation - they can comply while still being frustrated",
      "Perfect timing every day - some days they need an extra minute",
      "No pushback ever - INTENSE kids will always advocate for what they want"
    ],
    "this_is_success": "Child transitions within 3-5 minutes without physical meltdown. You remain calm and don''t yell. Child feels respected even if frustrated (no shame/trauma). Tomorrow morning they remember you kept your word about finishing after school."
  }'::jsonb,
  
  common_variations = '[
    {
      "variation_scenario": "Child chooses ''2 more minutes'' but when time is up, refuses to stop",
      "variation_response": "I hear you want more time. AND you already used your 2 minutes. The deal was 2 minutes, now we pause. I''m turning it off in 10 seconds. Ten... nine... (Then DO IT. Follow through is everything.)",
      "why_this_works": "Holds the boundary without anger. They learn you mean what you say, which actually REDUCES future resistance because they trust your timelines."
    },
    {
      "variation_scenario": "Child says ''NO!'' to both options and refuses to engage",
      "variation_response": "Okay, I hear ''no.'' You''re not choosing, so I''m choosing for you. I''m pausing your game in 30 seconds and we''re leaving. I''ll be right here. (Stay close, stay calm, execute the boundary.)",
      "why_this_works": "Firm boundary + proximity + calm = safety. They might tantrum but you''re not abandoning them, you''re leading them through the hard moment."
    },
    {
      "variation_scenario": "Sibling is ready and getting impatient / making comments",
      "variation_response": "To sibling: ''Thanks for being ready, buddy! Can you grab your backpack and wait by the door?'' To INTENSE child: ''2 minutes left. Your brother is waiting but you still have your time.''",
      "why_this_works": "Validates the cooperative sibling without shaming the INTENSE one. Reduces sibling conflict and keeps INTENSE child''s brain from adding ''everyone is mad at me'' to the stress load."
    },
    {
      "variation_scenario": "You''re already late - genuinely don''t have 3 minutes",
      "variation_response": "Buddy, this is a sudden stop. I should have warned you earlier - that''s on me. We''re leaving RIGHT NOW. I''ll carry you if I need to. Your game will be here when you get home. This is happening. (Then follow through - carry them to the car if needed, stay calm, no shaming.)",
      "why_this_works": "Takes ownership (''I should have warned you'') + clear boundary + no shame. They''ll likely be upset but won''t feel attacked. Repair the relationship later: ''That was rough this morning. Tomorrow I''ll give you the 3-minute warning.''"
    },
    {
      "variation_scenario": "Child starts tantruming/melting down when you give the warning",
      "variation_response": "I see your body is really upset about stopping. AND we still need to go. I''m going to stay right here with you. You have 2 minutes to get your body calm enough to walk, or I carry you. I''m not leaving you. (Physical proximity, calm voice, hold boundary.)",
      "why_this_works": "Co-regulation through proximity. You''re not punishing the feelings, you''re holding the boundary WHILE they feel the feelings. This is how they learn emotional regulation."
    },
    {
      "variation_scenario": "Child later says ''You PROMISED I could finish after school!'' but you forgot",
      "variation_response": "You''re right. I said you could finish after school and I forgot to make that happen. I broke my promise. Let''s do it right now, or if we can''t today, let''s pick a time tomorrow. I need to keep my word to you.",
      "why_this_works": "Models accountability and repair. This is CRITICAL - if you don''t follow through on the ''after school'' promise, they won''t trust your future negotiations. Their cooperation depends on your consistency."
    }
  ]'::jsonb,
  
  strategy_steps = '[
    {
      "step_number": 1,
      "step_title": "ACKNOWLEDGE WHAT THEY''RE DOING",
      "step_explanation": "Get physically close, get down to their eye level, and NAME what they''re absorbed in without judgment or urgency. This tells their brain: ''I see you. You''re not in trouble.'' The acknowledgment creates a tiny space for their prefrontal cortex to come back online.",
      "what_to_say_examples": [
        "Whoa. That tower is getting really tall.",
        "I see you''re right in the middle of that level.",
        "You''re working so hard on that drawing.",
        "Those animals are in a really specific order, huh?",
        "That looks important to you right now."
      ]
    },
    {
      "step_number": 2,
      "step_title": "VALIDATE + NAME THE REALITY",
      "step_explanation": "Use the magic word AND instead of BUT. Validate how hard it is to stop something engaging, AND introduce the time boundary. The AND keeps their brain open - BUT would trigger defensiveness. Stay calm and firm, not rushed.",
      "what_to_say_examples": [
        "It''s really hard to stop a game before it''s done, AND we need to leave in 3 minutes.",
        "I know you want to finish that, AND the car leaves in 3 minutes.",
        "Your brain wants to keep building, AND it''s time to pause for school.",
        "Stopping mid-project feels impossible, AND we have to go in 3 minutes.",
        "I can see you''re not ready to stop, AND the timer says 3 minutes until we go."
      ]
    },
    {
      "step_number": 3,
      "step_title": "OFFER CHOICE WITHIN THE BOUNDARY",
      "step_explanation": "Give them decision-making power within your non-negotiable timeline. Choice releases dopamine (motivation chemical) and shifts them from ''victim'' to ''agent.'' The options must be realistic - don''t offer 10 minutes if you only have 3.",
      "what_to_say_examples": [
        "You can pause it right now and finish after school, or play for 2 more minutes and then we pause. Which one?",
        "Would you rather leave your tower exactly as it is, or take 1 minute to add a quick roof so it feels ''done''?",
        "You can finish that row of animals, or leave it unfinished and I take a photo so you remember the pattern. You choose.",
        "Do you want to turn off the game yourself when the timer goes off, or do you want me to turn it off?",
        "Your choice: save your game right now, or finish this level and risk losing your progress when I turn it off in 2 minutes."
      ]
    }
  ]'::jsonb

WHERE title = 'Child hyperfocused on play - refusing to leave for school/appointment'
  AND category = 'transitions'
  AND profile = 'INTENSE';