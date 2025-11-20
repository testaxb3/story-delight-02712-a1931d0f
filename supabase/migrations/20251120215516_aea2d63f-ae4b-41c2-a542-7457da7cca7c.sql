-- HYPER-SPECIFIC SCRIPT: TRANSITIONS / DISTRACTED PROFILE

INSERT INTO public.scripts (
  title,
  category,
  profile,
  age_min,
  age_max,
  difficulty_level,
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
  'Gets stuck examining toy mid-transition - takes 18 minutes to reach bathroom',
  'Transitions',
  'DISTRACTED',
  4,
  10,
  'Moderate',
  4,
  
  '**7:42 PM.** You say "Time for bath!" Your child stands up from the Lego table, takes three steps toward the hallway, then **freezes**. Their eyes lock onto a small plastic dinosaur lying on the floor—one they''ve walked past 47 times today without noticing.

They crouch down. Pick it up. Turn it over in their hands, examining the texture of the scales. "Mom, did you know T-Rex had really bumpy skin?" They''re now sitting cross-legged on the floor, 4 feet from where they started, the dinosaur fully occupying their attention.

You remind them: "Bathroom. Now." They look up, genuinely confused. "Wait, what was I doing?" They stand up, still holding the dinosaur, take two more steps, then notice a drawing taped to the wall. Stop again. "Oh! I need to show you this!" Point at the drawing with intense focus.

**7:58 PM.** You''ve given 6 reminders. They''ve moved 12 feet in 16 minutes. The bathroom is 30 feet away. Every single object between here and there has become a **mental derailment point**—a shiny sticker on the floor, their sister''s shoe, a dust particle floating in the light.

Their brain isn''t defying you. **It''s genuinely forgetting the destination every 8-12 seconds** because a new stimulus hijacks their working memory and **completely erases the previous instruction**.',

  '**❌ COMMON MISTAKE #1: Repeating the instruction louder each time**


"BATHROOM. GO TO THE BATHROOM. I SAID BATHROOM!"


**Why it fails:** Their working memory can only hold instructions for 8-12 seconds before environmental stimuli overwrite it. Louder repetition doesn''t strengthen memory encoding—it just adds auditory stress without creating the external structure their brain needs to maintain task direction.


**The neuroscience:** The DISTRACTED brain has weak connections between the prefrontal cortex (which holds instructions) and the hippocampus (which encodes "what I''m supposed to be doing"). Each visual distraction literally **deletes the instruction** from working memory and replaces it with the new stimulus. Volume doesn''t fix neural connectivity.


**❌ COMMON MISTAKE #2: Getting frustrated and physically steering them**


Grabbing their shoulders and marching them to the bathroom while saying "Stop getting distracted! Just WALK there!"


**Why it fails:** Physical steering doesn''t teach their brain how to create its own attentional anchors. You become the external frontal lobe instead of helping them build internal task-holding skills. Next transition, same derailment pattern repeats because they never learned to self-redirect.


**The neuroscience:** Task completion requires sustained activation of the dorsolateral prefrontal cortex (which holds goals) while filtering out irrelevant stimuli. Their brain struggles with this "goal maintenance + distractor inhibition" combo. Steering solves the immediate problem but doesn''t build the neural pathways they need for independent transitions.


**❌ COMMON MISTAKE #3: Removing all objects from the path**


Clearing every toy, paper, and item between point A and point B to create an "empty hallway."


**Why it fails:** The DISTRACTED brain will find distractions in a white-walled empty room—a shadow, the hum of the AC, their own hand. The issue isn''t the objects; it''s the lack of **external memory anchors**. Removing stimuli doesn''t teach them how to maintain task focus when stimuli inevitably exist.',

  '[
    {
      "step_number": 1,
      "step_title": "Create the Walking Mantra (Before Movement Starts)",
      "step_explanation": "Before they take a single step, establish a 3-word phrase they will repeat out loud continuously during the transition. The mantra acts as an external memory anchor that keeps the destination active in working memory. It must be said aloud (not thought) because vocalization activates motor cortex pathways that strengthen memory encoding.",
      "what_to_say_examples": [
        "\"Before we walk, we need our bathroom words. Say with me: Bath. Time. Now. Good. Now keep saying those three words the whole way there: Bath. Time. Now.\"",
        "\"Your walking job is to be the DJ. You say Bath-Time-Now over and over like a song while you walk. Can you start? Bath-Time-Now, Bath-Time-Now...\"",
        "\"We''re going to make your brain sticky. Say these words and they''ll stick: Bath. Time. Now. Keep saying them so your brain remembers where we''re going.\""
      ]
    },
    {
      "step_number": 2,
      "step_title": "Walk Behind Them with Mantra Prompting",
      "step_explanation": "Position yourself behind them (not beside or in front) and walk 2 feet back. This positioning makes YOU the external prefrontal cortex—you can see when they start to slow/stop/look at something, and you can immediately re-prompt the mantra before they fully derail. If they stop saying the mantra, their working memory has been hijacked. Your job is to restart it within 3 seconds.",
      "what_to_say_examples": [
        "(Child stops talking, eyes drift to toy) \"Mantra! Bath-Time-Now. Say it: Bath-Time-Now.\" (Wait for them to restart before continuing)",
        "(Child slows down, looking at wall) \"I don''t hear your words. Bath-Time-Now. Keep walking, keep saying it.\"",
        "(Child picks up object) \"Mantra first, look later. Bath-Time-Now. Say it and walk.\" (If they keep holding object: \"You can bring it. Just keep saying your words.\")"
      ]
    },
    {
      "step_number": 3,
      "step_title": "Acknowledge Distractions Without Stopping",
      "step_explanation": "When they notice something (toy, sticker, drawing), acknowledge it verbally while keeping movement going. This validates their observation (which is genuine—they really DO see interesting things) without allowing the full derailment. The phrase structure is: See it → Name it → Keep moving. This prevents the \"stop and examine\" pattern while honoring their noticing.",
      "what_to_say_examples": [
        "(Child looks at toy) \"Yep, dinosaur. Bath-Time-Now. Keep walking, keep saying it.\"",
        "(Child points at drawing) \"I see it, cool drawing. Bath-Time-Now. We''ll look after bath. Keep moving.\"",
        "(Child bends toward object) \"Spotted that shoe, good noticing. Bath-Time-Now. Walk and talk, walk and talk.\""
      ]
    },
    {
      "step_number": 4,
      "step_title": "Celebrate Arrival with Task Completion Reinforcement",
      "step_explanation": "The moment they reach the bathroom threshold (even if it took 8 minutes and 12 re-directs), celebrate the task completion with specific praise about what their BRAIN did. This reinforces the neural pathways for task maintenance and builds their sense of competence around transitions. Focus on the process (kept saying mantra, kept moving) not the speed.",
      "what_to_say_examples": [
        "\"You made it! Your brain held onto Bath-Time-Now the whole way. That''s how you do transitions.\"",
        "\"Look at that—you kept your words going and your feet moving. That''s exactly what your brain needs. High five.\"",
        "\"Even when you saw the dinosaur and the drawing, you kept saying your mantra and got here. That''s serious brain work.\""
      ]
    }
  ]',

  '**The Walking Mantra** acts as a continuous external memory anchor. The DISTRACTED brain''s working memory can only hold instructions for 8-12 seconds before environmental stimuli erase them. By vocalizing the destination repeatedly, they create a **self-generated reminder system** that reactivates the goal every 3-4 seconds—before the instruction decays. The vocalization isn''t just mental; it engages motor cortex (mouth movement) + auditory cortex (hearing themselves) + prefrontal cortex (maintaining the goal), creating a **multi-sensory memory loop** that''s harder to overwrite than a single silent thought.

**Walking behind them** mimics the role of a healthy prefrontal cortex—scanning for derailment and immediately re-engaging task focus before the distraction fully hijacks attention. Research on ADHD shows the critical window is 3-5 seconds: if you re-prompt within that window, they can recover task focus without fully derailing. After 5 seconds, they''ve mentally switched tasks entirely and need to "restart" the transition from scratch.

**Acknowledging distractions without stopping** teaches them that noticing things is fine—but stopping isn''t necessary. This builds the neural skill of **divided attention** (holding the goal while processing new stimuli) rather than **attention switching** (dropping the goal to fully focus on new stimuli). Over time, this trains the brain to filter distractions into "notice but don''t stop" vs "this actually requires stopping."

**Celebrating arrival** reinforces the dopamine hit for task completion. The DISTRACTED brain often doesn''t get natural completion satisfaction because they rarely finish tasks without external support. By explicitly celebrating "you made it," you''re conditioning their brain to associate transitions with success rather than frustration—which increases motivation for future transitions.',

  '{
    "first_30_seconds": "They will likely start the mantra enthusiastically (novelty is engaging for the DISTRACTED brain), then stop saying it within 10-15 seconds as visual stimuli captures their attention. You will need to re-prompt the mantra 2-3 times in the first 30 seconds. Their walking pace may slow dramatically when they look at objects. This is normal—their brain is genuinely hijacked.",
    "by_2_minutes": "They will start to anticipate your prompts and may restart the mantra on their own after brief pauses. The transition that previously took 18 minutes may now take 5-7 minutes with 8-12 re-prompts. They may ask to hold or touch objects they notice—allow this if they keep moving and saying the mantra. Forward movement + vocalization = success, even if they''re carrying three toys and a sock.",
    "this_is_success": "Success is reaching the destination in under 10 minutes with active engagement in the mantra system—not perfect no-distraction walking. DISTRACTED brains will ALWAYS notice things; the goal is teaching them to notice without fully derailing. If they reach the bathroom while still holding the mantra (even if they paused 8 times), their brain learned to maintain task focus despite distractions. That''s the skill being built.",
    "dont_expect": [
      "Don''t expect them to walk in a straight line without looking at anything—their brain genuinely finds novelty in ordinary objects you''ve tuned out",
      "Don''t expect them to need fewer prompts after just one transition—building this skill takes 40-60 repetitions before it becomes semi-automatic",
      "Don''t expect the mantra to work if they stop saying it aloud—silent thinking doesn''t create strong enough memory encoding for the DISTRACTED brain",
      "Don''t expect smooth transitions when they''re hungry, tired, or emotionally dysregulated—working memory function collapses when basic needs aren''t met"
    ]
  }',

  '[
    {
      "variation_scenario": "They start the mantra but then switch to singing a completely different song mid-walk",
      "variation_response": "Immediately redirect: \"That''s a great song, but right now we need Bath-Time-Now. Switch back: Bath-Time-Now.\" If they resist: \"Song is for after bath. Right now: Bath-Time-Now. I need to hear those words.\" Don''t allow song substitution—it defeats the memory anchor purpose. The specific words matter."
    },
    {
      "variation_scenario": "They stop walking and say \"But I really want to look at this for just one second\"",
      "variation_response": "\"You can look while walking and talking. Bath-Time-Now—keep saying it and keep moving, your eyes can look.\" If they insist on stopping: \"Okay, 5 seconds of looking while standing still, but you have to keep saying Bath-Time-Now the whole time. Ready? Go.\" (Count to 5, then: \"Time''s up, keep walking, keep saying it.\")"
    },
    {
      "variation_scenario": "They reach the bathroom but then immediately turn around to go get something they forgot",
      "variation_response": "Block the exit gently and say: \"We made it! Bath-Time-Now complete. High five.\" (Give high five.) \"Now, what did you need?\" (Let them tell you.) \"Okay, after bath we''ll get it. Right now you''re here, and that''s the win. Let''s start bath.\" Don''t let them leave and restart the cycle—acknowledge the forgotten item verbally but hold the boundary."
    },
    {
      "variation_scenario": "They do great with the mantra for three days, then suddenly it stops working",
      "variation_response": "The novelty wore off and the mantra became background noise. Switch it up: \"New bathroom words this week: Go-To-Bath, Go-To-Bath\" or \"This week we''re speed-walking and the words are Zoom-Zoom-Bath.\" Rotate the mantra every 5-7 days to maintain novelty activation. The structure stays the same; the words change."
    }
  ]',

  'You need to be **physically present and following them** for this to work—this isn''t a "call from the kitchen" strategy. Position yourself 2 feet behind them where you can see their body language and hear if the mantra stops. Your energy should be **coaching, not controlling**: you''re their external frontal lobe temporarily, helping their brain build the skill of task maintenance. This requires patience with repetition—you will say "Bath-Time-Now, keep saying it" 8-12 times per transition initially. That''s not failure; that''s how working memory strengthens over time. If you''re exhausted, frustrated, or need them to move quickly, this will feel tedious—save it for times when you have 10 minutes and the capacity to repeat yourself calmly. Eventually the prompts decrease as the skill builds, but the first 2 weeks require consistent external support.',

  ARRAY['distracted', 'transitions', 'working-memory', 'task-focus', 'bathroom-transitions', 'getting-distracted', 'forgetfulness', 'attention-regulation'],

  false
);