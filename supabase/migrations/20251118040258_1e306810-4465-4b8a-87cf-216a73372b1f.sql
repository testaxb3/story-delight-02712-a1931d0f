-- Fix what_to_expect and common_variations shape for the Bedtime INTENSE script (using dollar-quoted strings)
UPDATE scripts
SET 
  what_to_expect = $$
  {
    "first_5_minutes": "Expect immediate testing when you leave the room. Walk them back to bed **silently** each time — no talking, no eye contact.",
    "by_10_minutes": "Crying may spike when you stop engaging (the **extinction burst**). Stay robotic. Returns may be **10–20 times** on Night 1.",
    "by_week_2": "Most INTENSE kids stay in bed after **1–2 gentle reminders** and fall asleep faster as the boundary becomes predictable.",
    "dont_expect": [
      "Perfect cooperation on Night 1–3 — behavior usually gets worse before it gets better.",
      "Long explanations to help — **talking = attention**, which prolongs testing."
    ],
    "this_is_success": "They remain in bed and fall asleep within **20–30 minutes** with **fewer than three** attempts to get out, and nights steadily get easier."
  }
  $$::jsonb,
  common_variations = $$
  [
    {
      "variation_scenario": "Child has a legitimate need (bathroom, feels sick)",
      "variation_response": "Handle it **quickly and calmly**, then right back to bed. One sentence: \"Okay, go to the bathroom. Then straight back to bed.\""
    },
    {
      "variation_scenario": "Child cries/screams when you don't engage",
      "variation_response": "Let them **express the emotion in bed**. Monitor from outside if needed, but don't re-enter unless there's real danger."
    },
    {
      "variation_scenario": "You're exhausted and want to give up",
      "variation_response": "Remember: **three hard nights now** beats **six months** of nightly battles. Ask for partner backup if possible."
    },
    {
      "variation_scenario": "They fall asleep on the floor beside the door",
      "variation_response": "Leave them there for the first night. In the morning: \"Your bed is more comfortable. Tonight you'll sleep in your bed.\""
    }
  ]
  $$::jsonb
WHERE id = 'd619a979-e495-4880-96d1-721d734c20c8';