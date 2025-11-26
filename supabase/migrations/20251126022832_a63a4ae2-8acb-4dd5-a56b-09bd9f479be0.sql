-- Seed content for DEFIANT community (20 unique authors, 25 posts)

INSERT INTO community_posts (
  community_id,
  user_id,
  content,
  is_seed_post,
  author_name,
  author_photo_url,
  author_brain_type,
  created_at
) VALUES 
-- VICTORY POSTS (5)
('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'My son said ''okay'' instead of ''NO!'' for the first time in weeks! The validation-first approach from the Defiance script is working! 🎉', true, 'Patricia Walsh', 'https://randomuser.me/api/portraits/women/41.jpg', 'DEFIANT', NOW() - INTERVAL '2 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'We made it through dinner without a single power struggle. Giving choices instead of commands = game changer! Used the approach from the Mealtime Battle script and my daughter actually chose between two vegetable options without arguing 😭', true, 'Kevin Reynolds', 'https://randomuser.me/api/portraits/men/41.jpg', 'DEFIANT', NOW() - INTERVAL '5 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'HUGE WIN: My daughter actually apologized after a meltdown. The repair conversation script helped us both! She came to me an hour later and said "sorry for yelling mom". I almost cried 💙', true, 'Diane Mitchell', 'https://randomuser.me/api/portraits/women/42.jpg', 'DEFIANT', NOW() - INTERVAL '8 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, '3 days without a major blowup! Using the ''when-then'' language instead of threats is finally clicking. Instead of "If you don''t clean up, no iPad", I say "When you clean up, then we can have iPad time" and it works SO much better', true, 'Gregory Barnes', 'https://randomuser.me/api/portraits/men/42.jpg', 'DEFIANT', NOW() - INTERVAL '11 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'My 7yo cleaned his room without a fight. The secret? I stopped repeating myself and used the one-ask approach from the scripts. Said it once calmly, then walked away. He actually did it 10 minutes later! 🙌', true, 'Carolyn Hughes', 'https://randomuser.me/api/portraits/women/43.jpg', 'DEFIANT', NOW() - INTERVAL '14 days'),

-- STRUGGLE POSTS (5)
('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'Every single request turns into a negotiation. ''Put on your shoes'' becomes a 30-minute battle. Anyone else exhausted? 😩 I feel like I''m negotiating a hostage situation just to leave the house', true, 'Dennis Price', 'https://randomuser.me/api/portraits/men/43.jpg', 'DEFIANT', NOW() - INTERVAL '1 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'My daughter''s default answer is ''NO'' before I even finish my sentence. How do you not lose your cool? I''ve tried staying calm but after the 47th NO today I just want to scream', true, 'Janet Coleman', 'https://randomuser.me/api/portraits/women/44.jpg', 'DEFIANT', NOW() - INTERVAL '4 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'The eye rolls, the back talk, the door slamming... she''s only 6! Is this normal for defiant kids? Sometimes I feel like I''m parenting a teenager already and she hasn''t even lost her baby teeth', true, 'Ronald Murphy', 'https://randomuser.me/api/portraits/men/44.jpg', 'DEFIANT', NOW() - INTERVAL '7 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'We can''t get through homework without him screaming ''YOU CAN''T MAKE ME!'' at least 5 times. Every. Single. Day. I''m so tired of the power struggles over a simple worksheet 😭', true, 'Gloria Rivera', 'https://randomuser.me/api/portraits/women/45.jpg', 'DEFIANT', NOW() - INTERVAL '10 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'Public meltdowns when she doesn''t get her way are destroying me. Left the grocery store in tears today after she threw herself on the floor screaming. The stares from other people... I can''t do this anymore', true, 'Edward Cox', 'https://randomuser.me/api/portraits/men/45.jpg', 'DEFIANT', NOW() - INTERVAL '13 days'),

-- QUESTION POSTS (5)
('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'What''s your go-to script for when they refuse to do ANYTHING you ask? Need help with my 8yo who has turned refusal into an Olympic sport. Looking for specific strategies that actually work', true, 'Kathleen Ward', 'https://randomuser.me/api/portraits/women/46.jpg', 'DEFIANT', NOW() - INTERVAL '3 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'How do you handle the ''I hate you!'' moments? My heart breaks every time even though I know he doesn''t mean it. Do I respond? Ignore it? Validate his anger? I''m so confused', true, 'Timothy Peterson', 'https://randomuser.me/api/portraits/men/46.jpg', 'DEFIANT', NOW() - INTERVAL '6 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'Any tips for mornings? My son fights every single step - getting dressed, brushing teeth, eating breakfast... We''re late to school 3 days a week because of the battles. What scripts do you use?', true, 'Sharon Gray', 'https://randomuser.me/api/portraits/women/47.jpg', 'DEFIANT', NOW() - INTERVAL '9 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'When do you pick your battles vs stand firm? I feel like I''m either too strict or too lenient. How do you find the balance with defiant kids? Sometimes I give in just to avoid the meltdown', true, 'Jason Simmons', 'https://randomuser.me/api/portraits/men/47.jpg', 'DEFIANT', NOW() - INTERVAL '12 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'Has anyone tried the collaborative problem solving approach? Does it work with really stubborn kids? My daughter is SO strong-willed and I''m wondering if it''s worth trying', true, 'Deborah Foster', 'https://randomuser.me/api/portraits/women/48.jpg', 'DEFIANT', NOW() - INTERVAL '15 days'),

-- TIP POSTS (5)
('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'Pro tip: Give TWO choices, both acceptable to you. ''Do you want to brush teeth first or put on pajamas first?'' Works way better than ''Go get ready for bed''. My son feels in control and I still get what I need ✨', true, 'Jeffrey Long', 'https://randomuser.me/api/portraits/men/48.jpg', 'DEFIANT', NOW() - INTERVAL '2 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'Stop saying ''Because I said so'' - it escalates EVERY time. The scripts taught me to briefly explain why, then move on. ''We brush teeth so they stay healthy and don''t get cavities.'' Then change subject. Game changer!', true, 'Teresa Russell', 'https://randomuser.me/api/portraits/women/49.jpg', 'DEFIANT', NOW() - INTERVAL '5 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'Whisper when they yell. Sounds crazy but it actually works to de-escalate. My son stops to hear what I''m saying and it completely breaks the yelling cycle. Try it!', true, 'Steven Howard', 'https://randomuser.me/api/portraits/men/49.jpg', 'DEFIANT', NOW() - INTERVAL '8 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'The phrase ''I hear you, AND...'' instead of ''but'' has reduced arguments by half. ''I hear you want to play, AND we need to leave in 5 minutes.'' Validation is everything with these kids 💯', true, 'Dorothy Jenkins', 'https://randomuser.me/api/portraits/women/50.jpg', 'DEFIANT', NOW() - INTERVAL '11 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'Set the expectation BEFORE the situation. ''When we get to the store, we''re not buying toys today'' = fewer meltdowns. I repeat it in the car, at the entrance, and before checkout. Repetition helps!', true, 'Gary Bryant', 'https://randomuser.me/api/portraits/men/50.jpg', 'DEFIANT', NOW() - INTERVAL '14 days'),

-- DISCOVERY POSTS (5)
('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'Just realized my daughter''s defiance spikes when she''s hungry or tired. Started offering snacks before homework and it''s helping! Obvious now but I didn''t connect the dots before. Low blood sugar = high defiance 😅', true, 'Patricia Walsh', 'https://randomuser.me/api/portraits/women/41.jpg', 'DEFIANT', NOW() - INTERVAL '17 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'The ''time-in'' instead of ''time-out'' concept blew my mind. Staying WITH them during big emotions is so powerful. My son calms down way faster when I sit nearby (not talking, just present) vs sending him to his room alone', true, 'Kevin Reynolds', 'https://randomuser.me/api/portraits/men/41.jpg', 'DEFIANT', NOW() - INTERVAL '20 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'My son isn''t being defiant to be difficult - he genuinely needs to feel in control. Once I understood that, everything changed. Now I give him control in small ways (choose breakfast, pick shirt) and he fights less on the important stuff', true, 'Diane Mitchell', 'https://randomuser.me/api/portraits/women/42.jpg', 'DEFIANT', NOW() - INTERVAL '23 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'Found that giving him a 5-minute warning before transitions reduces resistance by 80%. ''In 5 minutes we''ll clean up toys'' gives him time to mentally prepare. Why didn''t anyone tell me sooner?! 🕐', true, 'Gregory Barnes', 'https://randomuser.me/api/portraits/men/42.jpg', 'DEFIANT', NOW() - INTERVAL '26 days'),

('cea49707-0b83-4cc1-8cac-78472ae8359a', NULL, 'The script about natural consequences vs punishments was eye-opening. Letting him experience the consequence of not wearing a jacket (being cold) taught more than any lecture. He asks for his jacket now without me saying anything!', true, 'Carolyn Hughes', 'https://randomuser.me/api/portraits/women/43.jpg', 'DEFIANT', NOW() - INTERVAL '29 days');