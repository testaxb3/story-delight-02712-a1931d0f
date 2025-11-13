-- Insert realistic seed posts to populate community
-- These will appear to be real user posts but are admin-created

-- NOTE: Replace 'ADMIN_USER_ID' with your actual admin user ID from auth.users table
-- Run this query: SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com';

-- WIN Posts
INSERT INTO community_posts (user_id, content, post_type, is_seed_post, created_at, author_name, author_brain_type) VALUES
(
  'ADMIN_USER_ID',
  '🎉 #WIN: Just used the Won''t Eat Breakfast script with Sofia (INTENSE)! She ate the WHOLE plate without a fight for the first time in WEEKS. I''m literally crying happy tears! This program is life-changing! 😭❤️',
  'win',
  true,
  NOW() - INTERVAL '3 hours',
  'Sarah Martinez',
  'INTENSE'
),
(
  'ADMIN_USER_ID',
  '#WIN: The Bedtime Resistance script WORKED! Lucas went to bed without a single tantrum tonight. First time in 6 MONTHS! My husband couldn''t believe it. Thank you Michelle! 🛏️✨',
  'win',
  true,
  NOW() - INTERVAL '1 day',
  'Jessica Park',
  'DEFIANT'
),
(
  'ADMIN_USER_ID',
  '🎊 WIN! Used the Screen Time Transition script and my son actually HANDED me the iPad without crying! What is this sorcery?! NEP is magic! 📱➡️😊',
  'win',
  true,
  NOW() - INTERVAL '5 hours',
  'Emma Thompson',
  'DISTRACTED'
),
(
  'ADMIN_USER_ID',
  '#WIN: Homework battle OVER! Used the "Can''t Initiate Starting" script and Mia started her homework WITHOUT me nagging 47 times! Miracle! 📚🙌',
  'win',
  true,
  NOW() - INTERVAL '2 days',
  'Rachel Chen',
  'DISTRACTED'
),
(
  'ADMIN_USER_ID',
  'WIN WIN WIN! 🎉 The hair brushing script ended our daily battle. Olivia let me brush her hair while singing the ABC song. No tears! No screaming! I can''t believe this works!',
  'win',
  true,
  NOW() - INTERVAL '8 hours',
  'Amanda Silva',
  'INTENSE'
);

-- QUESTION Posts
INSERT INTO community_posts (user_id, content, post_type, is_seed_post, created_at, author_name, author_brain_type) VALUES
(
  'ADMIN_USER_ID',
  'Anyone else struggling with getting their DEFIANT kiddo to put shoes on in the morning? We''re late to school every. single. day. 😫 Which script works best for this?',
  'question',
  true,
  NOW() - INTERVAL '12 hours',
  'Lisa Johnson',
  'DEFIANT'
),
(
  'ADMIN_USER_ID',
  'Help! My 5yo INTENSE daughter melts down every time her socks feel "wrong". How do you handle sensory issues with NEP? Any tips? 🧦😰',
  'question',
  true,
  NOW() - INTERVAL '1 day 6 hours',
  'Maria Rodriguez',
  'INTENSE'
),
(
  'ADMIN_USER_ID',
  'DISTRACTED parents: how do you keep your child focused during homework time? Mine is literally distracted by DUST particles floating in the air 😅 Help!',
  'question',
  true,
  NOW() - INTERVAL '18 hours',
  'Sophie Williams',
  'DISTRACTED'
),
(
  'ADMIN_USER_ID',
  'Quick question: Do you use the same script multiple times or rotate? My son seems to "catch on" when I use the bedtime script too many nights in a row. Thoughts? 🤔',
  'question',
  true,
  NOW() - INTERVAL '2 days 3 hours',
  'Jennifer Lee',
  'DEFIANT'
);

-- LESSON Posts
INSERT INTO community_posts (user_id, content, post_type, is_seed_post, created_at, author_name, author_brain_type) VALUES
(
  'ADMIN_USER_ID',
  'Lesson learned: I tried using logic with my INTENSE daughter during a meltdown. HUGE mistake. Switched to NEP Connection + Validation and she calmed down in 2 minutes. Michelle was right - 70% emotion, 30% logic! 🧠',
  'lesson',
  true,
  NOW() - INTERVAL '1 day 12 hours',
  'Catherine Moore',
  'INTENSE'
),
(
  'ADMIN_USER_ID',
  'Real talk: I used to yell every morning. Now I use the Morning Routine script and my house is PEACEFUL. The difference is night and day. Lesson: the old way doesn''t work. NEP does. 💜',
  'lesson',
  true,
  NOW() - INTERVAL '3 days',
  'Nicole Taylor',
  'DEFIANT'
),
(
  'ADMIN_USER_ID',
  'LESSON: Patience is KEY with DISTRACTED kids. I used to rush my son through everything. Now I give him "micro-pauses" like Michelle teaches. He actually COMPLETES tasks now! 🐢➡️✅',
  'lesson',
  true,
  NOW() - INTERVAL '2 days 8 hours',
  'Ashley Brown',
  'DISTRACTED'
);

-- Add some fake likes/engagement
-- Note: This would require creating fake user accounts for realistic engagement
-- For now, we'll just have the posts without likes/comments

COMMENT ON TABLE community_posts IS 'Community posts including both real user posts and seed posts for social proof';
