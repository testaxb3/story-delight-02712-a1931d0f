
INSERT INTO scripts (
  title, category, profile, age_min, age_max, difficulty, duration_minutes,
  the_situation, what_doesnt_work, strategy_steps, why_this_works,
  what_to_expect, common_variations, parent_state_needed, tags, emergency_suitable
) VALUES (
  'Asked to put shoes on 25 minutes ago - found them building an elaborate pillow fort instead',
  'Daily Responsibilities',
  'DISTRACTED',
  4, 9,
  'Easy',
  5,
  
  E'7:43 AM. School starts at 8:15. You need to leave in 7 minutes.\n\n"Put your shoes on, we''re leaving soon."\n\n"Okay!"\n\nThat was 25 minutes ago.\n\nYou just found your 6-year-old in the living room, one sock on, surrounded by every pillow in the house arranged in an architectural masterpiece. They''re carefully adjusting a blanket roof, completely absorbed in their creation.\n\nTheir shoes are still by the door. Untouched. They haven''t moved toward them once.\n\n"What are you DOING? I said shoes 25 minutes ago!"\n\nThey look up, genuinely confused. "I was going to! But then I thought of a really cool fort idea and I had to try it before I forgot."\n\nNot a trace of defiance. No attitude. Just... pure, innocent distraction. They honestly thought they were on their way to get shoes. Somehow, 25 minutes evaporated and a pillow fort materialized instead.',
  
  E'**❌ COMMON MISTAKE #1: The Repetition Escalation**\n\n"Shoes! Shoes! SHOES! How many times do I have to say it?!"\n\nRepeating louder doesn''t help. They heard you the first time. The information went in and then immediately got displaced by something more interesting. Volume doesn''t improve retention.\n\n\n**❌ COMMON MISTAKE #2: The Responsibility Lecture**\n\n"You need to learn to listen! You''re 6 years old! This isn''t that hard!"\n\nActually, for their brain, it IS that hard. The gap between intention and action is genuinely wider for DISTRACTED kids. They''re not choosing to ignore you - they''re losing the instruction.\n\n\n**❌ COMMON MISTAKE #3: Doing It For Them**\n\n(Grabbing shoes, jamming them on their feet while muttering about being late)\n\nThis works for today. It creates learned helplessness for tomorrow. They never build the executive function skills they need because you keep bypassing them.',
  
  '[
    {
      "step_number": 1,
      "step_title": "Interrupt With Presence, Not Words",
      "step_explanation": "More words won''t help - their brain already has too many inputs. Instead, enter their physical space. Put yourself between them and the distraction. Make eye contact. Touch their shoulder. Your physical presence anchors their attention in a way words can''t.",
      "what_to_say_examples": [
        "(Walking over, gently blocking the fort) Hey. Eyes on me for a second.",
        "(Crouching down, hand on their arm) Hold up. I need your brain for 30 seconds.",
        "(Stepping into their line of sight) Pause the fort. Look at me."
      ]
    },
    {
      "step_number": 2,
      "step_title": "One Step, One Sentence",
      "step_explanation": "DISTRACTED brains lose multi-step instructions. Don''t say ''put on your shoes and grab your backpack and we need to leave.'' Give ONE instruction. Make it concrete. Include the first physical action.",
      "what_to_say_examples": [
        "Walk to the door. That''s it. Just walk to the door.",
        "Stand up and take my hand. We''re going to find your shoes together.",
        "Shoes. They''re by the door. Go touch them and I''ll meet you there."
      ]
    },
    {
      "step_number": 3,
      "step_title": "Body Doubles the Action",
      "step_explanation": "The DISTRACTED brain works better with a ''body double'' - someone physically present during the task. Walk with them. Stand near them while they put shoes on. Your presence acts as an external anchor that keeps them in the task until completion.",
      "what_to_say_examples": [
        "I''m going to stand right here while you get those on. I''ve got nowhere else to be for the next 60 seconds.",
        "Let''s do this together. You do left, I''ll hold the right ready.",
        "I''m just going to be here. Keep going. Almost there."
      ]
    }
  ]',
  
  E'DISTRACTED brains have a **working memory** that functions like a small, slippery bucket. Information goes in, but quickly gets dumped when something new appears.\n\nThe pillow fort wasn''t defiance - it was **working memory hijacking**. An idea popped up (fort!) and completely overwrite the previous instruction (shoes). They''re not choosing to disobey; their brain literally lost the information.\n\n**Physical presence** works because it occupies their attention channel. When you''re standing there, you''re the most salient stimulus. When you walk away, whatever''s in front of them becomes more salient.\n\n**Body doubling** is a validated strategy for ADHD and attention differences. The physical presence of another person doing something (or waiting) creates enough external accountability to keep their brain on task.',
  
  '{
    "first_30_seconds": "They might protest abandoning the fort: ''But I''m almost done!'' or look wistfully back at it. That''s okay. Gently redirect: ''Fort will be here later. Shoes first.''",
    "by_2_minutes": "With you physically present, shoes should be going on. They might try to talk about the fort while getting dressed. Let them talk - the key is the shoes are happening.",
    "this_is_success": "Success is shoes on feet before leaving - regardless of how much assistance you provided. You''re not babying them; you''re providing the scaffolding their brain needs until it develops more.",
    "dont_expect": [
      "Them to remember tomorrow without reminders",
      "The fort distraction to be the last one ever",
      "This to feel like ''real'' obedience",
      "Self-sufficiency on morning routines yet"
    ]
  }',
  
  '[
    {
      "variation_scenario": "They get upset about the fort: ''You''re ruining everything!''",
      "variation_response": "''I get it - you made something cool and I''m interrupting. Shoes first, then tell me about your fort idea in the car. I actually want to hear about it.'' Validate and delay, don''t dismiss."
    },
    {
      "variation_scenario": "They start shoes but get distracted again mid-task",
      "variation_response": "Don''t lecture. Gently redirect: ''Shoe. Keep going.'' Think of yourself as a GPS: when they go off course, just recalculate, don''t criticize."
    },
    {
      "variation_scenario": "This happens EVERY morning",
      "variation_response": "You need a systems change, not a behavior change. Shoes by the breakfast table. Backpack already in car. Visual checklist. Reduce the distance between instruction and object."
    }
  ]',
  
  'Patience and proximity. Your physical presence is a tool, not a punishment. Being there isn''t because they''re ''bad at listening'' - it''s because their brain needs scaffolding. Think of yourself as a helpful GPS, not a frustrated drill sergeant.',
  
  ARRAY['morning-routine', 'shoes', 'distracted', 'daily-responsibilities', 'getting-ready', 'school', 'executive-function', 'working-memory', 'body-doubling'],
  false
);
