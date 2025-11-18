-- Fix INTENSE bedtime script structure
UPDATE scripts
SET strategy_steps = '[
  {
    "step_number": 1,
    "step_title": "VALIDATE the testing (30 seconds)",
    "step_explanation": "The INTENSE brain resists bedtime because it wants control and connection. Getting out of bed = seeing you = getting a reaction (even negative attention feels better than none).\n\n**What to do:**\n→ Stay calm\n→ Name what they''re doing\n→ Make it boring\n\n**What to say:**\n*\"I see you''re testing if I mean it. That''s normal. Bedtime is at 8:30, and you''re staying in your room.\"*\n\n**Critical move:** Do NOT engage in conversation, negotiation, or reaction. Your calm = their learning.",
    "what_to_say_examples": [
      "I see you''re testing if I mean it. That''s normal. Bedtime is at 8:30.",
      "You''re staying in your room. I''m right outside if you need me.",
      "Testing is okay. The answer is still bedtime."
    ]
  },
  {
    "step_number": 2,
    "step_title": "CONSISTENT physical return (Every. Single. Time.)",
    "step_explanation": "This is where most parents fail with INTENSE kids. They either give in after the 5th time or they escalate emotionally.\n\nYour child is **testing the boundary**. They need to know: Is this rule real? Will you hold it even when I push hard?\n\n**Every time they get out of bed:**\n→ Walk them back silently (no words)\n→ Tuck them in briefly\n→ Exit immediately\n\n**Do NOT:**\n→ Explain again\n→ Negotiate\n→ Show frustration\n→ Give attention\n\n**Your consistency is the lesson.**",
    "what_to_say_examples": [
      "Bedtime.",
      "(Silence - just guide them back)",
      "(No words - just tuck and exit)"
    ]
  },
  {
    "step_number": 3,
    "step_title": "CONNECTION reward (Next morning)",
    "step_explanation": "INTENSE kids need to know the consequence of cooperation is MORE connection (the thing they wanted all along).\n\n**Next morning, as soon as they wake up:**\n*\"You stayed in bed last night after the first few tries. That was hard work. Now we have extra time this morning to [do something they love together].\"*\n\n**This teaches:**\n→ Cooperation = more parent time (not less)\n→ Fighting = boring, fast returns to bed\n→ The boundary is real AND you still love them\n\n**Over time:** They learn bedtime is non-negotiable, but morning connection time is predictable and rewarding.",
    "what_to_say_examples": [
      "You stayed in bed after I tucked you in. Now we have time for pancakes together!",
      "Great job staying in your room. Let''s read an extra story this morning.",
      "You worked hard on bedtime. Let''s pick a fun activity for this morning."
    ]
  }
]'::jsonb,
what_to_expect = '{
  "first_5_minutes": "Expect testing. They will get out of bed 3-10 times. Stay calm. Return them silently each time.",
  "by_10_minutes": "Most INTENSE kids dramatically reduce testing once they realize you''re 100% consistent and not engaging.",
  "by_week_2": "Bedtime resistance drops by 70-80% as they learn the boundary is real and morning connection is the reward.",
  "dont_expect": [
    "Immediate compliance the first night",
    "No testing or pushback",
    "Perfect bedtime behavior right away"
  ],
  "this_is_success": "Success is when YOU stay calm and consistent through the testing, not when they stop testing immediately. Behavior change follows your calm enforcement."
}'::jsonb
WHERE title = 'Bedtime resistance - won''t stay in bed' AND profile = 'INTENSE';