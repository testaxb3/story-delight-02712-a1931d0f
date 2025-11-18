-- Create DEFIANT bedtime script: Bedtime resistance - fighting control
INSERT INTO public.scripts (
  title,
  category,
  profile,
  difficulty,
  age_min,
  age_max,
  the_situation,
  what_doesnt_work,
  phrase_1,
  phrase_1_action,
  phrase_2,
  phrase_2_action,
  phrase_3,
  phrase_3_action,
  strategy_steps,
  why_this_works,
  what_to_expect,
  common_variations,
  parent_state_needed,
  tags,
  location_type,
  time_optimal,
  emergency_suitable,
  requires_preparation,
  expected_time_seconds,
  works_in_public
) VALUES (
  'Bedtime resistance - fighting control',
  'Bedtime',
  'DEFIANT',
  'Moderate',
  4,
  12,
  'Your DEFIANT child is resisting bedtime because they feel you''re trying to control them. They argue about every step, refuse to cooperate, and actively fight the process. The more you push, the harder they push back.',
  '• **"It''s bedtime NOW!"** → Triggers their defiance and need to resist authority
• **Removing privileges as punishment** → Escalates power struggle and damages relationship
• **Bribing or negotiating endlessly** → Teaches manipulation and gives them too much control',
  'I can see you want to stay up. You''re in charge of getting yourself ready.',
  'Sit nearby calmly, making it clear you''re not going to fight or force',
  'Two paths: Ready by 8:30 and we read together, or not ready and you go to bed at 8:30 anyway.',
  'State this factually, without emotion or threat. Make it a simple choice',
  'I trust you to make the choice that works for you.',
  'Leave the room. Do not engage further. Let them experience the natural consequence',
  '[
    {
      "step": 1,
      "title": "Transfer Control (First 60 Seconds)",
      "explanation": "The moment you try to control a DEFIANT child at bedtime, you''ve lost. They will fight you harder than they fight sleep.\n\n**What to do:**\n→ Stop giving commands\n→ State the boundary clearly once\n→ Hand them the choice\n\n**What to say:**\n*\"I can see you don''t want to go to bed right now. That''s normal. Here''s what''s happening: bedtime is at 8:30. You can get ready now, or you can choose not to. Either way, lights go out at 8:30.\"*\n\n**Critical move:** Walk away. Do not engage in debate, negotiation, or explanation. You''ve stated the reality. Now they own the choice."
    },
    {
      "step": 2,
      "title": "Follow Through Without Emotion (8:30 Exactly)",
      "explanation": "This is where most parents fail with DEFIANT kids. They either back down or they escalate emotionally.\n\nYour child is **testing whether you mean what you say**. Not because they''re bad—because they need to know if your boundaries are real.\n\n**At 8:30 exactly:**\n→ Walk in calmly\n→ Turn off the lights\n→ Say: *\"It''s 8:30. Time for bed.\"*\n\n**If they''re not ready:**\n*\"I see you chose not to get ready. That''s okay. You can sleep in your clothes tonight. We can try again tomorrow.\"*\n\n**No anger. No lectures. No disappointment.**\n\nThis is critical: **Your calmness is the lesson.**"
    },
    {
      "step": 3,
      "title": "Debrief Tomorrow (Morning Routine)",
      "explanation": "DEFIANT kids need to process and problem-solve **after** they''ve calmed down.\n\n**Next morning, at breakfast:**\n*\"Hey, about last night—you chose not to get ready for bed. How did that feel sleeping in your clothes?\"*\n\nLet them talk. Don''t lecture.\n\nThen: *\"Tonight you get another chance. You can choose to get ready by 8:30 and we''ll have time to read together, or you can choose not to and go to bed anyway. Your call.\"*\n\n**This teaches:**\n→ Consequences are real but not emotional\n→ They have agency\n→ You trust them to learn"
    }
  ]'::jsonb,
  'The DEFIANT brain is wired to resist authority and test boundaries. Bedtime becomes a power struggle because it feels like you''re forcing them to do something against their will.

**Here''s what''s actually happening in their brain:**
When you try to control them → Their nervous system interprets this as a threat to their autonomy → Fight response activates → They dig in harder

**By transferring control**, you''re eliminating the power struggle. They''re not fighting you anymore—they''re making a choice and experiencing the natural outcome.

**The boundary stays firm (lights out at 8:30), but the enforcement is calm and factual.** This is what changes behavior long-term.',
  '{
    "first_5_minutes": "Expect resistance. They will test whether you really mean it. Stay calm. Do not engage.",
    "by_10_minutes": "If they chose not to get ready, they''ll likely protest when lights go out. Hold the boundary without anger.",
    "by_week_2": "Most DEFIANT kids start choosing cooperation once they realize the boundary is real and you''re not going to fight.",
    "dont_expect": [
      "Immediate compliance the first night",
      "No testing or pushback",
      "Perfect cooperation right away"
    ],
    "this_is_success": "Success is when YOU stay calm and consistent, not when they cooperate perfectly. Behavior change follows your calm enforcement."
  }'::jsonb,
  '[
    {
      "scenario": "\"You can''t make me!\"",
      "response": "\"You''re right. I can''t make you get ready. That''s your choice. And my choice is lights out at 8:30 either way.\" Then walk away."
    },
    {
      "scenario": "\"I hate you!\"",
      "response": "\"I hear you''re angry. That''s okay. Bedtime is still 8:30.\" Stay calm. Do not engage emotionally."
    },
    {
      "scenario": "Child gets ready at 8:29",
      "response": "\"Great choice. You got ready just in time. Let''s read together.\" No lecture about cutting it close. Acknowledge the choice."
    },
    {
      "scenario": "Child melts down when lights go out",
      "response": "\"I know this feels hard. You can try again tomorrow.\" Stay calm. Exit the room. Do not negotiate."
    }
  ]'::jsonb,
  'Calm, non-reactive, committed to the boundary',
  ARRAY['defiant', 'bedtime', 'power struggle', 'control', 'autonomy', 'boundaries'],
  ARRAY['home'],
  ARRAY['evening'],
  false,
  false,
  90,
  false
);