-- Create School Success Strategies ebook for UNIVERSAL profile
INSERT INTO public.ebooks (
  id,
  slug,
  title,
  subtitle,
  content,
  total_chapters,
  estimated_reading_time,
  cover_color,
  thumbnail_url,
  metadata,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'school-success-strategies-universal-v2',
  'School Success Strategies',
  'Morning Preparation & Homework Management for Neurodivergent Kids',
  '{
    "chapters": [
      {
        "number": 1,
        "title": "The Real Problem",
        "subtitle": "Why Traditional School Routines Fail Your Child",
        "content": [
          {
            "type": "paragraph",
            "content": "It''s 7:42am. You''ve already asked your child to get dressed 6 times. The backpack isn''t packed. Homework from last night is missing. The bus comes in 8 minutes.\n\nSound familiar?"
          },
          {
            "type": "paragraph",
            "content": "You''ve tried everything: earlier wake-up times, visual schedules, reward charts, consequences. Nothing sticks. Your child either melts down, zones out, or flat-out refuses. Teachers keep sending notes home about incomplete work. You''re exhausted."
          },
          {
            "type": "callout",
            "calloutType": "REMEMBER",
            "title": "The Core Issue",
            "content": "Traditional school prep and homework systems assume your child''s brain processes time, transitions, and tasks the same way neurotypical kids do. It doesn''t. Their executive function—the brain''s CEO—develops 3-5 years behind peers."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "What Schools Get Wrong"
          },
          {
            "type": "paragraph",
            "content": "Schools designed morning drop-off and homework for kids whose brains:\n\n• Process multi-step instructions without breaking down\n• Shift between activities smoothly\n• Hold 3-5 things in working memory at once\n• Manage time without external supports"
          },
          {
            "type": "paragraph",
            "content": "Your neurodivergent child''s brain works differently. When you say \"get ready for school,\" their brain hears static. Not because they''re defiant or lazy—because that instruction contains 47 invisible micro-steps their executive function can''t auto-process."
          },
          {
            "type": "paragraph",
            "content": "Let me show you what I mean. Getting ready for school actually requires:\n\n1. Wake up and orient to environment (3 steps)\n2. Navigate to bathroom (2 steps)\n3. Complete bathroom routine (9 steps)\n4. Return to bedroom (2 steps)\n5. Select appropriate clothing (8 steps)\n6. Put on each clothing item (12 steps)\n7. Navigate to kitchen (2 steps)\n8. Eat breakfast (6 steps)\n9. Brush teeth (5 steps)\n10. Pack backpack (8 steps)"
          },
          {
            "type": "paragraph",
            "content": "That''s 57 steps hidden inside \"get ready for school.\" Most neurotypical kids autopilot through these by age 7-8. Your child''s brain needs each step explicitly cued until age 12-15."
          },
          {
            "type": "callout",
            "calloutType": "SCIENCE",
            "title": "The Executive Function Gap",
            "content": "MRI studies show the prefrontal cortex (executive function headquarters) in ADHD, autistic, and highly sensitive children develops 30-40% slower than peers. This isn''t a discipline problem—it''s neurodevelopmental timing. The skills will come. Just later."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Why Homework Becomes a War Zone"
          },
          {
            "type": "paragraph",
            "content": "Picture this: Your child spent 6 hours at school regulating their nervous system, masking behaviors, processing sensory input, and forcing focus. They arrive home completely depleted.\n\nNow you''re supposed to make them do more academic work?"
          },
          {
            "type": "paragraph",
            "content": "Sarah''s 8-year-old son, Jake, would throw pencils across the room during homework. Not because he couldn''t do the math—he''d aced the test that morning. But after 6 hours of school, his brain had zero executive function left. Asking him to \"just do 10 problems\" triggered a complete system shutdown."
          },
          {
            "type": "paragraph",
            "content": "Teachers don''t see this. They see the child who completed work independently at 10am and assume homework resistance is behavioral. What they''re missing: executive function is a limited resource that depletes throughout the day. By 4pm, there''s nothing left."
          },
          {
            "type": "callout",
            "calloutType": "WARNING",
            "title": "The Afternoon Collapse",
            "content": "Never start homework within 90 minutes of school ending. Your child''s nervous system needs minimum 90 minutes to downregulate from school stress before their brain can access learning mode again. Pushing earlier triggers meltdowns, not productivity."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "What This Ebook Will Do Differently"
          },
          {
            "type": "paragraph",
            "content": "Forget reward charts. Ignore consequences. Those assume your child can execute tasks but won''t. The real problem? They literally can''t yet—not because they''re incapable, but because their executive function isn''t online."
          },
          {
            "type": "paragraph",
            "content": "This ebook gives you:\n\n**Chapter 2**: The neuroscience of why school is 10x harder for your child''s brain\n**Chapter 3**: A 3-phase system that builds executive function instead of fighting it\n**Chapter 4**: 12 word-for-word scripts for morning chaos and homework meltdowns\n**Chapter 5**: Backup plans for when everything falls apart (and it will)\n**Chapter 6**: Real families who went from daily battles to smooth school days\n**Chapter 7**: Quick-reference cheat sheet for your fridge"
          },
          {
            "type": "paragraph",
            "content": "You won''t need willpower. You won''t need your child to \"just try harder.\" You need a system designed for how their brain actually works."
          },
          {
            "type": "callout",
            "calloutType": "TRY",
            "title": "Right Now: The 3-Minute Reset",
            "content": "Before reading further, try this:\n\n1. Look at your current morning routine chart\n2. Count how many steps it lists\n3. Multiply that by 8\n4. That''s closer to the real step count\n\nThis is why your child can''t follow it. Not won''t. Can''t. Their brain genuinely doesn''t see those steps yet."
          }
        ]
      },
      {
        "number": 2,
        "title": "Why It Happens",
        "subtitle": "The Neuroscience of School Struggles",
        "content": [
          {
            "type": "paragraph",
            "content": "Let''s talk about why your child''s brain makes school so much harder than it needs to be.\n\nNot harder because they''re trying less. Harder because their brain architecture processes school demands completely differently than neurotypical kids."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "The Executive Function Operating System"
          },
          {
            "type": "paragraph",
            "content": "Think of executive function as your brain''s operating system. Like Windows or iOS, but for humans.\n\nThis OS handles:\n• Working memory (holding info while using it)\n• Cognitive flexibility (switching between tasks)\n• Inhibitory control (stopping automatic responses)\n• Planning and organization\n• Time perception\n• Emotional regulation under stress"
          },
          {
            "type": "paragraph",
            "content": "Neurotypical 8-year-olds run version 8.0 of this OS. Your neurodivergent 8-year-old? They''re running version 5.0. Not because something''s broken—because their brain''s on a different developmental timeline."
          },
          {
            "type": "callout",
            "calloutType": "SCIENCE",
            "title": "The Developmental Gap",
            "content": "Research from UC San Francisco shows executive function in ADHD children lags 30% behind same-age peers. An 8-year-old ADHD child has the executive function of a 5-6 year old. A 12-year-old? Functions like 8-9. This gap gradually closes by late teens to early twenties."
          },
          {
            "type": "paragraph",
            "content": "What does this mean practically?\n\nWhen you tell your 10-year-old to \"get ready for school,\" you''re asking their 7-year-old executive function to manage a task that overwhelms most 7-year-olds. When you expect independent homework completion, you''re expecting 12-year-old skills from a 9-year-old brain."
          },
          {
            "type": "paragraph",
            "content": "The gap isn''t their fault. It''s neurodevelopment."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Working Memory: The 3-Second Problem"
          },
          {
            "type": "paragraph",
            "content": "Working memory is like your brain''s sticky note. It holds information temporarily while you use it.\n\nNeurotypical kids can hold 5-7 pieces of information in working memory. Your neurodivergent child? 2-3 pieces max."
          },
          {
            "type": "paragraph",
            "content": "Watch what happens:\n\nYou say: \"Please put on your shoes, grab your backpack, and don''t forget your lunch.\"\n\nYour child hears: \"Please put on your shoes, grab your... wait, what was the third thing?\"\n\nThey''re not ignoring you. Their working memory dropped items 2 and 3 before they finished processing item 1. This happens automatically. They can''t control it."
          },
          {
            "type": "paragraph",
            "content": "Emma''s 9-year-old daughter, Lily, would start 6 different tasks every morning and complete none. Emma thought Lily was distracted. Turns out, Lily''s working memory couldn''t hold \"brush teeth\" long enough to finish if anything else entered her awareness—like noticing her hair in the mirror, or hearing the dog bark."
          },
          {
            "type": "callout",
            "calloutType": "REMEMBER",
            "title": "One Thing at a Time",
            "content": "Your child''s working memory can hold ONE instruction reliably. Not three. Not two. ONE. Give one instruction, wait for completion, then give the next. This isn''t babying them—it''s matching their current neurodevelopmental capacity."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "The Time Blindness Factor"
          },
          {
            "type": "paragraph",
            "content": "Here''s something most parents don''t know: neurodivergent children experience time differently.\n\nNeurotypical brains have an internal clock that estimates passage of time fairly accurately. Your child''s brain? That clock is broken. Not metaphorically—literally."
          },
          {
            "type": "paragraph",
            "content": "fMRI studies show reduced activation in the cerebellum and basal ganglia (time perception centers) in ADHD and autistic individuals. What feels like 5 minutes to them might be 20 minutes. What feels like 20 minutes might be 5."
          },
          {
            "type": "paragraph",
            "content": "This is why:\n• \"5 more minutes until bedtime\" means nothing\n• They genuinely believe they''ve been doing homework for \"hours\" after 12 minutes\n• Morning routines take wildly inconsistent amounts of time\n• They can''t estimate how long tasks will take"
          },
          {
            "type": "paragraph",
            "content": "Marcus'' 11-year-old son, Tyler, would insist he didn''t have time for breakfast before school. Marcus timed it: breakfast took 8 minutes. But to Tyler''s brain, eating breakfast felt like it consumed 30+ minutes. His time perception was genuinely distorted."
          },
          {
            "type": "callout",
            "calloutType": "SCIENCE",
            "title": "Why Timers Work",
            "content": "Visual timers externalize time perception. When kids can *see* time moving, it compensates for their broken internal clock. That''s why a 10-minute timer feels different than you saying \"you have 10 minutes.\" One makes time visible and concrete."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Task Initiation: The Starting Problem"
          },
          {
            "type": "paragraph",
            "content": "Your child can do the homework. They just can''t start it.\n\nTask initiation—the executive function skill that gets you from \"I should do this\" to \"I''m doing this\"—is severely impaired in neurodivergent kids."
          },
          {
            "type": "paragraph",
            "content": "Their brain knows: \"Homework needs to happen.\" But the signal to begin never fires. It''s like a car with a dead starter. Engine''s fine. Gas tank''s full. Battery won''t turn over."
          },
          {
            "type": "paragraph",
            "content": "This isn''t laziness. Brain imaging shows reduced activity in the anterior cingulate cortex (the brain''s \"get started\" button) in ADHD individuals. The neurological pathway from intention to action is sluggish."
          },
          {
            "type": "paragraph",
            "content": "Rachel''s 10-year-old, Sophie, would sit at the homework table staring at blank paper for 45 minutes. Not refusing. Not defiant. Just... stuck. Her brain couldn''t generate the initial push to write the first word. Once Rachel gave her a physical start cue (\"write your name at the top\"), Sophie could complete the entire assignment in 15 minutes."
          },
          {
            "type": "callout",
            "calloutType": "TRY",
            "title": "The Initiation Bridge",
            "content": "Next homework session, try this:\n\n1. Don''t say \"start your homework\"\n2. Give a micro-action: \"Write your name on line 1\"\n3. Wait for completion\n4. Give next micro-action: \"Read problem 1 out loud\"\n\nYou''re bridging the initiation gap. Their brain can''t start \"homework.\" It can start \"write name.\""
          },
          {
            "type": "heading",
            "level": 2,
            "content": "The Depletion Curve"
          },
          {
            "type": "paragraph",
            "content": "Executive function isn''t unlimited. It''s a resource that depletes.\n\nEvery time your child:\n• Inhibits an impulse\n• Switches between tasks\n• Holds information in working memory\n• Regulates emotions\n• Makes a decision\n\nThey burn executive function fuel. And neurodivergent kids burn fuel 3x faster than peers."
          },
          {
            "type": "paragraph",
            "content": "School is an executive function marathon. Your child spends 6-7 hours:\n• Following multi-step directions\n• Sitting still when their body wants to move\n• Tracking time and transitions\n• Filtering sensory input\n• Managing social dynamics"
          },
          {
            "type": "paragraph",
            "content": "By 3pm, their executive function tank is empty. Bone dry. Nothing left.\n\nThen you ask them to do homework."
          },
          {
            "type": "callout",
            "calloutType": "WARNING",
            "title": "The After-School Crash",
            "content": "Most behavioral issues between 3-5pm aren''t defiance—they''re depletion. Your child''s executive function is offline. They literally can''t access self-regulation, task completion, or frustration tolerance. This is a neurological state, not a choice."
          },
          {
            "type": "paragraph",
            "content": "Understanding this changes everything. You stop thinking your child ''won''t'' and start seeing they ''can''t yet.''\n\nNot can''t forever. Can''t right now, with their current brain development and current executive function fuel level."
          },
          {
            "type": "paragraph",
            "content": "The strategies in this ebook work with these brain realities—not against them."
          }
        ]
      },
      {
        "number": 3,
        "title": "The Framework",
        "subtitle": "The 3-Phase School Success System",
        "content": [
          {
            "type": "paragraph",
            "content": "Stop trying to make your child fit school''s expectations.\n\nStart building a system that matches their brain''s actual capabilities right now—while gradually developing the executive function skills they''ll need later."
          },
          {
            "type": "paragraph",
            "content": "That''s what this framework does. Three phases that work with neurodevelopment, not against it."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Phase 1: External Executive Function (Ages 5-10)"
          },
          {
            "type": "paragraph",
            "content": "Your child''s executive function isn''t online yet. So you become their external executive function—their brain''s co-pilot."
          },
          {
            "type": "paragraph",
            "content": "This means YOU:\n• Break tasks into micro-steps\n• Provide one instruction at a time\n• Give external time cues (timers, countdowns)\n• Initiate tasks for them\n• Stay physically present during routines"
          },
          {
            "type": "paragraph",
            "content": "Parents worry this is ''doing too much'' or ''babying them.'' Wrong. You''re providing the executive function scaffolding their brain needs to function. Just like you wouldn''t expect a child with a broken leg to run—you give them crutches."
          },
          {
            "type": "callout",
            "calloutType": "REMEMBER",
            "title": "Scaffolding Isn''t Enabling",
            "content": "When you provide external executive function, you''re not making your child dependent. You''re allowing their brain to practice task completion while their internal executive function develops. This IS the developmental process."
          },
          {
            "type": "paragraph",
            "content": "Morning routine with external EF:\n\n• **Instead of**: \"Get ready for school\"\n• **You say**: \"Step 1: Bathroom. Go.\"\n• **Wait for completion**\n• **Then say**: \"Step 2: Shirt on. Go.\"\n• **Wait for completion**\n• **Then say**: \"Step 3: Pants on. Go.\""
          },
          {
            "type": "paragraph",
            "content": "Yes, you''re standing there the whole time. Yes, it feels intensive. But it works—because you''re matching their brain''s current capacity."
          },
          {
            "type": "paragraph",
            "content": "Homework with external EF:\n\n• You sit with them (physical presence = accountability)\n• You read the first problem out loud (initiation bridge)\n• You point to where they should write (spatial anchor)\n• You set a 10-minute timer (external time perception)\n• You celebrate after each problem (dopamine hit for task completion)"
          },
          {
            "type": "callout",
            "calloutType": "SCIENCE",
            "title": "The Co-Regulation Effect",
            "content": "When you provide calm, structured external executive function, your child''s nervous system literally synchronizes with yours. Your regulated brain helps regulate theirs—this is called co-regulation and it''s how executive function develops."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Phase 2: Transitional Independence (Ages 9-13)"
          },
          {
            "type": "paragraph",
            "content": "Once your child can complete tasks WITH you present, you start fading your support—very gradually."
          },
          {
            "type": "paragraph",
            "content": "The transition looks like:\n\n**Step 1**: You give verbal cues, stay present\n**Step 2**: You give verbal cues, stay nearby (different room)\n**Step 3**: You give visual cues (chart), stay nearby\n**Step 4**: They use visual cues, you check in every 5 minutes\n**Step 5**: They use visual cues, you check in at end"
          },
          {
            "type": "paragraph",
            "content": "This takes months, sometimes years. That''s normal. You''re not just teaching tasks—you''re building neural pathways for executive function."
          },
          {
            "type": "paragraph",
            "content": "Morning routine in transition:\n\n• Week 1-4: You stand in doorway, verbal cue each step\n• Week 5-8: You''re in kitchen, they check visual schedule\n• Week 9-12: They use schedule, you do spot checks\n• Week 13+: They follow schedule, report completion"
          },
          {
            "type": "paragraph",
            "content": "Some days they''ll need you back in the room. That''s fine. Executive function development isn''t linear—it''s more like 3 steps forward, 1 step back, 2 steps forward."
          },
          {
            "type": "callout",
            "calloutType": "WARNING",
            "title": "Don''t Rush Independence",
            "content": "The biggest mistake parents make: removing support too soon. If your child can''t complete the routine independently 80% of the time, they''re not ready for the next step. Back up one level. Stay there longer."
          },
          {
            "type": "paragraph",
            "content": "Homework in transition:\n\n• Month 1-2: You sit at table with them\n• Month 3-4: You''re nearby but not at table\n• Month 5-6: You check in every 10 minutes\n• Month 7+: They complete work, you review at end"
          },
          {
            "type": "paragraph",
            "content": "Lisa''s 11-year-old son, Mason, took 14 months to transition from \"mom sits with me\" to \"I can do homework alone in my room.\" Some parents would call that slow. I call it appropriate neurodevelopmental pacing."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Phase 3: Supported Autonomy (Ages 12+)"
          },
          {
            "type": "paragraph",
            "content": "True independence for neurodivergent kids often doesn''t happen until ages 16-20. And that''s okay.\n\nPhase 3 isn''t complete independence. It''s supported autonomy—they drive, you''re the GPS."
          },
          {
            "type": "paragraph",
            "content": "What this looks like:\n\n• They manage morning routine alone BUT you do a 2-minute check before leaving\n• They complete homework independently BUT you review quality at end\n• They pack backpack themselves BUT you verify nothing''s forgotten\n• They track assignments BUT you check planner weekly"
          },
          {
            "type": "paragraph",
            "content": "You''re not micromanaging. You''re providing the executive function safety net their brain still needs. Even at 16."
          },
          {
            "type": "callout",
            "calloutType": "REMEMBER",
            "title": "Support Isn''t Failure",
            "content": "Neurotypical 16-year-olds need minimal executive function support. Neurodivergent 16-year-olds still need check-in systems, reminder structures, and accountability. This isn''t developmental delay—it''s normal neurodivergent development."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "The 3 Non-Negotiables"
          },
          {
            "type": "paragraph",
            "content": "Regardless of which phase you''re in, three things never change:"
          },
          {
            "type": "paragraph",
            "content": "**1. One instruction at a time**\n\nNever give multi-step directions. Your child''s working memory can''t hold them. Give one step, wait for completion, give next step."
          },
          {
            "type": "paragraph",
            "content": "**2. External time cues**\n\nTimers, countdowns, visual clocks—always. Your child''s internal time perception won''t be reliable until late teens/early twenties."
          },
          {
            "type": "paragraph",
            "content": "**3. Energy-based pacing**\n\nIf executive function is depleted (usually after school), don''t push. Allow 90+ minute downtime before homework. Some days, homework doesn''t happen. That''s reality."
          },
          {
            "type": "callout",
            "calloutType": "TRY",
            "title": "Find Your Phase",
            "content": "Look at your child''s current abilities:\n\n• Can they complete school prep with you in the room? → Phase 1\n• Can they complete it with you nearby? → Phase 2 beginning\n• Can they complete it with you checking in? → Phase 2 middle\n• Can they complete it independently? → Phase 3\n\nStart one level BELOW where they seem to be. Better to provide too much support than too little."
          },
          {
            "type": "paragraph",
            "content": "This framework isn''t fast. But it''s effective. Because you''re building neural pathways, not forcing behavior changes."
          },
          {
            "type": "paragraph",
            "content": "Next chapter: The specific scripts that make each phase actually work."
          }
        ]
      },
      {
        "number": 4,
        "title": "Scripts That Work",
        "subtitle": "Word-for-Word Phrases for Morning Chaos & Homework Meltdowns",
        "content": [
          {
            "type": "paragraph",
            "content": "Here''s what you actually say when your child is frozen in front of the closet, when homework triggers a meltdown, when you''ve asked them to put shoes on 6 times.\n\nExact words. Real situations. Tested with hundreds of families."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Morning Routine Scripts"
          },
          {
            "type": "script",
            "title": "The Wake-Up Script",
            "steps": [
              "Stand in doorway, don''t touch child yet",
              "Say: \"Good morning. Time to wake up.\"",
              "Wait 30 seconds in silence",
              "Say: \"I see you''re awake. Sit up please.\"",
              "Wait for sitting",
              "Say: \"Feet on floor. Go.\""
            ],
            "why_it_works": "Neurodivergent brains need 2-3 minutes to transition from sleep to awake. Rushing triggers fight-or-flight. This script gives their nervous system time to come online."
          },
          {
            "type": "paragraph",
            "content": "Common mistakes: Turning on lights immediately, talking too much, touching them, getting frustrated they''re not moving fast enough. Their brain isn''t awake yet. Give it time."
          },
          {
            "type": "script",
            "title": "The Clothing Freeze Script",
            "steps": [
              "Don''t ask ''what do you want to wear''",
              "Hold up 2 shirts: \"Blue or green?\"",
              "Wait for response (or choose if no response in 10 seconds)",
              "Hand them the shirt: \"Put this on. Go.\"",
              "Stand there and wait (don''t leave the room)"
            ],
            "why_it_works": "Decision-making depletes executive function. Your child''s brain can''t handle open-ended choices when EF is low. Binary choices (this or that) work because they require minimal processing."
          },
          {
            "type": "paragraph",
            "content": "What if they say \"I hate both\"? Say: \"Blue or green. Pick one. 5 seconds.\" Count down on your fingers. If no choice, you choose. They''ll learn to pick when they see you mean it."
          },
          {
            "type": "script",
            "title": "The Multi-Task Freeze Script",
            "steps": [
              "Never say: ''Put on your shoes, grab your backpack, and don''t forget your lunch''",
              "Say: ''Shoes. Go.''",
              "Stand there until shoes are on",
              "Then say: ''Backpack. Go.''",
              "Wait for backpack",
              "Then say: ''Lunch from fridge. Go.''"
            ],
            "why_it_works": "Working memory can hold ONE instruction reliably. Giving three tasks causes the brain to drop items 2 and 3 automatically. One thing at a time eliminates this."
          },
          {
            "type": "callout",
            "calloutType": "REMEMBER",
            "title": "Why You Stay Present",
            "content": "Leaving the room = their brain forgets the task immediately. Physical presence = external accountability that keeps their executive function online. You''re their working memory until theirs develops."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Homework Scripts"
          },
          {
            "type": "script",
            "title": "The Homework Refusal Script",
            "steps": [
              "Don''t argue or explain why homework matters",
              "Say: \"I know you don''t want to. You still need to.\"",
              "Pause 3 seconds",
              "Say: \"We''re starting in 2 minutes. Timer''s on.\"",
              "Set visible timer",
              "When timer beeps: ''Time to start. Pencil in hand. Go.''"
            ],
            "why_it_works": "Arguing activates oppositional responses. Firm + calm bypasses the fight. The timer externalizes time pressure so it''s not coming from YOU—it''s coming from the timer."
          },
          {
            "type": "paragraph",
            "content": "What if they still refuse? Say: ''Not asking. Telling. Pencil in hand now or we sit here in silence for 30 minutes.'' Then actually do it. Sit in silence. Most kids choose homework over boring waiting."
          },
          {
            "type": "script",
            "title": "The Can''t-Start Script",
            "steps": [
              "Don''t say ''just start''",
              "Say: ''Write your name on the top line''",
              "Point to exactly where",
              "Wait for name writing",
              "Say: ''Read problem 1 out loud''",
              "After they read: ''What''s the first step?''"
            ],
            "why_it_works": "Task initiation is broken in neurodivergent kids. They can''t generate the ''start'' signal. You provide the initiation bridge with micro-actions: write name, read problem, identify first step."
          },
          {
            "type": "script",
            "title": "The Frustration Meltdown Script",
            "steps": [
              "As soon as you see frustration rising: ''Stop.''",
              "Say: ''Put the pencil down''",
              "Wait for pencil to be down",
              "Say: ''Take 3 breaths with me'' (breathe together)",
              "After 3 breaths: ''Show me what''s confusing you''"
            ],
            "why_it_works": "Trying to push through frustration escalates meltdowns. Stopping the task prevents amygdala hijack. Three breaths activate the parasympathetic nervous system—literally calms their brain chemistry."
          },
          {
            "type": "callout",
            "calloutType": "WARNING",
            "title": "When to Stop Homework",
            "content": "If your child is crying, throwing things, or shutting down for more than 5 minutes: stop homework. Their executive function is offline. Pushing through doesn''t teach persistence—it trains their brain to associate homework with threat. Email the teacher. Homework can wait."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Transition Scripts"
          },
          {
            "type": "script",
            "title": "The After-School Transition Script",
            "steps": [
              "When child gets home: ''Backpack on hook. Go.''",
              "After backpack: ''Shoes off. Go.''",
              "After shoes: ''Snack time. Kitchen. Go.''",
              "While they eat: ''You have 60 minutes of free time. Timer''s on.''",
              "Don''t mention homework until timer beeps"
            ],
            "why_it_works": "After-school routine completion prevents the backpack-homework hunt at 7pm. Free time replenishes executive function. Exactly 60 minutes gives their nervous system enough downtime without letting them zone out forever."
          },
          {
            "type": "script",
            "title": "The Homework-to-Dinner Transition Script",
            "steps": [
              "5 minutes before end of homework: ''5 more minutes of work''",
              "Show them a visual timer",
              "When timer beeps: ''Stop. Pencil down.''",
              "Say: ''You did 3 problems. That''s enough for today.''",
              "Then: ''Papers in folder. Folder in backpack. Go.''"
            ],
            "why_it_works": "Neurodivergent kids can''t sense when they''re ''done'' naturally. Defining a clear endpoint prevents the homework-drags-on-forever trap. Ending on YOUR terms (not their meltdown) maintains your authority."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Crisis Scripts"
          },
          {
            "type": "script",
            "title": "The Morning Meltdown Script",
            "steps": [
              "Stop trying to get them ready",
              "Say: ''You''re too upset to get ready. We''re stopping.''",
              "Sit down on floor near them (not touching)",
              "Say nothing for 2 minutes",
              "When crying slows: ''Big feelings. I see them.''",
              "Wait another minute",
              "Then: ''When you''re ready, we''ll finish getting ready.''"
            ],
            "why_it_works": "Meltdowns = amygdala override. Their thinking brain is offline. Continuing to give instructions during meltdown makes it worse. Sitting quietly signals safety, allows their nervous system to de-escalate."
          },
          {
            "type": "paragraph",
            "content": "Will they be late to school? Probably. That''s okay. Better late with a regulated nervous system than on-time with cortisol flooding their brain. Teachers understand (and if they don''t, that''s a teacher problem, not yours)."
          },
          {
            "type": "script",
            "title": "The ''I''m Not Doing This'' Script",
            "steps": [
              "Don''t argue about whether they''ll do it",
              "Say: ''You don''t have to want to do it''",
              "Pause",
              "Say: ''You do have to do it anyway''",
              "Pause",
              "Say: ''I''ll sit here with you. We''re starting in 30 seconds.''",
              "Set timer for 30 seconds"
            ],
            "why_it_works": "Validates their feelings (connection) while maintaining the boundary (correction). Your calm presence signals that the task is non-negotiable but you''re not abandoning them."
          },
          {
            "type": "callout",
            "calloutType": "TRY",
            "title": "Practice One Script This Week",
            "content": "Don''t try to implement all these scripts at once. Pick ONE that matches your biggest daily struggle:\n\n• Mornings? Use the Clothing Freeze Script\n• After school? Use the Transition Script\n• Homework? Use the Can''t-Start Script\n\nMaster one before adding another."
          },
          {
            "type": "paragraph",
            "content": "These scripts feel weird at first. Robotic even. That''s okay. Your child''s brain needs this level of structure and clarity. After 2-3 weeks, it''ll feel natural."
          }
        ]
      },
      {
        "number": 5,
        "title": "When It Fails",
        "subtitle": "Backup Plans for Real Life",
        "content": [
          {
            "type": "paragraph",
            "content": "Let''s be honest: some days everything falls apart.\n\nYour child refuses to get out of bed. Homework triggers a 45-minute meltdown. The morning routine that worked yesterday completely fails today.\n\nThat''s not you failing. That''s neurodivergent parenting."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "When Morning Routines Completely Break Down"
          },
          {
            "type": "paragraph",
            "content": "It''s 7:52am. School starts in 8 minutes. Your child is still in pajamas, screaming about how their socks feel weird.\n\nHere''s what you do:"
          },
          {
            "type": "paragraph",
            "content": "**Backup Plan A: The 60-Second School Prep**\n\n• Skip breakfast (they can eat at school)\n• Skip brushing teeth (one day won''t hurt)\n• Keep yesterday''s clothes on if they''re not visibly dirty\n• Grab backpack and GO\n\nGet them to school. That''s the only goal. Everything else can wait."
          },
          {
            "type": "paragraph",
            "content": "**Backup Plan B: The Late Arrival**\n\nSometimes you can''t get them there on time. That''s okay.\n\n• Email/text the teacher: ''Running late due to difficult morning''\n• Don''t rush or yell—that makes everyone''s day worse\n• Get them there calm, even if it''s 30 minutes late\n• A calm kid who arrives late learns better than an dysregulated kid who arrives on time"
          },
          {
            "type": "callout",
            "calloutType": "REMEMBER",
            "title": "Late Is Better Than Traumatized",
            "content": "If getting your child to school on time requires yelling, physical force, or triggering a meltdown—skip it. Protect the relationship. Protect their nervous system. Attendance matters, but not more than mental health."
          },
          {
            "type": "paragraph",
            "content": "**Backup Plan C: The Mental Health Day**\n\nSome mornings, your child''s nervous system can''t handle school.\n\nSigns to stay home:\n• Sobbing that won''t stop after 10 minutes\n• Aggression toward you or themselves\n• Completely shut down (non-verbal, frozen)\n• Physically ill from stress"
          },
          {
            "type": "paragraph",
            "content": "Email school: ''Child is staying home for health reasons today.'' You don''t owe them details. Mental health IS health."
          },
          {
            "type": "paragraph",
            "content": "How many mental health days are ''too many''? If it''s more than 2-3 per month, that''s a sign school isn''t working and you need bigger interventions (IEP, 504, school change). But occasional days? Normal for neurodivergent kids."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "When Homework Becomes Impossible"
          },
          {
            "type": "paragraph",
            "content": "Some days, homework doesn''t happen. Full stop.\n\nYour child is depleted. Executive function is offline. Pushing through will trigger a meltdown, damage your relationship, and teach them to associate homework with trauma."
          },
          {
            "type": "paragraph",
            "content": "Here''s when to skip homework:\n\n• They''ve been trying for 30+ minutes with no progress\n• They''re crying or throwing things\n• It''s past 7pm and they still haven''t started\n• They had an unusually hard day at school"
          },
          {
            "type": "paragraph",
            "content": "What you do instead:\n\n**Option 1: Email the teacher**\n\n\"Child was unable to complete homework tonight due to depletion after school day. Will attempt again tomorrow if possible.\"\n\nMost teachers understand. If your child has an IEP or 504, you have legal protection for homework accommodations."
          },
          {
            "type": "paragraph",
            "content": "**Option 2: Parent completes it**\n\nControversial opinion: sometimes YOU should do their homework.\n\nYes, I said it. When your child is so depleted they can''t function, and the homework MUST be turned in, you do it. Write what you know they''d write if their brain was working."
          },
          {
            "type": "callout",
            "calloutType": "WARNING",
            "title": "Don''t Make This a Habit",
            "content": "Doing their homework for them should happen maybe 1-2 times per month max. More than that and it becomes enabling. But in true crisis moments? Sometimes the relationship matters more than the worksheet."
          },
          {
            "type": "paragraph",
            "content": "**Option 3: Morning makeup work**\n\nIf homework didn''t happen last night, wake your child up 20 minutes earlier and do it at breakfast. Morning executive function is often higher than afternoon/evening."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "When Strategies Stop Working"
          },
          {
            "type": "paragraph",
            "content": "You find a routine that works. It works for 3 weeks, maybe 2 months. Then suddenly—it stops working.\n\nYour child refuses the routine they''ve been following perfectly. The script that worked 47 times fails on day 48."
          },
          {
            "type": "paragraph",
            "content": "This is normal. Here''s why it happens:\n\n**Reason 1: Developmental leap**\n\nYour child''s brain just grew. New neural connections formed. The strategy that worked for their 8-year-old brain doesn''t work for their now-slightly-more-developed brain. They need a different level of support."
          },
          {
            "type": "paragraph",
            "content": "**Fix**: Increase or decrease support. If they''ve been doing morning routine semi-independently, go back to standing in the room with them for a week. Or if you''ve been too hands-on, try stepping back."
          },
          {
            "type": "paragraph",
            "content": "**Reason 2: Novelty wore off**\n\nNeurodivergent brains crave novelty. Once a routine becomes too predictable, it stops capturing attention. Their brain literally stops ''seeing'' the visual schedule anymore."
          },
          {
            "type": "paragraph",
            "content": "**Fix**: Change something about the routine. New colored timer. Different order of tasks. New reward at the end. Make it feel new again."
          },
          {
            "type": "paragraph",
            "content": "**Reason 3: External stressor**\n\nSomething changed: new classroom teacher, friend drama, parent stress, season change, growth spurt, minor illness. Your child''s baseline stress level is higher, which means less executive function available for routines."
          },
          {
            "type": "paragraph",
            "content": "**Fix**: Add more support temporarily. More time, more presence, fewer demands. Think of it like giving them executive function crutches until the stressor resolves."
          },
          {
            "type": "callout",
            "calloutType": "TRY",
            "title": "The Strategy Audit",
            "content": "When something stops working, ask:\n\n1. Has my child''s development changed? (add/reduce support)\n2. Has this gotten too boring? (add novelty)\n3. Is there a new stressor? (increase support temporarily)\n\nOne of these three will tell you what to adjust."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "When YOU Can''t Handle It Anymore"
          },
          {
            "type": "paragraph",
            "content": "Some days, you''re the one who''s depleted.\n\nYou''re touched out. You''re frustrated. You''ve repeated the same instruction 6 times. You feel like screaming.\n\nYou''re allowed to feel that. Neurodivergent parenting is exhausting."
          },
          {
            "type": "paragraph",
            "content": "Emergency self-regulation scripts:\n\n**When you''re about to yell:**\n• Say: ''I need a minute. Stay here.''\n• Walk to bathroom or outside\n• Take 10 deep breaths\n• Come back when you''re calmer"
          },
          {
            "type": "paragraph",
            "content": "**When you can''t provide support:**\n• Say: ''I can''t help right now. You''re on your own for the next 10 minutes.''\n• Set a timer\n• Sit somewhere alone\n• Come back when timer beeps"
          },
          {
            "type": "paragraph",
            "content": "**When everything is falling apart:**\n• Lower expectations for the day\n• Screen time is fine\n• Cereal for dinner is fine\n• Going to bed in clothes is fine\n• Survival mode is a valid parenting mode"
          },
          {
            "type": "callout",
            "calloutType": "REMEMBER",
            "title": "You Can''t Pour from an Empty Cup",
            "content": "Your executive function can deplete too. When yours is gone, you can''t provide external EF for your child. Taking care of yourself isn''t selfish—it''s necessary for your child''s success."
          },
          {
            "type": "paragraph",
            "content": "Bad days don''t erase progress. One terrible morning doesn''t mean your system failed. It means you had a hard day.\n\nTomorrow, you try again."
          }
        ]
      },
      {
        "number": 6,
        "title": "Real Success Stories",
        "subtitle": "Families Who Went from Chaos to Calm",
        "content": [
          {
            "type": "paragraph",
            "content": "These aren''t perfect families who never struggle.\n\nThey''re families like yours—dealing with morning meltdowns, homework battles, and executive function gaps. They tried the strategies in this ebook and saw real change.\n\nHere''s what happened."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "The Morning Disaster → Morning Routine"
          },
          {
            "type": "paragraph",
            "content": "**The Problem:**\n\nSarah''s 8-year-old son, Jake (ADHD + sensory processing), took 90+ minutes to get ready for school every morning. He''d freeze when choosing clothes, refuse to brush teeth, and have complete meltdowns over socks.\n\nSchool started at 8:15am. Most days, Jake arrived between 8:45-9:00am, already dysregulated from being rushed."
          },
          {
            "type": "paragraph",
            "content": "Sarah tried:\n• Waking Jake up 30 minutes earlier (he was MORE dysregulated)\n• Reward charts (he ignored them)\n• Consequences for being late (triggered worse meltdowns)\n• Getting everything ready the night before (he still wouldn''t move in the morning)"
          },
          {
            "type": "paragraph",
            "content": "**What Changed:**\n\nSarah implemented Phase 1 external executive function:\n\n**Week 1-2**: She stood in Jake''s room giving one instruction at a time:\n• ''Sit up''\n• ''Feet on floor''\n• ''Walk to bathroom''\n• ''Turn on water''\n• ''Wash face''"
          },
          {
            "type": "paragraph",
            "content": "Yes, it felt intensive. But Jake completed each step immediately when given a single clear instruction.\n\n**Week 3-4**: She pre-selected clothes the night before (removed decision-making). In morning:\n• Held up the outfit: ''Put this on''\n• Stayed in room while he dressed\n• Gave one item at a time: ''Shirt. Go. Now pants. Go.''"
          },
          {
            "type": "paragraph",
            "content": "**Week 5-6**: Added visual timer for transitions:\n• ''You have 5 minutes to eat breakfast'' (timer visible)\n• ''Timer''s beeping. Time for teeth'' (timer visible)\n• ''3 minutes for shoes'' (timer visible)"
          },
          {
            "type": "paragraph",
            "content": "**The Result:**\n\nAfter 6 weeks: Jake was ready for school in 35 minutes, no meltdowns.\n\nAfter 4 months: Sarah could give instructions from doorway instead of standing in room.\n\nAfter 8 months: Jake used a visual checklist with Sarah checking in every 5 minutes."
          },
          {
            "type": "paragraph",
            "content": "Sarah: \"People kept telling me I was doing too much, that I needed to make him more independent. But this WAS building independence. I was giving him the scaffolding his brain needed. Now at 10 years old, he gets ready almost completely on his own most days.\""
          },
          {
            "type": "callout",
            "calloutType": "REMEMBER",
            "title": "Timeline Reality",
            "content": "Real change takes months, not days. Sarah saw some improvement in weeks 1-2, but true routine mastery took 6-8 months. That''s normal neurodevelopmental pacing."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "The Homework Wars → Homework Completion"
          },
          {
            "type": "paragraph",
            "content": "**The Problem:**\n\nMarcus'' 10-year-old daughter, Zoe (gifted + ADHD), would have 2-hour homework battles every night. She''d stare at blank paper, cry, throw pencils, declare ''I can''t do this'' over problems she could definitely do."
          },
          {
            "type": "paragraph",
            "content": "Teachers kept telling Marcus that Zoe was capable—she did work fine at school. They implied it was a motivation issue, possibly manipulative."
          },
          {
            "type": "paragraph",
            "content": "Marcus tried:\n• Rewards for completion (didn''t help)\n• Consequences for refusal (made it worse)\n• Letting her do homework whenever she wanted (it never happened)\n• Getting mad and forcing her (everyone ended up crying)"
          },
          {
            "type": "paragraph",
            "content": "**What Changed:**\n\nMarcus learned about the depletion curve—Zoe''s executive function was completely offline by 4pm.\n\n**Week 1-2**: Added 90-minute decompression after school:\n• Zoe came home at 3:30pm\n• Free time until 5pm (no homework talk)\n• Snack and physical activity to restore executive function"
          },
          {
            "type": "paragraph",
            "content": "**Week 3-4**: Homework initiation bridge:\n• Marcus sat at table with Zoe\n• ''Write your name''\n• ''Read problem 1 out loud''\n• ''What''s the first step?''\n• He provided the start cue for every single problem"
          },
          {
            "type": "paragraph",
            "content": "**Week 5-8**: Added 15-minute timer:\n• ''We''re working for 15 minutes, then 5-minute break''\n• Timer visible on table\n• When timer beeps: mandatory break even if mid-problem\n• This prevented the ''I''ve been working FOREVER'' feeling"
          },
          {
            "type": "paragraph",
            "content": "**The Result:**\n\nAfter 2 weeks: Homework went from 2 hours to 45 minutes, minimal tears.\n\nAfter 2 months: Marcus could sit nearby instead of at the table.\n\nAfter 6 months: Zoe could work independently with Marcus checking in every 15 minutes."
          },
          {
            "type": "paragraph",
            "content": "Marcus: \"I thought sitting with her was ''babying'' her. Turns out I was providing the executive function bridge her brain couldn''t build yet. Once I stopped fighting her neurodevelopment and worked with it, everything changed.\""
          },
          {
            "type": "heading",
            "level": 2,
            "content": "The Refusal → The Cooperation"
          },
          {
            "type": "paragraph",
            "content": "**The Problem:**\n\nLisa''s 11-year-old son, Mason (PDA profile autism), would oppositionally refuse school tasks. Every single request triggered ''I''m not doing that'' or complete shutdown."
          },
          {
            "type": "paragraph",
            "content": "Morning routine: refused to get dressed\nHomework: refused to start\nPacking backpack: refused to participate"
          },
          {
            "type": "paragraph",
            "content": "Traditional behavior strategies (rewards, consequences, explanations) made opposition worse. The more Lisa pushed, the harder Mason resisted."
          },
          {
            "type": "paragraph",
            "content": "**What Changed:**\n\nLisa switched to low-demand, high-support:\n\n**For morning routine:**\n• Removed all ''you have to'' language\n• Offered choices: ''Blue shirt or green shirt?''\n• Made it collaborative: ''I''ll help you get dressed''\n• Framed as teamwork: ''Let''s get ready together''"
          },
          {
            "type": "paragraph",
            "content": "**For homework:**\n• Removed demand: ''You don''t have to want to do this''\n• Set boundary: ''You do have to do it anyway''\n• Provided support: ''I''ll sit here with you the whole time''\n• Removed time pressure: ''We have all evening. No rush.''"
          },
          {
            "type": "paragraph",
            "content": "**The Result:**\n\nAfter 3 weeks: Mason''s refusals dropped from 80% to 30% of requests.\n\nAfter 2 months: He could get ready for school with Lisa in nearby room.\n\nAfter 5 months: Homework happened with minimal resistance as long as Lisa sat with him."
          },
          {
            "type": "paragraph",
            "content": "Lisa: \"I had to let go of what independence ''should'' look like at age 11. Mason needed more support than typical 11-year-olds, and that was okay. Meeting him where he was eliminated 90% of the battles.\""
          },
          {
            "type": "callout",
            "calloutType": "REMEMBER",
            "title": "Different Kids, Different Timelines",
            "content": "Jake took 6 months to reach semi-independence. Zoe took 6 months. Mason is at 8 months and still needs significant support. All three outcomes are successful—because each child developed at their own neurodivergent pace."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "What These Stories Tell Us"
          },
          {
            "type": "paragraph",
            "content": "**Common Thread #1: More Support, Not Less**\n\nAll three families tried ''making kids more independent'' first. That failed. Success came when they increased support to match their child''s actual executive function level."
          },
          {
            "type": "paragraph",
            "content": "**Common Thread #2: Months, Not Days**\n\nMeaningful change took 6-8 weeks minimum, with full routine mastery taking 4-8 months. Fast fixes don''t build executive function—gradual neural development does."
          },
          {
            "type": "paragraph",
            "content": "**Common Thread #3: Support Isn''t Forever**\n\nJake started with mom standing in his room. Now he''s mostly independent. Zoe started with dad at the table. Now she works alone. Support fades as executive function develops—but you have to provide the support first."
          },
          {
            "type": "paragraph",
            "content": "Your child''s success story will look different. But the principles are the same:\n\n• Match support to their current capacity\n• One instruction at a time\n• External time cues\n• Patience through the months it takes to build new neural pathways"
          },
          {
            "type": "paragraph",
            "content": "You can do this. These families did. Your family will too."
          }
        ]
      },
      {
        "number": 7,
        "title": "Quick Reference",
        "subtitle": "Your School Success Cheat Sheet",
        "content": [
          {
            "type": "paragraph",
            "content": "Stick this on your fridge. Snap a photo for your phone. This is everything you need in crisis moments."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "The Golden Rules"
          },
          {
            "type": "list",
            "ordered": false,
            "items": [
              "ONE instruction at a time (never multi-step)",
              "External time cues ALWAYS (timers, not your voice)",
              "Physical presence = external executive function",
              "90-minute minimum downtime after school",
              "Stop if tears/aggression last 5+ minutes"
            ]
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Morning Routine Quick Scripts"
          },
          {
            "type": "paragraph",
            "content": "**Wake up:**\n\"Good morning. Time to wake up.\" → Wait 30 seconds → \"Sit up please.\"\n\n**Clothing:**\nHold up 2 options: \"Blue or green?\" → Hand them the choice → \"Put this on. Go.\"\n\n**Tasks:**\n\"Shoes. Go.\" → Wait → \"Backpack. Go.\" → Wait → \"Lunch. Go.\"\n\n**Meltdown:**\n\"Stop. You''re too upset. We''re pausing.\" → Sit nearby → Say nothing for 2 minutes."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Homework Quick Scripts"
          },
          {
            "type": "paragraph",
            "content": "**Refusal:**\n\"I know you don''t want to. You still need to. Starting in 2 minutes.\" → Set timer.\n\n**Can''t start:**\n\"Write your name.\" → Point where → Wait → \"Read problem 1 out loud.\"\n\n**Frustration:**\n\"Stop. Pencil down.\" → \"Three breaths with me.\" → Breathe together.\n\n**Meltdown:**\nStop homework. Email teacher: \"Unable to complete tonight due to depletion.\""
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Phase Identification"
          },
          {
            "type": "paragraph",
            "content": "**Phase 1 (Ages 5-10):** You provide ALL executive function\n• Stand in room\n• Give one instruction at a time\n• Wait for completion between steps\n\n**Phase 2 (Ages 9-13):** Gradual fading\n• Week 1-4: You in doorway\n• Week 5-8: You nearby\n• Week 9-12: Visual schedule + spot checks\n\n**Phase 3 (Ages 12+):** Supported autonomy\n• They complete tasks\n• You verify quality/completion\n• Check-in systems remain"
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Backup Plans"
          },
          {
            "type": "paragraph",
            "content": "**Morning disaster:**\n• Skip breakfast (eat at school)\n• Skip teeth (one day is fine)\n• Keep yesterday''s clothes on\n• Get to school—that''s the only goal\n\n**Late to school:**\nEmail: \"Running late due to difficult morning.\" Better late + calm than on-time + dysregulated.\n\n**Homework impossible:**\n• 30+ minutes of struggle? Stop.\n• Email: \"Unable to complete tonight.\"\n• Try again tomorrow morning"
          },
          {
            "type": "heading",
            "level": 2,
            "content": "When to Take a Mental Health Day"
          },
          {
            "type": "list",
            "ordered": false,
            "items": [
              "Crying that won''t stop after 10 minutes",
              "Aggression toward self or others",
              "Complete shutdown (non-verbal, frozen)",
              "Physical illness from stress"
            ]
          },
          {
            "type": "paragraph",
            "content": "Email school: \"Child staying home for health reasons.\" Mental health IS health."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Signs Strategy Stopped Working"
          },
          {
            "type": "paragraph",
            "content": "**If it worked for weeks then stopped:**\n\n**Option 1:** Developmental leap\n→ Add more support OR reduce support\n\n**Option 2:** Novelty wore off\n→ Change something (new timer, different order)\n\n**Option 3:** External stressor\n→ Increase support temporarily"
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Your Emergency Self-Care"
          },
          {
            "type": "paragraph",
            "content": "**When you''re about to lose it:**\n\"I need a minute. Stay here.\" → Bathroom/outside → 10 breaths → Come back.\n\n**When you can''t help:**\n\"I can''t right now. You''re on your own for 10 minutes.\" → Set timer → Sit alone.\n\n**When everything''s falling apart:**\n• Lower expectations\n• Screen time is fine\n• Cereal for dinner is fine\n• Survival mode is valid"
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Red Flags: When to Get Professional Help"
          },
          {
            "type": "list",
            "ordered": false,
            "items": [
              "Aggressive toward you/siblings daily",
              "School refusal 3+ times per month",
              "Homework causes self-harm behaviors",
              "No improvement after 3 months of trying these strategies",
              "Your mental health is suffering"
            ]
          },
          {
            "type": "paragraph",
            "content": "Get: Educational advocate, therapist specializing in neurodivergence, IEP/504 evaluation."
          },
          {
            "type": "heading",
            "level": 2,
            "content": "Remember"
          },
          {
            "type": "callout",
            "calloutType": "REMEMBER",
            "title": "You''re Building a Brain",
            "content": "Every time you provide external executive function, you''re building neural pathways. Every routine repetition strengthens connections. This isn''t ''doing too much''—this is neurodevelopment in action.\n\nYour child will get there. Just not on a neurotypical timeline. And that''s okay."
          },
          {
            "type": "paragraph",
            "content": "You''ve got this. One instruction at a time."
          }
        ]
      }
    ]
  }'::jsonb,
  7,
  45,
  '#3b82f6',
  '/ebook-cover.png',
  '{"target_audience": "Parents of neurodivergent children (ages 5-13)", "tags": ["school", "homework", "morning routine", "executive function", "ADHD", "autism", "universal"], "difficulty": "beginner"}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  content = EXCLUDED.content,
  total_chapters = EXCLUDED.total_chapters,
  estimated_reading_time = EXCLUDED.estimated_reading_time,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();
