-- Delete the Portuguese version first
DELETE FROM public.scripts WHERE title = 'Monday morning school refusal - arms crossed, won''t get dressed, ''I''m NOT going and you can''t make me''';

-- Insert DEFIANT School script in English
INSERT INTO public.scripts (
  title,
  category,
  profile,
  age_min,
  age_max,
  difficulty,
  duration_minutes,
  the_situation,
  what_doesnt_work,
  strategy_steps,
  why_this_works,
  what_to_expect,
  common_variations,
  parent_state_needed,
  tags,
  emergency_suitable
) VALUES (
  'Monday morning school refusal - arms crossed, won''t get dressed, ''I''m NOT going and you can''t make me''',
  'School',
  'DEFIANT',
  5,
  11,
  'Hard',
  12,
  '6:47 AM, Monday morning. You''ve woken him up 3 times—the third time he yelled "LEAVE ME ALONE!" Now it''s 7:15, he''s still in pajamas, sitting on his bed with arms crossed. "I''m NOT going to school and you can''t make me."

You have a meeting at 8:30, need to leave in 20 minutes. Every second that passes, the pressure builds. Your body is tense, voice rising, threats on the tip of your tongue. He senses your frustration and ESCALATES—now he''s under the covers.',
  '**❌ COMMON MISTAKE #1: "You ARE going to school, end of discussion!"**
Creates the power battle he''s WAITING for. His brain interprets this as a direct challenge, activating full defensive mode.


**❌ COMMON MISTAKE #2: Threatening future consequences**
"If you don''t go, no screens this weekend!" He can''t process future when in defensive mode—his brain is 100% in the present, in the fight.


**❌ COMMON MISTAKE #3: Rationally explaining why school is important**
"Education is important for your future..." He KNOWS. This isn''t about logic. It''s about control, power, anxiety he can''t name.


**❌ COMMON MISTAKE #4: Physically dragging/forcing**
Might work ONCE. Completely destroys trust. Tomorrow will be 10x worse. You win the battle, lose the war.',
  '[
    {
      "step_number": 1,
      "step_title": "Drop the Rope",
      "step_explanation": "Stop pulling the rope. Literally let go.\n\nSit down on the floor of his room, breathe visibly. DON''T mention school for a full 60 seconds. Your body needs to exit attack mode before words will make any difference.",
      "what_to_say_examples": [
        "Hey... today feels hard.",
        "*silence, just breathing together*",
        "Okay, I''m going to sit here for a second."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Validate Without Agreeing",
      "step_explanation": "Name what he might be feeling WITHOUT giving in on the final decision.\n\nValidation disarms his defenses—he expected an attack, not understanding. DON''T ask why—he probably doesn''t know. Offer choice WITHIN the mandatory going, not about going itself.",
      "what_to_say_examples": [
        "Something about today feels heavy. Makes sense not wanting to go.",
        "Your body is saying no, huh? I see that.",
        "Do you want to bring your drawing to show your friend? Or take the backpack with your favorite character?"
      ]
    },
    {
      "step_number": 3,
      "step_title": "Micro-Movement",
      "step_explanation": "Don''t demand ''go get dressed''—too big, too direct.\n\nAsk for ONE microscopic action he can do without feeling he lost. Each micro-yes rebuilds his sense of control. Keep tone neutral, no urgency in voice even if you''re panicking inside.",
      "what_to_say_examples": [
        "Can you put on just one sock? Just one.",
        "Which foot first?",
        "Do you grab the shirt or should I?"
      ]
    }
  ]'::jsonb,
  'DEFIANT children are in constant "fight" mode—their brain interprets demands as threats to autonomy. Dropping the rope removes the resistance he was pushing against.

Validation disarms because he expected battle. When you name the feeling without judgment, his prefrontal cortex can start coming back online. Micro-actions bypass the global "NO" with small "yeses" that rebuild his sense of agency.

You still go to school—but without war. He doesn''t need to admit defeat to cooperate.',
  '{
    "first_30_seconds": "He may be confused or suspicious when you stop pushing. Might even escalate more (''I''m SERIOUS, I''m NOT GOING!'') because he''s testing if you gave up.",
    "by_90_seconds": "Visible physical resistance may start decreasing—shoulders relax slightly, looks at you instead of away.",
    "by_2_minutes": "He may start moving, even while complaining. ''Fine, BUT I''m not happy about this.'' Perfect—he doesn''t need to be happy.",
    "by_3_minutes": "Real movement happens—puts on a sock, grabs backpack. Still grumbling, but COOPERATING.",
    "dont_expect": [
      "That he''ll go happily or admit he was wrong",
      "That he''ll thank you for your patience",
      "That this solves tomorrow—every morning is new",
      "That you won''t be late—you might be 10 minutes late"
    ],
    "this_is_success": "You arrive at school without yelling, without physically forcing, without threats you can''t keep. Even if 10 minutes late. The connection was preserved."
  }'::jsonb,
  '[
    {
      "variation_scenario": "What if something is really happening at school (bullying, tough teacher, social anxiety)?",
      "variation_response": "Use this script to get through this morning without added trauma. Then, when you''re both calm (evening, weekend), talk: ''I noticed Mondays are hard. What''s happening at school?'' Separate the immediate crisis from investigating the cause."
    },
    {
      "variation_scenario": "What if I really cannot be late to work today?",
      "variation_response": "Text work NOW, before starting: ''Family situation, may be 10-15 min late?'' 5 minutes invested here saves 30 minutes of battle that would make you later anyway. Protect your time by slowing down."
    },
    {
      "variation_scenario": "This happens EVERY Monday, it''s a pattern.",
      "variation_response": "Weekly pattern indicates anticipatory anxiety from the weekend. Create Sunday night ritual: pack backpack together, choose clothes, talk about one good thing happening Monday. Prevent instead of react."
    }
  ]'::jsonb,
  'Slow down to speed up. Your urgency is pure fuel for his resistance. You will get to school—the question is: with connection or with trauma? Choose the hard path now that builds trust, not the fast path that destroys it.',
  ARRAY['school refusal', 'won''t go to school', 'morning battle', 'defiance', 'getting dressed', 'power struggle', 'control', 'monday morning', 'school anxiety'],
  false
);