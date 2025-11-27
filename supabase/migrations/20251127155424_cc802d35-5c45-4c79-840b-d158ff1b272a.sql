
INSERT INTO scripts (
  title, category, profile, age_min, age_max, difficulty, duration_minutes,
  the_situation, what_doesnt_work, strategy_steps, why_this_works,
  what_to_expect, common_variations, parent_state_needed, tags, emergency_suitable
) VALUES (
  'Screams ''I HATE YOU'' at full volume in restaurant after being told to stop throwing food',
  'Public Behavior',
  'DEFIANT',
  4, 10,
  'Hard',
  10,
  
  E'Table 12 at Olive Garden. 6:34 PM on a Saturday.\n\nThe breadstick piece just sailed past the booth behind you. Again. Your 6-year-old is grinning - that specific grin that says "What are you gonna do about it?"\n\n"Stop throwing food. Now."\n\nTheir face transforms. The grin vanishes. They stand up on the booth seat.\n\n"I HATE YOU!"\n\nEvery head in the restaurant turns. The elderly couple two tables over. The server mid-pour. A toddler in a highchair staring with wide eyes.\n\n"I HATE YOU AND YOU''RE THE WORST MOM EVER!"\n\nYour face is burning. Your partner is frozen. Your other kid has slid so far down in the booth they''re practically under the table.\n\nThe server is pretending to be very busy with menus. You can FEEL the judgment. Someone just whispered something to their dining companion.',
  
  E'**❌ COMMON MISTAKE #1: The Public Shutdown**\n\n"Stop it RIGHT NOW or we''re leaving!" (Hissed through clenched teeth)\n\nThey don''t care about leaving. They care about winning. You just gave them more ammunition AND an audience for the parking lot tantrum that''s coming.\n\n\n**❌ COMMON MISTAKE #2: The Embarrassment Leverage**\n\n"Everyone is watching. Is this how you want people to see you?"\n\nDEFIANT children often WANT the audience. You just told them their tactic is working. Also: shame escalates defiance, it doesn''t reduce it.\n\n\n**❌ COMMON MISTAKE #3: The Bribe**\n\n"If you stop, you can have dessert..."\n\nYou just taught them that public meltdowns = rewards. Next restaurant visit will be worse. They''re not stupid - they''re strategic.',
  
  '[
    {
      "step_number": 1,
      "step_title": "Shrink the World",
      "step_explanation": "Your child is feeding off the public energy. Your job is to make the audience disappear - for BOTH of you. Move physically closer. Lower your body. Block sightlines with your back. Your calm face becomes their whole world. Don''t address the volume or the words yet.",
      "what_to_say_examples": [
        "(Moving close, blocking view of other tables) Hey. I''m right here.",
        "(Quietly, face neutral) I can see you. Just you and me right now.",
        "(Sitting down at their level) I''m not going anywhere."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Name It Without Judgment",
      "step_explanation": "''I hate you'' is not a statement of fact. It''s an expression of overwhelming frustration at being controlled. Don''t argue with it or punish it - translate it. When you translate accurately, they feel understood instead of attacked.",
      "what_to_say_examples": [
        "You''re really mad that I stopped your game.",
        "Sounds like you feel like I''m ruining your fun.",
        "Being told ''no'' in front of everyone feels really bad."
      ]
    },
    {
      "step_number": 3,
      "step_title": "Set the Boundary WITH Them",
      "step_explanation": "Now that they''re not performing for the crowd, offer a choice that preserves their dignity. The boundary (no throwing food) stays. But HOW they comply becomes their choice. This isn''t negotiating the rule - it''s negotiating the execution.",
      "what_to_say_examples": [
        "The food stays on plates. That''s not changing. What CAN change is what we do next - stay and eat together, or take a walk outside until you''re ready.",
        "I''m not going to yell back at you. When you''re ready to sit down, I''m here.",
        "You don''t have to like the rule. You do have to follow it. Would it help to take a break outside first?"
      ]
    }
  ]',
  
  E'Public meltdowns activate your **social threat system** - the part of your brain that monitors for rejection and judgment. Your stress hormones spike, which your child READS and FEEDS on.\n\nDEFIANT children have heightened sensitivity to **dominance hierarchies**. In public, they perceive your corrections as attempts to establish dominance in front of witnesses. Their counter is to **flip the hierarchy** by making YOU look helpless.\n\nWhen you shrink the world and stay calm, you remove the audience reward. The defiance loses its strategic value. Their prefrontal cortex can re-engage because the "battle" has been de-escalated to a "conversation."\n\nResearch on public tantrums shows that **parental regulation predicts child regulation**. Your calm literally teaches their nervous system how to calm.',
  
  '{
    "first_30_seconds": "They may escalate briefly - louder, meaner words. This is testing if you''ll break. Keep your body language soft. The volume usually peaks then starts decreasing when they realize the audience isn''t getting the reaction they expected from you.",
    "by_2_minutes": "The screaming typically shifts to angry muttering or crying. ''You never let me do anything.'' This is actually progress - they''re processing instead of performing.",
    "this_is_success": "Success is NOT a smiling child who apologizes. Success is returning to some version of the meal OR successfully leaving without physical force. They might be sulky for an hour. That''s fine. The boundary held without warfare.",
    "dont_expect": [
      "An apology (especially not a public one)",
      "Other diners giving you approving looks",
      "Your child suddenly becoming pleasant",
      "The rest of the meal being enjoyable"
    ]
  }',
  
  '[
    {
      "variation_scenario": "They try to run away in the restaurant",
      "variation_response": "Don''t chase publicly. Stand up calmly, collect your things, tell your partner ''I''ve got this.'' Follow at walking pace. They want a chase scene - don''t give it to them. Most kids stop when the chase doesn''t happen."
    },
    {
      "variation_scenario": "A stranger intervenes: ''Maybe if you disciplined them more...''",
      "variation_response": "Brief eye contact, neutral tone: ''Thank you, we''re fine.'' Return attention to your child. Do not defend, explain, or engage. The stranger is not your audience."
    },
    {
      "variation_scenario": "They start crying loudly after the screaming stops",
      "variation_response": "This is regulation, not manipulation. ''It''s okay to cry. That was really hard.'' Don''t rush them to stop. The tears are actually the nervous system releasing the stress chemicals."
    }
  ]',
  
  'Radical indifference to judgment. You need to genuinely not care what other diners think for the next 10 minutes. Your job is your child, not your reputation. Take 3 deep breaths before approaching them.',
  
  ARRAY['public', 'restaurant', 'defiance', 'meltdown', 'embarrassment', 'boundaries', 'yelling', 'food-throwing'],
  true
);
