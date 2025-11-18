INSERT INTO scripts (
  title,
  category,
  profile,
  the_situation,
  what_doesnt_work,
  strategy_steps,
  why_this_works,
  what_to_expect,
  common_variations,
  parent_state_needed,
  difficulty,
  age_min,
  age_max,
  estimated_time_minutes,
  tags
) VALUES (
  'Mealtime meltdowns - child refusing to eat',
  'mealtime',
  'INTENSE',
  E'**The moment:** Your child is sitting at the table, but they''re pushing food away, declaring "I''m NOT eating this!" or melting down before even trying a bite.

**What''s really happening:** The INTENSE brain has heightened sensory sensitivity. Textures, smells, temperatures, or even the *appearance* of food can trigger their threat-detection system. Their amygdala reads unfamiliar food as potential danger.

**Goal tonight:** Create safety around the meal, reduce sensory overwhelm, and offer autonomy — so their nervous system can relax enough to engage with food.',
  E'**Worsens the situation:**

• **"Just try one bite!"** → Pressure activates their defiance reflex. The INTENSE brain doubles down when forced.

• **"You loved this last week!"** → Logic doesn''t work when their nervous system is in alarm mode.

• **Punishments or bribes** → Creates negative associations with mealtimes and increases future resistance.

**Why these backfire:** The INTENSE brain needs to feel *in control* to feel safe. When you force compliance, their stress hormones spike, shutting down appetite and digestion.',
  '[
    {
      "step_number": 1,
      "step_title": "Remove all pressure and offer choices",
      "step_explanation": "Instead of demanding they eat, give them **two low-stakes choices** that restore autonomy:\n\n• Which plate/bowl do they want?\n• Where do they want to sit?\n• Do they want a fork or spoon?\n\nThis shifts their brain from ''threat mode'' (resisting demands) to ''decision mode'' (feeling in control).",
      "what_to_say_examples": [
        "\"Do you want the blue plate or the white plate tonight?\"",
        "\"Should we sit at the table or have a picnic on the floor?\"",
        "\"Fork or spoon today?\""
      ]
    },
    {
      "step_number": 2,
      "step_title": "Use the ''Food Explorer'' approach",
      "step_explanation": "Instead of ''eating,'' reframe it as **exploring**. The INTENSE brain responds better to curiosity than obligation.\n\n• Place food on the table without expectation: ''This is what we''re having. You can explore it if you want.''\n• Let them touch, smell, or just look at food without eating it\n• Model curiosity yourself: ''I wonder what this tastes like...''\n\n**Key:** Remove the goal of eating. Just being *near* food without pressure is progress.",
      "what_to_say_examples": [
        "\"You don''t have to eat anything. Let''s just see what''s here tonight.\"",
        "\"I wonder how this smells... want to smell it with me?\"",
        "\"You can just sit with us — no pressure to eat.\""
      ]
    },
    {
      "step_number": 3,
      "step_title": "Honor their ''safe foods'' with a twist",
      "step_explanation": "Always include **one food you know they''ll accept** alongside new/challenging foods. This creates a safety net.\n\nThen, add a tiny ''adventure'' option:\n\n• Place a small amount of new food on a **separate plate** (not touching their safe food)\n• Let them decide if/when to explore it\n• Celebrate any interaction — even just touching or smelling counts as courage\n\n**The goal:** Build positive food experiences slowly, without overwhelm.",
      "what_to_say_examples": [
        "\"Here''s your safe food, and here''s something new on the side if you want to check it out.\"",
        "\"No pressure — just exploring today!\"",
        "\"You touched the broccoli! That took bravery!\""
      ]
    }
  ]'::jsonb,
  E'**Why removing pressure works:** The INTENSE brain has an overactive amygdala (threat detector). When you *demand* they eat, their body interprets it as danger and activates the fight-or-flight response — appetite disappears. Removing pressure deactivates this alarm.

**Why choice works:** The prefrontal cortex (thinking brain) needs to feel agency to relax. Offering choices signals: "You''re safe. You have control." This calms their nervous system enough for curiosity to emerge.

**Why the Food Explorer approach works:** The INTENSE brain is hypersensitive to sensory input — textures, smells, temperatures can feel overwhelming. By reframing food as something to *explore* (not eat), you reduce the sensory threat. Familiarity builds over time through repeated, pressure-free exposure.

**Long-term:** You''re teaching their brain that food is safe, mealtimes are calm, and they have autonomy. This is how picky eaters gradually expand their food repertoire.',
  '{
    "first_30_seconds": "They may still be resistant or testing whether you''re serious about no pressure. Stay calm and neutral — don''t push.",
    "by_2_minutes": "You''ll likely see them relax slightly. They might start asking questions about the food or playing with utensils. Their guard is coming down.",
    "by_10_minutes": "Most INTENSE children will engage with *something* on the table — even if it''s just their safe food or exploring textures. Some may surprise you by trying a small bite of the new food on their own terms.",
    "dont_expect": [
      "Them to suddenly eat everything on their plate",
      "Immediate enthusiasm for new foods",
      "This to work if you pressure them or show frustration"
    ],
    "this_is_success": "Success is any positive interaction with food — sitting calmly at the table, touching/smelling new foods, or eating their safe food without conflict. You''re building trust, not forcing nutrition in one meal."
  }'::jsonb,
  '[
    {
      "variation_scenario": "\"They won''t even sit at the table\"",
      "variation_response": "Don''t force it. Say: ''You don''t have to sit with us. Your plate will be here if you want to come back.'' Let them eat standing nearby or on the couch initially. Gradually work toward table sitting over weeks, not in one night.",
      "why_this_works": "The INTENSE brain needs to feel safe before compliance. Forcing them to sit activates resistance. Letting them choose builds trust."
    },
    {
      "variation_scenario": "\"They only want the same 3 foods every meal\"",
      "variation_response": "That''s okay. Serve their safe food, but place ONE tiny portion of a new food on a separate plate. Don''t mention it. Over weeks, they''ll see it repeatedly (building familiarity) and may explore it when ready.",
      "why_this_works": "Repeated exposure without pressure is how picky eaters expand their diet. Their brain needs to see food 10-15 times before it feels ''safe'' enough to try."
    },
    {
      "variation_scenario": "\"They start crying or having a meltdown\"",
      "variation_response": "This means their sensory system is overwhelmed. Remove the food from view, lower your voice, and say: ''It''s okay. No eating today. Let''s just take deep breaths together.'' Offer a safe food or let them leave the table.",
      "why_this_works": "Meltdowns = nervous system overload. Trying to push through makes it worse. Calm co-regulation first, food later."
    },
    {
      "variation_scenario": "\"They say ''I''m starving!'' but won''t eat what''s offered\"",
      "variation_response": "Stay calm: ''This is what we''re having tonight. You don''t have to eat it, but this is dinner.'' Don''t make a different meal. Offer their safe food if available, or let them wait until the next snack/meal.",
      "why_this_works": "The INTENSE brain often uses hunger as control/negotiation. Caving teaches them resistance works. Boundaries + empathy = learning to try new things."
    }
  ]'::jsonb,
  'You need to be **calm, patient, and pressure-free**. If you''re anxious about their nutrition or frustrated, they''ll sense it and resist more. Trust that they won''t starve — kids are biologically wired to eat when truly hungry.',
  'Moderate',
  2,
  10,
  20,
  ARRAY['mealtime', 'picky eating', 'sensory', 'food refusal', 'autonomy']
);