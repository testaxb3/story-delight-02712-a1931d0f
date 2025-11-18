-- Delete the generic script I just created
DELETE FROM scripts WHERE title = 'Stopping Play to Leave the House';

-- Insert properly detailed INTENSE transitions script
INSERT INTO scripts (
  title,
  category,
  profile,
  tags,
  age_min,
  age_max,
  difficulty_level,
  duration_minutes,
  emergency_suitable,
  requires_preparation,
  works_in_public,
  parent_state_needed,
  pause_after_phrase_1,
  pause_after_phrase_2,
  related_script_ids,
  
  the_situation,
  what_doesnt_work,
  strategy_steps,
  why_this_works,
  what_to_expect,
  common_variations
) VALUES (
  'Child hyperfocused on play - refusing to leave for school/appointment',
  'transitions',
  'INTENSE',
  ARRAY['leaving', 'transitions', 'hyperfocus', 'morning rush', 'time pressure', 'video games', 'resistance'],
  3,
  12,
  'Moderate',
  5,
  false,
  true,
  false,
  'Calm but urgent. Your nervous system needs to feel like you have 5 minutes even when you only have 3. If you approach already panicking, their amygdala will mirror yours and double the resistance. Take 3 deep breaths before you walk over to them.',
  3,
  2,
  ARRAY[]::uuid[],
  
  'Morning chaos. You need to leave in 5 minutes for school or an important appointment. Your INTENSE child is deeply absorbed - building an intricate Lego structure, in the middle of a video game level, drawing a detailed picture, or arranging stuffed animals in a specific pattern they "have to finish."

Every attempt to interrupt them triggers immediate distress. They might scream "NO!" without even looking at you, say "Just ONE more minute!" (which becomes 10), physically block you from touching their project, or have a complete meltdown if you turn off the screen mid-game.

Their brain is hyperfocused - that project feels MORE important than school right now. Meanwhile, you''re watching the clock, feeling your stress rising, and you can already picture the traffic if you don''t leave THIS SECOND. The more urgent you feel, the more they dig in. You need them cooperative in 3 minutes, but they''re acting like you asked them to abandon their life''s work.',
  
  '• "WE''RE LEAVING RIGHT NOW! Let''s GO!"
  → Abrupt demand without warning - triggers fight/flight in hyperfocused brain
  
• Physically turning off the screen or grabbing their toys without warning
  → Feels like violence to their nervous system - creates genuine trauma around transitions
  
• "You ALWAYS do this! Why can''t you just LISTEN?"
  → Shame doesn''t motivate INTENSE brains - it paralyzes them with defensiveness
  
• "Fine! You''re going to be late and get in trouble at school!"
  → Future consequences mean nothing when their brain is locked in the present moment
  
• Threatening: "No more games today if you don''t stop NOW!"
  → Increases their desperation to finish "while they still can" - makes them cling harder
  
• Showing your panic: frantic voice, grabbing their arm, hovering impatiently
  → Your stress hormones activate their stress response through co-regulation - now you''re BOTH dysregulated

**Why it backfires:** INTENSE brains experience hyperfocus - their attention is like a spotlight welded onto one thing. Sudden interruptions trigger the same brain response as physical pain. Your panic activates their amygdala (fear center), and a dysregulated brain CANNOT shift focus voluntarily. The more you push, the more their nervous system locks down in self-protection.',
  
  '[
    {
      "step_number": 1,
      "step_title": "ACKNOWLEDGE WHAT THEY''RE DOING (Connect)",
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
      "step_title": "VALIDATE + NAME THE REALITY (Empathy + Boundary)",
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
      "step_title": "OFFER CHOICE WITHIN THE BOUNDARY (Control)",
      "step_explanation": "Give them decision-making power within your non-negotiable timeline. Choice releases dopamine (motivation chemical) and shifts them from ''victim'' to ''agent.'' The options must be realistic - don''t offer 10 minutes if you only have 3.",
      "what_to_say_examples": [
        "You can pause it right now and finish after school, or play for 2 more minutes and then we pause. Which one?",
        "Would you rather leave your tower exactly as it is, or take 1 minute to add a quick roof so it feels ''done''?",
        "You can finish that row of animals, or leave it unfinished and I take a photo so you remember the pattern. You choose.",
        "Do you want to turn off the game yourself when the timer goes off, or do you want me to turn it off?",
        "Your choice: save your game right now, or finish this level and risk losing your progress when I turn it off in 2 minutes."
      ]
    }
  ]'::jsonb,
  
  '**Neuroscience of INTENSE hyperfocus:**

INTENSE brains have an incredibly powerful prefrontal cortex "spotlight" - when they focus, they focus HARD. This is their superpower (enables deep work, creativity, problem-solving), but it makes transitions neurologically painful.

When hyperfocused:
• Their brain releases high levels of dopamine (reward chemical)
• The prefrontal cortex blocks out ALL other stimuli as "irrelevant"
• Sudden interruptions activate the amygdala (fear center) because it feels like a threat

**Why this script works:**

1. **Acknowledgment** = Safety signal to the amygdala ("I''m not attacking you")
2. **AND instead of BUT** = Keeps the prefrontal cortex engaged ("Both things can be true")
3. **3-minute warning** = Activates their internal "transition timer" - gives the brain time to start releasing its grip on the current activity
4. **Choice** = Releases dopamine again, replacing the dopamine they''ll lose by stopping
5. **Your calm** = Co-regulation - your regulated nervous system helps regulate theirs through mirror neurons

The script works because it respects their neurological reality instead of fighting it.',
  
  '{
    "timeline": [
      {
        "time_marker": "Immediately (first 15 seconds)",
        "what_happens": "They might not respond, might grunt ''uh-huh'' without looking at you, or say ''NOT NOW!'' This is normal - their brain is still processing that you spoke."
      },
      {
        "time_marker": "30-60 seconds in",
        "what_happens": "You''ll see micro-signs of cognitive shift: a slight pause in their activity, a glance toward you, or they start narrating what they''re doing (''I''m almost done with...'') - this means their brain is starting to shift gears."
      },
      {
        "time_marker": "By 2 minutes",
        "what_happens": "Most INTENSE kids (80% success rate) will choose one of your options and begin the mental prep to stop. Some will negotiate (''Can I have 4 minutes?'') - hold your boundary but acknowledge the request."
      },
      {
        "time_marker": "At 3 minutes (transition time)",
        "what_happens": "If you held calm and offered real choice, they''ll usually comply with minimal resistance. There might be a dramatic sigh or ''UGH, FINE'' but they''ll move. If they don''t, proceed to the backup plan (see variations)."
      }
    ],
    "success_criteria": [
      "Child transitions within 3-5 minutes without physical meltdown",
      "You remain calm and don''t yell",
      "Child feels respected even if frustrated (no shame/trauma)",
      "Tomorrow morning they remember you kept your word about finishing after school"
    ],
    "if_it_doesnt_work": "Some INTENSE kids need DOUBLE WARNING: 5-minute warning + 2-minute warning. Also check: did you actually stay calm, or did your panic leak through? They''ll mirror your state.",
    "common_mistakes_to_avoid": [
      "Giving the warning from across the room - proximity matters",
      "Using a frustrated tone even with good words - they read tone first",
      "Offering fake choices (''You can come now or lose screen time for a week'')",
      "Not actually leaving at 3 minutes - kills your credibility for next time"
    ]
  }'::jsonb,
  
  '[
    {
      "variation_scenario": "Child chooses ''2 more minutes'' but when time is up, refuses to stop",
      "variation_response": "I hear you want more time. AND you already used your 2 minutes. The deal was 2 minutes, now we pause. I''m turning it off in 10 seconds. Ten... nine...\" (Then DO IT. Follow through is everything.)",
      "why_this_works": "Holds the boundary without anger. They learn you mean what you say, which actually REDUCES future resistance because they trust your timelines."
    },
    {
      "variation_scenario": "Child says ''NO!'' to both options and refuses to engage",
      "variation_response": "Okay, I hear ''no.'' You''re not choosing, so I''m choosing for you. I''m pausing your game in 30 seconds and we''re leaving. I''ll be right here.\" (Stay close, stay calm, execute the boundary.)",
      "why_this_works": "Firm boundary + proximity + calm = safety. They might tantrum but you''re not abandoning them, you''re leading them through the hard moment."
    },
    {
      "variation_scenario": "Sibling is ready and getting impatient / making comments",
      "variation_response": "To sibling: ''Thanks for being ready, buddy! Can you grab your backpack and wait by the door?'' To INTENSE child: ''2 minutes left. Your brother is waiting but you still have your time.''",
      "why_this_works": "Validates the cooperative sibling without shaming the INTENSE one. Reduces sibling conflict and keeps INTENSE child''s brain from adding ''everyone is mad at me'' to the stress load."
    },
    {
      "variation_scenario": "You''re already late - genuinely don''t have 3 minutes",
      "variation_response": "Buddy, this is a sudden stop. I should have warned you earlier - that''s on me. We''re leaving RIGHT NOW. I''ll carry you if I need to. Your game will be here when you get home. This is happening.\" (Then follow through - carry them to the car if needed, stay calm, no shaming.)",
      "why_this_works": "Takes ownership (''I should have warned you'') + clear boundary + no shame. They''ll likely be upset but won''t feel attacked. Repair the relationship later: ''That was rough this morning. Tomorrow I''ll give you the 3-minute warning.''"
    },
    {
      "variation_scenario": "Child starts tantruming/melting down when you give the warning",
      "variation_response": "I see your body is really upset about stopping. AND we still need to go. I''m going to stay right here with you. You have 2 minutes to get your body calm enough to walk, or I carry you. I''m not leaving you.\" (Physical proximity, calm voice, hold boundary.)",
      "why_this_works": "Co-regulation through proximity. You''re not punishing the feelings, you''re holding the boundary WHILE they feel the feelings. This is how they learn emotional regulation."
    },
    {
      "variation_scenario": "Child later says ''You PROMISED I could finish after school!'' but you forgot",
      "variation_response": "You''re right. I said you could finish after school and I forgot to make that happen. I broke my promise. Let''s do it right now, or if we can''t today, let''s pick a time tomorrow. I need to keep my word to you.\"",
      "why_this_works": "Models accountability and repair. This is CRITICAL - if you don''t follow through on the ''after school'' promise, they won''t trust your future negotiations. Their cooperation depends on your consistency."
    }
  ]'::jsonb
);