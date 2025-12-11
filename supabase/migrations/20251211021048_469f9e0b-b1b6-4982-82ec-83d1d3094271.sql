-- Update lesson 1 with structured JSON content (Cal AI style)
UPDATE public.lessons
SET content = '{
  "version": 2,
  "sections": [
    {
      "type": "text",
      "data": {
        "content": "As a parent, you probably know what it''s like to feel powerless when your kid doesn''t listen to you. It''s in these moments of frustration and hopelessness that you might resort to yelling.",
        "variant": "lead"
      }
    },
    {
      "type": "text",
      "data": {
        "content": "This outburst can happen anywhere, but the stakes may feel higher in public because of the added pressure. It compels you to resolve the situation quickly, and you may resort to raising your voice, making threats, or delivering impromptu lectures."
      }
    },
    {
      "type": "callout",
      "data": {
        "variant": "warning",
        "title": "The Real Problem",
        "content": "Your emotional state causes you to lose sight of rational, productive, and constructive responses."
      }
    },
    {
      "type": "divider",
      "data": { "style": "dots" }
    },
    {
      "type": "text",
      "data": {
        "content": "The first step in overcoming this challenge is to learn to stay calm and collected in stressful situations. This entails recognizing your triggers.",
        "variant": "highlight"
      }
    },
    {
      "type": "text",
      "data": {
        "content": "Have you ever wondered why you feel calmer about your child''s tantrums on some days, but not on others? This difference is often in specific internal and external triggers that push you towards anger."
      }
    },
    {
      "type": "numbered-list",
      "data": {
        "title": "Internal Triggers",
        "subtitle": "Consider which of these apply to you:",
        "colorScheme": "blue",
        "items": [
          { "number": 1, "title": "Feeling tired or sick", "description": "When your energy is low, your patience runs thin." },
          { "number": 2, "title": "Unrealistic expectations of your child", "description": "Expecting too much from your child can set both of you up for frustration." },
          { "number": 3, "title": "Stress or anxiety", "description": "The weight of everyday stress and anxiety can make even minor issues feel overwhelming." },
          { "number": 4, "title": "Not knowing what to do", "description": "Uncertainty can amplify your frustration and make you feel out of control." },
          { "number": 5, "title": "Your child reminding you of someone you dislike", "description": "Personal associations can trigger strong emotional reactions." }
        ]
      }
    },
    {
      "type": "numbered-list",
      "data": {
        "title": "External Triggers",
        "colorScheme": "orange",
        "items": [
          { "number": 1, "title": "Other people''s expectations", "description": "The pressure to meet societal or familial expectations can be overwhelming." },
          { "number": 2, "title": "Comparing yourself with other seemingly composed parents", "description": "Seeing other parents who appear to have it all together can make you feel inadequate." },
          { "number": 3, "title": "Your child misbehaving in public", "description": "Public misbehavior can add the stress of judgment from others to an already challenging situation." }
        ]
      }
    },
    {
      "type": "divider",
      "data": { "style": "line" }
    },
    {
      "type": "visual-diagram",
      "data": {
        "title": "Deeper Emotional Triggers",
        "labels": [
          { "number": 1, "text": "Feeling unheard: Daily experiences where you feel your concerns or needs are ignored", "position": "top-left" },
          { "number": 2, "text": "Unequal parenting load: Feeling like you''re handling more than your partner", "position": "top-right" },
          { "number": 3, "text": "Influence of upbringing: Your parents'' parenting style can affect your reactions today", "position": "left" },
          { "number": 4, "text": "Burnout: Persistent exhaustion from parenting demands", "position": "right" },
          { "number": 5, "text": "Isolation: Feeling disconnected from friends or community", "position": "bottom-left" }
        ]
      }
    },
    {
      "type": "divider",
      "data": { "style": "dots" }
    },
    {
      "type": "text",
      "data": {
        "content": "To overcome the pattern of yelling, you must identify your triggers and understand them. You can do this by using the Diary, noting down examples of situations that provoke your outbursts. Afterward, review these entries to identify any recurring patterns."
      }
    },
    {
      "type": "reflection-form",
      "data": {
        "title": "Reflection Template",
        "description": "Take some time to think about how you could react differently in these situations without resorting to yelling:",
        "fields": [
          { "label": "Situation", "description": "Describe the situations that made you angry" },
          { "label": "Thought", "description": "What did you think right before the outburst?" },
          { "label": "Emotion", "description": "How did the outburst make you feel?" },
          { "label": "Bodily Sensations", "description": "How did you feel physically?" },
          { "label": "My Reaction", "description": "Is this your normal reaction?" },
          { "label": "Appropriate Reaction", "description": "How can you avoid such outbursts in the future?" }
        ]
      }
    },
    {
      "type": "divider",
      "data": { "style": "line" }
    },
    {
      "type": "accordion",
      "data": {
        "title": "Triggers from the Past",
        "items": [
          { "title": "Look Back at Your Upbringing", "content": "Reflect on how your parents raised you. Did they do something you wish you could change? What would you do instead?" },
          { "title": "Notice Your Emotions", "content": "What is your immediate reaction to your child''s misbehaviors? Is there a chance this reaction is caused by your experiences with your parents?" },
          { "title": "Understand Your Emotions", "content": "If you notice strong emotions when your child behaves a certain way, take a pause and think about it. For example, feeling worried when your child forgets to call after school might connect to your own past, like getting in trouble for being late." }
        ]
      }
    },
    {
      "type": "callout",
      "data": {
        "variant": "tip",
        "title": "Today''s Challenge",
        "content": "Pinpoint the things that often make you lose your cool and end up shouting. Figuring out these triggers is the first step to handling them."
      }
    },
    {
      "type": "callout",
      "data": {
        "variant": "info",
        "content": "Tomorrow, you''ll discover what studies say about yelling and how it impacts your child''s development."
      }
    },
    {
      "type": "cta",
      "data": {
        "text": "Ready to learn more?",
        "description": "Continue your journey to becoming a calmer, more effective parent.",
        "buttonText": "Back to Lessons",
        "buttonAction": "close"
      }
    }
  ]
}'::text,
updated_at = NOW()
WHERE day_number = 1;