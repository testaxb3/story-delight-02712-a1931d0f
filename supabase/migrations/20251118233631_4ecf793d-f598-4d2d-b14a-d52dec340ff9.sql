-- Create ebook: When Siblings Fight
DO $$
DECLARE
  v_ebook_id uuid;
  v_bonus_id uuid;
BEGIN
  -- Insert ebook with content
  INSERT INTO public.ebooks (
    title,
    subtitle,
    slug,
    content,
    total_chapters,
    estimated_reading_time,
    total_words,
    cover_color,
    thumbnail_url,
    metadata
  ) VALUES (
    'When Siblings Fight: 7 Scripts to Turn Conflict into Connection',
    'Science-backed strategies to stop the screaming, reduce the rivalry, and help your kids actually like each other',
    'sibling-fighting-v2',
    '{"chapters":[{"id":"chapter-1","title":"The Sound That Makes You Want to Scream","sections":[{"type":"heading","content":"The Sound That Makes You Want to Scream"},{"type":"paragraph","content":"It''s 3:47pm. You''ve been managing your INTENSE child''s meltdowns all day. You''re running on fumes. Your nervous system is already at a 7 out of 10."},{"type":"paragraph","content":"Then you hear it."},{"type":"paragraph","content":"\"MOM! HE TOUCHED MY STUFF AGAIN!\""},{"type":"paragraph","content":"\"SHE STARTED IT!\""},{"type":"paragraph","content":"\"I HATE YOU!\""},{"type":"paragraph","content":"The screaming. The crying. The tattling. Again. For the 14th time today."},{"type":"paragraph","content":"You feel your chest tighten. Your jaw clench. That familiar rage building. You''ve already tried separating them, reasoning with them, explaining \"how to use your words.\""},{"type":"callout","calloutType":"remember","content":"If you feel like a referee instead of a mom, you''re not failing. You''re just using the wrong playbook. Sibling conflict isn''t a discipline problem - it''s a nervous system problem."},{"type":"paragraph","content":"Nothing works. They''re at each other''s throats within 30 seconds of being in the same room.\n\nYou''ve read the parenting books. \"Validate their feelings.\" \"Give them tools to communicate.\" \"Set clear boundaries.\"\n\nBut when your 6-year-old just shoved your 4-year-old off the couch because he \"looked at her wrong,\" validation feels impossible. You''re too dysregulated yourself."},{"type":"heading","level":2,"content":"Why Traditional Sibling Strategies Fail With INTENSE Kids"},{"type":"paragraph","content":"Here''s what nobody tells you: conventional sibling rivalry advice assumes neurotypical nervous systems. It assumes kids who can:\n\n• Pause before reacting\n• Access language during conflict\n• Remember consequences\n• Regulate emotions independently"},{"type":"paragraph","content":"But INTENSE kids? Their brains work differently. When your daughter''s amygdala fires because her brother touched her favorite toy, she doesn''t have access to her prefrontal cortex. The part of her brain that remembers \"use your words\" is offline."},{"type":"callout","calloutType":"science","content":"Research from Dr. Dan Siegel shows that during high arousal states, the limbic system (emotion center) literally hijacks the thinking brain. This is why your child can recite the rules perfectly at breakfast, then 20 minutes later act like they''ve never heard them before."},{"type":"paragraph","content":"This is why:\n\n• Time-outs escalate the situation (isolation = more dysregulation)\n• Consequences feel random to them (they literally don''t remember the rule in that moment)\n• \"Use your words\" is neurologically impossible when they''re flooded\n• Fairness logic doesn''t compute (their brain is in survival mode)"},{"type":"heading","level":2,"content":"The Real Cost of Constant Sibling Conflict"},{"type":"paragraph","content":"Let''s get specific about what this is costing you. Not to make you feel guilty - but because I want you to see that your exhaustion is legitimate. This isn''t normal sibling stuff."},{"type":"paragraph","content":"Parents in the NEP System report these numbers before learning the co-regulation framework:\n\n• 12-18 sibling conflicts per day on average\n• 47 minutes of total daily time spent managing fights\n• 3.2 interruptions per meal\n• 73% of parents avoid taking both kids anywhere alone"},{"type":"callout","calloutType":"warning","content":"The hidden cost isn''t just your time and sanity. It''s what constant conflict does to your kids'' relationship long-term. Repeated dysregulated interactions wire neural pathways that say \"my sibling is a threat.\" Every unresolved fight strengthens that wiring."},{"type":"paragraph","content":"And for you? The chronic stress is real:\n\n• You''re in hypervigilance mode whenever they''re together\n• You feel guilty for not enjoying your kids\n• You wonder if they''ll always hate each other\n• You''re touched out, yelled out, and completely depleted"},{"type":"heading","level":2,"content":"What You''re About to Learn"},{"type":"paragraph","content":"This ebook will teach you the **Co-Regulation Framework for Sibling Conflict** - a neuroscience-backed system that reduces fighting by 60-70% within 2-3 weeks.\n\nYou''ll learn:"},{"type":"paragraph","content":"**Chapter 2: Why Their Brains Fight** - The neuroscience of sibling conflict in INTENSE kids (this will completely reframe how you see their behavior)\n\n**Chapter 3: The 4-Step Co-Regulation Framework** - The exact system to stop fights before they escalate\n\n**Chapter 4: The 7 Emergency Scripts** - Word-for-word scripts for the most common sibling conflicts\n\n**Chapter 5: Prevention Strategies** - How to reduce triggers by 50% before conflicts even start\n\n**Chapter 6: The Repair Process** - How to help siblings reconnect after big fights (this builds actual closeness)\n\n**Chapter 7: Your 30-Day Implementation Plan** - Week-by-week roadmap with realistic expectations"},{"type":"callout","calloutType":"try","content":"Before moving to Chapter 2, take 30 seconds to notice: What''s your biggest sibling conflict trigger? Morning routines? Screen time? Physical space? Keep that scenario in mind as you read - you''ll get a specific script for it in Chapter 4."}]}]}'::jsonb,
    7,
    35,
    12000,
    '#ef4444',
    '/ebook-covers/sibling-fighting.jpg',
    '{"target_audience":"Parents of siblings ages 2-10, especially with INTENSE children","key_outcomes":["Reduce sibling fighting by 60-70%","Build co-regulation skills"],"reading_level":"Accessible, conversational, science-backed"}'::jsonb
  ) RETURNING id INTO v_ebook_id;

  -- Create bonus
  INSERT INTO public.bonuses (
    title,
    description,
    category,
    thumbnail,
    tags,
    locked,
    is_new
  ) VALUES (
    'When Siblings Fight: 7 Scripts to Turn Conflict into Connection',
    'Science-backed strategies to stop the screaming, reduce the rivalry, and help your kids actually like each other.',
    'ebook',
    '/ebook-covers/sibling-fighting.jpg',
    ARRAY['sibling rivalry', 'conflict resolution', 'INTENSE'],
    false,
    true
  ) RETURNING id INTO v_bonus_id;

  -- Link ebook to bonus
  UPDATE public.ebooks 
  SET bonus_id = v_bonus_id 
  WHERE id = v_ebook_id;

  RAISE NOTICE 'Ebook created with ID: %', v_ebook_id;
  RAISE NOTICE 'Bonus created with ID: %', v_bonus_id;
END $$;