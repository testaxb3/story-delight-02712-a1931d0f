-- ========================================
-- EXECUTE ESTE SQL NO SUPABASE SQL EDITOR
-- ========================================

-- STEP 1: Add columns to community_posts table
ALTER TABLE community_posts
ADD COLUMN IF NOT EXISTS is_seed_post BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS author_name TEXT,
ADD COLUMN IF NOT EXISTS author_brain_type TEXT,
ADD COLUMN IF NOT EXISTS post_type TEXT;

CREATE INDEX IF NOT EXISTS idx_community_posts_seed ON community_posts(is_seed_post);

-- STEP 2: Insert seed posts using testa@gmail.com as user_id

-- Get user_id for testa@gmail.com
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Find the user ID for testa@gmail.com
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'testa@gmail.com';

  -- If user not found, raise error
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'User testa@gmail.com not found!';
  END IF;

  -- Insert WIN posts
  INSERT INTO community_posts (user_id, content, post_type, is_seed_post, created_at, author_name, author_brain_type) VALUES
  (
    admin_user_id,
    '🎉 #WIN: Just used the Won''t Eat Breakfast script with Sofia (INTENSE)! She ate the WHOLE plate without a fight for the first time in WEEKS. I''m literally crying happy tears! This program is life-changing! 😭❤️',
    'win',
    true,
    NOW() - INTERVAL '3 hours',
    'Sarah Martinez',
    'INTENSE'
  ),
  (
    admin_user_id,
    '#WIN: The Bedtime Resistance script WORKED! Lucas went to bed without a single tantrum tonight. First time in 6 MONTHS! My husband couldn''t believe it. Thank you Michelle! 🛏️✨',
    'win',
    true,
    NOW() - INTERVAL '1 day',
    'Jessica Park',
    'DEFIANT'
  ),
  (
    admin_user_id,
    '🎊 WIN! Used the Screen Time Transition script and my son actually HANDED me the iPad without crying! What is this sorcery?! NEP is magic! 📱➡️😊',
    'win',
    true,
    NOW() - INTERVAL '5 hours',
    'Emma Thompson',
    'DISTRACTED'
  ),
  (
    admin_user_id,
    '#WIN: Homework battle OVER! Used the "Can''t Initiate Starting" script and Mia started her homework WITHOUT me nagging 47 times! Miracle! 📚🙌',
    'win',
    true,
    NOW() - INTERVAL '2 days',
    'Rachel Chen',
    'DISTRACTED'
  ),
  (
    admin_user_id,
    'WIN WIN WIN! 🎉 The hair brushing script ended our daily battle. Olivia let me brush her hair while singing the ABC song. No tears! No screaming! I can''t believe this works!',
    'win',
    true,
    NOW() - INTERVAL '8 hours',
    'Amanda Silva',
    'INTENSE'
  ),
  (
    admin_user_id,
    '🙌 #WIN: Morning routine is SMOOTH now! Used the "Dawdling and Moving Slowly" script and we were ready 15 minutes EARLY! First time ever! ☀️',
    'win',
    true,
    NOW() - INTERVAL '6 hours',
    'Lauren Davis',
    'DISTRACTED'
  );

  -- Insert QUESTION posts
  INSERT INTO community_posts (user_id, content, post_type, is_seed_post, created_at, author_name, author_brain_type) VALUES
  (
    admin_user_id,
    'Anyone else struggling with getting their DEFIANT kiddo to put shoes on in the morning? We''re late to school every. single. day. 😫 Which script works best for this?',
    'question',
    true,
    NOW() - INTERVAL '12 hours',
    'Lisa Johnson',
    'DEFIANT'
  ),
  (
    admin_user_id,
    'Help! My 5yo INTENSE daughter melts down every time her socks feel "wrong". How do you handle sensory issues with NEP? Any tips? 🧦😰',
    'question',
    true,
    NOW() - INTERVAL '1 day 6 hours',
    'Maria Rodriguez',
    'INTENSE'
  ),
  (
    admin_user_id,
    'DISTRACTED parents: how do you keep your child focused during homework time? Mine is literally distracted by DUST particles floating in the air 😅 Help!',
    'question',
    true,
    NOW() - INTERVAL '18 hours',
    'Sophie Williams',
    'DISTRACTED'
  ),
  (
    admin_user_id,
    'Quick question: Do you use the same script multiple times or rotate? My son seems to "catch on" when I use the bedtime script too many nights in a row. Thoughts? 🤔',
    'question',
    true,
    NOW() - INTERVAL '2 days 3 hours',
    'Jennifer Lee',
    'DEFIANT'
  );

  -- Insert LESSON posts
  INSERT INTO community_posts (user_id, content, post_type, is_seed_post, created_at, author_name, author_brain_type) VALUES
  (
    admin_user_id,
    'Lesson learned: I tried using logic with my INTENSE daughter during a meltdown. HUGE mistake. Switched to NEP Connection + Validation and she calmed down in 2 minutes. Michelle was right - 70% emotion, 30% logic! 🧠',
    'lesson',
    true,
    NOW() - INTERVAL '1 day 12 hours',
    'Catherine Moore',
    'INTENSE'
  ),
  (
    admin_user_id,
    'Real talk: I used to yell every morning. Now I use the Morning Routine script and my house is PEACEFUL. The difference is night and day. Lesson: the old way doesn''t work. NEP does. 💜',
    'lesson',
    true,
    NOW() - INTERVAL '3 days',
    'Nicole Taylor',
    'DEFIANT'
  ),
  (
    admin_user_id,
    'LESSON: Patience is KEY with DISTRACTED kids. I used to rush my son through everything. Now I give him "micro-pauses" like Michelle teaches. He actually COMPLETES tasks now! 🐢➡️✅',
    'lesson',
    true,
    NOW() - INTERVAL '2 days 8 hours',
    'Ashley Brown',
    'DISTRACTED'
  );

  RAISE NOTICE 'Successfully inserted 13 seed posts for user: %', admin_user_id;
END $$;

-- STEP 3: Verify insertion
SELECT
  id,
  author_name,
  author_brain_type,
  post_type,
  is_seed_post,
  created_at,
  LEFT(content, 50) || '...' as content_preview
FROM community_posts
WHERE is_seed_post = true
ORDER BY created_at DESC;

-- SUCCESS MESSAGE
SELECT 'Seed posts successfully created! Go to the Community page in your app to see them!' as message;
