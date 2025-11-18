
-- Insert enriched V2 version of "35 Strategies to Get Your Child Off Screens"
INSERT INTO ebooks (
  id,
  title,
  slug,
  subtitle,
  bonus_id,
  content,
  total_chapters,
  total_words,
  estimated_reading_time,
  cover_color,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  '35 Strategies to Get Your Child Off Screens',
  '35-strategies-to-get-your-child-off-screens-v2',
  'Evidence-based strategies to reclaim your child''s attention and restore family balance',
  (SELECT id FROM bonuses WHERE title ILIKE '%35 Strategies%' LIMIT 1),
  jsonb_build_object(
    'chapters', jsonb_build_array(
      -- CHAPTER 1: The Screen Crisis
      jsonb_build_object(
        'title', 'The Screen Crisis',
        'content', jsonb_build_array(
          jsonb_build_object('type', 'heading2', 'content', 'Why Your Child Can''t Stop Scrolling'),
          jsonb_build_object('type', 'paragraph', 'content', 'The uncomfortable truth: **Your child''s brain is being hijacked**. And it''s not their fault.'),
          jsonb_build_object('type', 'paragraph', 'content', 'Children ages 8-18 spend an average of **7.5 hours per day** on screens (NIH, 2024). That''s more time than they spend sleeping. More time than they spend at school. More time than they spend with you.'),
          jsonb_build_object('type', 'callout', 'calloutType', 'SCIENCE', 'content', jsonb_build_object('title', 'The Dopamine Trap', 'body', 'Every notification, like, and new video triggers a **dopamine release** in your child''s brain—the same neurotransmitter involved in addiction. Social media platforms employ **variable reward schedules**, the most addictive reinforcement pattern known to psychology.')),
          jsonb_build_object('type', 'paragraph', 'content', 'But here''s what most parents don''t realize: **screen time isn''t the real problem**. It''s *what screens are replacing*.'),
          jsonb_build_object('type', 'heading2', 'content', 'What We''re Really Losing'),
          jsonb_build_object('type', 'paragraph', 'content', 'When your child is glued to a screen, they''re missing out on:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Face-to-face interaction** → Critical for developing empathy and reading social cues',
            '**Physical play** → Essential for motor development and emotional regulation',
            '**Boredom** → The birthplace of creativity and problem-solving',
            '**Deep focus** → The ability to concentrate on difficult tasks',
            '**Sleep quality** → Blue light disrupts melatonin production'
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'WARNING', 'content', jsonb_build_object('title', 'The Long-Term Cost', 'body', 'Research from Stanford University shows that excessive screen time during childhood is linked to: **decreased academic performance**, **increased anxiety and depression**, **sleep disorders**, and **delayed social-emotional development**. The impacts can last into adulthood.')),
          jsonb_build_object('type', 'heading2', 'content', 'The Parent''s Dilemma'),
          jsonb_build_object('type', 'paragraph', 'content', 'You''ve probably tried the obvious solutions:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            'Setting time limits (ignored or negotiated away)',
            'Removing devices (leading to epic meltdowns)',
            'Bribing with screen time (creating more dependency)',
            'Explaining the harm (met with eye rolls)'
          )),
          jsonb_build_object('type', 'paragraph', 'content', 'None of it worked. You felt like the bad guy. Your child seemed miserable. And the peace in your home evaporated.'),
          jsonb_build_object('type', 'callout', 'calloutType', 'REMEMBER', 'content', jsonb_build_object('title', 'You''re Not Alone', 'body', 'Over **95% of parents** report struggling with managing their children''s screen time. The strategies in this guide are based on research and real-world success stories from families who''ve reclaimed balance.')),
          jsonb_build_object('type', 'paragraph', 'content', '**This guide will show you a different way**—one that doesn''t rely on willpower, doesn''t create constant conflict, and actually works.')
        )
      ),
      
      -- CHAPTER 2: Understanding Electronic Screen Syndrome
      jsonb_build_object(
        'title', 'Understanding Electronic Screen Syndrome',
        'content', jsonb_build_array(
          jsonb_build_object('type', 'heading2', 'content', 'The Hidden Disorder Affecting Millions'),
          jsonb_build_object('type', 'paragraph', 'content', 'Dr. Victoria Dunckley''s groundbreaking research uncovered something shocking: **many behavioral and learning problems in children aren''t standalone diagnoses**—they''re symptoms of *Electronic Screen Syndrome* (ESS).'),
          jsonb_build_object('type', 'callout', 'calloutType', 'SCIENCE', 'content', jsonb_build_object('title', 'What Is ESS?', 'body', 'Electronic Screen Syndrome occurs when excessive screen time **dysregulates the nervous system**, leading to a state of chronic *hyperarousal*. The brain becomes "stuck" in fight-or-flight mode, unable to properly rest and recover.')),
          jsonb_build_object('type', 'heading2', 'content', 'Common Signs Your Child May Have ESS'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Mood dysregulation** → Increased irritability, emotional outbursts, or depression',
            '**Poor impulse control** → Difficulty waiting, interrupting constantly',
            '**Difficulty focusing** → Can''t complete homework or follow multi-step directions',
            '**Disorganization** → Loses things, forgets tasks, struggles with time management',
            '**Insomnia** → Difficulty falling asleep or staying asleep',
            '**Sensory overload** → Overwhelmed by lights, sounds, or textures'
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'WARNING', 'content', jsonb_build_object('title', 'The Misdiagnosis Problem', 'body', 'Many children with ESS are misdiagnosed with ADHD, bipolar disorder, or oppositional defiant disorder. Before pursuing medication, Dr. Dunckley recommends a **4-week screen fast** to see if symptoms improve.')),
          jsonb_build_object('type', 'heading2', 'content', 'Why Screens Dysregulate the Brain'),
          jsonb_build_object('type', 'paragraph', 'content', 'Think of your child''s nervous system like a battery. Sleep recharges it. Screens drain it—**fast**.'),
          jsonb_build_object('type', 'paragraph', 'content', 'Screen time triggers multiple stress responses:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Visual stimulation** → Rapid scene changes overstimulate the visual cortex',
            '**Blue light exposure** → Suppresses melatonin, disrupting circadian rhythms',
            '**Interactive engagement** → Keeps the brain in an "always on" state',
            '**Reward unpredictability** → Creates anxiety about missing out'
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'REMEMBER', 'content', jsonb_build_object('title', 'Recovery Is Possible', 'body', 'The good news: **ESS is reversible**. With consistent screen reduction and replacement activities, most children show significant improvement within 2-4 weeks. Complete recovery typically occurs within 3 months.')),
          jsonb_build_object('type', 'heading2', 'content', 'The 4-Week Reset Protocol'),
          jsonb_build_object('type', 'paragraph', 'content', 'Dr. Dunckley''s research shows that a **complete screen fast** for 3-4 weeks allows the nervous system to reset. This doesn''t mean screens forever—it means creating a baseline so you can reintroduce them mindfully.'),
          jsonb_build_object('type', 'script', 'content', 'What to expect during the reset:\n\n**Week 1**: Withdrawal symptoms peak—irritability, boredom complaints, anxiety\n→ Stay consistent. Offer alternative activities. Validate their feelings.\n\n**Week 2**: Behavioral improvements begin—better mood, increased creativity\n→ Notice and celebrate small wins. Keep replacement activities engaging.\n\n**Week 3**: Sleep improves noticeably—easier bedtimes, better morning moods\n→ Establish consistent sleep routines to maintain progress.\n\n**Week 4**: Focus and emotional regulation stabilize\n→ Plan for mindful screen reintroduction with clear boundaries.')
        )
      ),

      -- CHAPTER 3: The Neuroscience Behind Screen Addiction
      jsonb_build_object(
        'title', 'The Neuroscience Behind Screen Addiction',
        'content', jsonb_build_array(
          jsonb_build_object('type', 'heading2', 'content', 'Why Screens Are More Addictive Than Candy'),
          jsonb_build_object('type', 'paragraph', 'content', 'To win this battle, you need to understand what you''re fighting. **Tech companies employ neuroscientists and behavioral psychologists** whose sole job is to make their apps as addictive as possible.'),
          jsonb_build_object('type', 'paragraph', 'content', 'They''ve succeeded. Brilliantly.'),
          jsonb_build_object('type', 'callout', 'calloutType', 'SCIENCE', 'content', jsonb_build_object('title', 'The Variable Reward System', 'body', 'Slot machines and social media use the same psychological trick: **variable ratio reinforcement**. You never know when the next reward (like, comment, funny video) will come, so your brain stays hyper-engaged, constantly checking.')),
          jsonb_build_object('type', 'heading2', 'content', 'Three Brain Systems Under Attack'),
          jsonb_build_object('type', 'paragraph', 'content', '**1. The Dopamine System**'),
          jsonb_build_object('type', 'paragraph', 'content', 'Every notification triggers a small dopamine hit. Over time, the brain **downregulates dopamine receptors**—meaning your child needs more and more stimulation to feel the same pleasure. Real-world activities (playing outside, reading, conversation) can''t compete.'),
          jsonb_build_object('type', 'paragraph', 'content', '**2. The Prefrontal Cortex**'),
          jsonb_build_object('type', 'paragraph', 'content', 'This is your child''s "executive control center"—responsible for decision-making, impulse control, and focus. It''s also the **last part of the brain to develop** (not fully mature until age 25). Excessive screen time impairs its development.'),
          jsonb_build_object('type', 'paragraph', 'content', '**3. The Stress Response System**'),
          jsonb_build_object('type', 'paragraph', 'content', 'Screens keep the **amygdala** (fear center) activated. The constant stimulation triggers low-level fight-or-flight responses, flooding the body with cortisol and adrenaline.'),
          jsonb_build_object('type', 'callout', 'calloutType', 'WARNING', 'content', jsonb_build_object('title', 'The Attention Economy', 'body', 'You''re not competing with screens. You''re competing with **billion-dollar companies** who employ the world''s best psychologists to capture and hold attention. Understanding this shifts blame away from your child—and helps you develop effective strategies.')),
          jsonb_build_object('type', 'heading2', 'content', 'The Comparison Trap'),
          jsonb_build_object('type', 'paragraph', 'content', 'Social media adds another layer of harm: **constant social comparison**.'),
          jsonb_build_object('type', 'paragraph', 'content', 'Your child sees curated highlight reels from peers—perfect bodies, exciting vacations, endless friend groups. Their brain interprets this as: *"Everyone else''s life is better than mine."*'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Instagram/TikTok**: Linked to increased body dissatisfaction and eating disorders',
            '**Snapchat**: Creates anxiety about maintaining "streaks" and FOMO',
            '**YouTube**: Infinite scroll keeps kids watching far longer than intended',
            '**Gaming**: Uses progression systems and social pressure to increase engagement'
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'REMEMBER', 'content', jsonb_build_object('title', 'Your Child Isn''t Weak', 'body', 'If your child struggles to put down devices, it''s not a character flaw. They''re up against **deliberately engineered addiction mechanisms**. The solution isn''t more willpower—it''s better systems.')),
          jsonb_build_object('type', 'heading2', 'content', 'The Good News About Neuroplasticity'),
          jsonb_build_object('type', 'paragraph', 'content', 'Here''s the hopeful part: **the brain is incredibly adaptable**. When you reduce screen time and provide engaging alternatives, your child''s brain begins to heal:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            'Dopamine receptors upregulate → Real-world activities become enjoyable again',
            'Prefrontal cortex strengthens → Impulse control and focus improve',
            'Stress hormones normalize → Mood stabilizes, sleep improves',
            'Attention span lengthens → Homework becomes manageable'
          )),
          jsonb_build_object('type', 'paragraph', 'content', 'Recovery isn''t just possible—**it''s probable**, if you follow the right steps.')
        )
      ),

      -- CHAPTER 4: Immediate Action Strategies
      jsonb_build_object(
        'title', 'Immediate Action Strategies',
        'content', jsonb_build_array(
          jsonb_build_object('type', 'heading2', 'content', 'Quick Wins to Start the Reset'),
          jsonb_build_object('type', 'paragraph', 'content', 'These 8 strategies can be implemented **immediately**—even today—and will create noticeable improvements within days.'),
          jsonb_build_object('type', 'callout', 'calloutType', 'TRY', 'content', jsonb_build_object('title', 'Start Small for Big Wins', 'body', 'Don''t try all 8 at once. Pick **2-3 strategies** that feel most doable for your family. Build momentum with early success before adding more.')),
          jsonb_build_object('type', 'heading2', 'content', 'Strategy #1: The No-Phone Morning'),
          jsonb_build_object('type', 'paragraph', 'content', 'The first hour after waking sets the tone for the entire day. When kids check devices immediately upon waking, they start the day in **reactive mode**—responding to notifications instead of being intentional.'),
          jsonb_build_object('type', 'script', 'content', 'Implementation:\n\n**Before bed**: Collect all devices and charge them in a central location (NOT bedrooms)\n→ "Phones sleep in the kitchen, just like we sleep in our beds."\n\n**Morning routine**: Complete breakfast, getting dressed, and tooth-brushing BEFORE device access\n→ "We fuel our bodies before we fuel our minds with screens."\n\n**Set a clear marker**: Use a visual timer or clock time (e.g., no screens before 8am on school days)'),
          jsonb_build_object('type', 'callout', 'calloutType', 'SCIENCE', 'content', jsonb_build_object('title', 'Why This Works', 'body', 'Research from the University of Pennsylvania shows that **delayed phone access** improves morning cortisol regulation, leading to better mood and focus throughout the day.')),
          jsonb_build_object('type', 'heading2', 'content', 'Strategy #2: Device-Free Meals'),
          jsonb_build_object('type', 'paragraph', 'content', 'Family meals are one of the **strongest predictors** of child wellbeing—but only when screens aren''t present.'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Create a device basket**: All phones go in during meals',
            '**Lead by example**: Parents must follow the same rule',
            '**Use conversation starters**: Have prompts ready for awkward silences',
            '**Celebrate small talk**: Don''t expect deep conversations immediately'
          )),
          jsonb_build_object('type', 'heading2', 'content', 'Strategy #3: The One-Hour-Before-Bed Cutoff'),
          jsonb_build_object('type', 'paragraph', 'content', '**Blue light** from screens suppresses melatonin production for 2-3 hours. If your child watches videos at 9pm, they won''t feel sleepy until midnight.'),
          jsonb_build_object('type', 'script', 'content', 'The Bedtime Wind-Down Routine:\n\n**7:00pm**: Announce "screens off in one hour" (gives warning)\n\n**8:00pm**: Collect all devices, plug into charging station\n→ Use a visual timer so kids can see time passing\n\n**8:00-9:00pm**: Offer calming alternatives:\n• Reading together\n• Audiobooks or podcasts\n• Board games or puzzles\n• Drawing or journaling\n• Gentle stretching or yoga'),
          jsonb_build_object('type', 'callout', 'calloutType', 'WARNING', 'content', jsonb_build_object('title', 'The First Week Will Be Hard', 'body', 'Expect resistance, complaints, and possibly tears. **This is normal withdrawal**. Stay consistent. Most families report significant sleep improvements by day 5-7.')),
          jsonb_build_object('type', 'heading2', 'content', 'Strategy #4: Remove Bedroom Devices'),
          jsonb_build_object('type', 'paragraph', 'content', 'Non-negotiable. **Bedrooms are for sleeping**, not scrolling at 2am.'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            'Replace phone alarm → Buy an actual alarm clock',
            'Replace "relaxation" videos → Use white noise machine or calming music',
            'Replace "can''t sleep without it" → Create a new bedtime routine with books',
            'Replace "need it for emergencies" → Landline in common area or parent phone nearby'
          )),
          jsonb_build_object('type', 'heading2', 'content', 'Strategy #5: Turn Off All Notifications'),
          jsonb_build_object('type', 'paragraph', 'content', '**Every ping is a dopamine trigger**. Disable notifications for social media, games, and non-essential apps.'),
          jsonb_build_object('type', 'paragraph', 'content', 'Keep only: texts from family, phone calls, and calendar reminders.'),
          jsonb_build_object('type', 'heading2', 'content', 'Strategy #6: Grayscale Mode'),
          jsonb_build_object('type', 'paragraph', 'content', 'A surprisingly effective trick: **turn the phone to grayscale**. Apps are designed with bright colors specifically to trigger dopamine. Remove the colors, reduce the appeal.'),
          jsonb_build_object('type', 'paragraph', 'content', '*iPhone*: Settings → Accessibility → Display & Text Size → Color Filters → Grayscale'),
          jsonb_build_object('type', 'paragraph', 'content', '*Android*: Settings → Accessibility → Vision → Color Correction → Grayscale'),
          jsonb_build_object('type', 'heading2', 'content', 'Strategy #7: The Replacement Box'),
          jsonb_build_object('type', 'paragraph', 'content', 'When you take away screens, you must **replace them with something**. Create a "Boredom Box" with engaging alternatives:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            'Art supplies (sketchbook, markers, clay)',
            'Building materials (LEGOs, blocks, craft sticks)',
            'Books at their reading level',
            'Puzzles and brain teasers',
            'Outdoor equipment (ball, jump rope, sidewalk chalk)',
            'Board games that can be played solo'
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'TRY', 'content', jsonb_build_object('title', 'The Boredom Challenge', 'body', 'The first few days, your child will complain they''re bored. **Don''t fix it for them**. Boredom is where creativity is born. Resist the urge to entertain—let them figure it out.')),
          jsonb_build_object('type', 'heading2', 'content', 'Strategy #8: Model the Behavior'),
          jsonb_build_object('type', 'paragraph', 'content', '**Kids don''t do what you say. They do what you do.**'),
          jsonb_build_object('type', 'paragraph', 'content', 'If you''re scrolling Instagram while telling them to put down their phone, the message is clear: *"Screens are important."*'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            'Put your phone away during family time',
            'Read physical books instead of scrolling',
            'Engage in hobbies that don''t involve screens',
            'Be fully present during conversations'
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'REMEMBER', 'content', jsonb_build_object('title', 'Progress Over Perfection', 'body', 'You don''t need to implement all 8 strategies perfectly. Even adding **2-3 of these** will create noticeable improvements in your child''s mood, sleep, and focus.'))
        )
      ),

      -- CHAPTER 5: Building Screen-Free Habits
      jsonb_build_object(
        'title', 'Building Screen-Free Habits',
        'content', jsonb_build_array(
          jsonb_build_object('type', 'heading2', 'content', 'The Replacement Principle'),
          jsonb_build_object('type', 'paragraph', 'content', '**You can''t just remove screens. You must replace them.**'),
          jsonb_build_object('type', 'paragraph', 'content', 'Think of screen time like junk food. You can''t just remove the cookies and leave an empty pantry—your child will rebel, sneak food, or have a meltdown. You need to stock **equally appealing alternatives**.'),
          jsonb_build_object('type', 'callout', 'calloutType', 'SCIENCE', 'content', jsonb_build_object('title', 'The Power of Substitution', 'body', 'Behavioral psychology research shows that **habit replacement** is far more effective than habit elimination. Instead of "stop using screens," the goal is "choose engaging alternatives."')),
          jsonb_build_object('type', 'heading2', 'content', 'What Makes a Good Replacement Activity?'),
          jsonb_build_object('type', 'paragraph', 'content', 'Not all non-screen activities are created equal. The best replacements share three qualities:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Immediately engaging** → No complicated setup or learning curve',
            '**Provides sensory input** → Activates touch, movement, or creativity',
            '**Offers autonomy** → Kids can do it independently without constant supervision'
          )),
          jsonb_build_object('type', 'heading2', 'content', 'The 4 Categories of Replacement Activities'),
          jsonb_build_object('type', 'paragraph', 'content', '**Category 1: Physical Movement**'),
          jsonb_build_object('type', 'paragraph', 'content', 'Movement is the **fastest way** to regulate the nervous system and release pent-up energy.'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            'Trampoline or jump rope',
            'Dance party to favorite music',
            'Bike ride or scooter around the block',
            'Sports practice (shooting hoops, kicking a soccer ball)',
            'Parkour or obstacle courses in the backyard',
            'Family walk after dinner'
          )),
          jsonb_build_object('type', 'paragraph', 'content', '**Category 2: Creative Expression**'),
          jsonb_build_object('type', 'paragraph', 'content', 'Creative activities activate the **prefrontal cortex**—the same brain region weakened by excessive screen time.'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            'Drawing, painting, or sculpting with clay',
            'Building with LEGOs, blocks, or cardboard',
            'Writing stories, comics, or journaling',
            'Playing a musical instrument',
            'Photography walks (with a real camera, not a phone)',
            'DIY crafts (friendship bracelets, origami, woodworking)'
          )),
          jsonb_build_object('type', 'paragraph', 'content', '**Category 3: Social Connection**'),
          jsonb_build_object('type', 'paragraph', 'content', 'Real-world social interaction builds **empathy, communication skills**, and emotional regulation.'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            'Board games or card games with family',
            'Invite a friend over for outdoor play',
            'Cooking or baking together',
            'Volunteering in the community',
            'Family game night traditions',
            'Neighborhood kickball or hide-and-seek'
          )),
          jsonb_build_object('type', 'paragraph', 'content', '**Category 4: Productive Boredom**'),
          jsonb_build_object('type', 'paragraph', 'content', 'This might sound counterintuitive, but **boredom is essential** for developing creativity and self-directed play.'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            'Free play with no agenda',
            'Building forts or "secret bases"',
            'Nature exploration (collecting rocks, leaves, bugs)',
            'Reading for pleasure',
            'Audiobooks or podcasts',
            'Daydreaming and unstructured time'
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'REMEMBER', 'content', jsonb_build_object('title', 'Embrace the "I''m Bored" Phase', 'body', 'The first week off screens, your child will complain of boredom. **This is a good sign**—it means their brain is detoxing from constant stimulation. Resist the urge to fix it. Boredom is where creativity begins.')),
          jsonb_build_object('type', 'heading2', 'content', 'The Weekly Activity Calendar'),
          jsonb_build_object('type', 'paragraph', 'content', 'Structure reduces resistance. Create a **visual schedule** showing when screen-free activities happen each week.'),
          jsonb_build_object('type', 'script', 'content', 'Sample Screen-Free Schedule:\n\n**Monday**: Family game night after dinner\n→ Rotate who picks the game\n\n**Tuesday**: Art hour (everyone does a creative project)\n→ Display finished artwork on the fridge\n\n**Wednesday**: Outdoor play (bike ride, park, backyard games)\n→ Parent participates for at least 15 minutes\n\n**Thursday**: Cooking together (kid picks and helps make dinner)\n→ Even young kids can tear lettuce, stir, or set the table\n\n**Friday**: Movie night (intentional screen time with family)\n→ Make it special: popcorn, blankets, no phones\n\n**Saturday**: Big adventure (hike, museum, library, farmers market)\n→ Break the routine, explore something new\n\n**Sunday**: Free play / boredom day\n→ No agenda, let kids direct their own activities'),
          jsonb_build_object('type', 'callout', 'calloutType', 'TRY', 'content', jsonb_build_object('title', 'The Power of Anticipation', 'body', 'Post the schedule where kids can see it. **Anticipating fun activities** activates the same dopamine system that screens hijack—but in a healthier way.')),
          jsonb_build_object('type', 'heading2', 'content', 'Making It Stick: The 21-Day Habit Rule'),
          jsonb_build_object('type', 'paragraph', 'content', 'Habits take **21 days of consistent repetition** to become automatic. The first 2 weeks will require active effort. By week 3, the new routines will feel normal.'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Week 1**: Constant reminders needed, lots of resistance',
            '**Week 2**: Less prompting required, occasional buy-in',
            '**Week 3**: Activities become expected parts of the routine',
            '**Week 4+**: New habits are established, resistance drops significantly'
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'WARNING', 'content', jsonb_build_object('title', 'Don''t Give Up During Week 1', 'body', 'The first week is the hardest. Kids will push back, complain, and test boundaries. **This is expected**. Stay consistent. The breakthrough happens in weeks 2-3.'))
        )
      ),

      -- CHAPTER 6: The 5Cs Framework
      jsonb_build_object(
        'title', 'The 5Cs Framework',
        'content', jsonb_build_array(
          jsonb_build_object('type', 'heading2', 'content', 'The Official Evidence-Based Approach'),
          jsonb_build_object('type', 'paragraph', 'content', 'The American Academy of Pediatrics developed the **5Cs Framework** as a research-backed guide for healthy media use in families.'),
          jsonb_build_object('type', 'callout', 'calloutType', 'SCIENCE', 'content', jsonb_build_object('title', 'Why Follow the AAP?', 'body', 'The AAP''s guidelines are based on **decades of research** across pediatrics, neuroscience, and developmental psychology. These aren''t arbitrary rules—they''re evidence-based best practices.')),
          jsonb_build_object('type', 'heading2', 'content', 'The 5Cs Explained'),
          jsonb_build_object('type', 'paragraph', 'content', '**1. Child**'),
          jsonb_build_object('type', 'paragraph', 'content', 'Consider your child''s **age, maturity, and temperament**.'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Under 18 months**: Avoid screens entirely (except video calls)',
            '**18-24 months**: High-quality educational content only, co-viewed with parent',
            '**2-5 years**: Limit to 1 hour per day of high-quality programming',
            '**6-12 years**: Consistent limits based on family values, prioritize sleep and physical activity',
            '**13+ years**: Balance screen time with offline activities, monitor for signs of overuse'
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'REMEMBER', 'content', jsonb_build_object('title', 'One Size Doesn''t Fit All', 'body', 'A child with ADHD may need **stricter limits** than their sibling. A teen with anxiety may struggle more with social media. Customize based on your child''s unique needs.')),
          jsonb_build_object('type', 'paragraph', 'content', '**2. Content**'),
          jsonb_build_object('type', 'paragraph', 'content', 'Not all screen time is equal. **Quality matters more than quantity**.'),
          jsonb_build_object('type', 'table', 'headers', jsonb_build_array('High-Quality Content', 'Low-Quality Content'), 'rows', jsonb_build_array(
            jsonb_build_array('Educational, age-appropriate', 'Mindless entertainment'),
            jsonb_build_array('Encourages creativity or learning', 'Passive consumption'),
            jsonb_build_array('Co-viewed with adults', 'Watched alone'),
            jsonb_build_array('Limited violence/ads', 'Heavy violence or ads targeting kids')
          )),
          jsonb_build_object('type', 'paragraph', 'content', '**Green Light Content**: PBS Kids, Khan Academy, audiobooks, creative apps (GarageBand, iMovie)'),
          jsonb_build_object('type', 'paragraph', 'content', '**Red Light Content**: Infinite scroll platforms (TikTok, Instagram Reels), violent games, YouTube without supervision'),
          jsonb_build_object('type', 'paragraph', 'content', '**3. Calm**'),
          jsonb_build_object('type', 'paragraph', 'content', 'Screen time should **not replace** calming activities like sleep, physical play, or face-to-face time.'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**No screens 1 hour before bed** → Protects sleep quality',
            '**No screens during meals** → Builds family connection',
            '**No screens during meltdowns** → Teaches real coping skills',
            '**No background TV** → Reduces sensory overload'
          )),
          jsonb_build_object('type', 'script', 'content', 'Teaching Calm Without Screens:\n\nWhen your child is upset:\n\n**Instead of**: "Here, watch this video to calm down"\n\n**Try**: "Let''s take three deep breaths together" or "Want to squeeze this stress ball?" or "Should we go for a quick walk?"\n\nWhy this matters:\n→ Screens provide *temporary distraction*, not true emotional regulation\n→ Kids must learn to *self-soothe* using healthy strategies'),
          jsonb_build_object('type', 'paragraph', 'content', '**4. Crowding Out**'),
          jsonb_build_object('type', 'paragraph', 'content', 'Screens shouldn''t **crowd out** essential activities.'),
          jsonb_build_object('type', 'paragraph', 'content', '**Non-negotiable priorities**:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Sleep**: 9-12 hours for school-age kids, 8-10 hours for teens',
            '**Physical activity**: 60 minutes of movement per day',
            '**Face-to-face time**: At least 1 hour of quality family interaction',
            '**Homework/responsibilities**: Age-appropriate chores and schoolwork'
          )),
          jsonb_build_object('type', 'paragraph', 'content', '**Rule of thumb**: If adding screen time means cutting sleep, play, or family time, it''s too much.'),
          jsonb_build_object('type', 'callout', 'calloutType', 'TRY', 'content', jsonb_build_object('title', 'The Priority Pyramid', 'body', 'Create a visual pyramid with your family. At the top: sleep and physical activity. Middle: school and chores. Bottom: screen time. Screens only happen after the top priorities are met.')),
          jsonb_build_object('type', 'paragraph', 'content', '**5. Communication**'),
          jsonb_build_object('type', 'paragraph', 'content', 'Talk **openly** about media use. Make it a ongoing conversation, not a one-time lecture.'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Co-view content**: Watch shows together and discuss',
            '**Ask questions**: "What did you like about that video?" "How did that make you feel?"',
            '**Teach media literacy**: "Do you think that ad is trying to sell you something?"',
            '**Set expectations together**: Involve kids in creating screen time rules'
          )),
          jsonb_build_object('type', 'heading2', 'content', 'Implementing the 5Cs in Your Family'),
          jsonb_build_object('type', 'paragraph', 'content', 'The 5Cs work best when used **together**, not as isolated rules. Here''s how to integrate them:'),
          jsonb_build_object('type', 'script', 'content', 'Family Media Plan Conversation:\n\n**Step 1**: Family meeting (30 minutes, screen-free)\n→ "We''re creating our family''s media plan together"\n\n**Step 2**: Discuss each C as a family\n→ Child: What''s appropriate for each kid''s age?\n→ Content: What types of content align with our values?\n→ Calm: When should screens be off-limits?\n→ Crowding out: What activities must happen before screens?\n→ Communication: How will we talk about screens?\n\n**Step 3**: Write down agreed-upon rules\n→ Post them where everyone can see\n\n**Step 4**: Schedule a check-in in 2 weeks\n→ "What''s working? What needs adjustment?"'),
          jsonb_build_object('type', 'callout', 'calloutType', 'REMEMBER', 'content', jsonb_build_object('title', 'Flexibility Within Structure', 'body', 'The 5Cs provide a **framework**, not rigid rules. Some days will require more flexibility (sick days, long car rides). The goal is consistency *most of the time*, not perfection *all the time*.'))
        )
      ),

      -- CHAPTER 7: Age-Specific Strategies
      jsonb_build_object(
        'title', 'Age-Specific Strategies',
        'content', jsonb_build_array(
          jsonb_build_object('type', 'heading2', 'content', 'Tailoring Your Approach by Development Stage'),
          jsonb_build_object('type', 'paragraph', 'content', 'What works for a 5-year-old won''t work for a 15-year-old. **Developmental stage matters**.'),
          jsonb_build_object('type', 'callout', 'calloutType', 'SCIENCE', 'content', jsonb_build_object('title', 'Brain Development Timeline', 'body', 'The prefrontal cortex (impulse control, decision-making) doesn''t fully mature until **age 25**. Younger kids need *external structure*. Teens need *guided autonomy*.')),
          jsonb_build_object('type', 'heading2', 'content', 'Ages 2-5: Building Foundations'),
          jsonb_build_object('type', 'paragraph', 'content', '**Primary goal**: Establish that screens are a *privilege*, not a right.'),
          jsonb_build_object('type', 'paragraph', 'content', '**What works**:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Visual timers**: Kids can see time running out',
            '**"First-Then" language**: "First we play outside, then we can watch one show"',
            '**Co-viewing**: Always watch with them, discuss what you''re seeing',
            '**Transition warnings**: "5 more minutes until screens off"',
            '**Distraction**: Offer exciting alternatives when turning screens off'
          )),
          jsonb_build_object('type', 'script', 'content', 'Sample Routine for Preschoolers:\n\n**Morning**: No screens until after breakfast and getting dressed\n\n**Afternoon**: 30 minutes of educational content (PBS Kids, Sesame Street)\n→ Co-view and talk about the show\n\n**Evening**: No screens after 6pm\n→ Offer sensory play: Play-Doh, water table, building blocks\n\n**Weekend**: One special movie as a family activity'),
          jsonb_build_object('type', 'callout', 'calloutType', 'WARNING', 'content', jsonb_build_object('title', 'The iPad Babysitter Trap', 'body', 'It''s tempting to use screens to keep toddlers quiet, but **early overexposure** sets the stage for problematic use later. If you need a break, opt for independent play in a safe space instead.')),
          jsonb_build_object('type', 'heading2', 'content', 'Ages 6-9: Establishing Healthy Habits'),
          jsonb_build_object('type', 'paragraph', 'content', '**Primary goal**: Teach *self-regulation* while maintaining clear boundaries.'),
          jsonb_build_object('type', 'paragraph', 'content', '**What works**:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Screen time tokens**: Kids earn tokens for responsibilities, spend them on screen time',
            '**Device-free zones**: No screens in bedrooms or bathrooms',
            '**Weekend rewards**: Extra screen time on weekends if weekday rules are followed',
            '**Gaming limits**: 60-90 minutes max per day, with breaks every 30 minutes',
            '**Content approval**: Parents pre-approve all apps, games, and shows'
          )),
          jsonb_build_object('type', 'script', 'content', 'Token System Implementation:\n\n**How to earn tokens**:\n→ Complete homework without reminders (1 token)\n→ Do chores without being asked (1 token)\n→ Read for 30 minutes (1 token)\n→ Help a sibling or parent (1 token)\n\n**How to spend tokens**:\n→ 1 token = 30 minutes screen time\n→ 3 tokens = Choose family movie\n→ 5 tokens = Special gaming session with parent\n\n**Rules**:\n→ Tokens can be saved or spent\n→ Tokens can''t be "borrowed" from future days\n→ Losing tokens due to rule-breaking is consequence for misbehavior'),
          jsonb_build_object('type', 'callout', 'calloutType', 'TRY', 'content', jsonb_build_object('title', 'Gamify Good Behavior', 'body', 'Elementary-age kids **love earning systems**. The token approach taps into their natural motivation for rewards while teaching delayed gratification.')),
          jsonb_build_object('type', 'heading2', 'content', 'Ages 10-12: Transitioning to Responsibility'),
          jsonb_build_object('type', 'paragraph', 'content', '**Primary goal**: Gradually shift from *external control* to *internal motivation*.'),
          jsonb_build_object('type', 'paragraph', 'content', '**What works**:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Collaborative rule-setting**: Involve kids in creating screen time limits',
            '**Natural consequences**: If homework suffers, screen time decreases',
            '**Social media delay**: Wait until at least 13 (or later)',
            '**Phone contracts**: Written agreement before getting a smartphone',
            '**Regular check-ins**: Weekly conversations about online experiences'
          )),
          jsonb_build_object('type', 'table', 'headers', jsonb_build_array('Situation', 'Natural Consequence'), 'rows', jsonb_build_array(
            jsonb_build_array('Grades drop below agreed standard', 'Lose screen time until grades improve'),
            jsonb_build_array('Sneak screens after bedtime', 'Devices collected earlier the next night'),
            jsonb_build_array('Refuse to do chores', 'No earned screen time for that day'),
            jsonb_build_array('Complete responsibilities without reminders', 'Earn bonus screen time on weekend')
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'REMEMBER', 'content', jsonb_build_object('title', 'Pre-Teen Brain Changes', 'body', 'Ages 10-12 mark the beginning of **puberty and brain reorganization**. Expect more resistance and emotional intensity. Stay firm on boundaries while validating their feelings.')),
          jsonb_build_object('type', 'heading2', 'content', 'Ages 13-15: Navigating the Teen Years'),
          jsonb_build_object('type', 'paragraph', 'content', '**Primary goal**: Balance *independence* with *safety monitoring*.'),
          jsonb_build_object('type', 'paragraph', 'content', '**What works**:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Flexible limits**: Adjust based on demonstrated responsibility',
            '**Privacy with transparency**: Teens need privacy, but parents should know passwords',
            '**Social media education**: Discuss online safety, cyberbullying, and digital footprint',
            '**Mental health monitoring**: Watch for signs of social media-induced anxiety or depression',
            '**Driving privileges**: Link responsible device use to earning driving privileges'
          )),
          jsonb_build_object('type', 'script', 'content', 'The Teen Phone Contract:\n\n**I agree to**:\n→ Keep my phone on Do Not Disturb during homework\n→ Charge my phone in the kitchen overnight\n→ Not use phone while driving\n→ Ask before downloading new apps\n→ Tell a parent if I see something disturbing online\n→ Limit social media to 90 minutes per day\n\n**My parents agree to**:\n→ Respect my privacy in messages with friends\n→ Only check my phone if they have safety concerns\n→ Trust me unless I give reason not to\n→ Help me if I make a mistake online instead of punishing\n\n**Consequences for breaking contract**:\n→ First time: Warning and discussion\n→ Second time: Lose phone for 24 hours\n→ Third time: Downgrade to basic phone for 1 week'),
          jsonb_build_object('type', 'callout', 'calloutType', 'WARNING', 'content', jsonb_build_object('title', 'The Social Media Dilemma', 'body', 'Research links teen social media use to increased rates of **anxiety, depression, and self-harm**. Consider delaying Instagram/TikTok until age 16, or using parental controls to limit usage.')),
          jsonb_build_object('type', 'heading2', 'content', 'Ages 16-18: Preparing for Independence'),
          jsonb_build_object('type', 'paragraph', 'content', '**Primary goal**: Help teens develop *self-awareness* about their device use.'),
          jsonb_build_object('type', 'paragraph', 'content', '**What works**:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Self-monitoring**: Teens track their own screen time and reflect',
            '**Open dialogue**: Regular conversations without judgment',
            '**Mental health priority**: Encourage therapy if social media is affecting wellbeing',
            '**College prep**: Discuss how device habits will affect college success',
            '**Gradual autonomy**: Reduce restrictions as they demonstrate responsibility'
          )),
          jsonb_build_object('type', 'paragraph', 'content', '**Conversation starters**:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '"How does scrolling make you feel afterward?"',
            '"Do you think your phone use is helping or hurting your goals?"',
            '"What would you do with an extra hour per day if you had it?"',
            '"Have you noticed any friends struggling with screen time?"'
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'TRY', 'content', jsonb_build_object('title', 'The 24-Hour Challenge', 'body', 'Challenge your teen to go **24 hours without their phone** (except calls from family). Afterward, discuss what they noticed. This builds self-awareness without forcing permanent change.'))
        )
      ),

      -- CHAPTER 8: The Alternative Activities Arsenal
      jsonb_build_object(
        'title', 'The Alternative Activities Arsenal',
        'content', jsonb_build_array(
          jsonb_build_object('type', 'heading2', 'content', '50+ Screen-Free Activities Kids Actually Enjoy'),
          jsonb_build_object('type', 'paragraph', 'content', '**The key: Replacement, not just removal.**'),
          jsonb_build_object('type', 'paragraph', 'content', 'You can''t just take away screens and leave a void. You must fill that void with activities that are **immediately engaging, require minimal setup**, and provide the stimulation their brains crave.'),
          jsonb_build_object('type', 'callout', 'calloutType', 'TRY', 'content', jsonb_build_object('title', 'The Activity Menu', 'body', 'Print this list and post it on your fridge. When kids say "I''m bored," point to the menu and say: **"Pick something, or I''ll pick for you."**')),
          jsonb_build_object('type', 'heading2', 'content', 'Physical Activities (For High-Energy Kids)'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Trampoline jumping** → Releases endorphins, regulates sensory system',
            '**Bike riding or scootering** → Neighborhood laps or park trails',
            '**Dance party** → Create playlists, learn TikTok dances (without the phone)',
            '**Obstacle course** → Use furniture, pillows, tape for indoor courses',
            '**Sports practice** → Shooting hoops, kicking soccer ball, catch',
            '**Skateboarding or rollerblading** → Driveway practice',
            '**Jump rope or hopscotch** → Classic playground games',
            '**Yoga or stretching** → YouTube-free routines from library books',
            '**Swimming** → Pool, lake, or sprinkler',
            '**Hiking or nature walks** → Local trails, identify plants/animals'
          )),
          jsonb_build_object('type', 'heading2', 'content', 'Creative Activities (For Maker Kids)'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**LEGO building** → Free build or follow instruction books',
            '**Drawing or painting** → Still life, imagination drawings, painting rocks',
            '**Clay sculpting** → Air-dry clay or Play-Doh creations',
            '**Friendship bracelets** → Macrame or beading',
            '**Origami** → Follow library books for paper folding',
            '**Cardboard creations** → Build cities, rockets, or forts',
            '**Sewing projects** → Hand-stitching or simple sewing machine projects',
            '**Music** → Practice instrument, write songs, make instruments',
            '**Photography** → Real camera (not phone) photo scavenger hunts',
            '**Woodworking** → Simple projects with parent supervision'
          )),
          jsonb_build_object('type', 'heading2', 'content', 'Social Activities (For Connection)'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Board games** → Family game night classics (Ticket to Ride, Catan, Codenames)',
            '**Card games** → Uno, Go Fish, Poker, Magic the Gathering',
            '**Cooking together** → Kids choose and help prepare meals',
            '**Baking** → Cookies, muffins, bread (kids measure and mix)',
            '**Invite a friend over** → Old-school playdates with outdoor activities',
            '**Neighborhood games** → Kickball, capture the flag, hide and seek',
            '**Volunteering** → Food bank, animal shelter, community cleanup',
            '**Family projects** → Organize garage, plant garden, paint room',
            '**Puzzle building** → 500-1000 piece puzzles as family activity',
            '**Reading aloud** → Take turns reading chapter books together'
          )),
          jsonb_build_object('type', 'heading2', 'content', 'Quiet Activities (For Wind-Down Time)'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Reading** → Graphic novels, chapter books, magazines',
            '**Audiobooks** → Listen while drawing or doing puzzles',
            '**Journaling** → Daily gratitude, feelings check-in, creative writing',
            '**Coloring books** → Detailed adult coloring books are calming',
            '**Model building** → Airplanes, cars, ships (requires focus)',
            '**Knitting or crocheting** → Repetitive, meditative crafts',
            '**Brain teasers** → Sudoku, crosswords, logic puzzles',
            '**Stargazing** → Identify constellations, watch for meteors',
            '**Meditation or breathing exercises** → Guided practices from library',
            '**Letter writing** → Pen pals, thank you notes, letters to future self'
          )),
          jsonb_build_object('type', 'heading2', 'content', 'Productive Activities (For Growing Responsibility)'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Age-appropriate chores** → Laundry, vacuuming, organizing',
            '**Pet care** → Walking dog, grooming, training tricks',
            '**Gardening** → Plant vegetables, flowers, or indoor plants',
            '**Car washing** → Earn money by washing family cars',
            '**Organizing** → Closet, toys, bookshelf (surprisingly fun)',
            '**Budgeting practice** → Track allowance, plan savings goals',
            '**Meal planning** → Plan weekly meals, make grocery list',
            '**Teaching younger siblings** → Read to them, help with homework',
            '**Research projects** → Pick a topic of interest and create a presentation',
            '**Starting a business** → Lemonade stand, dog walking, lawn mowing'
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'REMEMBER', 'content', jsonb_build_object('title', 'The First Week Is Key', 'body', 'Kids will resist these activities at first because **their dopamine system is still recalibrating**. By week 2-3, they''ll naturally gravitate toward these alternatives.')),
          jsonb_build_object('type', 'heading2', 'content', 'The Boredom Jar'),
          jsonb_build_object('type', 'paragraph', 'content', 'One of the best tools for beating "I''m bored" complaints:'),
          jsonb_build_object('type', 'script', 'content', 'How to Create a Boredom Jar:\n\n**Step 1**: Sit down with your kids and brainstorm 30-50 screen-free activities they''d enjoy\n\n**Step 2**: Write each activity on a slip of paper and put them in a jar\n\n**Step 3**: When kids complain of boredom, they must:\n→ Pull 3 slips from the jar\n→ Choose one of the 3 activities\n→ Do it for at least 20 minutes\n\n**Pro tip**: Include a few "wild cards" like:\n→ "Free choice" (pick anything)\n→ "Parent joins you" (do an activity with parent)\n→ "Earn screen time" (complete 2 activities, then 30 min screens)'),
          jsonb_build_object('type', 'callout', 'calloutType', 'TRY', 'content', jsonb_build_object('title', 'The 10-Minute Rule', 'body', 'Require kids to engage with an alternative activity for **10 minutes** before they can move to something else. Often, once they''re immersed, they''ll voluntarily continue.'))
        )
      ),

      -- CHAPTER 9: Troubleshooting Common Resistance
      jsonb_build_object(
        'title', 'Troubleshooting Common Resistance',
        'content', jsonb_build_array(
          jsonb_build_object('type', 'heading2', 'content', 'When Kids Fight Back'),
          jsonb_build_object('type', 'paragraph', 'content', 'Let''s be real: **Your child will resist**. They''ll push back, argue, negotiate, and possibly melt down.'),
          jsonb_build_object('type', 'paragraph', 'content', 'This is normal. Expected. And—when handled correctly—temporary.'),
          jsonb_build_object('type', 'callout', 'calloutType', 'SCIENCE', 'content', jsonb_build_object('title', 'Understanding Withdrawal', 'body', 'What looks like defiance is often **neurological withdrawal**. Their brain is craving dopamine hits it''s been getting from screens. Behavioral symptoms (irritability, anxiety, anger) typically peak in days 3-5, then gradually improve.')),
          jsonb_build_object('type', 'heading2', 'content', 'Resistance Type #1: "But Everyone Else Gets To!"'),
          jsonb_build_object('type', 'paragraph', 'content', '**Translation**: "I feel left out and different from my peers."'),
          jsonb_build_object('type', 'script', 'content', 'How to respond:\n\n**Don''t say**: "I don''t care what other families do"\n→ This dismisses their real feelings of social exclusion\n\n**Instead say**:\n"I know it feels like everyone has unlimited screen time. That must be frustrating. Our family has different rules because we care about your brain health and sleep. I''m not trying to punish you—I''m protecting you. When you''re 18, you can make your own screen time rules."\n\n**Follow up with**:\n"What are your friends doing that you feel you''re missing? Maybe we can find a screen-free way to be part of it."'),
          jsonb_build_object('type', 'callout', 'calloutType', 'REMEMBER', 'content', jsonb_build_object('title', 'Stand Firm', 'body', 'Research shows that **most parents underestimate** how many other families are struggling with screens too. You''re not the only one setting limits—you might just be one of the few willing to enforce them.')),
          jsonb_build_object('type', 'heading2', 'content', 'Resistance Type #2: "I''m So Bored!"'),
          jsonb_build_object('type', 'paragraph', 'content', '**Translation**: "My brain is used to constant stimulation and doesn''t know what to do without it."'),
          jsonb_build_object('type', 'script', 'content', 'How to respond:\n\n**Don''t say**: "Go find something to do"\n→ This feels dismissive and unhelpful\n\n**Instead say**:\n"Boredom is your brain''s way of rebooting. It''s actually a good thing. I''m not going to entertain you, but I will help you get started on an activity. What sounds interesting: building something, playing outside, or doing art?"\n\n**If they refuse all options**:\n"That''s okay. You can sit here and be bored. Sometimes boredom leads to the best ideas."\n\n**Then walk away**. Don''t engage in the boredom complaint cycle.'),
          jsonb_build_object('type', 'callout', 'calloutType', 'TRY', 'content', jsonb_build_object('title', 'The Boredom Challenge', 'body', 'Tell your kid: **"If you can be bored for 20 minutes without complaining, you''ll discover something interesting."** Most kids can''t resist the challenge—and by 20 minutes, they''re engaged in something.')),
          jsonb_build_object('type', 'heading2', 'content', 'Resistance Type #3: Epic Meltdowns'),
          jsonb_build_object('type', 'paragraph', 'content', '**Translation**: "I''m experiencing neurological withdrawal and my nervous system is dysregulated."'),
          jsonb_build_object('type', 'script', 'content', 'How to respond:\n\n**During the meltdown**:\n→ Stay calm. Your regulation helps them regulate.\n→ Don''t engage in arguments. Repeat calmly: "I know you''re upset. Screens are off for now."\n→ Offer physical comfort if they''ll accept it (hug, sit nearby)\n→ Move to a quiet space if possible\n\n**After the meltdown**:\n→ "That was really hard. Your body is getting used to less screen time. It will get easier."\n→ "What can I do to help next time you''re feeling frustrated?"\n→ Help them name the feeling: "It sounds like you were feeling angry and disappointed."'),
          jsonb_build_object('type', 'callout', 'calloutType', 'WARNING', 'content', jsonb_build_object('title', 'Don''t Give In During Meltdowns', 'body', 'If you cave and give back screens during a tantrum, you''ve just taught your child: **"Meltdowns work."** Stay consistent, even when it''s hard.')),
          jsonb_build_object('type', 'heading2', 'content', 'Resistance Type #4: Sneaking Screens'),
          jsonb_build_object('type', 'paragraph', 'content', '**Translation**: "I''m struggling with impulse control and addiction."'),
          jsonb_build_object('type', 'script', 'content', 'How to respond:\n\n**First offense**:\n"I know it''s hard to resist screens. But sneaking breaks our trust. The consequence is [lose screens for 24 hours / earlier bedtime collection tomorrow]. Let''s talk about what makes it so hard to follow the rules."\n\n**Repeated offenses**:\n"This keeps happening, which tells me you''re struggling with self-control. That''s actually normal—your brain is still developing impulse control. But it means we need stronger systems. From now on, [devices stay in my room / I''ll hold your password / we''re doing a 2-week complete reset]."\n\n**Important**: Frame it as *support*, not *punishment*.\n→ "I''m not trying to punish you. I''m helping you build healthy habits because I love you."'),
          jsonb_build_object('type', 'heading2', 'content', 'Resistance Type #5: Negotiating Constantly'),
          jsonb_build_object('type', 'paragraph', 'content', '**Translation**: "If I keep asking, maybe you''ll change your mind."'),
          jsonb_build_object('type', 'script', 'content', 'How to respond:\n\n**Use the "Broken Record" technique**:\n\nChild: "Can I have more screen time?"\nYou: "Our family rule is 1 hour on school days."\n\nChild: "But I finished all my homework!"\nYou: "Our family rule is 1 hour on school days."\n\nChild: "That''s not fair!"\nYou: "Our family rule is 1 hour on school days."\n\n**Important**: Don''t engage with new arguments. Repeat the same phrase calmly until they give up.\n\n**When to negotiate**:\nWeekends, special occasions, or earned bonuses are appropriate times for flexibility. But day-to-day rules should be non-negotiable.'),
          jsonb_build_object('type', 'callout', 'calloutType', 'REMEMBER', 'content', jsonb_build_object('title', 'Consistency Is Key', 'body', 'Kids test boundaries to see if rules are real. **The more consistent you are, the faster they''ll stop testing.** Expect 2-3 weeks of testing, then significant reduction in resistance.')),
          jsonb_build_object('type', 'heading2', 'content', 'When Your Partner Doesn''t Agree'),
          jsonb_build_object('type', 'paragraph', 'content', 'One of the biggest obstacles: **co-parents who aren''t on the same page**.'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Schedule a private conversation**: Don''t argue in front of kids',
            '**Share research**: Send articles or this guide to your partner',
            '**Start small**: Agree on one rule (e.g., no screens at dinner) before adding more',
            '**Unified front**: Once you agree, present it together to kids',
            '**Check in weekly**: Adjust rules as needed, but do it together'
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'WARNING', 'content', jsonb_build_object('title', 'The Undermining Problem', 'body', 'If one parent consistently undermines screen time rules, **it won''t work**. Kids will exploit the inconsistency. This is a conversation that must happen between adults first.'))
        )
      ),

      -- CHAPTER 10: Long-Term Success & Maintenance
      jsonb_build_object(
        'title', 'Long-Term Success & Maintenance',
        'content', jsonb_build_array(
          jsonb_build_object('type', 'heading2', 'content', 'The 90-Day Brain Reset Plan'),
          jsonb_build_object('type', 'paragraph', 'content', 'You''ve learned the strategies. Now let''s put them into a **comprehensive 90-day plan** for sustainable change.'),
          jsonb_build_object('type', 'callout', 'calloutType', 'SCIENCE', 'content', jsonb_build_object('title', 'Why 90 Days?', 'body', 'Neuroplasticity research shows that **66-90 days** is the average time needed to form a new automatic habit. After 90 days, healthy screen habits become the family norm—not something you have to actively enforce.')),
          jsonb_build_object('type', 'heading2', 'content', 'Phase 1: Weeks 1-3 (The Reset)'),
          jsonb_build_object('type', 'paragraph', 'content', '**Goal**: Detox from excessive screen time and establish new routines.'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Implement core rules**: No screens before school, during meals, or 1 hour before bed',
            '**Set daily limits**: 1 hour on school days, 2 hours on weekends',
            '**Stock alternatives**: Fill "boredom box" with engaging activities',
            '**Family meeting**: Explain changes, get buy-in, post rules visibly',
            '**Expect resistance**: Tantrums, boredom complaints, testing boundaries',
            '**Stay consistent**: No exceptions, even on hard days'
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'REMEMBER', 'content', jsonb_build_object('title', 'Week 1 Is the Hardest', 'body', 'Withdrawal symptoms peak in the first week. If you can make it through **days 3-7**, it gets significantly easier. Don''t give up during the hardest part.')),
          jsonb_build_object('type', 'heading2', 'content', 'Phase 2: Weeks 4-6 (The Adjustment)'),
          jsonb_build_object('type', 'paragraph', 'content', '**Goal**: Refine rules based on what''s working and address remaining challenges.'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Evaluate progress**: What improved? Sleep? Mood? Focus?',
            '**Adjust as needed**: Tweak rules that aren''t working',
            '**Introduce rewards**: Screen time bonuses for extra responsibilities',
            '**Add structured activities**: Weekly family game night, outdoor adventures',
            '**Monitor content quality**: Ensure screen time is high-quality when allowed',
            '**Celebrate wins**: Notice and praise improvements'
          )),
          jsonb_build_object('type', 'script', 'content', 'Week 4 Family Check-In:\n\n**Ask each family member**:\n→ "What''s been the hardest part of less screen time?"\n→ "What activities have you enjoyed instead?"\n→ "Have you noticed any positive changes?" (sleep, mood, energy)\n→ "What rules should we keep? What needs adjustment?"\n\n**Make adjustments together**:\n→ "Based on what we discussed, we''re keeping [rules that work] and changing [rules that don''t]"'),
          jsonb_build_object('type', 'heading2', 'content', 'Phase 3: Weeks 7-12 (The New Normal)'),
          jsonb_build_object('type', 'paragraph', 'content', '**Goal**: Solidify habits so they feel automatic, not forced.'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Less active enforcement needed**: Rules are now routine',
            '**Kids self-regulate more**: They start monitoring their own time',
            '**Reintroduce flexibility**: Earned bonuses, special occasions',
            '**Teach media literacy**: Discuss advertising, social comparison, online safety',
            '**Prepare for challenges**: Plan for summer break, holidays, travel',
            '**Model healthy use**: Parents continue demonstrating good screen habits'
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'TRY', 'content', jsonb_build_object('title', 'The 12-Week Celebration', 'body', 'At the end of 12 weeks, **celebrate as a family**. Go out for ice cream, have a special movie night, or do a fun activity. Acknowledge everyone''s effort in making the change.')),
          jsonb_build_object('type', 'heading2', 'content', 'Maintenance: Months 4+'),
          jsonb_build_object('type', 'paragraph', 'content', 'Once the 90-day reset is complete, the goal shifts to **maintaining healthy habits** long-term.'),
          jsonb_build_object('type', 'table', 'headers', jsonb_build_array('Maintenance Strategy', 'How Often'), 'rows', jsonb_build_array(
            jsonb_build_array('Family check-in meetings', 'Monthly'),
            jsonb_build_array('Review screen time stats', 'Weekly'),
            jsonb_build_array('Refresh alternative activities', 'Every 2-3 months'),
            jsonb_build_array('Update phone contracts (for teens)', 'Every 6 months'),
            jsonb_build_array('Reassess rules as kids age', 'Annually')
          )),
          jsonb_build_object('type', 'heading2', 'content', 'Handling Special Circumstances'),
          jsonb_build_object('type', 'paragraph', 'content', '**Vacations & Travel**'),
          jsonb_build_object('type', 'paragraph', 'content', 'Long car rides and plane flights are exceptions. Allow extended screen time, but:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            'Download content ahead (no infinite scroll)',
            'Take regular breaks every hour',
            'Return to normal limits the day you arrive'
          )),
          jsonb_build_object('type', 'paragraph', 'content', '**Sick Days**'),
          jsonb_build_object('type', 'paragraph', 'content', 'When kids are genuinely sick, more screen time is okay. But:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            'Still maintain "no screens before noon" rule',
            'Prioritize sleep over binge-watching',
            'Return to regular limits as soon as they''re feeling better'
          )),
          jsonb_build_object('type', 'paragraph', 'content', '**Summer Break**'),
          jsonb_build_object('type', 'paragraph', 'content', 'Without school structure, screen time can explode. Prevent this:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            'Create a **summer schedule** with activities, camps, playdates',
            'Maintain "earn it" system: chores → screen time',
            'No screens before 12pm on summer days',
            'Plan weekly adventures (parks, museums, beach)'
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'WARNING', 'content', jsonb_build_object('title', 'The Summer Slide Risk', 'body', 'Studies show kids lose **2-3 months of progress** in healthy screen habits over summer if structure isn''t maintained. Plan ahead.')),
          jsonb_build_object('type', 'heading2', 'content', 'When to Seek Professional Help'),
          jsonb_build_object('type', 'paragraph', 'content', 'Most kids respond well to the strategies in this guide. But sometimes, **professional help is needed**.'),
          jsonb_build_object('type', 'paragraph', 'content', '**Red flags that warrant professional support**:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            '**Violent reactions** to screen limits (breaking things, harming self/others)',
            '**Severe withdrawal symptoms** lasting beyond 2 weeks',
            '**Complete social isolation** (refuses all activities, only wants screens)',
            '**Academic failure** despite screen reduction',
            '**Signs of depression or anxiety** (persistent sadness, panic attacks)',
            '**Gaming addiction** (plays 6+ hours daily, loses sense of time)',
            '**Inappropriate online activity** (accessing unsafe content, cyberbullying)'
          )),
          jsonb_build_object('type', 'paragraph', 'content', '**Who to contact**:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            'Pediatrician (for ESS evaluation)',
            'Child psychologist (for behavioral issues)',
            'Family therapist (for parent-child conflict)',
            'Gaming addiction specialist (if gaming is primary concern)'
          )),
          jsonb_build_object('type', 'heading2', 'content', 'Your Family''s Success Story'),
          jsonb_build_object('type', 'paragraph', 'content', '**Three months from now**, your family could look completely different:'),
          jsonb_build_object('type', 'list', 'items', jsonb_build_array(
            'Your child sleeps through the night and wakes up rested',
            'Homework happens without 2-hour battles',
            'Family dinners include actual conversation',
            'Your child rediscovers hobbies they''d abandoned',
            'Mood swings decrease, emotional regulation improves',
            'You spend quality time together—without devices in the way'
          )),
          jsonb_build_object('type', 'callout', 'calloutType', 'REMEMBER', 'content', jsonb_build_object('title', 'This Isn''t Perfection—It''s Progress', 'body', 'You don''t need to follow every strategy perfectly. Even implementing **50% of this guide** will create meaningful improvement. Start where you are. Do what you can. Keep going.')),
          jsonb_build_object('type', 'paragraph', 'content', '**The most important thing?**'),
          jsonb_build_object('type', 'paragraph', 'content', '**Start today.**'),
          jsonb_build_object('type', 'paragraph', 'content', 'Not next week. Not after summer. Not when things calm down.'),
          jsonb_build_object('type', 'paragraph', 'content', '**Today.**'),
          jsonb_build_object('type', 'paragraph', 'content', 'Pick **one strategy** from this guide. Implement it tonight. Build from there.'),
          jsonb_build_object('type', 'paragraph', 'content', 'Your child''s brain—and your family''s peace—will thank you.')
        )
      )
    )
  )::jsonb,
  10, -- total_chapters
  12500, -- total_words (estimated)
  45, -- estimated_reading_time (minutes)
  '#10b981', -- green color for "strategies" theme
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO NOTHING;
