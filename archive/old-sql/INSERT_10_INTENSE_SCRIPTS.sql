-- ================================================================
-- 10 INTENSE NEP SCRIPTS
-- High-quality scripts for sensorially sensitive, emotionally intense children
-- Following NEP Framework with ALL Enhanced Fields
-- ================================================================

-- Script 1: Public Meltdown at Store
INSERT INTO scripts (
  title, category, wrong_way,
  phrase_1, phrase_1_action,
  phrase_2, phrase_2_action,
  phrase_3, phrase_3_action,
  neurological_tip, profile, tags,
  situation_trigger, location_type, time_optimal,
  intensity_level, success_speed, parent_state,
  age_min, age_max, backup_plan, common_mistakes,
  pause_after_phrase_1, pause_after_phrase_2,
  expected_time_seconds, difficulty_level,
  requires_preparation, works_in_public, emergency_suitable
) VALUES (
  'Public Store Meltdown', 'Tantrums',
  '"Stop screaming RIGHT NOW! Everyone is staring at us! You''re being so embarrassing!"',
  'I see you''re having big feelings...', 'Kneel to their level. Block your bodies from crowd view. Soft, low voice.',
  'It''s hard when everything feels too much, AND I''m right here with you...', 'Offer hand or gentle touch on shoulder. Stay close. Ignore stares completely.',
  'Squeeze my hands or take some space. You choose what your body needs.', 'Wait. Stay close. If they choose space, stand 2 feet away, calm face.',
  'Your calm body is their anchor when their nervous system is flooded. Ignoring the audience removes shame that intensifies meltdowns. Physical touch option gives sensory regulation for intense kids who need co-regulation.',
  'INTENSE', ARRAY['meltdown', 'public', 'store', 'shopping', 'overwhelm', 'sensory'],
  'When child is screaming/melting down in public store and people are staring',
  ARRAY['public', 'store', 'shopping'], ARRAY['anytime'], 'severe', '2min',
  ARRAY['embarrassed', 'frustrated', 'anxious'], 3, 9,
  'Pick up calmly and carry outside to car. Sit with them. Say nothing until body calms. Then: "That was really hard. Your body had too much."',
  ARRAY['Looking at other shoppers apologetically (teaches: their opinion matters more than your feelings)', 'Saying "you''re fine, stop crying" (invalidates real overwhelm)', 'Promising treats to stop meltdown (teaches: meltdown = reward)', 'Explaining why we need groceries (their brain can''t process logic during meltdown)'],
  4, 3, 120, 'intermediate', false, true, false
);

-- Script 2: Sensory Overload at Restaurant
INSERT INTO scripts (
  title, category, wrong_way,
  phrase_1, phrase_1_action,
  phrase_2, phrase_2_action,
  phrase_3, phrase_3_action,
  neurological_tip, profile, tags,
  situation_trigger, location_type, time_optimal,
  intensity_level, success_speed, parent_state,
  age_min, age_max, backup_plan, common_mistakes,
  pause_after_phrase_1, pause_after_phrase_2,
  expected_time_seconds, difficulty_level,
  requires_preparation, works_in_public, emergency_suitable
) VALUES (
  'Restaurant Sensory Shutdown', 'Emotional_Regulation',
  '"Just TRY to sit still! Other families can do this! Why can''t you just be normal?"',
  'I notice it''s really loud in here...', 'Lean close. Quiet voice. Put your body between them and the noise source.',
  'It''s hard when lights and sounds feel too big, AND we can take a break...', 'Gently touch their arm. Point toward exit/bathroom/quieter spot.',
  'Outside for air or bathroom for quiet. You pick where feels better.', 'Stand up, offer hand. Walk slowly to their chosen spot. Stay with them.',
  'Intense kids'' sensory systems get flooded fast. Acknowledging the real physical discomfort validates their experience. Giving them control over where to regulate prevents full shutdown.',
  'INTENSE', ARRAY['sensory overload', 'restaurant', 'public', 'loud', 'overstimulation'],
  'When child is shutting down at restaurant because it''s too loud/bright/busy',
  ARRAY['public', 'restaurant'], ARRAY['afternoon', 'evening'], 'moderate', '1min',
  ARRAY['frustrated', 'embarrassed', 'exhausted'], 3, 10,
  'Walk outside immediately. Find quiet spot away from people. Sit on ground with them. Wait until breathing slows. Offer to leave restaurant if needed.',
  ARRAY['Forcing them to stay at table "just a little longer" (overload worsens)', 'Offering screen to distract (adds more sensory input when already flooded)', 'Comparing to other kids who can handle it (adds shame to overwhelm)', 'Asking questions while they''re shutting down (can''t process language)'],
  3, 2, 60, 'beginner', false, true, true
);

-- Script 3: Bedtime Big Feelings
INSERT INTO scripts (
  title, category, wrong_way,
  phrase_1, phrase_1_action,
  phrase_2, phrase_2_action,
  phrase_3, phrase_3_action,
  neurological_tip, profile, tags,
  situation_trigger, location_type, time_optimal,
  intensity_level, success_speed, parent_state,
  age_min, age_max, backup_plan, common_mistakes,
  pause_after_phrase_1, pause_after_phrase_2,
  expected_time_seconds, difficulty_level,
  requires_preparation, works_in_public, emergency_suitable
) VALUES (
  'Bedtime Anxiety and Big Feelings', 'Bedtime',
  '"You''re fine! The dark can''t hurt you! Just close your eyes and GO TO SLEEP!"',
  'I see your body feels worried...', 'Sit on edge of bed. Dim light on. Hand on their back or nearby.',
  'It''s hard when your brain won''t settle and everything feels scary, AND I''m staying right here...', 'Slow, deep breaths. Keep hand on their back. Rock gently if they allow it.',
  'Tell me what you need, or I can guess. Squeeze, song, or breathing?', 'Do what they choose. Stay close. Slow everything down. Repeat if needed.',
  'Intense kids'' feelings are genuinely BIG and real, not manipulation. Your physical presence signals safety to their amygdala. Letting them name what helps gives control when they feel powerless.',
  'INTENSE', ARRAY['bedtime', 'anxiety', 'dark', 'scared', 'big feelings', 'connection'],
  'When child can''t settle for bed because of anxiety or big feelings about dark/being alone',
  ARRAY['home', 'bedroom'], ARRAY['evening'], 'moderate', '5min',
  ARRAY['exhausted', 'frustrated', 'calm'], 3, 10,
  'Lie down next to them. Say: "I''m staying until your body feels safe." Don''t talk. Just breathe slow and calm. Stay until they sleep if needed.',
  ARRAY['Leaving room to "teach independence" when they''re genuinely scared (increases anxiety)', 'Saying "there''s nothing to be scared of" (invalidates real fear)', 'Getting frustrated that bedtime is taking too long (they feel your stress)', 'Offering screen/video to calm down (stimulates brain instead of settling)'],
  4, 3, 300, 'intermediate', true, false, false
);

-- Script 4: Morning Emotional Meltdown
INSERT INTO scripts (
  title, category, wrong_way,
  phrase_1, phrase_1_action,
  phrase_2, phrase_2_action,
  phrase_3, phrase_3_action,
  neurological_tip, profile, tags,
  situation_trigger, location_type, time_optimal,
  intensity_level, success_speed, parent_state,
  age_min, age_max, backup_plan, common_mistakes,
  pause_after_phrase_1, pause_after_phrase_2,
  expected_time_seconds, difficulty_level,
  requires_preparation, works_in_public, emergency_suitable
) VALUES (
  'Morning Sensory Overload Meltdown', 'Morning_Routines',
  '"We do this EVERY morning! Just put the clothes on! We''re going to be SO LATE!"',
  'I see everything feels wrong today...', 'Stop rushing. Kneel down. Soft voice. Turn off extra lights/sounds.',
  'It''s hard when your body feels too much and clothes hurt, AND we need clothes for school...', 'Hold up two outfit options. Remove tags if you can. Stay calm and slow.',
  'This soft one or this loose one. Point to the one that feels okay.', 'Help them into chosen outfit. Skip socks if needed. Modify = survival, not failure.',
  'Intense kids'' morning nervous systems are already fragile. Sensory pain from clothes is REAL, not defiance. Slowing down for 60 seconds prevents 20-minute meltdown. Modified outfit beats no outfit.',
  'INTENSE', ARRAY['morning', 'sensory', 'clothes', 'getting dressed', 'overwhelm', 'rush'],
  'When child is melting down in morning because clothes feel wrong and everything is overwhelming',
  ARRAY['home', 'bedroom'], ARRAY['morning'], 'severe', '2min',
  ARRAY['rushed', 'frustrated', 'anxious'], 3, 10,
  'Choose their softest outfit yourself. Remove all tags. Say: "I picked soft clothes. Arms up." Dress them quickly. Get to car. Process feelings later, not during crisis.',
  ARRAY['Forcing the outfit you picked (triggers more overwhelm)', 'Arguing about why they need to get dressed (logic doesn''t work in meltdown)', 'Threatening consequences for being late (adds pressure to overload)', 'Offering 6 outfit choices (too many decisions when already overwhelmed)'],
  3, 2, 120, 'intermediate', false, false, false
);

-- Script 5: Transition Tears from Playground
INSERT INTO scripts (
  title, category, wrong_way,
  phrase_1, phrase_1_action,
  phrase_2, phrase_2_action,
  phrase_3, phrase_3_action,
  neurological_tip, profile, tags,
  situation_trigger, location_type, time_optimal,
  intensity_level, success_speed, parent_state,
  age_min, age_max, backup_plan, common_mistakes,
  pause_after_phrase_1, pause_after_phrase_2,
  expected_time_seconds, difficulty_level,
  requires_preparation, works_in_public, emergency_suitable
) VALUES (
  'Playground Transition Tears', 'Transitions',
  '"Stop crying! We''ll come back tomorrow! You''re making this so hard! Let''s GO!"',
  'I see you''re really sad to leave...', 'Kneel to their level. Acknowledge the tears. Gentle hand on shoulder if they allow.',
  'It''s hard to leave when you''re having so much fun, AND our playground time is done...', 'Stand up slowly. Offer your hand. Point toward exit with calm confidence.',
  'Hold my hand or walk next to me. We''re walking to the car now.', 'Start walking slowly. If no movement in 3 seconds, pick up gently and carry. Stay calm.',
  'Intense kids feel transitions as real grief, not just preference. Acknowledging sadness without negotiating validates feelings while maintaining boundary. Your calm body during their storm = co-regulation.',
  'INTENSE', ARRAY['transition', 'leaving', 'playground', 'park', 'crying', 'cooperation'],
  'When child is already crying about leaving playground and you need to go',
  ARRAY['public', 'park', 'playground'], ARRAY['afternoon', 'evening', 'anytime'], 'moderate', '1min',
  ARRAY['rushed', 'embarrassed', 'frustrated'], 2, 8,
  'Pick up calmly and carry to car even if crying. Buckle in. Say: "I know that was really hard. We can be sad together." Let them cry. Drive home.',
  ARRAY['Promising "just 5 more minutes" when you don''t mean it (teaches: parent doesn''t follow through)', 'Explaining all the reasons you have to leave (engages argument brain)', 'Getting angry at the tears (adds shame to sadness)', 'Bribing with treats to stop crying (teaches: big feelings = rewards)'],
  3, 2, 60, 'beginner', false, true, true
);

-- Script 6: Sibling Conflict Explosion
INSERT INTO scripts (
  title, category, wrong_way,
  phrase_1, phrase_1_action,
  phrase_2, phrase_2_action,
  phrase_3, phrase_3_action,
  neurological_tip, profile, tags,
  situation_trigger, location_type, time_optimal,
  intensity_level, success_speed, parent_state,
  age_min, age_max, backup_plan, common_mistakes,
  pause_after_phrase_1, pause_after_phrase_2,
  expected_time_seconds, difficulty_level,
  requires_preparation, works_in_public, emergency_suitable
) VALUES (
  'Sibling Hit During Anger Explosion', 'Social',
  '"We do NOT hit in this house! Say sorry RIGHT NOW! Go to your room!"',
  'I see you hit your brother...', 'Firm voice. Move between children. Put hand up as physical boundary.',
  'It''s hard when anger feels so big you lose control, AND hitting hurts and isn''t safe...', 'Move sibling to safety. Turn back to intense child. Lower voice. Slow down.',
  'Different room or calm corner. Your body needs space to settle. I''m coming with you.', 'Walk with them to separate space. Don''t discuss yet. Just sit nearby until breathing slows.',
  'Intense kids'' anger is neurologically overwhelming, not malicious. Separation is for safety AND regulation, not punishment. Staying with them during cooldown = co-regulation. Repair happens AFTER nervous system calms.',
  'INTENSE', ARRAY['hitting', 'sibling conflict', 'anger', 'aggression', 'big feelings'],
  'When intense child hit sibling during emotional explosion and you''re frustrated',
  ARRAY['home'], ARRAY['anytime'], 'severe', '3min',
  ARRAY['angry', 'frustrated', 'disappointed'], 4, 10,
  'Physically separate immediately. Say: "I''m keeping everyone safe. You need space." Take them to different room. Sit with them. Wait for calm. Other parent comforts sibling if possible.',
  ARRAY['Forcing apology while they''re still escalated (insincere and ineffective)', 'Sending to room alone as punishment (they need co-regulation, not isolation)', 'Lecturing about hitting while they''re still activated (can''t process)', 'Asking "why did you do that?" during meltdown (engages argument brain)'],
  4, 3, 180, 'advanced', false, false, false
);

-- Script 7: Food Texture Refusal
INSERT INTO scripts (
  title, category, wrong_way,
  phrase_1, phrase_1_action,
  phrase_2, phrase_2_action,
  phrase_3, phrase_3_action,
  neurological_tip, profile, tags,
  situation_trigger, location_type, time_optimal,
  intensity_level, success_speed, parent_state,
  age_min, age_max, backup_plan, common_mistakes,
  pause_after_phrase_1, pause_after_phrase_2,
  expected_time_seconds, difficulty_level,
  requires_preparation, works_in_public, emergency_suitable
) VALUES (
  'Mealtime Sensory Texture Battle', 'Mealtime',
  '"This is what we''re eating! I''m not making separate meals! Just TRY one bite!"',
  'I see that texture doesn''t work for you...', 'Stay seated. Calm face. Don''t push plate closer. Acknowledge the real discomfort.',
  'It''s hard when food feels wrong in your mouth, AND your body needs fuel tonight...', 'Point to one safe food on table. Keep voice matter-of-fact, not pleading.',
  'Eat what your body can handle. Bread, yogurt, or fruit. You choose one.', 'Put chosen safe food in front of them. Let them eat it. End of negotiation.',
  'Sensory texture aversion is neurological, not defiance. Fighting it creates food anxiety. One safe food = enough nutrition for tonight. Battle-free meals = long-term healthy relationship with food.',
  'INTENSE', ARRAY['mealtime', 'picky eating', 'sensory', 'food refusal', 'texture'],
  'When child refuses dinner because of texture issues and mealtime is becoming a battle',
  ARRAY['home'], ARRAY['evening', 'anytime'], 'moderate', '1min',
  ARRAY['frustrated', 'exhausted', 'feeling guilty'], 3, 10,
  'Say: "Your body knows what it needs. Eat what you can." Offer plain pasta, bread, or cheese. Let them eat safe food. Don''t discuss nutrition. Survival meal is success.',
  ARRAY['Forcing "one bite" of the refused food (increases food anxiety long-term)', 'Making them sit until they eat it (creates power struggle)', 'Explaining nutrition while they''re distressed (logic doesn''t work)', 'Feeling like failure as parent (you''re preventing trauma, not giving in)'],
  3, 2, 60, 'beginner', true, false, false
);

-- Script 8: Bath Time Sensory Battle
INSERT INTO scripts (
  title, category, wrong_way,
  phrase_1, phrase_1_action,
  phrase_2, phrase_2_action,
  phrase_3, phrase_3_action,
  neurological_tip, profile, tags,
  situation_trigger, location_type, time_optimal,
  intensity_level, success_speed, parent_state,
  age_min, age_max, backup_plan, common_mistakes,
  pause_after_phrase_1, pause_after_phrase_2,
  expected_time_seconds, difficulty_level,
  requires_preparation, works_in_public, emergency_suitable
) VALUES (
  'Bath Time Sensory Shutdown', 'Hygiene',
  '"Bath time is NOT optional! You''re dirty and you NEED a bath! Get in NOW!"',
  'I see bath time feels bad tonight...', 'Stop forcing. Turn off rushing energy. Sit on bathroom floor at their level.',
  'It''s hard when water and towels feel wrong on your skin, AND bodies need washing...', 'Offer washcloth. Show warm water temperature on your hand. Stay slow and calm.',
  'Quick washcloth bath or super fast shower. You pick how we get clean.', 'Let them choose. If washcloth: they wash face/hands/private areas, done. If shower: 2 minutes max.',
  'Evening sensory tolerance is already depleted for intense kids. Full bath isn''t worth the trauma. Washcloth bath = clean enough. Modifying expectations = meeting their nervous system where it is.',
  'INTENSE', ARRAY['bath', 'hygiene', 'sensory', 'evening routine', 'washing'],
  'When child is fighting bath time because of sensory issues with water or towels',
  ARRAY['home', 'bathroom'], ARRAY['evening'], 'moderate', '2min',
  ARRAY['exhausted', 'frustrated', 'rushed'], 3, 10,
  'Skip bath entirely tonight. Say: "Bodies can skip one night. Washcloth on face and hands." Quick wipe down. Put on pajamas. Preserve bedtime peace over perfect hygiene.',
  ARRAY['Forcing full bath "because they need it" (creates bath trauma)', 'Fighting about hair washing when they''re already overwhelmed (pick your battles)', 'Using cold water as "consequence" for fighting (cruel and increases fear)', 'Rushing them through it while they''re distressed (confirms bath = bad)'],
  3, 2, 120, 'beginner', false, false, false
);

-- Script 9: Homework Overwhelm Shutdown
INSERT INTO scripts (
  title, category, wrong_way,
  phrase_1, phrase_1_action,
  phrase_2, phrase_2_action,
  phrase_3, phrase_3_action,
  neurological_tip, profile, tags,
  situation_trigger, location_type, time_optimal,
  intensity_level, success_speed, parent_state,
  age_min, age_max, backup_plan, common_mistakes,
  pause_after_phrase_1, pause_after_phrase_2,
  expected_time_seconds, difficulty_level,
  requires_preparation, works_in_public, emergency_suitable
) VALUES (
  'Homework Emotional Shutdown', 'Problem_Solving',
  '"It''s only 10 problems! Just START! Other kids can do this! Why is this so hard for you?"',
  'I see this feels too big...', 'Sit next to them. Close extra worksheets. Remove visual overwhelm. Soft voice.',
  'It''s hard when work feels impossible and your brain shuts down, AND we can make it smaller...', 'Cover all problems except one. Point to single problem. Stay calm and close.',
  'Just this one problem. Then break. Show me you can do one.', 'Wait. Don''t help yet. If they try: celebrate. If frozen: do first one together, they do second.',
  'Intense kids'' emotional flooding blocks executive function. They CAN''T, not WON''T. Breaking into one tiny piece restarts frozen brain. Success on one = momentum. Forcing through shutdown = learned helplessness.',
  'INTENSE', ARRAY['homework', 'overwhelm', 'shutdown', 'school', 'executive function'],
  'When child is shutting down over homework because task feels too overwhelming',
  ARRAY['home'], ARRAY['afternoon', 'evening'], 'severe', '3min',
  ARRAY['frustrated', 'exhausted', 'losing patience'], 5, 12,
  'Close the homework. Say: "Your brain is done for tonight. Let''s write a note to teacher." Write: "[Child] was overwhelmed tonight. We completed X problems. Will try again tomorrow." Protect their mental health over completion.',
  ARRAY['Saying "it''s easy, just do it" (minimizes real struggle)', 'Sitting there until it''s done (creates homework trauma)', 'Doing the work for them (doesn''t help long-term)', 'Comparing to siblings or classmates (adds shame to overwhelm)'],
  4, 3, 180, 'intermediate', true, false, false
);

-- Script 10: Car Seat Sensory Fight
INSERT INTO scripts (
  title, category, wrong_way,
  phrase_1, phrase_1_action,
  phrase_2, phrase_2_action,
  phrase_3, phrase_3_action,
  neurological_tip, profile, tags,
  situation_trigger, location_type, time_optimal,
  intensity_level, success_speed, parent_state,
  age_min, age_max, backup_plan, common_mistakes,
  pause_after_phrase_1, pause_after_phrase_2,
  expected_time_seconds, difficulty_level,
  requires_preparation, works_in_public, emergency_suitable
) VALUES (
  'Car Seat Strap Sensory Meltdown', 'Transitions',
  '"The straps don''t hurt! Just GET IN! We''re already late! Stop making this difficult!"',
  'I see the straps feel bad...', 'Stop forcing. Take breath. Acknowledge the real physical discomfort they feel.',
  'It''s hard when straps feel too tight and wrong, AND car seats keep you safe...', 'Loosen straps slightly. Show them it''s looser. Put soft cloth on chest clip if you have one.',
  'Get in now with loose straps, or I lift you in. We''re leaving in 10 seconds.', 'Count slowly. If no movement by 10, lift them in calmly. Buckle while staying calm. Drive.',
  'Sensory sensitivity to car seat pressure is REAL for intense kids. Acknowledging it validates, loosening straps helps, but boundary stays firm: we''re going. Your calm during their resistance = safety.',
  'INTENSE', ARRAY['car seat', 'sensory', 'straps', 'transition', 'leaving', 'cooperation'],
  'When child is fighting car seat because straps hurt and you''re already running late',
  ARRAY['car', 'parking lot', 'public'], ARRAY['morning', 'anytime'], 'severe', '1min',
  ARRAY['rushed', 'frustrated', 'angry'], 3, 7,
  'Lift them into seat. Buckle quickly. If screaming: say nothing. Drive. Let them be upset. Arrive at destination. Then: "That was really hard. The straps feel bad and we still have to use them."',
  ARRAY['Arguing that straps don''t hurt (invalidates their real sensory experience)', 'Tightening straps "properly" while they''re melting down (increases overwhelm)', 'Threatening to leave them home (empty threat, illegal)', 'Apologizing repeatedly while still forcing (mixed message)'],
  3, 2, 60, 'beginner', false, true, true
);

-- ================================================================
-- VERIFICATION QUERY
-- ================================================================
-- Run this after inserting to verify:
--
-- SELECT COUNT(*) as total, profile
-- FROM scripts
-- WHERE profile = 'INTENSE'
-- GROUP BY profile;
--
-- Expected result: INTENSE | 10
--
-- View details:
-- SELECT title, situation_trigger, emergency_suitable, expected_time_seconds
-- FROM scripts
-- WHERE profile = 'INTENSE'
-- ORDER BY title;
