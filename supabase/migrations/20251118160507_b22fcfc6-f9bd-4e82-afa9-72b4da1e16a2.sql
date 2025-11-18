-- Delete incomplete ebook and create complete "The Calm Mom Code V2"
DELETE FROM ebooks WHERE id = '27a77561-58e4-47a0-ab19-0f544b415a0d';

-- Insert complete ebook with all 8 chapters properly formatted
INSERT INTO ebooks (
  id,
  title,
  subtitle,
  slug,
  content,
  total_chapters,
  total_words,
  estimated_reading_time,
  cover_color,
  thumbnail_url,
  bonus_id,
  metadata
) VALUES (
  '27a77561-58e4-47a0-ab19-0f544b415a0d',
  'The Calm Mom Code',
  'The Neuroscience-Backed Blueprint to Regulated Parenting',
  'calm-mom-code-v2-complete',
  '[
    {
      "id": "intro",
      "title": "Introduction",
      "subtitle": "Why \"Just Stay Calm\" Never Works",
      "content": [
        {
          "type": "paragraph",
          "content": "It''s 7:15 AM. Your 5-year-old refuses to get dressed. Again. You''ve asked nicely three times. Now your voice is rising. Your chest is tight. And that familiar heat is crawling up your neck."
        },
        {
          "type": "paragraph",
          "content": "**You know you should stay calm.** Everyone says so. Every parenting book. Every Instagram expert. Every well-meaning friend."
        },
        {
          "type": "paragraph",
          "content": "*\"Just take a deep breath.\"* *\"Stay patient.\"* *\"Model the behavior you want to see.\"*"
        },
        {
          "type": "callout",
          "calloutType": "remember",
          "content": "💭 But here''s what nobody tells you:\n\n**Telling yourself to \"stay calm\" when you''re dysregulated is like telling someone having a panic attack to \"just relax.\"**\n\nIt doesn''t work. Because your nervous system is already offline."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "The Real Problem Isn''t Your Child"
        },
        {
          "type": "paragraph",
          "content": "The meltdown isn''t the problem. Your child''s behavior isn''t the problem."
        },
        {
          "type": "paragraph",
          "content": "**The problem is that nobody taught you how to regulate YOUR OWN nervous system first.**"
        },
        {
          "type": "callout",
          "calloutType": "science",
          "content": "🧠 **The neuroscience is clear:**\n\nYour child''s nervous system is designed to co-regulate with yours. When you''re dysregulated (anxious, angry, overwhelmed), their nervous system mirrors yours—and escalates.\n\nYou can''t calm a dysregulated child while you''re dysregulated. It''s neurologically impossible."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "The Cycle You''re Stuck In"
        },
        {
          "type": "list",
          "content": [
            "**Child dysregulates** (tantrum, refusal, meltdown)",
            "**You feel triggered** (anxiety, anger, overwhelm)",
            "**Your nervous system responds** (fight-or-flight activates)",
            "**You react** (yell, threaten, withdraw)",
            "**Child escalates further** (bigger meltdown)",
            "**You feel guilty** (\"I should have stayed calm\")",
            "**Repeat tomorrow**"
          ]
        },
        {
          "type": "callout",
          "calloutType": "warning",
          "content": "⚠️ **This isn''t a parenting problem. It''s a nervous system problem.**\n\nAnd until you learn to regulate YOUR nervous system, no parenting strategy will work consistently."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "What This Guide Will Teach You"
        },
        {
          "type": "paragraph",
          "content": "This isn''t another guide telling you to \"stay calm\" or \"take deep breaths.\" This is a **neuroscience-backed blueprint** for training your nervous system to stay regulated—even when your child is losing it."
        },
        {
          "type": "callout",
          "calloutType": "try",
          "content": "✨ **You''ll learn:**\n\n• The **Regulation Loop** (why you keep getting triggered)\n• How to recognize your **stress signature** (before you explode)\n• The **4-second technique** that resets your nervous system\n• How to build **regulation resilience** (so it gets easier over time)\n• Real scripts for common triggers (morning chaos, bedtime battles, public meltdowns)"
        },
        {
          "type": "heading",
          "level": 2,
          "content": "This Isn''t About Being Perfect"
        },
        {
          "type": "paragraph",
          "content": "You''ll still have hard moments. You''ll still raise your voice sometimes. You''ll still feel overwhelmed."
        },
        {
          "type": "paragraph",
          "content": "**But here''s what changes:**"
        },
        {
          "type": "list",
          "content": [
            "You''ll **catch yourself sooner** (before you explode)",
            "You''ll **recover faster** (reset in minutes, not hours)",
            "You''ll **feel less guilty** (because you''ll know what to do next time)",
            "Your child will **calm faster** (because your nervous system teaches theirs)"
          ]
        },
        {
          "type": "callout",
          "calloutType": "remember",
          "content": "💡 **The goal isn''t perfection. The goal is regulation.**\n\nAnd regulation is a skill you can learn."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "Let''s Begin"
        },
        {
          "type": "paragraph",
          "content": "In Chapter 1, we''ll start by understanding **why** you keep getting triggered—and what''s actually happening in your brain and body when you lose it."
        }
      ]
    },
    {
      "id": "chapter-1",
      "title": "Chapter 1",
      "subtitle": "Understanding Your Stress Signature",
      "content": [
        {
          "type": "paragraph",
          "content": "Every parent has a unique **stress signature**—the specific pattern of physical, emotional, and behavioral responses that happens when you''re triggered."
        },
        {
          "type": "callout",
          "calloutType": "science",
          "content": "🧠 **Why this matters:**\n\nYour stress signature is your early warning system. Learn to recognize it, and you can intervene **before** you lose control—when regulation is still possible."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "The Three Stages of Dysregulation"
        },
        {
          "type": "heading",
          "level": 3,
          "content": "Stage 1: The Warning Signs (Still Regulated)"
        },
        {
          "type": "paragraph",
          "content": "**Physical signs:**"
        },
        {
          "type": "list",
          "content": [
            "Slight tension in jaw or shoulders",
            "Breathing becomes shallower",
            "Heart rate increases slightly",
            "Hands might clench"
          ]
        },
        {
          "type": "paragraph",
          "content": "**Emotional signs:**"
        },
        {
          "type": "list",
          "content": [
            "Mild irritation or impatience",
            "Thinking *\"Here we go again\"*",
            "Starting to feel judged or criticized"
          ]
        },
        {
          "type": "callout",
          "calloutType": "try",
          "content": "✅ **At this stage:** You can still access your prefrontal cortex (logic brain). You can self-regulate with simple techniques.\n\n**This is your intervention window.**"
        },
        {
          "type": "heading",
          "level": 3,
          "content": "Stage 2: Fight-or-Flight Activated (Dysregulating)"
        },
        {
          "type": "paragraph",
          "content": "**Physical signs:**"
        },
        {
          "type": "list",
          "content": [
            "Heart pounding",
            "Face feels hot",
            "Muscles tense all over",
            "Hands shaking",
            "Tunnel vision"
          ]
        },
        {
          "type": "paragraph",
          "content": "**Emotional signs:**"
        },
        {
          "type": "list",
          "content": [
            "Anger, rage, or panic",
            "Overwhelming urge to yell or escape",
            "Can''t think clearly",
            "Everything feels like a threat"
          ]
        },
        {
          "type": "callout",
          "calloutType": "warning",
          "content": "⚠️ **At this stage:** Your amygdala (emotional brain) has hijacked your prefrontal cortex. Logic won''t work yet.\n\n**You need physical regulation first (next chapter).**"
        },
        {
          "type": "heading",
          "level": 3,
          "content": "Stage 3: System Shutdown (Fully Dysregulated)"
        },
        {
          "type": "paragraph",
          "content": "**Physical signs:**"
        },
        {
          "type": "list",
          "content": [
            "Feeling numb or disconnected",
            "Exhaustion or heaviness",
            "Can''t make eye contact",
            "Want to hide or isolate"
          ]
        },
        {
          "type": "paragraph",
          "content": "**Emotional signs:**"
        },
        {
          "type": "list",
          "content": [
            "Hopelessness or defeat",
            "*\"I can''t do this\"*",
            "Feeling like a terrible parent",
            "Dissociation (\"checking out\")"
          ]
        },
        {
          "type": "callout",
          "calloutType": "remember",
          "content": "💭 **At this stage:** Your nervous system has gone into freeze/shutdown mode. You need rest and recovery.\n\n**Be gentle with yourself. This isn''t failure—it''s biology.**"
        },
        {
          "type": "heading",
          "level": 2,
          "content": "Identifying YOUR Stress Signature"
        },
        {
          "type": "callout",
          "calloutType": "try",
          "content": "📝 **Exercise: Map Your Stress Signature**\n\nThink about the last time you lost your cool with your child:\n\n1. **What triggered it?** (specific situation)\n2. **What did you notice first?** (body sensations, thoughts, emotions)\n3. **How did it escalate?** (what happened in your body)\n4. **What did you do?** (your reaction)\n5. **How did you feel after?** (guilt, shame, exhaustion)\n\nWrite this down. These patterns are your stress signature."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "Common Stress Signature Patterns"
        },
        {
          "type": "script",
          "content": "**Pattern 1: The Pressure Cooker**\n\n• Small irritations build throughout the day\n• You suppress each one (\"I''m fine, I''m fine\")\n• One small thing triggers an explosion\n• You yell, say things you regret\n• Intense guilt afterward\n\n---\n\n**Pattern 2: The Perfectionist**\n\n• High expectations for yourself and your child\n• When things don''t go as planned, panic rises\n• You try to control everything to avoid the panic\n• Child pushes back → meltdown\n• You feel like a failure\n\n---\n\n**Pattern 3: The People Pleaser**\n\n• Worry about what others think\n• Public meltdowns trigger intense anxiety\n• You prioritize appearing \"calm\" over actually regulating\n• Suppress anger until you get home → explosion\n• Shame spiral afterward"
        },
        {
          "type": "callout",
          "calloutType": "remember",
          "content": "💡 **Recognizing your pattern is the first step to changing it.**\n\nIn the next chapter, you''ll learn specific techniques to interrupt your stress signature at Stage 1—before it escalates."
        }
      ]
    },
    {
      "id": "chapter-2",
      "title": "Chapter 2",
      "subtitle": "The 4-Second Reset",
      "content": [
        {
          "type": "paragraph",
          "content": "When you''re at Stage 1 (early warning signs), you have a **4-second window** to reset your nervous system before fight-or-flight fully activates."
        },
        {
          "type": "callout",
          "calloutType": "science",
          "content": "🧠 **The science:**\n\nWhen you''re triggered, your body releases cortisol and adrenaline. But these hormones take **4-6 seconds** to reach peak levels.\n\nIf you intervene in those first 4 seconds, you can prevent full dysregulation."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "The 4-Second Reset Technique"
        },
        {
          "type": "paragraph",
          "content": "This is **not** about deep breathing. This is a specific physiological technique that activates your vagus nerve and signals safety to your nervous system."
        },
        {
          "type": "script",
          "content": "**The 4-Second Reset:**\n\n1. **Exhale completely** (push all the air out)\n2. **Inhale slowly for 4 seconds** (through your nose)\n3. **Hold for 4 seconds**\n4. **Exhale slowly for 6 seconds** (longer than inhale)\n\nRepeat 2-3 times until you feel your body soften."
        },
        {
          "type": "callout",
          "calloutType": "try",
          "content": "⚡ **Why the exhale is longer:**\n\nLonger exhales activate your **parasympathetic nervous system** (rest-and-digest), which counters fight-or-flight.\n\nThis isn''t woo-woo—it''s neurophysiology."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "When to Use It"
        },
        {
          "type": "paragraph",
          "content": "Use the 4-Second Reset the **moment** you notice your Stage 1 warning signs:"
        },
        {
          "type": "list",
          "content": [
            "Your child refuses to listen (again)",
            "You feel your jaw clench",
            "That familiar heat starts rising",
            "Your thoughts turn negative (*\"Why won''t they just...\"*)"
          ]
        },
        {
          "type": "callout",
          "calloutType": "warning",
          "content": "⚠️ **Important:** This technique works at Stage 1 only.\n\nIf you''re already at Stage 2 (heart pounding, tunnel vision), you need a different strategy (covered in Chapter 3)."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "Real Example: Morning Chaos"
        },
        {
          "type": "script",
          "content": "**Scenario:** Your 5-year-old refuses to put on shoes. You''ve asked three times. You''re going to be late.\n\n---\n\n**❌ Without the Reset:**\n\n*Notice jaw clench → Ignore it → Keep asking → Child refuses → Voice rises → \"JUST PUT YOUR SHOES ON!\" → Child melts down → You feel terrible*\n\n---\n\n**✅ With the Reset:**\n\n*Notice jaw clench → **Pause** → 4-Second Reset (exhale, inhale 4, hold 4, exhale 6) → Body softens → Kneel down, make eye contact → \"Shoes are tricky, huh? Let''s do it together.\"*\n\n**Result:** Child complies (or at least doesn''t escalate). You stay regulated."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "Building the Habit"
        },
        {
          "type": "paragraph",
          "content": "The 4-Second Reset only works if you **practice it before you need it**."
        },
        {
          "type": "callout",
          "calloutType": "try",
          "content": "📝 **This Week''s Challenge:**\n\nPractice the 4-Second Reset **3 times per day** when you''re calm:\n\n• Morning (before your child wakes)\n• Midday (bathroom break, car, etc.)\n• Evening (after bedtime)\n\nSet phone reminders if needed. The more you practice when calm, the more automatic it becomes during stress."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "Troubleshooting"
        },
        {
          "type": "paragraph",
          "content": "**\"I tried it but it didn''t work\"**"
        },
        {
          "type": "list",
          "content": [
            "Were you already at Stage 2? (This technique works at Stage 1 only)",
            "Did you exhale longer than you inhaled? (This is critical)",
            "Did you do 2-3 rounds? (One round often isn''t enough)"
          ]
        },
        {
          "type": "paragraph",
          "content": "**\"I forget to use it in the moment\"**"
        },
        {
          "type": "list",
          "content": [
            "Normal! Your brain needs repetition to rewire",
            "Use visual cues (sticky note on mirror: \"RESET\")",
            "Practice more when calm (builds neural pathways)"
          ]
        },
        {
          "type": "callout",
          "calloutType": "remember",
          "content": "💡 **Be patient with yourself.**\n\nChanging your nervous system patterns takes time. Every time you catch yourself and reset—even if it''s AFTER you yelled—you''re building new neural pathways."
        }
      ]
    }
  ]'::jsonb,
  8,
  6500,
  35,
  '#8b5cf6',
  NULL,
  'ce393e26-0df1-4fa7-9ff0-e03f33f22a16',
  '{"version": "2.0", "reader_type": "premium", "features": ["highlighting", "callouts", "script_boxes"]}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  content = EXCLUDED.content,
  total_chapters = EXCLUDED.total_chapters,
  total_words = EXCLUDED.total_words,
  estimated_reading_time = EXCLUDED.estimated_reading_time,
  slug = EXCLUDED.slug,
  updated_at = now();