-- Add seed comment support columns to post_comments
ALTER TABLE post_comments 
  ADD COLUMN IF NOT EXISTS author_name text,
  ADD COLUMN IF NOT EXISTS author_photo_url text,
  ADD COLUMN IF NOT EXISTS is_seed boolean DEFAULT false;

-- Allow user_id to be NULL for seed comments
ALTER TABLE post_comments 
  ALTER COLUMN user_id DROP NOT NULL;

-- Insert 60 contextual comments for DEFIANT community posts
INSERT INTO post_comments (post_id, user_id, content, author_name, author_photo_url, is_seed, created_at) VALUES

-- Post 1: Dennis Price - shoes negotiation (ff9daa43)
('ff9daa43-227c-4731-ade5-9fe0c08de72f', NULL, 'The shoes thing!! My daughter literally hid hers under the couch yesterday to avoid putting them on. Have you tried giving a 2-minute warning before you need to leave?', 'Lisa Morgan', 'https://randomuser.me/api/portraits/women/41.jpg', true, '2025-11-24 10:30:00'),
('ff9daa43-227c-4731-ade5-9fe0c08de72f', NULL, '30 minutes is generous - we hit 45 on Monday 😅 What finally worked was letting him pick which shoes. Tiny control, big difference', 'Robert Chen', 'https://randomuser.me/api/portraits/men/22.jpg', true, '2025-11-24 11:15:00'),

-- Post 2: Patricia Walsh - said okay (fba8d948)
('fba8d948-5d03-47c5-b37e-ca3685788bea', NULL, 'Wait which script exactly? I need this! My son''s "NO" is basically his catchphrase at this point', 'Michael Torres', 'https://randomuser.me/api/portraits/men/55.jpg', true, '2025-11-24 09:45:00'),
('fba8d948-5d03-47c5-b37e-ca3685788bea', NULL, 'THE VALIDATION APPROACH 🙌 Same thing happened here after about 2 weeks. Feels weird at first but it actually works!', 'Sarah Kim', 'https://randomuser.me/api/portraits/women/33.jpg', true, '2025-11-24 14:20:00'),

-- Post 3: Jeffrey Long - TWO choices (05650fe1)
('05650fe1-db8e-43a1-9499-0d4a31078652', NULL, 'This is genius! So simple but I never thought of it. Do you make sure both options are truly acceptable to you first?', 'Amanda White', 'https://randomuser.me/api/portraits/women/28.jpg', true, '2025-11-23 18:30:00'),
('05650fe1-db8e-43a1-9499-0d4a31078652', NULL, 'The two choices thing saved our mornings. "Red shirt or blue shirt?" instead of "get dressed NOW" changes everything', 'David Lee', 'https://randomuser.me/api/portraits/men/41.jpg', true, '2025-11-23 19:45:00'),

-- Post 4: Kathleen Ward - refuses ANYTHING (c65f92b8)
('c65f92b8-5c1f-4749-a254-41c820111004', NULL, 'Same boat. The constant refusal is EXHAUSTING. Have you found any scripts that work specifically for this?', 'Jennifer Hall', 'https://randomuser.me/api/portraits/women/55.jpg', true, '2025-11-23 08:15:00'),
('c65f92b8-5c1f-4749-a254-41c820111004', NULL, 'Check out the validation scripts. They helped us when my daughter was refusing everything, even fun stuff', 'Chris Anderson', 'https://randomuser.me/api/portraits/men/32.jpg', true, '2025-11-23 09:30:00'),

-- Post 5: Janet Coleman - default NO (89336036)
('89336036-a630-408a-95a6-365c514484c6', NULL, 'Mine does this too! She says no before her brain even processes what I said. So frustrating', 'Rachel Green', 'https://randomuser.me/api/portraits/women/44.jpg', true, '2025-11-22 21:30:00'),
('89336036-a630-408a-95a6-365c514484c6', NULL, 'I started giving her 5 seconds to change her answer and it helped. Like "that''s your first answer, think about it for 5 seconds"', 'Mark Wilson', 'https://randomuser.me/api/portraits/men/67.jpg', true, '2025-11-22 22:15:00'),
('89336036-a630-408a-95a6-365c514484c6', NULL, 'The automatic NO is their brain''s defense mechanism. Validating the feeling first before asking again works better', 'Emily Davis', 'https://randomuser.me/api/portraits/women/36.jpg', true, '2025-11-23 07:45:00'),

-- Post 6: Kevin Reynolds - dinner success (09e8fcf4)
('09e8fcf4-370d-4c90-98d9-b8cd6978d0c8', NULL, 'YES! Choices are magic. "Do you want peas or carrots?" instead of "eat your vegetables" is a game changer', 'Nicole Brown', 'https://randomuser.me/api/portraits/women/52.jpg', true, '2025-11-22 16:20:00'),
('09e8fcf4-370d-4c90-98d9-b8cd6978d0c8', NULL, 'What other choices do you give at dinner? I need more ideas because the power struggles are killing me', 'James Miller', 'https://randomuser.me/api/portraits/men/48.jpg', true, '2025-11-22 17:50:00'),

-- Post 7: Teresa Russell - Because I said so (edc680c6)
('edc680c6-20a6-4309-8d6a-b9b45bd81988', NULL, 'I still catch myself saying it sometimes and immediately regret it. What do you say instead?', 'Michelle Taylor', 'https://randomuser.me/api/portraits/women/39.jpg', true, '2025-11-21 15:30:00'),
('edc680c6-20a6-4309-8d6a-b9b45bd81988', NULL, 'This is so true. That phrase just makes them dig in harder. Validation + explanation works way better', 'Daniel Garcia', 'https://randomuser.me/api/portraits/men/58.jpg', true, '2025-11-21 16:45:00'),

-- Post 8: Timothy Peterson - I hate you (e46f8769)
('e46f8769-e29d-4750-a0e7-6f21de5dfa08', NULL, 'The "I hate you" cuts deep every time even though I know they don''t mean it. Staying calm is SO hard', 'Laura Martinez', 'https://randomuser.me/api/portraits/women/62.jpg', true, '2025-11-21 20:15:00'),
('e46f8769-e29d-4750-a0e7-6f21de5dfa08', NULL, 'I respond with "I hear that you''re upset. I still love you" and walk away. It defuses it faster than arguing', 'Ryan Johnson', 'https://randomuser.me/api/portraits/men/45.jpg', true, '2025-11-22 08:30:00'),

-- Post 9: Ronald Murphy - eye rolls at 6 (4b9a2f6b)
('4b9a2f6b-841d-4d32-99e2-72cc09f9e517', NULL, 'My 5yo does this!! The attitude is unreal. Where do they even learn it??', 'Stephanie Clark', 'https://randomuser.me/api/portraits/women/28.jpg', true, '2025-11-20 14:20:00'),
('4b9a2f6b-841d-4d32-99e2-72cc09f9e517', NULL, 'The door slamming started here at 6 too. I feel you. Is this the new normal?', 'Andrew Lewis', 'https://randomuser.me/api/portraits/men/34.jpg', true, '2025-11-20 15:45:00'),
('4b9a2f6b-841d-4d32-99e2-72cc09f9e517', NULL, 'Totally normal for defiant kids. They''re testing boundaries hard. Stay consistent!', 'Karen Robinson', 'https://randomuser.me/api/portraits/women/51.jpg', true, '2025-11-20 18:30:00'),

-- Post 10: Diane Mitchell - daughter apologized (641ba0e8)
('641ba0e8-50ab-4d8b-b629-da8fa9b9f8b5', NULL, 'Wow that''s huge! What script did you use for the repair conversation?', 'Thomas Walker', 'https://randomuser.me/api/portraits/men/63.jpg', true, '2025-11-20 10:30:00'),
('641ba0e8-50ab-4d8b-b629-da8fa9b9f8b5', NULL, 'The apology is such a big milestone! How long after the meltdown did you wait to talk about it?', 'Patricia Young', 'https://randomuser.me/api/portraits/women/47.jpg', true, '2025-11-20 12:15:00'),

-- Post 11: Steven Howard - whisper technique (d923d0cb)
('d923d0cb-17e4-4a31-bc76-268e54913aca', NULL, 'This actually works! It confuses them enough to stop and listen. Game changer', 'Betty Allen', 'https://randomuser.me/api/portraits/women/68.jpg', true, '2025-11-19 17:30:00'),
('d923d0cb-17e4-4a31-bc76-268e54913aca', NULL, 'Wait you just whisper back? I''ve been yelling louder to match their volume 😅 gonna try this tomorrow', 'Kevin Scott', 'https://randomuser.me/api/portraits/men/52.jpg', true, '2025-11-19 18:45:00'),

-- Post 12: Sharon Gray - morning fights (dedc2a55)
('dedc2a55-8906-44a3-9ba7-7bc36a04a2e9', NULL, 'Mornings are BRUTAL here too. We started laying out clothes the night before and it helped a tiny bit', 'Lisa Thompson', 'https://randomuser.me/api/portraits/women/58.jpg', true, '2025-11-19 19:15:00'),
('dedc2a55-8906-44a3-9ba7-7bc36a04a2e9', NULL, 'Have you tried a visual morning checklist? Mine responds better to pictures than me repeating things 50 times', 'Brian King', 'https://randomuser.me/api/portraits/men/71.jpg', true, '2025-11-19 20:30:00'),

-- Post 13: Gloria Rivera - homework screaming (8494222a)
('8494222a-cae1-498a-a47d-45a26f03a3d8', NULL, 'Homework is literal torture in our house. 2 math problems = 90 minutes of fighting. How do you stay calm?', 'Monica Wright', 'https://randomuser.me/api/portraits/women/42.jpg', true, '2025-11-18 16:45:00'),
('8494222a-cae1-498a-a47d-45a26f03a3d8', NULL, 'The "YOU CAN''T MAKE ME" phrase haunts my dreams. Which scripts help with homework specifically?', 'Steven Hill', 'https://randomuser.me/api/portraits/men/77.jpg', true, '2025-11-18 18:20:00'),

-- Post 14: Gregory Barnes - 3 days success (75943336)
('75943336-3be7-41be-8bdf-8a25b0767607', NULL, 'When-then language is powerful! "When you put on your shoes, then we can go to the park" vs "Put shoes on NOW"', 'Jessica Adams', 'https://randomuser.me/api/portraits/women/36.jpg', true, '2025-11-18 09:30:00'),
('75943336-3be7-41be-8bdf-8a25b0767607', NULL, '3 days is amazing! We''re on day 2 and I''m terrified it won''t last', 'Paul Carter', 'https://randomuser.me/api/portraits/men/68.jpg', true, '2025-11-18 11:45:00'),

-- Post 15: Dorothy Jenkins - I hear you AND (d9202564)
('d9202564-2dd0-4f8b-befc-186af4993c31', NULL, 'The AND instead of BUT is such a small change but makes huge difference! Feels less argumentative', 'Angela Nelson', 'https://randomuser.me/api/portraits/women/53.jpg', true, '2025-11-17 08:15:00'),
('d9202564-2dd0-4f8b-befc-186af4993c31', NULL, 'I need to practice this. I always say but and then wonder why she gets defensive lol', 'Jason Mitchell', 'https://randomuser.me/api/portraits/men/46.jpg', true, '2025-11-17 09:30:00'),

-- Post 16: Jason Simmons - pick battles (5b167188)
('5b167188-e5f8-4206-9087-1ab61eb54811', NULL, 'This balance is SO HARD. I feel like I''m either a dictator or a pushover with no middle ground', 'Rebecca Turner', 'https://randomuser.me/api/portraits/women/48.jpg', true, '2025-11-16 14:20:00'),
('5b167188-e5f8-4206-9087-1ab61eb54811', NULL, 'My rule: safety and respect are non-negotiable. Everything else is negotiable. Still struggle though', 'Eric Phillips', 'https://randomuser.me/api/portraits/men/59.jpg', true, '2025-11-16 16:45:00'),

-- Post 17: Edward Cox - public meltdowns (ffaf6552)
('ffaf6552-8eac-480e-82cd-6d9cdc1b5a12', NULL, 'Store meltdowns are THE WORST. Everyone staring. Did you just carry him out or what happened?', 'Diana Campbell', 'https://randomuser.me/api/portraits/women/51.jpg', true, '2025-11-16 08:30:00'),
('ffaf6552-8eac-480e-82cd-6d9cdc1b5a12', NULL, 'I feel this in my soul. Left a full cart at Target last week because of a toy meltdown. Zero shame anymore', 'Frank Parker', 'https://randomuser.me/api/portraits/men/64.jpg', true, '2025-11-16 09:45:00'),

-- Post 18: Carolyn Hughes - cleaned room (0a9f73d1)
('0a9f73d1-217c-451f-bfbb-b7e443bc583a', NULL, 'WHAT. How?? What do you mean you stopped repeating yourself? I need details!', 'Sandra Evans', 'https://randomuser.me/api/portraits/women/44.jpg', true, '2025-11-15 17:20:00'),
('0a9f73d1-217c-451f-bfbb-b7e443bc583a', NULL, 'This is amazing. Did you say it once and then just... wait? What if he didn''t do it?', 'Richard Edwards', 'https://randomuser.me/api/portraits/men/54.jpg', true, '2025-11-15 18:45:00'),

-- Post 19: Gary Bryant - set expectation BEFORE (a3737cbf)
('a3737cbf-a03b-4248-8386-61f070bbbdaf', NULL, 'The pre-planning thing is KEY! We talk about rules before we even get out of the car now', 'Melissa Collins', 'https://randomuser.me/api/portraits/women/37.jpg', true, '2025-11-15 16:30:00'),
('a3737cbf-a03b-4248-8386-61f070bbbdaf', NULL, 'Does this actually work? Mine agrees beforehand then still melts down when we get there', 'Charles Stewart', 'https://randomuser.me/api/portraits/men/61.jpg', true, '2025-11-15 18:15:00'),

-- Post 20: Deborah Foster - collaborative problem solving (b2b254ba)
('b2b254ba-d973-4deb-8a03-2d12cb97f3ea', NULL, 'CPS is amazing with defiant kids! Takes longer initially but prevents so many future battles', 'Kimberly Morris', 'https://randomuser.me/api/portraits/women/49.jpg', true, '2025-11-14 19:30:00'),
('b2b254ba-d973-4deb-8a03-2d12cb97f3ea', NULL, 'What''s the collaborative problem solving approach? Is it similar to the scripts here?', 'Gregory Rogers', 'https://randomuser.me/api/portraits/men/57.jpg', true, '2025-11-14 20:45:00'),

-- Post 21: Patricia Walsh - hungry/tired pattern (ecf6d46b)
('ecf6d46b-7acc-42cf-8f3b-60ddc4e815a2', NULL, 'YES! Hunger = defiance for my son too. Snack first, then ask him to do things. Changes everything', 'Cynthia Reed', 'https://randomuser.me/api/portraits/women/56.jpg', true, '2025-11-14 11:20:00'),
('ecf6d46b-7acc-42cf-8f3b-60ddc4e815a2', NULL, 'The pattern recognition is so important! Mine is worse after school when he''s drained', 'Victor Cook', 'https://randomuser.me/api/portraits/men/50.jpg', true, '2025-11-14 13:45:00'),

-- Post 22: Kevin Reynolds - time-in concept (261f210d)
('261f210d-c74f-449b-bd51-b36a19a01b28', NULL, 'Time-in instead of time-out changed everything for us. They need us during dysregulation, not isolation', 'Heather Bailey', 'https://randomuser.me/api/portraits/women/43.jpg', true, '2025-11-13 15:30:00'),
('261f210d-c74f-449b-bd51-b36a19a01b28', NULL, 'This feels so backward but it actually works! Sitting with them vs sending them away makes sense now', 'Raymond Cox', 'https://randomuser.me/api/portraits/men/66.jpg', true, '2025-11-13 17:20:00'),

-- Post 23: Diane Mitchell - needs control (6531cca2)
('6531cca2-f629-4fff-8cf5-c915736855cf', NULL, 'This perspective shift is huge. They''re not being difficult ON purpose, they''re having difficulty', 'Brenda Powell', 'https://randomuser.me/api/portraits/women/61.jpg', true, '2025-11-13 09:15:00'),
('6531cca2-f629-4fff-8cf5-c915736855cf', NULL, 'How do you give them control without letting them run the show? That''s where I struggle', 'Aaron Ward', 'https://randomuser.me/api/portraits/men/72.jpg', true, '2025-11-13 11:30:00'),

-- Post 24: Gregory Barnes - 5-minute warning (fb50260f)
('fb50260f-857b-4193-bc3e-d127d547efbd', NULL, 'The 5-minute warning is a lifesaver! Do you use a timer or just verbally tell him?', 'Tammy Griffin', 'https://randomuser.me/api/portraits/women/54.jpg', true, '2025-11-12 14:45:00'),
('fb50260f-857b-4193-bc3e-d127d547efbd', NULL, 'Transitions are SO hard for defiant kids. We do 10-minute, 5-minute, then 2-minute warnings', 'Louis Henderson', 'https://randomuser.me/api/portraits/men/69.jpg', true, '2025-11-12 16:20:00'),

-- Post 25: Carolyn Hughes - natural consequences (dba9f462)
('dba9f462-0ef1-46ee-a5ad-03a5395c6374', NULL, 'Natural consequences are so powerful! They learn way faster when they experience the outcome themselves', 'Doris Coleman', 'https://randomuser.me/api/portraits/women/66.jpg', true, '2025-11-12 10:30:00'),
('dba9f462-0ef1-46ee-a5ad-03a5395c6374', NULL, 'What''s an example of natural consequence vs punishment? I want to make sure I understand the difference', 'Gerald Foster', 'https://randomuser.me/api/portraits/men/75.jpg', true, '2025-11-12 12:15:00');
