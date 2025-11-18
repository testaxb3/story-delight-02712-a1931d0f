-- Fix DEFIANT bedtime script structure
UPDATE scripts
SET strategy_steps = '[
  {
    "step_number": 1,
    "step_title": "Transfer Control (First 60 Seconds)",
    "step_explanation": "The moment you try to control a DEFIANT child at bedtime, you''ve lost. They will fight you harder than they fight sleep.\n\n**What to do:**\n→ Stop giving commands\n→ State the boundary clearly once\n→ Hand them the choice\n\n**What to say:**\n*\"I can see you don''t want to go to bed right now. That''s normal. Here''s what''s happening: bedtime is at 8:30. You can get ready now, or you can choose not to. Either way, lights go out at 8:30.\"*\n\n**Critical move:** Walk away. Do not engage in debate, negotiation, or explanation. You''ve stated the reality. Now they own the choice.",
    "what_to_say_examples": [
      "I can see you don''t want to go to bed right now. That''s normal.",
      "Bedtime is at 8:30. You can get ready now, or you can choose not to.",
      "Either way, lights go out at 8:30. Your choice."
    ]
  },
  {
    "step_number": 2,
    "step_title": "Follow Through Without Emotion (8:30 Exactly)",
    "step_explanation": "This is where most parents fail with DEFIANT kids. They either back down or they escalate emotionally.\n\nYour child is **testing whether you mean what you say**. Not because they''re bad—because they need to know if your boundaries are real.\n\n**At 8:30 exactly:**\n→ Walk in calmly\n→ Turn off the lights\n→ Say: *\"It''s 8:30. Time for bed.\"*\n\n**If they''re not ready:**\n*\"I see you chose not to get ready. That''s okay. You can sleep in your clothes tonight. We can try again tomorrow.\"*\n\n**No anger. No lectures. No disappointment.**\n\nThis is critical: **Your calmness is the lesson.**",
    "what_to_say_examples": [
      "It''s 8:30. Time for bed.",
      "I see you chose not to get ready. That''s okay. You can sleep in your clothes tonight.",
      "We can try again tomorrow."
    ]
  },
  {
    "step_number": 3,
    "step_title": "Debrief Tomorrow (Morning Routine)",
    "step_explanation": "DEFIANT kids need to process and problem-solve **after** they''ve calmed down.\n\n**Next morning, at breakfast:**\n*\"Hey, about last night—you chose not to get ready for bed. How did that feel sleeping in your clothes?\"*\n\nLet them talk. Don''t lecture.\n\nThen: *\"Tonight you get another chance. You can choose to get ready by 8:30 and we''ll have time to read together, or you can choose not to and go to bed anyway. Your call.\"*\n\n**This teaches:**\n→ Consequences are real but not emotional\n→ They have agency\n→ You trust them to learn",
    "what_to_say_examples": [
      "About last night—you chose not to get ready for bed. How did that feel sleeping in your clothes?",
      "Tonight you get another chance.",
      "You can choose to get ready by 8:30 and we''ll have time to read, or choose not to and go to bed anyway. Your call."
    ]
  }
]'::jsonb,
what_to_expect = '{
  "first_5_minutes": "Expect resistance. They will test whether you really mean it. Stay calm. Do not engage.",
  "by_10_minutes": "If they chose not to get ready, they''ll likely protest when lights go out. Hold the boundary without anger.",
  "by_week_2": "Most DEFIANT kids start choosing cooperation once they realize the boundary is real and you''re not going to fight.",
  "dont_expect": [
    "Immediate compliance the first night",
    "No testing or pushback",
    "Perfect cooperation right away"
  ],
  "this_is_success": "Success is when YOU stay calm and consistent, not when they cooperate perfectly. Behavior change follows your calm enforcement."
}'::jsonb
WHERE title = 'Bedtime resistance - fighting control' AND profile = 'DEFIANT';