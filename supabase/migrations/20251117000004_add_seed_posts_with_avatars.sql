-- ============================================================================
-- ADD SEED POSTS WITH PROFILE AVATARS
-- ============================================================================
-- This migration adds seed posts (fake posts for social proof) with realistic
-- profile avatars from DiceBear API to make the community look more active
-- and professional for new users.
-- ============================================================================

-- Add author_photo_url column to community_posts if not exists
ALTER TABLE public.community_posts
ADD COLUMN IF NOT EXISTS author_photo_url TEXT;

-- Add index for seed posts filtering
CREATE INDEX IF NOT EXISTS idx_community_posts_seed
  ON public.community_posts(is_seed_post) WHERE is_seed_post = true;

-- Insert seed posts with diverse authors and avatars
-- Using DiceBear Avatars API (https://avatars.dicebear.com/) - avataaars style
-- Each seed uses the author's first name for consistency

INSERT INTO public.community_posts (
  id,
  content,
  user_id,
  is_seed_post,
  author_name,
  author_brain_type,
  author_photo_url,
  post_type,
  created_at
) VALUES
-- INTENSE Brain Type Posts (8 posts)
(
  gen_random_uuid(),
  'Day 7 with my INTENSE toddler and we finally had a breakthrough! 🎉 Used the "Name the Feeling" script when she was having a meltdown about her shoes. Instead of the usual 2-hour tantrum, she calmed down in 15 minutes! Progress feels amazing!',
  NULL,
  true,
  'Sarah Martinez',
  'INTENSE',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
  'win',
  NOW() - INTERVAL '2 days 3 hours'
),
(
  gen_random_uuid(),
  'Struggling hard today. My INTENSE 4-year-old has been screaming non-stop for 3 hours because I gave him the "wrong" color cup. I feel like I''m failing as a parent. Does it ever get easier? 😭',
  NULL,
  true,
  'Michael Chen',
  'INTENSE',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=ffdfbf',
  'help',
  NOW() - INTERVAL '5 hours'
),
(
  gen_random_uuid(),
  'Week 3 update: Consistency is KEY! 🔑 My INTENSE child used to have 10+ meltdowns per day. Now we''re down to 2-3 manageable ones. The "Take a Break Together" script has been a game changer. We do deep breathing together now!',
  NULL,
  true,
  'Emma Johnson',
  'INTENSE',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=c0aede',
  'win',
  NOW() - INTERVAL '1 day 8 hours'
),
(
  gen_random_uuid(),
  'Can someone help? My INTENSE 5-year-old refuses to go to school every morning. Full-on screaming, hitting, kicking. Nothing in the scripts seems to work. Feeling completely overwhelmed and exhausted.',
  NULL,
  true,
  'David Rodriguez',
  'INTENSE',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=ffd5dc',
  'help',
  NOW() - INTERVAL '12 hours'
),
(
  gen_random_uuid(),
  'MAJOR WIN TODAY! 🎊 My INTENSE kiddo actually ASKED to use the calm-down corner instead of melting down! Day 21 of using these scripts consistently. I''m in tears (happy ones!). There IS hope!',
  NULL,
  true,
  'Lisa Anderson',
  'INTENSE',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa&backgroundColor=d1d4f9',
  'win',
  NOW() - INTERVAL '6 hours'
),
(
  gen_random_uuid(),
  'Question for INTENSE parents: How do you handle bedtime? My 3-year-old fights sleep for 3+ hours every night. Tried every script but nothing sticks. Any tips?',
  NULL,
  true,
  'James Taylor',
  'INTENSE',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=ffd5dc',
  'help',
  NOW() - INTERVAL '1 day 2 hours'
),
(
  gen_random_uuid(),
  'Day 14: Small wins matter! ✨ My INTENSE child looked at me today and said "Mommy, I feel angry" instead of throwing things. That''s HUGE progress! The "Emotion Coaching" approach really works!',
  NULL,
  true,
  'Jennifer Lee',
  'INTENSE',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer&backgroundColor=c0aede',
  'win',
  NOW() - INTERVAL '3 days'
),
(
  gen_random_uuid(),
  'Rough week. My INTENSE 6-year-old has been extra challenging. School says he''s disruptive. Home is a battlefield. I''m trying so hard but feeling like nothing is working. Need encouragement.',
  NULL,
  true,
  'Robert Wilson',
  'INTENSE',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert&backgroundColor=ffdfbf',
  'help',
  NOW() - INTERVAL '18 hours'
),

-- DISTRACTED Brain Type Posts (6 posts)
(
  gen_random_uuid(),
  'Update on my DISTRACTED kiddo: Homework that used to take 3 hours now takes 45 minutes! 🎉 The "Break It Down" script is MAGIC. We break everything into 5-minute chunks with mini-celebrations. Game changer!',
  NULL,
  true,
  'Amanda Garcia',
  'DISTRACTED',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda&backgroundColor=b6e3f4',
  'win',
  NOW() - INTERVAL '1 day 12 hours'
),
(
  gen_random_uuid(),
  'My DISTRACTED 7-year-old forgets EVERYTHING. Lost 4 jackets this month. Can''t remember to brush teeth without 20 reminders. How do you all handle this? Feeling frustrated and defeated.',
  NULL,
  true,
  'Christopher Brown',
  'DISTRACTED',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher&backgroundColor=ffd5dc',
  'help',
  NOW() - INTERVAL '8 hours'
),
(
  gen_random_uuid(),
  'Week 4 with DISTRACTED child: Created a visual routine chart and it''s WORKING! ⭐ Morning routine went from chaos to smooth in just one week. She checks off each task herself now!',
  NULL,
  true,
  'Maria Davis',
  'DISTRACTED',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=d1d4f9',
  'win',
  NOW() - INTERVAL '2 days 6 hours'
),
(
  gen_random_uuid(),
  'Help needed! My DISTRACTED 5-year-old can''t sit still for meals. Up and down every 30 seconds. Meal times are exhausting. What strategies work for you?',
  NULL,
  true,
  'Daniel Miller',
  'DISTRACTED',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel&backgroundColor=ffdfbf',
  'help',
  NOW() - INTERVAL '15 hours'
),
(
  gen_random_uuid(),
  'DISTRACTED brain type victory! 🎊 My son actually finished a 20-minute activity today WITHOUT getting distracted! Used the "Focus Timer" technique. Progress is happening!',
  NULL,
  true,
  'Patricia Martinez',
  'DISTRACTED',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia&backgroundColor=c0aede',
  'win',
  NOW() - INTERVAL '4 days'
),
(
  gen_random_uuid(),
  'School called again. My DISTRACTED child "not paying attention" in class. Teacher frustrated. I''m trying everything but feeling judged. Anyone else dealing with this?',
  NULL,
  true,
  'Matthew Garcia',
  'DISTRACTED',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Matthew&backgroundColor=b6e3f4',
  'help',
  NOW() - INTERVAL '1 day'
),

-- DEFIANT Brain Type Posts (6 posts)
(
  gen_random_uuid(),
  'HUGE breakthrough with my DEFIANT 6-year-old! 🎉 Started giving her 2 choices instead of commands. "Do you want to brush teeth now or after story time?" She actually CHOSE without arguing! Mind blown!',
  NULL,
  true,
  'Jessica Williams',
  'DEFIANT',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica&backgroundColor=ffd5dc',
  'win',
  NOW() - INTERVAL '1 day 4 hours'
),
(
  gen_random_uuid(),
  'My DEFIANT 4-year-old says NO to EVERYTHING. Getting dressed? No. Eating? No. Bath? No. I''m at my breaking point. Every day is a power struggle. Need help desperately.',
  NULL,
  true,
  'Anthony Johnson',
  'DEFIANT',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Anthony&backgroundColor=ffdfbf',
  'help',
  NOW() - INTERVAL '10 hours'
),
(
  gen_random_uuid(),
  'Week 5 update: The "Collaborative Problem Solving" approach is WORKING! 💪 My DEFIANT child and I actually negotiated bedtime together. He feels heard and cooperates more. Who knew?!',
  NULL,
  true,
  'Rebecca Anderson',
  'DEFIANT',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Rebecca&backgroundColor=d1d4f9',
  'win',
  NOW() - INTERVAL '3 days 8 hours'
),
(
  gen_random_uuid(),
  'DEFIANT parents: How do you handle public meltdowns? My 5-year-old threw herself on the grocery store floor today screaming. So many judgmental stares. Feeling like the worst parent ever.',
  NULL,
  true,
  'Kevin Thomas',
  'DEFIANT',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin&backgroundColor=c0aede',
  'help',
  NOW() - INTERVAL '7 hours'
),
(
  gen_random_uuid(),
  'Victory lap! 🎊 My DEFIANT kiddo actually APOLOGIZED today after hitting his sister! First time EVER! The emotional regulation work is paying off! Don''t give up, parents!',
  NULL,
  true,
  'Michelle Jackson',
  'DEFIANT',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Michelle&backgroundColor=b6e3f4',
  'win',
  NOW() - INTERVAL '2 days'
),
(
  gen_random_uuid(),
  'Advice needed: My DEFIANT 7-year-old refuses to do homework. Every night is World War 3. Tried rewards, consequences, nothing works. Teachers are getting frustrated. What am I doing wrong?',
  NULL,
  true,
  'Ryan White',
  'DEFIANT',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan&backgroundColor=ffd5dc',
  'help',
  NOW() - INTERVAL '20 hours'
);

-- Update existing seed posts (if any) with avatar URLs
UPDATE public.community_posts
SET author_photo_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || REPLACE(author_name, ' ', '') || '&backgroundColor=b6e3f4'
WHERE is_seed_post = true AND author_photo_url IS NULL;

-- Add comment explaining the field
COMMENT ON COLUMN public.community_posts.author_photo_url IS 'Profile photo URL for seed posts (uses DiceBear avatars). For real posts, use profiles.photo_url instead.';

-- Grant permissions
GRANT SELECT ON public.community_posts TO authenticated;
GRANT SELECT ON public.community_posts TO anon;
