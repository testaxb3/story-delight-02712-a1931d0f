-- Insert ~60 contextual seed comments for DISTRACTED community posts (using only existing post IDs)

-- Post: "Major win today! My 7yo transitioned from iPad to dinner..."
INSERT INTO post_comments (post_id, content, author_name, author_photo_url, is_seed, user_id)
VALUES 
('55d7a9ef-e51c-4680-a101-6310dd4c58cd', 'This is huge!! Transition time is usually our worst moment of the day. Which specific part of the script helped most?', 'Rachel Kim', 'https://randomuser.me/api/portraits/women/32.jpg', true, NULL),
('55d7a9ef-e51c-4680-a101-6310dd4c58cd', 'Amazing! How long did it take before you saw this result? We''re on day 4 and still struggling.', 'Marcus Thompson', 'https://randomuser.me/api/portraits/men/52.jpg', true, NULL);

-- Post: "BREAKTHROUGH: My daughter finished her reading assignment in ONE sitting..."
INSERT INTO post_comments (post_id, content, author_name, author_photo_url, is_seed, user_id)
VALUES 
('d708bde6-5df8-4471-b6a1-84113bc93e1d', 'ONE sitting?! That''s incredible! We''re still at 3-4 interruptions per task. What''s your chunking strategy?', 'Jennifer Walsh', 'https://randomuser.me/api/portraits/women/44.jpg', true, NULL),
('d708bde6-5df8-4471-b6a1-84113bc93e1d', 'The chunking technique is legit! We break every task into 5-minute micro-chunks. Changed everything.', 'David Park', 'https://randomuser.me/api/portraits/men/28.jpg', true, NULL),
('d708bde6-5df8-4471-b6a1-84113bc93e1d', 'Going to try this today! Reading time is our biggest battle right now.', 'Sophie Martinez', 'https://randomuser.me/api/portraits/women/67.jpg', true, NULL);

-- Post: "We actually finished homework in 30 minutes today instead of 3 hours..."
INSERT INTO post_comments (post_id, content, author_name, author_photo_url, is_seed, user_id)
VALUES 
('5fcd8d26-901a-47dc-94f0-a83eb5af16fe', 'From 3 hours to 30 minutes?! That''s life-changing! Which visual timer do you use?', 'Amanda Foster', 'https://randomuser.me/api/portraits/women/25.jpg', true, NULL),
('5fcd8d26-901a-47dc-94f0-a83eb5af16fe', 'This gives me so much hope! We''re at 2+ hours every night. Did you use a specific script?', 'Brian Chen', 'https://randomuser.me/api/portraits/men/41.jpg', true, NULL),
('5fcd8d26-901a-47dc-94f0-a83eb5af16fe', '30 minutes is our DREAM. Amazing progress!! 🎉', 'Lisa Rodriguez', 'https://randomuser.me/api/portraits/women/58.jpg', true, NULL);

-- Post: "Anyone else's kid start homework, then end up playing with the eraser for 45 minutes?"
INSERT INTO post_comments (post_id, content, author_name, author_photo_url, is_seed, user_id)
VALUES 
('67d6b9a1-500d-412e-8b73-e2ecde763d00', 'YES. Every. Single. Day. The pencil becomes a toy, the eraser becomes fascinating... anything except actual homework 😅', 'Emily Watson', 'https://randomuser.me/api/portraits/women/19.jpg', true, NULL),
('67d6b9a1-500d-412e-8b73-e2ecde763d00', 'Remove the eraser! Seriously. We give him a mechanical pencil and keep the eraser across the room. One less distraction.', 'Christopher Lee', 'https://randomuser.me/api/portraits/men/63.jpg', true, NULL),
('67d6b9a1-500d-412e-8b73-e2ecde763d00', 'The Homework Battle script addresses this exact thing! It''s all about minimizing distractions in the workspace.', 'Michelle Santos', 'https://randomuser.me/api/portraits/women/71.jpg', true, NULL);

-- Post: "Used the Homework Battle script yesterday and my son actually stayed at the table for 20 minutes straight!"
INSERT INTO post_comments (post_id, content, author_name, author_photo_url, is_seed, user_id)
VALUES 
('19d1d9f3-1066-4240-bda4-097d38edb6b7', '20 minutes straight is HUGE for a distracted kid! Celebrate that!! 🎉', 'Sarah Mitchell', 'https://randomuser.me/api/portraits/women/36.jpg', true, NULL),
('19d1d9f3-1066-4240-bda4-097d38edb6b7', 'First time ever = breakthrough moment! These small wins lead to big changes. Keep going!', 'Kevin Brown', 'https://randomuser.me/api/portraits/men/47.jpg', true, NULL);

-- Post: "My 8yo has left the homework table 12 times in 20 minutes. He hasn't written a single word..."
INSERT INTO post_comments (post_id, content, author_name, author_photo_url, is_seed, user_id)
VALUES 
('44c4930d-98a0-4cd4-a03d-2b24ae409ff4', 'You''re not doing anything wrong! ADHD brains need movement. Have you tried the "movement break every 10 minutes" approach?', 'Jessica Taylor', 'https://randomuser.me/api/portraits/women/42.jpg', true, NULL),
('44c4930d-98a0-4cd4-a03d-2b24ae409ff4', 'This was us 3 weeks ago! The Homework Battle script + fidget tools helped us go from 12 interruptions to 3. Hang in there!', 'Daniel Kim', 'https://randomuser.me/api/portraits/men/55.jpg', true, NULL),
('44c4930d-98a0-4cd4-a03d-2b24ae409ff4', '12 times in 20 minutes is classic ADHD. Not a behavior problem - it''s how their brain works. The scripts help work WITH it, not against it.', 'Nicole Johnson', 'https://randomuser.me/api/portraits/women/29.jpg', true, NULL);

-- Post: "Morning routines are pure chaos. My daughter has the attention span of a goldfish..."
INSERT INTO post_comments (post_id, content, author_name, author_photo_url, is_seed, user_id)
VALUES 
('5d8308b0-9495-4109-8cea-75c7dd3c8fa9', 'Visual checklist on the wall saved us! She can SEE the steps and check them off. Makes such a difference.', 'Rebecca Davis', 'https://randomuser.me/api/portraits/women/51.jpg', true, NULL),
('5d8308b0-9495-4109-8cea-75c7dd3c8fa9', 'We lay out clothes the night before. Morning is just execution, not decision-making. Cuts our time in half!', 'Andrew Martinez', 'https://randomuser.me/api/portraits/men/34.jpg', true, NULL);

-- Post: "After 3 weeks of using the Morning Routine script, my daughter is finally getting dressed without me repeating..."
INSERT INTO post_comments (post_id, content, author_name, author_photo_url, is_seed, user_id)
VALUES 
('84b40f47-67e2-4b0d-b5cc-0c7c061eebe1', '3 weeks of consistency paying off!! This is exactly how long it usually takes for new patterns to stick. Amazing work!', 'Laura Wilson', 'https://randomuser.me/api/portraits/women/64.jpg', true, NULL),
('84b40f47-67e2-4b0d-b5cc-0c7c061eebe1', 'The fact that you stuck with it for 3 weeks is the real win! Consistency is everything with ADHD kids.', 'Michael Chang', 'https://randomuser.me/api/portraits/men/22.jpg', true, NULL);

-- Post: "Screen time battles every single day. He promises 'just 5 more minutes'..."
INSERT INTO post_comments (post_id, content, author_name, author_photo_url, is_seed, user_id)
VALUES 
('6f72e422-9dfc-4818-aa0d-9494afc29b2f', 'The Transition script is MADE for this! Give warnings at 10 min, 5 min, and 2 min. Works way better than "5 more minutes" promises.', 'Christina Lee', 'https://randomuser.me/api/portraits/women/38.jpg', true, NULL),
('6f72e422-9dfc-4818-aa0d-9494afc29b2f', 'We use a visual timer that he can see counting down. When time hits zero, iPad goes away. No negotiation. Took 2 weeks but now it works!', 'Jason Park', 'https://randomuser.me/api/portraits/men/59.jpg', true, NULL);

-- Post: "Homework took 3.5 hours tonight. THREE AND A HALF HOURS for a 20-minute worksheet..."
INSERT INTO post_comments (post_id, content, author_name, author_photo_url, is_seed, user_id)
VALUES 
('1d9970d8-6963-46c0-9767-c6ec5dce1e34', 'This was our life 2 months ago! Breaking tasks into 5-minute chunks with 2-minute movement breaks changed EVERYTHING.', 'Ashley Thompson', 'https://randomuser.me/api/portraits/women/45.jpg', true, NULL),
('1d9970d8-6963-46c0-9767-c6ec5dce1e34', '3.5 hours is not sustainable for anyone! Have you tried the "body doubling" technique? Just sit nearby doing your own work. Helps them stay focused.', 'Ryan Foster', 'https://randomuser.me/api/portraits/men/43.jpg', true, NULL),
('1d9970d8-6963-46c0-9767-c6ec5dce1e34', 'The Homework Battle script addresses this exact scenario. It''s all about working with their attention span, not against it. Hang in there!', 'Emma Rodriguez', 'https://randomuser.me/api/portraits/women/56.jpg', true, NULL);

-- Post: "Which script do you use for homework battles? My 6yo can't stay focused for more than 2 minutes..."
INSERT INTO post_comments (post_id, content, author_name, author_photo_url, is_seed, user_id)
VALUES 
('2d22f0c4-72f1-49d8-a91f-fd02ec4de51e', 'The "Homework Without the Drama" script! It breaks everything into 2-minute micro-tasks. Perfect for 6yo attention spans.', 'Melissa Garcia', 'https://randomuser.me/api/portraits/women/27.jpg', true, NULL),
('2d22f0c4-72f1-49d8-a91f-fd02ec4de51e', 'At 6, they need movement breaks every 5-10 minutes. The Focus script has a version specifically for younger kids!', 'Thomas Wilson', 'https://randomuser.me/api/portraits/men/68.jpg', true, NULL);

-- Post: "How do you handle constant 'I'm bored' during tasks?"
INSERT INTO post_comments (post_id, content, author_name, author_photo_url, is_seed, user_id)
VALUES 
('252756c9-150a-48f9-9392-ab99de575d6b', '"I''m bored" usually means "this is hard and I''m avoiding it". The Focus script helps break tasks down so they feel less overwhelming.', 'Katherine Chen', 'https://randomuser.me/api/portraits/women/33.jpg', true, NULL),
('252756c9-150a-48f9-9392-ab99de575d6b', 'We turned boring tasks into races. "Can you finish 3 math problems before the timer beeps?" Makes it a game instead of torture.', 'Patrick Murphy', 'https://randomuser.me/api/portraits/men/31.jpg', true, NULL);

-- Post: "What's your morning routine setup? My daughter is always late for school..."
INSERT INTO post_comments (post_id, content, author_name, author_photo_url, is_seed, user_id)
VALUES 
('f6066cba-98cf-4fb0-add7-3c10a4871313', 'Start the night before! Lay out clothes, pack backpack, put shoes by door. Morning is just execution, not planning.', 'Samantha Lee', 'https://randomuser.me/api/portraits/women/48.jpg', true, NULL),
('f6066cba-98cf-4fb0-add7-3c10a4871313', 'The "Morning Express" script reframes it as a train leaving at 8am. Each task is a station. My daughter LOVES this approach!', 'Gregory Taylor', 'https://randomuser.me/api/portraits/men/54.jpg', true, NULL),
('f6066cba-98cf-4fb0-add7-3c10a4871313', 'Visual checklist with velcro pictures! She flips them over when done. Makes morning routine visible and concrete.', 'Diana Martinez', 'https://randomuser.me/api/portraits/women/70.jpg', true, NULL);

-- Post: "For those with kids who hyperfocus on screens - which transition script works best?"
INSERT INTO post_comments (post_id, content, author_name, author_photo_url, is_seed, user_id)
VALUES 
('3b83620b-d6ca-4f2f-92b8-cff1a74df942', 'The "Screen Time Transition" script! Key is giving multiple warnings: 10 min, 5 min, 2 min. Helps them mentally prepare.', 'Olivia Santos', 'https://randomuser.me/api/portraits/women/62.jpg', true, NULL),
('3b83620b-d6ca-4f2f-92b8-cff1a74df942', 'We use the "save your progress" approach. He gets a 5-minute warning to save/finish his level. Reduces the "I''m in the middle of something!" meltdowns.', 'Steven Garcia', 'https://randomuser.me/api/portraits/men/46.jpg', true, NULL);

-- Post: "How long did it take before you saw results? Been using scripts for 1 week and still struggling..."
INSERT INTO post_comments (post_id, content, author_name, author_photo_url, is_seed, user_id)
VALUES 
('72338140-2764-480d-b46e-fe11bdc98d17', 'One week is still early! Most scripts take 2-3 weeks of consistent use before you see real change. Hang in there!', 'Victoria Brown', 'https://randomuser.me/api/portraits/women/26.jpg', true, NULL),
('72338140-2764-480d-b46e-fe11bdc98d17', 'Week 1 is always the hardest. Week 2 gets easier, and by week 3 you start seeing the magic happen. Don''t give up!', 'Benjamin Chen', 'https://randomuser.me/api/portraits/men/37.jpg', true, NULL),
('72338140-2764-480d-b46e-fe11bdc98d17', 'Totally normal! Changing brain patterns takes time. The key is consistency, even when it feels like nothing is working.', 'Julia Martinez', 'https://randomuser.me/api/portraits/women/65.jpg', true, NULL);

-- Post: "Pro tip: I set a visual timer next to my son's desk..."
INSERT INTO post_comments (post_id, content, author_name, author_photo_url, is_seed, user_id)
VALUES 
('ad3bafd8-3dd1-45e4-a6db-2d07581bd96a', 'Visual timers are EVERYTHING! ADHD kids can''t feel time passing. Making it visible changes the game.', 'Hannah Kim', 'https://randomuser.me/api/portraits/women/39.jpg', true, NULL),
('ad3bafd8-3dd1-45e4-a6db-2d07581bd96a', 'Which timer do you use? Looking for recommendations! We tried an app but he just plays with the tablet instead 😅', 'Derek Wilson', 'https://randomuser.me/api/portraits/men/61.jpg', true, NULL),
('ad3bafd8-3dd1-45e4-a6db-2d07581bd96a', 'The Time Timer brand with the red shrinking disc is perfect! He can actually SEE time disappearing. Game changer for us.', 'Natalie Robinson', 'https://randomuser.me/api/portraits/women/28.jpg', true, NULL);