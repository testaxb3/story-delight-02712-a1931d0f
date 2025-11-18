-- Create premium version of The Calm Mom Code ebook for V2 reader
INSERT INTO ebooks (
  title,
  subtitle,
  slug,
  content,
  thumbnail_url,
  cover_color,
  bonus_id,
  total_chapters,
  estimated_reading_time,
  total_words
) VALUES (
  'The Calm Mom Code V2',
  'Regulating Yourself First (So Your Words Actually Work)',
  'calm-mom-code-v2',
  '[
    {
      "id": "intro",
      "title": "Introduction",
      "subtitle": "You Are Not the Problem",
      "content": [
        {
          "type": "heading",
          "level": 2,
          "content": "You Know This Moment"
        },
        {
          "type": "paragraph",
          "content": "It''s 7:15am. You''ve asked your child to put on their shoes **four times**. You''ve stayed calm. You''ve used your \"connection phrases.\" You''ve done everything the parenting books say."
        },
        {
          "type": "paragraph",
          "content": "And then they ask for the fifth time if they can watch TV before school."
        },
        {
          "type": "paragraph",
          "content": "Something inside you just... *snaps*."
        },
        {
          "type": "paragraph",
          "content": "**\"I SAID NO! WHY DON''T YOU EVER LISTEN TO ME?!\"**"
        },
        {
          "type": "paragraph",
          "content": "Your voice is louder than you meant. Your child''s face crumples. And the guilt hits you like a truck."
        },
        {
          "type": "paragraph",
          "content": "You''re supposed to be the calm one. You know yelling doesn''t work. You know better. So why do you keep doing it?"
        },
        {
          "type": "heading",
          "level": 2,
          "content": "Here''s What Nobody Tells You"
        },
        {
          "type": "paragraph",
          "content": "You can have the **best parenting strategies in the world** — the perfect connection phrases, the gentle discipline techniques, all of it. But if **YOU''RE** not regulated, none of it will work."
        },
        {
          "type": "paragraph",
          "content": "Why? Because your nervous system talks to your child''s nervous system *before your words ever reach their ears*."
        },
        {
          "type": "callout",
          "calloutType": "remember",
          "content": "**The Truth About Connection Phrases**\\n\\nThose \"magic words\" everyone talks about? They only work when they come from a regulated nervous system. Without that, they''re just... words."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "This Isn''t a Parenting Problem"
        },
        {
          "type": "paragraph",
          "content": "Here''s what I need you to hear: The reason you keep losing it isn''t because you''re a bad mom. It''s not because you lack willpower or patience."
        },
        {
          "type": "paragraph",
          "content": "**You keep losing it because you''re running on empty.**"
        },
        {
          "type": "callout",
          "calloutType": "science",
          "content": "**Your Nervous System Under Stress**\\n\\nWhen your sympathetic nervous system is chronically activated (fight-or-flight mode), your prefrontal cortex — the part of your brain responsible for patience, perspective, and emotional regulation — literally goes offline. You become reactive instead of responsive.\\n\\nIt''s not a character flaw. It''s biology."
        },
        {
          "type": "paragraph",
          "content": "You wake up already at a **6 out of 10** on the stress scale. So it only takes one more thing — one more \"Mom!\" one more spilled cup, one more battle over socks — to push you over the edge to a 10."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "What You''ll Learn"
        },
        {
          "type": "paragraph",
          "content": "This ebook is different. It''s not about parenting your kids better. **It''s about parenting yourself first.**"
        },
        {
          "type": "list",
          "content": [
            "**Why your nervous system is stuck in overdrive** (and why that makes everything harder)",
            "**The co-regulation secret** (why you MUST regulate yourself before you can help your child)",
            "**How to recognize your triggers** before you explode",
            "**60-second reset tools** you can use anywhere, anytime",
            "**Sustainable self-care** (not bubble baths — actual nervous system care)",
            "**Compassionate self-talk scripts** to quiet your inner critic",
            "**How to repair** when you do lose it (because you will)",
            "**A 30-day plan** to become the calm mom you want to be"
          ]
        }
      ]
    },
    {
      "id": "chapter1",
      "title": "Understanding Your Nervous System",
      "subtitle": "The Real Reason You Keep Losing It",
      "content": [
        {
          "type": "heading",
          "level": 2,
          "content": "Your Body Keeps the Score"
        },
        {
          "type": "paragraph",
          "content": "Before we talk about *what to do*, we need to understand *what''s happening* inside your body when you lose it with your kids."
        },
        {
          "type": "paragraph",
          "content": "Your nervous system has two main modes: **rest-and-digest** (parasympathetic) and **fight-or-flight** (sympathetic). In a healthy nervous system, you toggle between these modes as needed."
        },
        {
          "type": "callout",
          "calloutType": "science",
          "content": "**The Polyvagal Theory**\\n\\nDr. Stephen Porges'' research shows that our nervous system operates on a hierarchy:\\n\\n• **Ventral Vagal (Safe & Social)** — You feel calm, connected, present\\n• **Sympathetic (Fight or Flight)** — You feel activated, anxious, reactive\\n• **Dorsal Vagal (Shutdown)** — You feel numb, disconnected, exhausted\\n\\nWhen you''re chronically stressed, you spend most of your time in sympathetic activation or dorsal shutdown — never in the calm, connected state where good parenting actually happens."
        },
        {
          "type": "paragraph",
          "content": "The problem? Most moms are stuck in **chronic sympathetic activation**. Your nervous system thinks you''re always in danger, so it keeps you in survival mode 24/7."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "Why You''re Stuck in Fight-or-Flight"
        },
        {
          "type": "paragraph",
          "content": "Think about your typical day. How many of these sound familiar?"
        },
        {
          "type": "list",
          "content": [
            "You wake up already thinking about your to-do list",
            "You scroll your phone while drinking coffee (double stimulation)",
            "You rush through the morning routine, feeling behind before you even start",
            "Your shoulders are perpetually tense",
            "You hold your breath when concentrating",
            "You skip meals or eat standing up",
            "You collapse at the end of the day, exhausted but wired",
            "You struggle to fall asleep because your mind won''t stop"
          ]
        },
        {
          "type": "paragraph",
          "content": "Every single one of these keeps your nervous system in high alert. **You''re teaching your body that it''s never safe to relax.**"
        },
        {
          "type": "callout",
          "calloutType": "warning",
          "content": "**The Cortisol Cycle**\\n\\nChronic stress floods your body with cortisol. Over time, this:\\n• Shrinks your hippocampus (memory & emotional regulation)\\n• Enlarges your amygdala (fear & threat detection)\\n• Weakens your prefrontal cortex (patience & impulse control)\\n\\nThis literally rewires your brain to be more reactive and less patient."
        }
      ]
    },
    {
      "id": "chapter2",
      "title": "The Co-Regulation Foundation",
      "subtitle": "Why You Must Calm Yourself First",
      "content": [
        {
          "type": "heading",
          "level": 2,
          "content": "You Cannot Pour from an Empty Cup"
        },
        {
          "type": "paragraph",
          "content": "Here''s the hard truth: **Your child cannot regulate themselves if you''re dysregulated.**"
        },
        {
          "type": "paragraph",
          "content": "Children don''t have fully developed nervous systems. Their prefrontal cortex (the brain''s CEO) won''t be fully formed until their mid-20s. This means they *literally cannot calm themselves down* without co-regulation from a calm adult."
        },
        {
          "type": "callout",
          "calloutType": "science",
          "content": "**Mirror Neurons & Emotional Contagion**\\n\\nYour child''s brain has mirror neurons that automatically mimic your emotional state. When you''re stressed, their nervous system picks up on it instantly — before conscious thought.\\n\\nThey don''t just *hear* your words. They *feel* your nervous system state. And their nervous system matches yours."
        },
        {
          "type": "paragraph",
          "content": "This is why saying \"Calm down!\" while YOU''RE activated never works. Your child''s body is literally responding to YOUR dysregulation, not their own emotions."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "The Co-Regulation Process"
        },
        {
          "type": "paragraph",
          "content": "True co-regulation happens in this order:"
        },
        {
          "type": "list",
          "content": [
            "**You regulate yourself first** (even if it''s just 20% calmer)",
            "**Your child''s nervous system senses your regulation** (through tone, facial expressions, body language)",
            "**Their nervous system begins to match yours** (they start calming down)",
            "**Now your words can actually land** (they can hear and process what you''re saying)"
          ]
        },
        {
          "type": "callout",
          "calloutType": "try",
          "content": "**The 60-Second Reset**\\n\\nBefore responding to your child, try this:\\n\\n1. **Notice** your activation (\"My chest is tight, my jaw is clenched\")\\n2. **Breathe** — Exhale longer than you inhale (4 counts in, 6 counts out)\\n3. **Ground** — Feel your feet on the floor\\n4. **Respond** — Now speak to your child\\n\\nEven 20% calmer makes a huge difference."
        }
      ]
    },
    {
      "id": "chapter3",
      "title": "Daily Regulation Practices",
      "subtitle": "Building Your Resilience Baseline",
      "content": [
        {
          "type": "heading",
          "level": 2,
          "content": "Morning Micro-Rituals"
        },
        {
          "type": "paragraph",
          "content": "You don''t need an hour-long morning routine. You need **60 seconds of intentional nervous system regulation** before the chaos begins."
        },
        {
          "type": "callout",
          "calloutType": "try",
          "content": "**Morning Regulation Menu (Pick ONE)**\\n\\n• **30-second cold water face wash** — Activates the vagus nerve\\n• **3 deep breaths before getting out of bed** — Sets a calm tone\\n• **1-minute gentle stretching** — Releases overnight tension\\n• **Silent coffee** — 5 minutes without screens or talking\\n• **Gratitude list** — 3 things, written or mental"
        },
        {
          "type": "paragraph",
          "content": "The goal isn''t perfection. The goal is to start your day from a **ventral vagal state** (calm & connected) instead of sympathetic activation (already stressed)."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "Throughout the Day"
        },
        {
          "type": "paragraph",
          "content": "Set **3 micro-reset alarms** throughout your day. When they go off, pause for 30 seconds and:"
        },
        {
          "type": "list",
          "content": [
            "**Check your body** — Where are you holding tension?",
            "**Take 3 deep breaths** — Exhale fully",
            "**Soften** — Release your jaw, drop your shoulders, unclench your fists",
            "**Hydrate** — Drink water (dehydration amplifies stress)"
          ]
        },
        {
          "type": "callout",
          "calloutType": "remember",
          "content": "**Prevention is easier than repair.** Three 30-second resets throughout the day are infinitely more effective than trying to calm down after you''ve already exploded."
        }
      ]
    },
    {
      "id": "chapter4",
      "title": "Your 30-Day Transformation",
      "subtitle": "Becoming the Calm Mom You Want to Be",
      "content": [
        {
          "type": "heading",
          "level": 2,
          "content": "Week 1: Awareness"
        },
        {
          "type": "paragraph",
          "content": "You can''t change what you don''t notice. This week is all about building **somatic awareness** — learning to recognize your activation BEFORE you explode."
        },
        {
          "type": "callout",
          "calloutType": "try",
          "content": "**Daily Practice: Body Scan Check-Ins**\\n\\n3x per day, pause and notice:\\n• Where is tension in your body?\\n• What''s your breath like? (Shallow? Held? Deep?)\\n• What''s your heart rate? (Racing? Calm?)\\n• Rate your stress: 1-10\\n\\nJust notice. Don''t judge. Don''t fix. Just observe."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "Week 2: Regulation Tools"
        },
        {
          "type": "paragraph",
          "content": "Now that you can recognize your activation, let''s build your **regulation toolkit**."
        },
        {
          "type": "list",
          "content": [
            "**Physiological Sigh** — Double inhale through nose, long exhale through mouth (fastest way to calm your nervous system)",
            "**Humming** — Activates the vagus nerve (hum while doing dishes, in the car, etc.)",
            "**Cold Water** — Splash face or hold ice cubes (triggers the dive reflex, instant calm)",
            "**Bilateral Stimulation** — Tap alternating knees or cross-body movements (integrates left/right brain)",
            "**5-4-3-2-1 Grounding** — Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste"
          ]
        },
        {
          "type": "heading",
          "level": 2,
          "content": "Week 3: Integration"
        },
        {
          "type": "paragraph",
          "content": "You''re starting to feel the difference. Now let''s integrate these tools into your **parenting moments**."
        },
        {
          "type": "callout",
          "calloutType": "try",
          "content": "**The Trigger-Regulate-Respond Pattern**\\n\\n1. **Trigger** — Your child does the thing (again)\\n2. **PAUSE** — Don''t react immediately\\n3. **Regulate** — Use ONE tool from your toolkit\\n4. **Respond** — Now address the behavior\\n\\nPractice this 5x this week, even with small triggers."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "Week 4: Sustainability"
        },
        {
          "type": "paragraph",
          "content": "The final week is about making this your **new normal**."
        },
        {
          "type": "paragraph",
          "content": "By now, you should notice:"
        },
        {
          "type": "list",
          "content": [
            "You''re catching yourself earlier in the activation cycle",
            "Your baseline stress level is lower",
            "Your children are calmer (they''re co-regulating with your calm)",
            "Parenting feels less exhausting",
            "You''re repairing faster when you do lose it"
          ]
        },
        {
          "type": "callout",
          "calloutType": "remember",
          "content": "**This is a practice, not a destination.** You won''t be perfectly calm every day. But you''ll have the tools to come back to regulation faster. And that changes everything."
        }
      ]
    }
  ]'::jsonb,
  'https://iogceaotdodvugrmogpp.supabase.co/storage/v1/object/public/public-assets/bonus-thumbnails/9q6swreq3zm-1763083517785.png',
  '#8B5CF6',
  'ce393e26-0df1-4fa7-9ff0-e03f33f22a16',
  4,
  25,
  6500
);