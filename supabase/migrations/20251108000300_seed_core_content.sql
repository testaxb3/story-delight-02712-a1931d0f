-- Preload high-leverage NEP scripts so the new project feels complete on first login
insert into public.scripts (
  id,
  title,
  category,
  wrong_way,
  phrase_1,
  phrase_1_action,
  phrase_2,
  phrase_2_action,
  phrase_3,
  phrase_3_action,
  neurological_tip,
  profile
) values
  (
    'a185b5f2-7559-4bfe-8ac7-9eb66b3cab60',
    'Calm the Storm',
    'Emotional Regulation',
    '"Stop it right now or we are going home."',
    'I can see how big those feelings are. Take my hands so we can breathe together.',
    'Offer palms up and mirror three slow breaths.',
    'Your body is telling us it needs a pause. Let''s move to our calm corner for two minutes.',
    'Walk together to a calmer space and lower your voice.',
    'When the wave passes we will choose one tiny next step together.',
    'Co-create a micro action, like sipping water or squeezing a fidget.',
    'Labeling sensations lowers amygdala fire and co-regulation lends the prefrontal cortex its calm.',
    'INTENSE'
  ),
  (
    '03b1bde6-cf93-4952-acfe-36ec5b071414',
    'Focus Funnel',
    'Transitions',
    '"How many times do I have to tell you? Put it away now!"',
    'Freeze frame! What is the one thing you want to finish before we switch?',
    'Kneel to their eye level and point to the current activity.',
    'Great, let''s set a 2 minute timer together. When it sings, we power walk to the next step.',
    'Hand them the timer or tap start on your phone together.',
    'When the song ends we race to see who touches the door frame first!',
    'Inject playful urgency and move with them.',
    'Predictable countdowns plus movement give distracted brains the stimulation they crave while still switching tasks.',
    'DISTRACTED'
  ),
  (
    '5f554330-9d6c-4880-a0ce-8305566bc545',
    'Power of Choice',
    'Cooperation',
    '"Because I said so. End of discussion."',
    'I hear you want control. Do you want to start or finish this job?',
    'Offer two visual choices with your hands.',
    'Cool, I''ll take the other part. Want our team name to be Lightning or Thunder?',
    'High-five to seal the agreement.',
    'Let''s check in after five minutes and adjust if it''s not working.',
    'Set a five-minute timer they can see.',
    'Autonomy plus shared power keeps strong-willed kids in their thinking brain instead of the fight channel.',
    'DEFIANT'
  ),
  (
    '0bed6886-c93f-4746-8722-efe58cc896ef',
    'Bedtime Wind-Down',
    'Evening Routine',
    '"If you don''t calm down right now there''s no story."',
    'Your brain did big work today. Let''s tell it it''s safe to power down.',
    'Dim the lights and hand them a weighted stuffie.',
    'Which should we do first: warm washcloth or silly stretch?',
    'Model the chosen option slowly.',
    'While I read, you can trace circles on my hand to show you''re listening.',
    'Offer your hand and whisper instructions.',
    'Multi-sensory input plus predictability lowers cortisol so sleep chemicals can activate.',
    'INTENSE'
  ),
  (
    '7f386822-22a1-43a5-9691-e4a841cfd242',
    'Morning Momentum',
    'Morning Routine',
    '"We are late again! Hurry up, you never listen."',
    'Good morning teammate. What is the first mission on our launchpad?',
    'Point to a simple visual checklist.',
    'I''ll start the soundtrack—tell me when the socks mission is complete.',
    'Press play on a motivating playlist.',
    'Mission complete? Hit the buzzer and choose our breakfast victory dance.',
    'Let them trigger a fun sound or bell.',
    'Upbeat novelty keeps dopamine flowing so task initiation doesn''t feel like pushing a boulder.',
    'DISTRACTED'
  ),
  (
    'da1f6e37-63d8-4934-baae-2e5cf05728f6',
    'Team Cleanup',
    'Chores',
    '"This room is a disaster. Clean all of it before dinner."',
    'This zone looks overwhelming. Should we tackle Lego base or art table first?',
    'Stand in the room and gesture to two small areas.',
    'I''ll be the sorter. You be the speed stacker—deal?',
    'Hand them a basket and start modeling sorting.',
    'After three minutes we snap a photo of progress for the trophy wall.',
    'Set a three-minute timer and celebrate with a picture.',
    'Chunking tasks plus collaborative roles prevents shutdown from kids who equate directions with losing power.',
    'DEFIANT'
  ),
  (
    'f5916a8c-3ae3-413a-aa3f-1693a05225ba',
    'Connection Reset',
    'Connection',
    '"You''re being ridiculous. Stop crying."',
    'Press pause. Do you want a squeeze, a blanket, or quiet space?',
    'Offer three sensory options visually.',
    'I''ll stay close and match your breathing so you know you''re not alone.',
    'Sit beside them and mirror calm inhales/exhales.',
    'When you''re ready we''ll name the problem and solve it together.',
    'Wait silently until they nod or reach out.',
    'Regulation before reason: safety cues through choice and presence unlock the cortex for problem solving.',
    null
  ),
  (
    '8e580d64-f324-4478-ba92-9eeedd8be5e6',
    'Family Problem Solver',
    'Problem Solving',
    '"That''s final. I don''t want to hear another word."',
    'Sounds like this rule feels unfair. Want to map what matters to you on this whiteboard?',
    'Hand them a marker and draw two columns labelled "Need" and "Idea".',
    'Thanks for sharing. Here''s what matters to the family. Where do our ideas overlap?',
    'Write your perspective beside theirs calmly.',
    'Let''s test one idea tonight and review tomorrow. Deal?',
    'Circle the shared option and set a review time.',
    'Externalizing the debate keeps justice-driven brains engaged without triggering defiance loops.',
    'DEFIANT'
  ),
  (
    '71f70fee-9115-427c-ae8d-75765fa73d83',
    'Sensory Safety Check',
    'Regulation',
    '"It''s not that loud. You''re fine, stop overreacting."',
    'I''m scanning your space. Point to what feels too bright, too loud, or too itchy.',
    'Offer them your finger as a pointer and look where they indicate.',
    'Let''s lower or leave one thing at a time so your body feels safe.',
    'Adjust environment—dim lights, offer headphones, swap fabrics.',
    'Tell me when your body meter is in the green zone.',
    'Hold up a simple color scale card and wait for feedback.',
    'Meeting sensory needs quickly prevents the limbic hijack that looks like non-compliance.',
    'INTENSE'
  )
on conflict (id) do nothing;

-- Seed the video classroom with transformative lessons
insert into public.videos (
  id,
  title,
  description,
  video_url,
  section,
  order_index,
  duration,
  locked
) values
  (
    '22a64255-a2e2-404b-bc13-c400e8bca24d',
    'Welcome to the NeuroExpansion Path',
    'Understand how your child''s brain processes stress and how NEP rewires responses.',
    'https://player.vimeo.com/video/76979871',
    'foundation',
    1,
    '08:32',
    false
  ),
  (
    '2d063d45-828f-4e07-87cc-7ff1d22e0a74',
    'De-escalation in 90 Seconds',
    'A step-by-step playbook to move from chaos to calm without power struggles.',
    'https://player.vimeo.com/video/357274789',
    'foundation',
    2,
    '06:18',
    false
  ),
  (
    '760e57b1-8bce-4906-8266-0c12abe49f5d',
    'Playful Transitions that Stick',
    'Turn the toughest daily switches into connection rituals your child loves.',
    'https://player.vimeo.com/video/1084537',
    'practice',
    1,
    '07:05',
    false
  ),
  (
    'e01402c7-7470-4174-b7d7-266cf0b3ad47',
    'Coaching Strong-Willed Brains',
    'Partner with justice-driven kids so they feel powerful and still follow through.',
    'https://player.vimeo.com/video/143418951',
    'practice',
    2,
    '09:11',
    false
  ),
  (
    '28bd51a3-a576-424a-a313-3a4b6f18be3d',
    'Sensory Resets on the Go',
    'Fast regulation tools for overstimulated environments like stores and family gatherings.',
    'https://player.vimeo.com/video/654911958',
    'mastery',
    1,
    '05:54',
    true
  ),
  (
    '32fe624d-3dfb-4112-bc91-e4ce150f7448',
    'The 30-Day Momentum Map',
    'Stack habits that keep your streak alive and make scripts automatic.',
    'https://player.vimeo.com/video/238902809',
    'mastery',
    2,
    '10:42',
    true
  )
on conflict (id) do nothing;

-- Provide downloadable resources for instant wins
insert into public.pdfs (
  id,
  title,
  description,
  file_url,
  category,
  premium
) values
  (
    '83d1e56a-1ad6-4a22-8703-a35b146687e5',
    'NEP Script Cheat Sheet',
    'One-page reference with calming scripts for the three dominant brain profiles.',
    'https://storage.googleapis.com/brainy-child-guide/resources/nep-script-cheat-sheet.pdf',
    'Guides',
    false
  ),
  (
    '72ebb152-d376-486a-a37d-5fa4d856776d',
    'Morning Momentum Checklist',
    'Visual routine your child can follow independently every weekday morning.',
    'https://storage.googleapis.com/brainy-child-guide/resources/morning-momentum-checklist.pdf',
    'Routines',
    false
  ),
  (
    'a9f2e9a0-fbb6-4646-bc79-e22eefc7fad4',
    'Sensory Toolkit Planner',
    'Customize a go-bag with regulation tools tailored to your child''s sensory profile.',
    'https://storage.googleapis.com/brainy-child-guide/resources/sensory-toolkit-planner.pdf',
    'Regulation',
    true
  ),
  (
    'd2eb300e-745d-4a1d-af1f-e06bb3545c2e',
    '30-Day Momentum Tracker',
    'Celebrate every check-in with this printable calendar aligned to the in-app challenge.',
    'https://storage.googleapis.com/brainy-child-guide/resources/30-day-momentum-tracker.pdf',
    'Accountability',
    false
  )
on conflict (id) do nothing;
