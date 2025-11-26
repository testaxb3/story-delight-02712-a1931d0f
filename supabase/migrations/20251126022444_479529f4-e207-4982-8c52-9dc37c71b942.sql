-- Seed posts for DISTRACTED community
-- 25 posts with 20 unique authors, varied timestamps over last 30 days

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
-- Victory posts (5)
('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'BREAKTHROUGH: My daughter finished her reading assignment in ONE sitting. The ''chunking'' technique from the Focus script is magic! 🎉', true, 'Megan Foster', 'https://randomuser.me/api/portraits/women/21.jpg', 'DISTRACTED', NOW() - INTERVAL '2 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Used the Homework Battle script yesterday and my son actually stayed at the table for 20 minutes straight! First time EVER. I almost cried 😭💙', true, 'Ryan Cooper', 'https://randomuser.me/api/portraits/men/21.jpg', 'DISTRACTED', NOW() - INTERVAL '5 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Major win today! My 7yo transitioned from iPad to dinner without a single meltdown. The Transition script is a game changer 🙌', true, 'Hannah Scott', 'https://randomuser.me/api/portraits/women/22.jpg', 'DISTRACTED', NOW() - INTERVAL '1 day'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'After 3 weeks of using the Morning Routine script, my daughter is finally getting dressed without me repeating myself 47 times! Progress!! 🎊', true, 'Tyler Brooks', 'https://randomuser.me/api/portraits/men/22.jpg', 'DISTRACTED', NOW() - INTERVAL '8 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'We actually finished homework in 30 minutes today instead of 3 hours. The visual timer + script combo is working!! I''m so proud of him 💪', true, 'Olivia Parker', 'https://randomuser.me/api/portraits/women/23.jpg', 'DISTRACTED', NOW() - INTERVAL '3 days'),

-- Struggle posts (5)
('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Anyone else''s kid start homework, then end up playing with the eraser for 45 minutes? 😅 I''m exhausted. How do you handle this?', true, 'Jacob Miller', 'https://randomuser.me/api/portraits/men/23.jpg', 'DISTRACTED', NOW() - INTERVAL '4 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'My 8yo has left the homework table 12 times in 20 minutes. He hasn''t written a single word. I''m at my wit''s end. What am I doing wrong?', true, 'Emma Collins', 'https://randomuser.me/api/portraits/women/24.jpg', 'DISTRACTED', NOW() - INTERVAL '6 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Morning routines are pure chaos. My daughter has the attention span of a goldfish. Getting dressed takes 2 hours because she keeps getting distracted 😭', true, 'Liam Turner', 'https://randomuser.me/api/portraits/men/24.jpg', 'DISTRACTED', NOW() - INTERVAL '7 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Screen time battles every single day. He promises "just 5 more minutes" but it turns into an hour-long fight. I''m so tired of this 😞', true, 'Sophia Reed', 'https://randomuser.me/api/portraits/women/25.jpg', 'DISTRACTED', NOW() - INTERVAL '9 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Homework took 3.5 hours tonight. THREE AND A HALF HOURS for a 20-minute worksheet. How is this sustainable? I need help.', true, 'Mason Hughes', 'https://randomuser.me/api/portraits/men/25.jpg', 'DISTRACTED', NOW() - INTERVAL '10 days'),

-- Question posts (5)
('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Which script do you use for homework battles? My 6yo can''t stay focused for more than 2 minutes. Looking for recommendations!', true, 'Ava Morgan', 'https://randomuser.me/api/portraits/women/26.jpg', 'DISTRACTED', NOW() - INTERVAL '11 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'How do you handle constant "I''m bored" during tasks? Does the Focus script address this? New to the app and need guidance', true, 'Ethan Price', 'https://randomuser.me/api/portraits/men/26.jpg', 'DISTRACTED', NOW() - INTERVAL '12 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'What''s your morning routine setup? My daughter is always late for school because she can''t stay on task. Any script recommendations?', true, 'Isabella Hayes', 'https://randomuser.me/api/portraits/women/27.jpg', 'DISTRACTED', NOW() - INTERVAL '13 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'For those with kids who hyperfocus on screens - which transition script works best? Trying to avoid daily meltdowns when screen time ends', true, 'Noah Bennett', 'https://randomuser.me/api/portraits/men/27.jpg', 'DISTRACTED', NOW() - INTERVAL '14 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'How long did it take before you saw results? Been using scripts for 1 week and still struggling. Is this normal?', true, 'Charlotte Ross', 'https://randomuser.me/api/portraits/women/28.jpg', 'DISTRACTED', NOW() - INTERVAL '15 days'),

-- Tip posts (5)
('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Pro tip: I set a visual timer next to my son''s desk. When he can SEE the time, he stays focused way longer. Combined with the Homework Battle script = game changer 🔥', true, 'Lucas Gray', 'https://randomuser.me/api/portraits/men/28.jpg', 'DISTRACTED', NOW() - INTERVAL '16 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Chunking technique from the Focus script works wonders! Break tasks into 3-minute blocks with 1-minute movement breaks. My daughter went from 0 to 80% homework completion', true, 'Amelia Foster', 'https://randomuser.me/api/portraits/women/29.jpg', 'DISTRACTED', NOW() - INTERVAL '17 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Put all homework in one specific spot (we use a blue folder). My son knows: blue folder = focus time. Visual cues help SO much with distracted kids 📘', true, 'Benjamin Carter', 'https://randomuser.me/api/portraits/men/29.jpg', 'DISTRACTED', NOW() - INTERVAL '18 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Fidget tools during homework changed everything. Let them move their hands while they think. It''s not distraction, it''s regulation! The scripts teach this approach 🙌', true, 'Harper Mitchell', 'https://randomuser.me/api/portraits/women/30.jpg', 'DISTRACTED', NOW() - INTERVAL '19 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Morning routine hack: lay out clothes the night before AND take a photo of the outfit. My visual learner needs to SEE what''s next. Works with the Morning Routine script!', true, 'Alexander Ward', 'https://randomuser.me/api/portraits/men/30.jpg', 'DISTRACTED', NOW() - INTERVAL '20 days'),

-- Discovery posts (5)
('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Just discovered the Transition script works for homework → dinner too! Not just for screen time. My mind is blown 🤯', true, 'Mia Roberts', 'https://randomuser.me/api/portraits/women/31.jpg', 'DISTRACTED', NOW() - INTERVAL '21 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Found out my son does better with homework right AFTER a 10-minute movement break (jumping jacks, run around the block). The scripts mention this but I finally tried it - WOW', true, 'James Phillips', 'https://randomuser.me/api/portraits/men/31.jpg', 'DISTRACTED', NOW() - INTERVAL '22 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'The "body doubling" technique from the Focus script is incredible. I just sit nearby doing my own work - she stays on task 3x longer! Why did no one tell me this before?', true, 'Evelyn Campbell', 'https://randomuser.me/api/portraits/women/32.jpg', 'DISTRACTED', NOW() - INTERVAL '23 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Realized my daughter''s "I''m bored" actually means "this is too hard". The scripts helped me decode this. Now I offer help instead of getting frustrated 💡', true, 'William Evans', 'https://randomuser.me/api/portraits/men/32.jpg', 'DISTRACTED', NOW() - INTERVAL '24 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Music during homework = total game changer for my distracted kid. NOT lyrics though - instrumental only. The Homework script mentions background sound and it WORKS 🎵', true, 'Abigail Torres', 'https://randomuser.me/api/portraits/women/33.jpg', 'DISTRACTED', NOW() - INTERVAL '25 days'),

-- Mixed posts (5 more for total of 25)
('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Week 2 update: Morning routine went from 90 minutes to 35 minutes. Still not perfect but SO much better. The script''s step-by-step approach really helps 🌅', true, 'Daniel Rivera', 'https://randomuser.me/api/portraits/men/33.jpg', 'DISTRACTED', NOW() - INTERVAL '26 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'My 9yo asked me "why do I keep forgetting things?" and I used the script''s explanation about working memory. He finally understands it''s not his fault. Breakthrough moment 💙', true, 'Emily Cooper', 'https://randomuser.me/api/portraits/women/34.jpg', 'DISTRACTED', NOW() - INTERVAL '27 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Today was rough. Back to 2-hour homework battle. But I didn''t yell! Used the script''s staying calm techniques. Progress isn''t linear and that''s okay ❤️', true, 'Henry Morgan', 'https://randomuser.me/api/portraits/men/34.jpg', 'DISTRACTED', NOW() - INTERVAL '28 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Which script handles the "I forgot my homework at school" situation? This happens 3x per week and I''m losing it 😓', true, 'Grace Peterson', 'https://randomuser.me/api/portraits/women/35.jpg', 'DISTRACTED', NOW() - INTERVAL '29 days'),

('ec50da3d-0d1a-4370-be99-707d7bbc68ea', NULL, 'Just joined this community - are there other parents of ADHD/distracted kids here? Would love to connect and share experiences! 👋', true, 'Samuel Brooks', 'https://randomuser.me/api/portraits/men/35.jpg', 'DISTRACTED', NOW() - INTERVAL '30 days');