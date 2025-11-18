-- Delete incomplete V2 ebook and insert complete version
DELETE FROM ebooks WHERE slug = 'the-meltdown-decoder-v2';

-- Insert Complete The Meltdown Decoder V2 with Premium Formatting
INSERT INTO ebooks (
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
  'The Meltdown Decoder V2',
  'What Your Child''s Behavior Is Really Telling You',
  'the-meltdown-decoder-v2',
  '[
    {
      "id": "intro",
      "title": "Introduction",
      "subtitle": "Why \"Just Stop\" Never Works",
      "content": [
        {
          "type": "paragraph",
          "content": "Your child is screaming because you cut their sandwich wrong. You''ve asked them to stop five times. They''re getting louder. You''re getting angrier. And somewhere in the back of your mind, you''re thinking, *\"Why can''t they just STOP?\"*"
        },
        {
          "type": "callout",
          "calloutType": "science",
          "content": "**Here''s the truth nobody tells you**: They literally can''t.\n\nIt''s not because they''re manipulative, or spoiled, or \"playing you.\" It''s because their **brain is offline**—specifically, the part that controls logic, reasoning, and self-regulation."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "The Upstairs/Downstairs Brain"
        },
        {
          "type": "paragraph",
          "content": "Dr. Dan Siegel''s model explains it perfectly:"
        },
        {
          "type": "list",
          "content": [
            "**Upstairs brain** (Prefrontal Cortex): Logic, reasoning, impulse control, decision-making",
            "**Downstairs brain** (Amygdala + Limbic System): Emotions, fight-or-flight, survival instincts"
          ]
        },
        {
          "type": "callout",
          "calloutType": "remember",
          "content": "🧠 When your child is in meltdown mode, their **downstairs brain has taken over**. The upstairs brain (where logic lives) is completely offline.\n\nAsking them to \"just stop\" is like asking someone to do calculus during a panic attack."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "Why Traditional Discipline Backfires"
        },
        {
          "type": "paragraph",
          "content": "Traditional consequences assume the upstairs brain is online:"
        },
        {
          "type": "list",
          "content": [
            "*\"If you don''t stop screaming, no tablet tonight\"*",
            "*\"Count to three or you''re going to timeout\"*",
            "*\"I''m very disappointed in you\"*"
          ]
        },
        {
          "type": "callout",
          "calloutType": "warning",
          "content": "⚠️ **When the downstairs brain is in charge, these threats:**\n\n• **Aren''t processed** (the logic center is offline)\n• **Increase dysregulation** (more threats = more danger signals)\n• **Damage connection** (your child learns you''re not safe during hard moments)"
        },
        {
          "type": "heading",
          "level": 2,
          "content": "What Actually Works: The Connection First Model"
        },
        {
          "type": "paragraph",
          "content": "Before you can discipline, teach, or redirect, you must **regulate**."
        },
        {
          "type": "callout",
          "calloutType": "try",
          "content": "✨ **The order MUST be:**\n\n1. **Connection** (safety signal to the nervous system)\n2. **Validation** (acknowledgment of their experience)\n3. **Command** (simple, clear direction)\n\nWe call this the **CVC Framework**, and you''ll master it in Chapter 3."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "Real Example: The \"Wrong\" Sandwich"
        },
        {
          "type": "script",
          "content": "**❌ Traditional Response (Doesn''t Work):**\n*\"That''s ridiculous. It''s the same sandwich. Stop crying right now or no dessert.\"*\n\n---\n\n**✅ CVC Response (Works):**\n**Connection**: *Kneel down, soft voice* → *\"Hey buddy. Big feelings right now.\"*\n**Validation**: *Acknowledge their reality* → *\"You wanted it cut triangles. I cut it squares. That feels really wrong.\"*\n**Command**: *Simple, actionable* → *\"Let''s take three big breaths together. In through the nose...\"*"
        },
        {
          "type": "callout",
          "calloutType": "remember",
          "content": "💡 **Notice:** No logic. No explaining. No consequences. Just **regulation**.\n\nYou''re not teaching them a lesson right now—you''re teaching their nervous system that **you are safe**."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "The Neuroscience Nobody Tells You"
        },
        {
          "type": "callout",
          "calloutType": "science",
          "content": "🔬 **Mirror neurons** mean your child''s nervous system **matches yours**:\n\n• You''re calm → They can start to calm\n• You''re escalating → They escalate faster\n\nYour regulation is **CONTAGIOUS**. This is why \"staying calm\" isn''t just good advice—it''s neurologically necessary."
        },
        {
          "type": "callout",
          "calloutType": "try",
          "content": "**🎯 The Regulation Litmus Test:**\n\nCan your child answer a simple question correctly?\n\n• *\"What''s your name?\"*\n• *\"How old are you?\"*\n\nIf not, their upstairs brain is still offline. Keep regulating—don''t start teaching yet."
        }
      ]
    },
    {
      "id": "chapter-1",
      "title": "Chapter 1",
      "subtitle": "Understanding the Four Brain Types",
      "content": [
        {
          "type": "paragraph",
          "content": "Not all meltdowns are created equal. And not all children respond to the same strategies."
        },
        {
          "type": "paragraph",
          "content": "In my decade of working with families, I''ve identified **four distinct neurological profiles** that determine how children process emotions, handle transitions, and respond to regulation."
        },
        {
          "type": "callout",
          "calloutType": "remember",
          "content": "🧩 **Your child''s brain type isn''t a diagnosis—it''s a decoder.**\n\nIt tells you *why* certain behaviors happen and *which* strategies will actually work for your unique child."
        },
        {
          "type": "heading",
          "level": 2,
          "content": "The Four Brain Types"
        },
        {
          "type": "heading",
          "level": 3,
          "content": "1. The Intense Child"
        },
        {
          "type": "paragraph",
          "content": "**Core trait:** Feels everything at 100%"
        },
        {
          "type": "list",
          "content": [
            "Goes from calm to meltdown in seconds",
            "Struggles with transitions",
            "Highly sensitive to sensory input (sounds, textures, light)",
            "Deeply empathetic but easily overwhelmed"
          ]
        },
        {
          "type": "callout",
          "calloutType": "science",
          "content": "🧠 **The neuroscience**: Intense children have a highly reactive amygdala (emotional center) combined with a slower-developing prefrontal cortex (impulse control). They feel emotions deeply and have less capacity to regulate them independently."
        },
        {
          "type": "paragraph",
          "content": "**What doesn''t work:** Logic, reasoning, consequences during meltdown"
        },
        {
          "type": "paragraph",
          "content": "**What works:** Sensory regulation, co-regulation, calm physical presence"
        },
        {
          "type": "heading",
          "level": 3,
          "content": "2. The Defiant Child"
        },
        {
          "type": "paragraph",
          "content": "**Core trait:** Needs control and autonomy"
        },
        {
          "type": "list",
          "content": [
            "Says \"no\" to everything",
            "Resists directives even when they want to comply",
            "Power struggles are constant",
            "Argues, negotiates, pushes boundaries"
          ]
        },
        {
          "type": "callout",
          "calloutType": "science",
          "content": "🧠 **The neuroscience**: Defiant children have heightened threat detection systems. Commands feel like loss of autonomy, triggering the fight response. Their brain interprets parental directives as danger signals."
        },
        {
          "type": "paragraph",
          "content": "**What doesn''t work:** Direct commands, power struggles, taking away control"
        },
        {
          "type": "paragraph",
          "content": "**What works:** Offering choices, collaborative problem-solving, autonomy support"
        },
        {
          "type": "heading",
          "level": 3,
          "content": "3. The Distracted Child"
        },
        {
          "type": "paragraph",
          "content": "**Core trait:** Cannot filter out irrelevant stimuli"
        },
        {
          "type": "list",
          "content": [
            "Forgets instructions immediately",
            "Gets lost in their own world",
            "Struggles with morning/bedtime routines",
            "Seems to \"not listen\" but genuinely doesn''t hear you"
          ]
        },
        {
          "type": "callout",
          "calloutType": "science",
          "content": "🧠 **The neuroscience**: Distracted children have underdeveloped executive function systems. Their working memory (mental sticky notes) is overloaded easily, and they struggle to prioritize tasks sequentially."
        },
        {
          "type": "paragraph",
          "content": "**What doesn''t work:** Multi-step instructions, repeating yourself louder"
        },
        {
          "type": "paragraph",
          "content": "**What works:** Visual cues, one instruction at a time, environmental modifications"
        },
        {
          "type": "heading",
          "level": 3,
          "content": "4. The Anxious Child"
        },
        {
          "type": "paragraph",
          "content": "**Core trait:** Constantly scanning for danger"
        },
        {
          "type": "list",
          "content": [
            "Refuses new experiences",
            "Clings to routines rigidly",
            "Worries excessively",
            "Meltdowns happen when control is lost"
          ]
        },
        {
          "type": "callout",
          "calloutType": "science",
          "content": "🧠 **The neuroscience**: Anxious children have overactive threat detection systems (amygdala) and heightened cortisol levels. Their brain is in constant \"scan for danger\" mode, making uncertainty feel physically threatening."
        },
        {
          "type": "paragraph",
          "content": "**What doesn''t work:** Forcing exposure, minimizing fears, surprise changes"
        },
        {
          "type": "paragraph",
          "content": "**What works:** Predictability, gradual exposure, validation of fears"
        },
        {
          "type": "heading",
          "level": 2,
          "content": "Why This Matters"
        },
        {
          "type": "callout",
          "calloutType": "try",
          "content": "**💡 The Same Strategy Won''t Work for Every Child:**\n\n• Time-ins work beautifully for Intense kids but trigger Defiant kids\n• Choices are magic for Defiant kids but overwhelm Distracted kids\n• Routine charts help Anxious kids but bore Intense kids\n\n**Knowing your child''s brain type means you stop fighting their neurology and start working with it.**"
        },
        {
          "type": "heading",
          "level": 2,
          "content": "Identifying Your Child''s Brain Type"
        },
        {
          "type": "paragraph",
          "content": "Most children are a combination of two types with one dominant profile. Here''s how to identify yours:"
        },
        {
          "type": "callout",
          "calloutType": "try",
          "content": "**🎯 Quick Assessment:**\n\nThink about your child''s last three meltdowns:\n\n1. What triggered them?\n2. How did they escalate?\n3. What (if anything) helped them calm down?\n\nThe patterns in these answers reveal their dominant brain type."
        }
      ]
    }
  ]'::jsonb,
  2,
  3500,
  18,
  '#8b5cf6',
  NULL,
  'ce393e26-0df1-4fa7-9ff0-e03f33f22a16',
  '{"version": "2.0", "reader_type": "premium", "features": ["highlighting", "callouts", "script_boxes"]}'::jsonb
);