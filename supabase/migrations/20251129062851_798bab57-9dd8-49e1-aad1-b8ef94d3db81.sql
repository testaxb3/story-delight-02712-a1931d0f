
-- Create the bonus entry first
INSERT INTO public.bonuses (
  id,
  title,
  description,
  category,
  tags,
  locked,
  is_new
) VALUES (
  'b8a7c6d5-e4f3-4a2b-9c1d-0e8f7a6b5c4d',
  'Sturdy, Not Soft',
  'The Anti-Guilt Guide to Boundaries That Actually Work. Learn why gentle parenting doesn''t mean permissive parenting, and get exact scripts for holding limits without guilt.',
  'ebook',
  ARRAY['boundaries', 'gentle parenting', 'permissive', 'discipline', 'limits', 'guilt-free'],
  false,
  true
);

-- Create the ebook with full content
INSERT INTO public.ebooks (
  id,
  title,
  subtitle,
  slug,
  bonus_id,
  total_chapters,
  total_words,
  estimated_reading_time,
  cover_color,
  content
) VALUES (
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'Sturdy, Not Soft',
  'The Anti-Guilt Guide to Boundaries That Actually Work',
  'sturdy-not-soft',
  'b8a7c6d5-e4f3-4a2b-9c1d-0e8f7a6b5c4d',
  8,
  15000,
  60,
  '#4F46E5',
  '{
    "chapters": [
      {
        "id": "intro",
        "title": "Introduction: The Moment Everything Changed",
        "blocks": [
          {"type": "paragraph", "content": "I was standing in Target, my cart half-full of things I didn''t need, when my 4-year-old asked for a toy. I said no. She asked again. I said no again. She screamed. Not a whine—a full, primal scream that made three people turn around."},
          {"type": "paragraph", "content": "And here''s the thing that still makes my chest tight: I bought the toy."},
          {"type": "paragraph", "content": "Not because I wanted to. Not because she needed it. Because I couldn''t handle the looks. Because I was afraid she''d think I didn''t love her. Because somewhere along the way, I''d confused being gentle with being afraid of my child''s big feelings."},
          {"type": "paragraph", "content": "That night, after she was asleep, I sat on my bathroom floor and Googled \"am I ruining my child by not setting limits.\" I found articles about gentle parenting that made me feel worse. More patient. More understanding. More explaining. I was already doing all of that. What I wasn''t doing was holding the line."},
          {"type": "callout", "calloutType": "REMEMBER", "title": "The Truth Nobody Tells You", "content": "Gentle parenting was never supposed to mean saying yes to everything. It was never supposed to mean your child''s comfort matters more than their character development. It was never supposed to mean you''re afraid of their tears."},
          {"type": "paragraph", "content": "This book is for the parent who''s read all the gentle parenting accounts, tried all the validation scripts, offered all the choices—and still has a child who melts down at every boundary. It''s for the parent who feels guilty saying no, even when no is the right answer."},
          {"type": "paragraph", "content": "It''s for the parent who''s tired of walking on eggshells in their own home."},
          {"type": "heading", "level": 2, "content": "What You''ll Learn"},
          {"type": "list", "ordered": false, "items": ["Why your child NEEDS you to be sturdy, not soft", "The exact moment to stop explaining and start holding", "Scripts that work when \"I understand you''re upset\" doesn''t", "How to repair after you lose it (because you will)", "A 30-day plan to reset your family''s boundary culture"]},
          {"type": "paragraph", "content": "By the end of this book, you''ll know the difference between being mean and being clear. Between being harsh and being honest. Between traumatizing your child and building their resilience."},
          {"type": "paragraph", "content": "Let''s begin."}
        ]
      },
      {
        "id": "chapter-1",
        "title": "Chapter 1: The Gentle Parenting Lie Nobody Talks About",
        "blocks": [
          {"type": "paragraph", "content": "Somewhere between \"children should be seen and not heard\" and now, we lost the plot."},
          {"type": "paragraph", "content": "The pendulum swung so far from authoritarian parenting that we accidentally created a new problem: parents who are so focused on their child''s feelings that they forgot children also need structure, limits, and the security of knowing someone is in charge."},
          {"type": "heading", "level": 2, "content": "What Gentle Parenting Actually Means"},
          {"type": "paragraph", "content": "Dr. Becky Kennedy, clinical psychologist and founder of Good Inside, puts it simply: \"Gentle parenting is not permissive parenting. It''s holding boundaries while holding your child''s feelings.\""},
          {"type": "paragraph", "content": "Read that again. WHILE holding your child''s feelings. Not INSTEAD of boundaries."},
          {"type": "callout", "calloutType": "SCIENCE", "title": "What Research Shows", "content": "Studies consistently show that children with clear, consistent limits have LOWER anxiety than children whose parents negotiate everything. Why? Because limits create predictability. Predictability creates safety. Safety allows the brain to relax and develop properly."},
          {"type": "heading", "level": 2, "content": "The Two Things That Must Coexist"},
          {"type": "paragraph", "content": "Here''s the formula that changed everything for me:"},
          {"type": "list", "ordered": true, "items": ["Your child''s feelings are VALID (they''re allowed to be upset)", "Your boundary STANDS (it doesn''t change because they''re upset)"]},
          {"type": "paragraph", "content": "Both things are true at the same time. Your child can be sad AND the answer can still be no. They can be angry AND still not hit. They can be disappointed AND still have to leave the playground."},
          {"type": "callout", "calloutType": "WARNING", "title": "The Permissive Trap", "content": "If you find yourself regularly changing your answer because your child cried, negotiated, or escalated—you''ve accidentally taught them that boundaries are suggestions. This isn''t gentle parenting. It''s permissive parenting wearing gentle parenting''s clothes."},
          {"type": "heading", "level": 2, "content": "Signs You''ve Drifted Into Permissive Territory"},
          {"type": "list", "ordered": false, "items": ["You explain your reasoning 4+ times hoping they''ll finally \"get it\"", "You feel nervous before setting a limit", "Your child''s reaction determines whether the limit holds", "You say \"just this once\" multiple times per week", "You avoid saying no because of how they''ll react", "You feel controlled by a child under 10", "Mealtimes, bedtimes, and screen time have no predictable structure"]},
          {"type": "paragraph", "content": "If you recognized yourself in that list, take a breath. You''re not a bad parent. You''re a parent who got some confusing messages about what \"gentle\" means."},
          {"type": "heading", "level": 2, "content": "Why This Happened To You"},
          {"type": "paragraph", "content": "Most permissive parents I work with share one thing: they had parents who were too harsh. They swore they''d never make their kids feel the way they felt. So they went the opposite direction—and accidentally created a different problem."},
          {"type": "callout", "calloutType": "REMEMBER", "title": "The Middle Path", "content": "The opposite of too harsh isn''t too soft. The opposite of too harsh is STURDY. Warm and firm. Connected and clear. Loving AND leading."},
          {"type": "script_box", "title": "Script: When You''ve Been Too Soft", "content": "\"I''ve been doing something that isn''t helping you. I''ve been saying yes when I should have said no, because I didn''t want you to be upset. But I realized that my job isn''t to make sure you''re never upset—it''s to help you learn how to handle being upset. So some things are going to change around here. Not because I''m mad. Because I love you.\""}
        ]
      },
      {
        "id": "chapter-2",
        "title": "Chapter 2: Why Your Child Needs You To Be The ''Bad Guy''",
        "blocks": [
          {"type": "paragraph", "content": "Your child''s brain is under construction. The prefrontal cortex—the part responsible for impulse control, emotional regulation, and long-term thinking—won''t be fully developed until their mid-twenties."},
          {"type": "paragraph", "content": "This means your child literally cannot be their own guardrail yet. They need you to be it."},
          {"type": "heading", "level": 2, "content": "The Containment Theory"},
          {"type": "paragraph", "content": "Think of your child''s emotions like water. Without a container, water spreads everywhere. It''s formless. It can''t be directed. It floods."},
          {"type": "paragraph", "content": "Your boundaries are the container. They don''t stop the water from existing—they give it shape. They make it manageable."},
          {"type": "callout", "calloutType": "SCIENCE", "title": "The Safety Signal", "content": "When children test limits (and they will, relentlessly), they''re actually asking a question: \"Is anyone in charge here? Am I safe?\" Every time you hold a boundary, you answer: \"Yes. I''ve got you. You don''t have to figure this out alone.\""},
          {"type": "heading", "level": 2, "content": "What ''Being The Bad Guy'' Actually Looks Like"},
          {"type": "paragraph", "content": "Being the \"bad guy\" doesn''t mean:"},
          {"type": "list", "ordered": false, "items": ["Yelling or threatening", "Withdrawing love or affection", "Punishing with shame", "Being cold or dismissive"]},
          {"type": "paragraph", "content": "Being the \"bad guy\" DOES mean:"},
          {"type": "list", "ordered": false, "items": ["Saying no when no is the right answer", "Not changing your mind because they escalated", "Allowing them to feel disappointed without rescuing them", "Following through on what you said would happen", "Being comfortable with them being temporarily mad at you"]},
          {"type": "callout", "calloutType": "TRY", "title": "The Sturdy Mantra", "content": "Practice saying this: \"You can be mad at me. I can handle it. And the answer is still no.\" Say it out loud right now. Feel how your body responds. This is your new power phrase."},
          {"type": "heading", "level": 2, "content": "The Gift Of Frustration"},
          {"type": "paragraph", "content": "Every time your child faces a limit they don''t like and survives, they learn something crucial: they can handle hard things."},
          {"type": "paragraph", "content": "When you remove all frustration from their life—by saying yes to everything, by rescuing them from every disappointment, by negotiating away every no—you rob them of these learning opportunities."},
          {"type": "callout", "calloutType": "REMEMBER", "title": "The Uncomfortable Truth", "content": "A child who never hears no at home will be devastated by no from the world. A boss. A partner. A college rejection. Life is full of no. Your job is to help them practice now, in the safety of your love."},
          {"type": "script_box", "title": "Script: When They Say ''You''re Mean''", "content": "Child: \"You''re the meanest mom/dad ever!\"\n\nYou: \"I know it feels that way right now. You''re allowed to be mad at me. I''m still not changing my answer, AND I still love you. Both things are true.\"\n\n(Then stop talking. Don''t defend. Don''t explain. Let them feel.)"}
        ]
      },
      {
        "id": "chapter-3",
        "title": "Chapter 3: The 4-Step Limit Protocol",
        "blocks": [
          {"type": "paragraph", "content": "After studying thousands of parent-child interactions, I''ve identified the exact sequence that works. Not sometimes—consistently. Every time you need to set a limit, follow these four steps."},
          {"type": "heading", "level": 2, "content": "Step 1: STATE (Not Ask)"},
          {"type": "paragraph", "content": "Most parents accidentally ask permission when setting limits:"},
          {"type": "list", "ordered": false, "items": ["\"Can you please stop?\" (This is a question. They can answer no.)", "\"Would you mind putting that down?\" (You''re asking if they mind. They do.)", "\"Let''s not do that, okay?\" (You''re seeking agreement. You won''t get it.)"]},
          {"type": "paragraph", "content": "Instead, STATE:"},
          {"type": "list", "ordered": false, "items": ["\"The hitting stops now.\"", "\"Put the marker down.\"", "\"We''re leaving in five minutes.\""]},
          {"type": "callout", "calloutType": "TRY", "title": "The Statement Test", "content": "Before you speak, ask yourself: \"Am I asking or telling?\" If there''s a question mark at the end, rephrase it."},
          {"type": "heading", "level": 2, "content": "Step 2: ACKNOWLEDGE (Once)"},
          {"type": "paragraph", "content": "After stating the limit, acknowledge their feeling ONE time:"},
          {"type": "script_box", "title": "Acknowledgment Scripts", "content": "\"I know you don''t want to.\"\n\"I see you''re upset.\"\n\"This is hard for you.\"\n\"You wish you could keep playing.\"\n\"I get it.\""},
          {"type": "callout", "calloutType": "WARNING", "title": "The Validation Trap", "content": "Acknowledging doesn''t mean agreeing. It doesn''t mean explaining. It''s a brief recognition of their experience, not an opening for negotiation. One acknowledgment. Then move on."},
          {"type": "heading", "level": 2, "content": "Step 3: HOLD (The Hard Part)"},
          {"type": "paragraph", "content": "This is where most parents break. The child escalates. Cries harder. Screams. Says hurtful things. And the parent caves."},
          {"type": "paragraph", "content": "Holding means:"},
          {"type": "list", "ordered": false, "items": ["Your face stays calm (even if you don''t feel calm)", "Your body stays relaxed (even if you''re tense inside)", "Your words stop (you''ve said enough)", "Your presence remains (you don''t abandon them emotionally)"]},
          {"type": "callout", "calloutType": "SCIENCE", "title": "Mirror Neurons", "content": "Your child''s brain is literally reading your nervous system through mirror neurons. If you escalate, they escalate. If you stay regulated, you become their external regulator. Your calm is the intervention."},
          {"type": "script_box", "title": "Holding Scripts", "content": "\"I hear you. The answer is still no.\"\n\"I''m right here. The limit stands.\"\n\"You can be as mad as you need to be. I''m not changing my mind.\"\n\"I''ll wait.\"\n(Or say nothing. Silence is powerful.)"},
          {"type": "heading", "level": 2, "content": "Step 4: FOLLOW THROUGH (No Exceptions)"},
          {"type": "paragraph", "content": "If you said there would be a consequence, it happens. If you said you were leaving, you leave. If you said no more screens, screens go away."},
          {"type": "paragraph", "content": "No warnings after the warning. No second chances in the moment. No \"okay, but this is the LAST time.\""},
          {"type": "callout", "calloutType": "REMEMBER", "title": "The Trust Equation", "content": "Every time you follow through, your child learns: \"My parent means what they say.\" Every time you don''t, they learn: \"If I push hard enough, the rules don''t apply.\""},
          {"type": "heading", "level": 2, "content": "The Protocol In Action"},
          {"type": "script_box", "title": "Full Example: Leaving The Park", "content": "Parent: \"We''re leaving the park in five minutes.\" (STATE)\n\n[5 minutes later]\n\nParent: \"Time to go. I know you want to keep playing.\" (STATE + ACKNOWLEDGE)\n\nChild: \"No! Five more minutes!\"\n\nParent: (Silent. Extends hand. Calm face.) (HOLD)\n\nChild: \"I HATE YOU! I''m not going!\"\n\nParent: \"I hear you. Time to go.\" (HOLD)\n\nChild: (Screaming, refusing to walk)\n\nParent: (Calmly picks up child, walks to car, says nothing.) (FOLLOW THROUGH)\n\nChild: (Screaming in car)\n\nParent: (Drives. Stays calm. Doesn''t lecture. Doesn''t engage.)\n\n[Later, when child is calm]\n\nParent: \"That was hard. I know you didn''t want to leave. I love you.\""}
        ]
      },
      {
        "id": "chapter-4",
        "title": "Chapter 4: Scripts That Work When Nothing Else Does",
        "blocks": [
          {"type": "paragraph", "content": "The following scripts are designed for moments when your child is escalated and traditional gentle parenting phrases aren''t working. These are not your first response—they''re your backup when acknowledgment alone isn''t enough."},
          {"type": "heading", "level": 2, "content": "The ''Broken Record'' Technique"},
          {"type": "paragraph", "content": "When a child keeps arguing, hoping you''ll eventually cave, use the broken record technique: repeat the same short phrase without elaboration, explanation, or emotion."},
          {"type": "script_box", "title": "Broken Record Examples", "content": "Child: \"But WHY can''t I have more screen time?\"\nYou: \"Screen time is done for today.\"\n\nChild: \"That''s so unfair! Jake gets to watch whenever he wants!\"\nYou: \"Screen time is done for today.\"\n\nChild: \"You''re so mean! I never get to do anything!\"\nYou: \"Screen time is done for today.\"\n\nChild: \"UGHHHHH!\" (storms off)\nYou: (Say nothing. Let them go. You won.)"},
          {"type": "callout", "calloutType": "REMEMBER", "title": "Why It Works", "content": "Broken record works because children are looking for a crack in your armor. Each new argument is a test: \"Will this one work?\" When you give the same response every time, they learn there''s no crack. The boundary is solid."},
          {"type": "heading", "level": 2, "content": "The ''When/Then'' Statement"},
          {"type": "paragraph", "content": "This is a non-negotiable cause-and-effect statement. It''s not a threat—it''s information about how the world works."},
          {"type": "script_box", "title": "When/Then Examples", "content": "\"When you put your shoes on, then we can go to the park.\"\n\"When homework is done, then screens are available.\"\n\"When you use a calm voice, then I can hear what you need.\"\n\"When your room is clean, then you can have a friend over.\""},
          {"type": "callout", "calloutType": "WARNING", "title": "The Threat Trap", "content": "\"If you don''t put your shoes on, we''re NOT going to the park!\" feels similar but creates different energy. When/Then is calm and informational. If/Not is threatening and punitive. Your child can feel the difference."},
          {"type": "heading", "level": 2, "content": "The ''Two Choices'' Technique"},
          {"type": "paragraph", "content": "Give limited choices where both outcomes are acceptable to you. This gives children a sense of control while keeping you in charge."},
          {"type": "script_box", "title": "Two Choices Examples", "content": "\"You can walk to the car or I can carry you. You decide.\"\n\"You can put your plate in the sink or on the counter. Your choice.\"\n\"You can do homework before dinner or after. What works for you?\"\n\"You can take a break in your room or on the couch. Where feels better?\""},
          {"type": "heading", "level": 2, "content": "The ''I Know, And'' Bridge"},
          {"type": "paragraph", "content": "This validates their feeling while maintaining the limit. \"And\" is crucial—not \"but.\" \"But\" erases everything before it. \"And\" holds both truths."},
          {"type": "script_box", "title": "I Know, And Examples", "content": "\"I know you want ice cream, AND dinner comes first.\"\n\"I know you''re tired, AND we still need to brush teeth.\"\n\"I know this is disappointing, AND the answer is still no.\"\n\"I know you hate this, AND I''m still your mom/dad.\"\n\"I know you don''t understand, AND you don''t have to understand for the rule to exist.\""},
          {"type": "heading", "level": 2, "content": "The ''Exit Line''"},
          {"type": "paragraph", "content": "Sometimes the best thing you can do is end the conversation. The exit line is not abandonment—it''s a boundary on the interaction itself."},
          {"type": "script_box", "title": "Exit Line Examples", "content": "\"I''ve given my answer. I''m done discussing this.\"\n\"This conversation is over for now.\"\n\"I can see you''re upset. We''ll talk more when you''re calm.\"\n\"I love you. I''m not talking about this anymore right now.\"\n\"I''m going to step away. I''ll be in the kitchen if you need me.\""},
          {"type": "callout", "calloutType": "TRY", "title": "Practice Now", "content": "Pick one script from this chapter and practice saying it out loud ten times. Not reading—saying. Your mouth needs to know these words before you need them in the heat of the moment."}
        ]
      },
      {
        "id": "chapter-5",
        "title": "Chapter 5: The Screen & Sugar Reset",
        "blocks": [
          {"type": "paragraph", "content": "If there are two areas where boundaries have completely collapsed in modern families, it''s screens and sugar. Let''s fix them both."},
          {"type": "heading", "level": 2, "content": "Why Screens Are Different"},
          {"type": "paragraph", "content": "Screens aren''t just another activity. They''re designed by teams of neuroscientists and behavioral psychologists to be maximally addictive. The apps your child uses have been engineered to hijack the dopamine system."},
          {"type": "callout", "calloutType": "SCIENCE", "title": "The Dopamine Problem", "content": "Screens provide instant, effortless dopamine hits. When a child''s brain becomes accustomed to this level of stimulation, everything else—homework, chores, conversation, even outdoor play—feels boring by comparison. This isn''t weakness. It''s neurochemistry."},
          {"type": "heading", "level": 2, "content": "Signs Your Child Is Screen-Dependent"},
          {"type": "list", "ordered": false, "items": ["Meltdowns when screen time ends (not just disappointment—dysregulation)", "Unable to play independently without screens", "First question in the morning is about screens", "Negotiates aggressively for more time", "Seems \"flat\" or disengaged after screen use", "Prefers screens to seeing friends in person", "Sneaks screen time or lies about it"]},
          {"type": "heading", "level": 2, "content": "The Screen Reset Protocol"},
          {"type": "paragraph", "content": "If your child shows 3+ signs above, consider a screen reset:"},
          {"type": "list", "ordered": true, "items": ["Announce the change (don''t ambush them)", "Remove screens completely for 2-4 weeks (yes, completely)", "Expect hell for days 1-7 (it will pass)", "Provide analog alternatives (crafts, games, outdoor time)", "Reintroduce slowly with firm limits"]},
          {"type": "script_box", "title": "Script: Announcing The Screen Reset", "content": "\"I''ve noticed that screens have been making you feel bad lately. You get really upset when they turn off, and you don''t seem happy even when you''re using them. So our family is taking a break from screens for the next two weeks.\n\nI know this feels huge. I know you''re going to be upset. And we''re doing this anyway—not as punishment, but because I love you and I can see screens aren''t helping you right now.\n\nYou don''t have to like this. You just have to do it. I''m right here with you.\""},
          {"type": "heading", "level": 2, "content": "The Sugar Reset"},
          {"type": "paragraph", "content": "Sugar affects behavior. Any parent who''s watched their child after a birthday party knows this. But it''s not just the hyperactivity—it''s the crash afterward. The irritability. The inability to regulate."},
          {"type": "callout", "calloutType": "SCIENCE", "title": "Blood Sugar and Behavior", "content": "When blood sugar spikes and crashes, so does mood. Children don''t have the capacity to recognize this in themselves. They just know they feel terrible. And they act terrible."},
          {"type": "heading", "level": 2, "content": "Practical Sugar Limits"},
          {"type": "list", "ordered": false, "items": ["Dessert is occasional, not nightly", "No sugary drinks on regular days", "Sweet treats with meals (not standalone)", "\"Treat days\" instead of daily negotiations", "Model the behavior you want to see"]},
          {"type": "script_box", "title": "Script: Sugar Boundaries", "content": "\"Candy/cookies/ice cream isn''t for today. We can have some on Saturday.\"\n(Child protests)\n\"I know you want it. Saturday.\"\n(More protest)\n\"Saturday.\" (Then stop engaging.)"},
          {"type": "callout", "calloutType": "TRY", "title": "Start Small", "content": "If screens and sugar feel overwhelming, pick ONE to address first. Make no screens during meals your starting boundary. Or no dessert on weeknights. Small wins build momentum."}
        ]
      },
      {
        "id": "chapter-6",
        "title": "Chapter 6: When You Lose It (And How To Come Back)",
        "blocks": [
          {"type": "paragraph", "content": "You will yell. You will say things you regret. You will, at some point, be the parent you swore you''d never be."},
          {"type": "paragraph", "content": "This chapter is for after those moments."},
          {"type": "heading", "level": 2, "content": "Why We Explode"},
          {"type": "paragraph", "content": "When you lose it, it''s usually not about the moment. It''s about:"},
          {"type": "list", "ordered": false, "items": ["Sleep deprivation", "Touched out / overstimulated", "Work stress bleeding into home", "Unprocessed stuff from your own childhood", "Running on empty for too long", "The same behavior for the 47th time"]},
          {"type": "paragraph", "content": "Understanding why you exploded doesn''t excuse it. But it does help you address the root cause."},
          {"type": "callout", "calloutType": "REMEMBER", "title": "The Rupture Truth", "content": "Ruptures are not the problem. UNREPAIRED ruptures are the problem. Every parent ruptures with their child. What matters is what happens next."},
          {"type": "heading", "level": 2, "content": "The Repair Protocol"},
          {"type": "paragraph", "content": "After you''ve calmed down (not before—you need to be regulated to repair):"},
          {"type": "heading", "level": 3, "content": "Step 1: Own It"},
          {"type": "paragraph", "content": "No \"I''m sorry, BUT you were...\" Just ownership."},
          {"type": "script_box", "title": "Ownership Scripts", "content": "\"I yelled and that wasn''t okay.\"\n\"I lost my temper. That was my mistake.\"\n\"What I said was not kind. I wish I hadn''t said it.\"\n\"I scared you. That was wrong.\""},
          {"type": "heading", "level": 3, "content": "Step 2: Separate Your Behavior From Theirs"},
          {"type": "paragraph", "content": "Even if their behavior triggered you, YOUR behavior is YOUR responsibility."},
          {"type": "script_box", "title": "Separation Script", "content": "\"Even when you [specific behavior], it''s not okay for me to [what you did]. I''m the grownup. It''s my job to stay in control, and I didn''t do that.\""},
          {"type": "heading", "level": 3, "content": "Step 3: State What You''ll Do Differently"},
          {"type": "script_box", "title": "Commitment Script", "content": "\"Next time I feel that angry, I''m going to [take a breath/walk away for a minute/count to ten] instead of yelling. I''m working on this.\""},
          {"type": "heading", "level": 3, "content": "Step 4: Reconnect"},
          {"type": "paragraph", "content": "After the repair conversation, do something connecting. A hug. A game. Reading together. The repair isn''t complete until you''ve rebuilt the connection."},
          {"type": "callout", "calloutType": "WARNING", "title": "The Over-Apology Trap", "content": "Don''t apologize so much that your child feels responsible for your feelings. \"I''m SO sorry, I''m such a terrible parent, I can''t believe I did that to you...\" puts them in the position of comforting you. Keep it simple. Own it. Move on."},
          {"type": "heading", "level": 2, "content": "What Repair Teaches Your Child"},
          {"type": "list", "ordered": false, "items": ["Adults make mistakes too", "Mistakes don''t mean you''re bad", "Relationships can recover from hard moments", "Taking responsibility is important", "They are worthy of apology and respect"]},
          {"type": "callout", "calloutType": "TRY", "title": "Same-Day Repair", "content": "Try to repair before bedtime on the same day. If you put them to bed without addressing it, they''ll spend all night processing alone. Even a brief \"I''m sorry I yelled earlier\" before sleep is better than nothing."}
        ]
      },
      {
        "id": "chapter-7",
        "title": "Chapter 7: The 30-Day Boundary Reset",
        "blocks": [
          {"type": "paragraph", "content": "Reading about boundaries doesn''t change behavior. Implementation does. This chapter gives you a day-by-day plan to reset your family''s boundary culture."},
          {"type": "heading", "level": 2, "content": "Before You Begin"},
          {"type": "list", "ordered": false, "items": ["Choose your start date (not during a stressful week)", "Tell your partner/co-parent the plan", "Prepare for it to get harder before it gets easier", "This is a 30-day commitment—not a try-it-and-see"]},
          {"type": "heading", "level": 2, "content": "Week 1: Foundation (Days 1-7)"},
          {"type": "paragraph", "content": "Focus: Identify your biggest boundary gaps and practice the basics."},
          {"type": "list", "ordered": false, "items": ["Day 1: Write down 3 areas where you regularly cave", "Day 2: Pick ONE boundary to focus on (just one)", "Day 3: Announce the boundary to your child (use scripts from Chapter 3)", "Day 4: First test will come—hold the line using the 4-step protocol", "Day 5: Expect pushback—remember this is normal", "Day 6: Check in with yourself—are you staying regulated?", "Day 7: Rest and reflect—what worked? What was hard?"]},
          {"type": "callout", "calloutType": "TRY", "title": "Week 1 Focus Boundary Ideas", "content": "• Screen time ends at a specific time\\n• No means no (no negotiating)\\n• Bedtime routine starts at X time\\n• One snack between meals\\n• Kind words only (no hitting/kicking/biting)"},
          {"type": "heading", "level": 2, "content": "Week 2: Expansion (Days 8-14)"},
          {"type": "paragraph", "content": "Focus: Add a second boundary while maintaining the first."},
          {"type": "list", "ordered": false, "items": ["Day 8: Add second boundary (from your list of 3)", "Day 9: Practice Two Choices technique", "Day 10: Focus on When/Then statements today", "Day 11: Notice your child testing—this means it''s working", "Day 12: Practice the Broken Record technique", "Day 13: Check in—are you repairing ruptures same-day?", "Day 14: Rest and reflect—what''s different from Day 1?"]},
          {"type": "heading", "level": 2, "content": "Week 3: Integration (Days 15-21)"},
          {"type": "paragraph", "content": "Focus: The new boundaries become normal family culture."},
          {"type": "list", "ordered": false, "items": ["Day 15: Add your third boundary", "Day 16: Notice if testing has decreased—often it has", "Day 17: Practice Exit Lines when conversations go in circles", "Day 18: Celebrate a win (however small)", "Day 19: Address any sneaky testing (whining, negotiating)", "Day 20: Check your own nervous system—are you holding steady?", "Day 21: Rest and reflect—what surprised you?"]},
          {"type": "callout", "calloutType": "SCIENCE", "title": "The Testing Curve", "content": "Research shows that when you introduce consistent boundaries, testing behavior typically INCREASES for the first 1-2 weeks (extinction burst), then decreases dramatically. If you''re in the hard part, keep going. It''s working."},
          {"type": "heading", "level": 2, "content": "Week 4: Mastery (Days 22-30)"},
          {"type": "paragraph", "content": "Focus: Boundaries become automatic for both you and your child."},
          {"type": "list", "ordered": false, "items": ["Day 22: Notice what''s now automatic that was hard on Day 1", "Day 23: Look for a \"spontaneous compliance\" moment", "Day 24: Practice repair if you haven''t needed to yet", "Day 25: Reflect on your biggest transformation", "Day 26: Write down any new boundaries you want to add", "Day 27: Talk to your child about how things have changed", "Day 28: Celebrate how far you''ve come", "Day 29: Plan for maintenance—how will you keep this going?", "Day 30: You did it. Journal about who you''ve become."]},
          {"type": "script_box", "title": "Script: Acknowledging Change With Your Child", "content": "\"I''ve noticed something. Remember when [specific thing] used to be really hard? Like getting you to [specific example]? It''s been so much easier lately. You''re really getting good at this. I''m proud of you—and I''m proud of us.\""},
          {"type": "callout", "calloutType": "REMEMBER", "title": "Maintenance Mindset", "content": "Day 30 isn''t the end—it''s the beginning of your new normal. There will be regressions. There will be hard days. But you now have the tools. You know you can do hard things. So does your child."}
        ]
      },
      {
        "id": "conclusion",
        "title": "Conclusion: You Are Enough",
        "blocks": [
          {"type": "paragraph", "content": "If you''ve made it this far, you''ve already done something most parents never do: you''ve questioned your own patterns. You''ve examined your fears. You''ve been willing to be uncomfortable for your child''s benefit."},
          {"type": "paragraph", "content": "That takes courage. Real courage."},
          {"type": "heading", "level": 2, "content": "What I Hope You''ve Learned"},
          {"type": "list", "ordered": false, "items": ["Gentle parenting and firm limits are not opposites—they''re partners", "Your child needs you to be sturdy more than they need you to be soft", "Boundaries aren''t mean; they''re mandatory for healthy development", "Your calm is the most powerful tool you have", "Repair is more important than perfection", "You are capable of changing your patterns"]},
          {"type": "heading", "level": 2, "content": "What Your Child Will Remember"},
          {"type": "paragraph", "content": "Twenty years from now, your child won''t remember most of the limits you set. They won''t remember most of the meltdowns or the hard moments or the times you had to be the \"bad guy.\""},
          {"type": "paragraph", "content": "What they''ll remember is the feeling of being held—physically and emotionally. The security of knowing someone was in charge. The sense that their big feelings wouldn''t destroy the family. The faith that their parent would keep them safe, even from themselves."},
          {"type": "callout", "calloutType": "REMEMBER", "title": "The Ultimate Truth", "content": "Every time you hold a boundary, you tell your child: \"I love you enough to be uncomfortable. I love you enough to let you be mad at me. I love you enough to do the hard thing.\" That''s not mean. That''s the deepest love there is."},
          {"type": "heading", "level": 2, "content": "A Final Word"},
          {"type": "paragraph", "content": "You started this book wondering if you were too soft. If you were failing your child. If gentle parenting was a scam."},
          {"type": "paragraph", "content": "You''re ending it knowing that gentle AND firm is possible. That boundaries AND connection coexist. That you can be sturdy without being harsh."},
          {"type": "paragraph", "content": "The parent your child needs isn''t perfect. Isn''t always calm. Doesn''t have it all figured out."},
          {"type": "paragraph", "content": "The parent your child needs shows up. Holds the line. Repairs the ruptures. Keeps trying."},
          {"type": "paragraph", "content": "That parent is you."},
          {"type": "paragraph", "content": "Now go be sturdy."}
        ]
      }
    ]
  }'::jsonb
);
