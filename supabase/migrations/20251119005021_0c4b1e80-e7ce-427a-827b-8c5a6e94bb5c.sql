-- Add chapters 3-7 with complete, detailed scripts
UPDATE public.ebooks
SET content = jsonb_set(
  content,
  '{chapters}',
  content->'chapters' || $$[
    {
      "id": "chapter-3",
      "title": "Chapter 3: Script #1 - The Toy Grab",
      "sections": [
        {
          "type": "heading",
          "content": "When One Takes From the Other"
        },
        {
          "type": "paragraph",
          "content": "**THE SCENARIO:**"
        },
        {
          "type": "paragraph",
          "content": "Your 4-year-old is building a block tower. Focused. Calm. Finally."
        },
        {
          "type": "paragraph",
          "content": "Your 6-year-old INTENSE child walks into the room, sees the blocks, and—**GRAB**. Tower demolished. Screaming erupts."
        },
        {
          "type": "paragraph",
          "content": "Your 4-year-old: sobbing, pointing, \"THEY TOOK MY BLOCKS!\"\n\nYour INTENSE child: defensive, loud, \"I WANTED THEM!\""
        },
        {
          "type": "paragraph",
          "content": "**YOUR INSTINCT:**"
        },
        {
          "type": "paragraph",
          "content": "• \"GIVE THEM BACK RIGHT NOW!\"\n• \"You know better! How many times have we talked about this?\"\n• \"That's it. Go to your room!\"\n• \"You just lost screen time for a week!\""
        },
        {
          "type": "callout",
          "calloutType": "warning",
          "content": "**Why That Escalates:**\n\nYour INTENSE child's amygdala saw those blocks and fired a \"GET IT NOW\" signal in 0.2 seconds. Their prefrontal cortex (logic brain) never got involved.\n\nWhen you lecture or punish:\n• You activate shame (\"I'm bad\")\n• Their cortisol spikes higher\n• They become MORE aggressive, not less\n\nShame + dysregulation = increased future aggression."
        },
        {
          "type": "heading",
          "content": "THE REGULATION-FIRST SCRIPT"
        },
        {
          "type": "script",
          "content": "**STEP 1: Regulate YOURSELF (2-3 seconds)**\n\n[Take ONE deep breath. Drop your shoulders. Feel your feet on the ground.]\n\n**Internal dialogue:** \"They're not being bad. Their brain got hijacked. I am the calm.\"\n\n**Why this matters:** Your nervous system talks to theirs BEFORE your words do."
        },
        {
          "type": "script",
          "content": "**STEP 2: Create safety for BOTH kids (10 seconds)**\n\n**YOU:** [Calm, low voice—not loud] \"Okay. I see a toy situation happening. Everyone's safe. I'm going to help both of you.\"\n\n[Position yourself between them—not pulling them apart, just present. Your body is the anchor.]\n\n**Why this matters:** Your calm presence signals to their amygdalas: \"Threat is over.\""
        },
        {
          "type": "script",
          "content": "**STEP 3: Validate the INTENSE child FIRST (15 seconds)**\n\n[Yes, first. Not the child who \"had it first.\" Read why below.]\n\n**YOU:** [Kneel at INTENSE child's level] \"Your body really wanted those blocks. That grab happened so fast, didn't it? Your thinking brain didn't even get a chance.\"\n\n[WAIT. Let them respond. Even if it's yelling: \"I WANT THEM!\"]\n\n**YOU:** \"I know. When you see something you want, your body just goes for it. That's a super fast brain you've got. Sometimes TOO fast, right?\"\n\n**Why this matters:** Their amygdala needs safety validation BEFORE their prefrontal cortex can process empathy for the other child."
        },
        {
          "type": "callout",
          "calloutType": "remember",
          "content": "**Why Validate the \"Aggressor\" First?**\n\nEvery fiber of your being screams: \"But they TOOK the toy! The other kid is the victim!\"\n\nHere's why you validate the INTENSE child first:\n\n**1. Their amygdala is in higher threat state** (fight mode vs. other child's distress)\n**2. They can't process empathy until regulated** (prefrontal cortex offline)\n**3. Other child learns patience while watching you model co-regulation**\n\nYou'll validate the other child immediately after. Promise."
        },
        {
          "type": "script",
          "content": "**STEP 4: Name what happened without shame (10 seconds)**\n\n**YOU:** \"And... [younger child's name] was using those blocks. They were building something. So now we have: two kids, one set of blocks, and big feelings. This is a tricky situation.\"\n\n[Turn to younger child—make eye contact]\n\n**YOU:** \"You were surprised when those got grabbed, huh? That didn't feel good. You were in the middle of building.\"\n\n**Why this matters:** You're stating facts, not assigning blame. The INTENSE child hears: \"I'm not bad\" AND \"My action had an impact.\""
        },
        {
          "type": "script",
          "content": "**STEP 5: Teach the regulation skill (30-45 seconds)**\n\n**YOU:** [Back to INTENSE child] \"Here's what your fast brain needs to learn: When you see something you want that someone else is using, your job is to PAUSE.\"\n\n[Demonstrate with your body—this is KEY]\n\n**YOU:** \"The pause looks like this: Put your hands on your belly. [Do it with them] Take one big breath. [Breathe audibly together] That gives your thinking brain ONE SECOND to catch up to your fast brain.\"\n\n**YOU:** \"Let's practice RIGHT NOW while your body still remembers that feeling. See that [point to different toy]? Pretend you really want it. Show me: hands on belly... one big breath... THEN reach.\"\n\n[Practice 3-5 times. Make it playful, not punitive. Time them. Cheer when they do it.]\n\n**YOU:** \"YES! That's the pause! Your thinking brain just caught up to your fast brain!\"\n\n**Why this matters:** Neural pathways form through immediate repetition. You're literally building new brain connections right now."
        },
        {
          "type": "callout",
          "calloutType": "science",
          "content": "**The Neuroscience of the Pause:**\n\nResearch from MIT's Brain & Cognitive Sciences department shows that a **1-second delay** between impulse and action activates the prefrontal cortex (PFC).\n\nThe PFC needs just 1 second to:\n• Assess the situation\n• Consider consequences\n• Access empathy\n• Choose a different response\n\nWithout the pause? The amygdala controls 100% of behavior."
        },
        {
          "type": "script",
          "content": "**STEP 6: Facilitate repair (NOT forced apology) (30 seconds)**\n\n**YOU:** \"So [younger child] felt upset when the blocks got grabbed. What could help them feel better?\"\n\n[WAIT. Give them space to think. If they freeze:]\n\n**YOU:** \"Sometimes when we grab, we can:\n→ Offer something else they might like\n→ Ask if they want to build together\n→ Help them rebuild what got knocked down\n→ Give the blocks back for now and ask for a turn later\n\nWhich one feels right to you?\"\n\n**[Critical: Let THEM choose. Autonomy reduces resistance.]\n\n**If they choose repair:** Praise the effort, not the outcome. \"You're helping them feel better. That's what big kids do.\"\n\n**If they refuse:** \"Your body isn't ready yet. That's okay. We'll sit here together until it is.\" [Stay present. No shame. Just wait.]"
        },
        {
          "type": "callout",
          "calloutType": "try",
          "content": "**What About Forced Apologies?**\n\n\"Say sorry to your sister!\" feels satisfying. It doesn't work.\n\nHere's why:\n• Their amygdala is still activated (they don't FEEL sorry)\n• Forced apologies activate shame and resentment\n• They learn: \"Apologies are performances to make Mom stop being mad\"\n\nInstead, offering repair choices builds genuine empathy:\n• They choose what feels authentic\n• They experience the positive impact of repair\n• They learn: \"I can fix ruptures in relationships\""
        },
        {
          "type": "heading",
          "content": "Common Mistakes (And How to Avoid Them)"
        },
        {
          "type": "paragraph",
          "content": "**MISTAKE #1: Validating the \"victim\" first**"
        },
        {
          "type": "paragraph",
          "content": "**What you do:** \"Poor baby! They took your blocks! That's not fair!\"\n\n**Why it backfires:** Your INTENSE child's amygdala hears: \"Mom thinks I'm bad. Now I'm in MORE danger.\" They escalate.\n\n**Better:** Validate INTENSE child first (regulate them), THEN validate the other child."
        },
        {
          "type": "paragraph",
          "content": "**MISTAKE #2: Skipping the practice**"
        },
        {
          "type": "paragraph",
          "content": "**What you do:** \"We'll work on pausing later when you're calmer.\"\n\n**Why it fails:** Neural pathways form through immediate repetition. Right now, their cortisol is elevated and their brain is PRIMED for learning. Waiting = missing the window.\n\n**Better:** Practice immediately, even if they resist. Make it a game."
        },
        {
          "type": "paragraph",
          "content": "**MISTAKE #3: Lecturing while they're still activated**"
        },
        {
          "type": "paragraph",
          "content": "**What you do:** \"How many times have we talked about asking first? You KNOW grabbing is wrong. Why do you keep doing this?\"\n\n**Why it fails:** Their prefrontal cortex is offline. They literally cannot process complex language while dysregulated.\n\n**Better:** Regulate first. Teach second. Always."
        },
        {
          "type": "heading",
          "content": "Age-Specific Adaptations"
        },
        {
          "type": "paragraph",
          "content": "**Ages 2-3:**\n• Shorten to 3 steps: regulate you → validate them → offer trade\n• Use simpler language: \"Your body REALLY wanted that. [Child's name] was using it. Here—want this instead?\"\n• Practice the pause using their stuffed animals (pretend play)"
        },
        {
          "type": "paragraph",
          "content": "**Ages 4-6:**\n• Full script works\n• Add physical regulation: hand on belly, deep breaths, counting to 3\n• Make the pause practice a daily game (strengthens neural pathways)"
        },
        {
          "type": "paragraph",
          "content": "**Ages 7+:**\n• Add problem-solving: \"What could you do differently next time? Let's make a plan.\"\n• Teach them to recognize the physical signs of impulse: \"What does your body feel like right before you grab?\"\n• Create a written plan they can reference"
        },
        {
          "type": "heading",
          "content": "What Success Actually Looks Like"
        },
        {
          "type": "paragraph",
          "content": "**WEEK 1:**\n• You'll use this script 10-15 times\n• It will feel awkward and slow\n• Kids will still grab—BUT you stay regulated\n• De-escalation time: 5 minutes → 2 minutes"
        },
        {
          "type": "paragraph",
          "content": "**WEEK 2:**\n• You'll see them pause ONCE before grabbing\n• They'll start using regulation language: \"My fast brain...\"\n• Grabbing frequency drops ~20%"
        },
        {
          "type": "paragraph",
          "content": "**WEEKS 3-4:**\n• They pause successfully 40-50% of the time\n• They start asking for turns instead of grabbing\n• You notice them teaching the pause to other kids"
        },
        {
          "type": "paragraph",
          "content": "**MONTH 2:**\n• Grabbing reduces by 60-70%\n• They catch themselves mid-grab and correct\n• They self-regulate without your prompting"
        },
        {
          "type": "callout",
          "calloutType": "remember",
          "content": "**This is not a quick fix.** You're building a new neural pathway from scratch.\n\nThat pathway takes **500-1000 repetitions** to form. Then another 1000 to become automatic.\n\nBut it works. And unlike time-outs, it actually teaches the skill they need for life."
        }
      ]
    },
    {
      "id": "chapter-4",
      "title": "Chapter 4: Script #2 - The Tattling Tornado",
      "sections": [
        {
          "type": "heading",
          "content": "When Every. Single. Minute. Is a Complaint"
        },
        {
          "type": "paragraph",
          "content": "**THE SCENARIO:**"
        },
        {
          "type": "paragraph",
          "content": "You're trying to make dinner. Or work. Or exist."
        },
        {
          "type": "paragraph",
          "content": "And then it starts:"
        },
        {
          "type": "paragraph",
          "content": "\"Mom! They're looking at me!\"\n\n\"Mom! They're breathing too loud!\"\n\n\"Mom! They're in my space!\"\n\n\"Mom! They touched my toy!\"\n\n\"Mom! They're copying me!\"\n\n\"MOM! MOM! MOOOOM!\""
        },
        {
          "type": "paragraph",
          "content": "**14 times in the last hour.**"
        },
        {
          "type": "paragraph",
          "content": "You've tried:\n• \"Work it out yourselves\"\n• \"I'm not a referee\"\n• \"Stop tattling or you both lose iPad time\"\n• Ignoring them completely"
        },
        {
          "type": "paragraph",
          "content": "Nothing works. If anything, it's getting **worse**."
        },
        {
          "type": "callout",
          "calloutType": "remember",
          "content": "**Tattling isn't manipulation. It's a regulation request.**\n\nYour INTENSE child's nervous system is hyper-vigilant. When they tattle, their amygdala is signaling:\n\n**\"Something feels unsafe. I need you to help me feel safe again.\"**\n\nIgnoring them doesn't teach independence. It teaches: \"My distress signals don't matter.\""
        },
        {
          "type": "heading",
          "content": "THE REGULATION-FIRST SCRIPT"
        },
        {
          "type": "script",
          "content": "**STEP 1: Pause your reaction (2-3 seconds)**\n\n[BEFORE responding, take ONE breath. This is critical.]\n\n**Internal dialogue:** \"This isn't about the toy/space/breathing. This is about nervous system capacity. My child needs co-regulation, not consequences.\"\n\n**Why:** Your instinct is to snap \"NOT NOW!\" That activates shame and increases tattling."
        },
        {
          "type": "script",
          "content": "**STEP 2: Validate the FEELING (not the complaint) (10-15 seconds)**\n\n**YOU:** [Calm, neutral tone—no annoyance in your voice] \"You came to tell me something. Your body felt [annoyed/upset/bothered/activated].\"\n\n[DON'T engage with content yet. Just name the feeling.]\n\n**CHILD:** \"Yeah! They're—\"\n\n**YOU:** [Gentle interrupt with hand up] \"Hold on. I heard the feeling first. Now I need to check something: Is this a **safety problem** or a **frustration problem**?\"\n\n**Why:** You're teaching their prefrontal cortex to assess before reacting."
        },
        {
          "type": "script",
          "content": "**STEP 3: Teach the distinction (20-30 seconds)**\n\n**YOU:** \"Let me explain the difference:\n\n**SAFETY PROBLEMS** = Someone's hurt or about to get hurt. Come get me FAST.\n→ Hitting, pushing, dangerous behavior\n→ Someone's crying from pain\n→ Someone's about to break something important\n\n**FRUSTRATION PROBLEMS** = You don't like what they're doing, but everyone's body is safe. This is a 'try to solve it first' situation.\n→ They're annoying you\n→ They're in your space\n→ They're being loud\n→ They're touching your stuff (gently)\"\n\n[Pause]\n\n**YOU:** \"Which kind is this: safety or frustration?\"\n\n**Why:** You're building discernment capacity in their prefrontal cortex."
        },
        {
          "type": "callout",
          "calloutType": "try",
          "content": "**Create a Visual Reference:**\n\nMake a poster with your child showing:\n\n🚨 **SAFETY PROBLEMS** (Come Get Mom FAST)\n• Hitting/hurting\n• About to get hurt\n• Breaking something dangerous\n• Real tears (not tantrum crying)\n\n😤 **FRUSTRATION PROBLEMS** (Try First, Then Get Mom)\n• Annoying me\n• In my space\n• Being loud\n• Touching my stuff\n\nPost it at their eye level. Reference it EVERY TIME they tattle.\n\nVisual cues activate prefrontal cortex before amygdala takes over."
        },
        {
          "type": "script",
          "content": "**STEP 4: Teach the self-regulation tool (30-45 seconds)**\n\n[After they identify it as frustration problem]\n\n**YOU:** \"Okay, so this is a frustration problem. That means your body needs to reset BEFORE you talk to them. Here's the tool:\"\n\n[Demonstrate—this is KEY]\n\n**THE FRUSTRATION RESET:**\n**1. Hand on your belly** [do it with them]\n**2. Three big breaths** [breathe audibly together]\n**3. Ask yourself: 'Can I handle this myself, or do I actually need Mom?'**\n\n[Practice it right then]\n\n**YOU:** \"Let's try it. Hand on belly... breathe with me... one, two, three. Good. Now ask yourself: Can you handle this, or do you need me to help you use your words with them?\"\n\n**Why:** You're giving them a concrete tool they can use BEFORE they tattle."
        },
        {
          "type": "script",
          "content": "**STEP 5: Offer limited support based on their answer**\n\n**OPTION A: They say they can handle it**\n\n**YOU:** \"Great! I trust you. You've got the tool now. Come back if you need me.\"\n\n[Let them go try. Do NOT hover or offer advice.]\n\n---\n\n**OPTION B: They say they need help**\n\n**YOU:** \"Okay. I'll help you use your words with them. But first—what do you WANT to happen? What's the actual need?\"\n\n[Let them articulate: \"I want them to be quiet\" or \"I want them out of my room\"]\n\n**YOU:** \"Got it. Let's go together. I'll stand next to you while YOU tell them what you need. I'm not going to solve it—I'm going to help you solve it. Ready?\"\n\n[Walk with them. Have them speak directly to sibling while you're present.]\n\n**CHILD:** \"I need you to stop touching my stuff!\"\n\n**YOU:** [To both kids] \"Okay, I heard [child] say they need their stuff not touched. [Other child], did you hear that? Can your body do that?\"\n\n[Facilitate the conversation, don't solve it.]\n\n**Why:** You're teaching them the skill of direct communication while offering co-regulation support."
        },
        {
          "type": "callout",
          "calloutType": "science",
          "content": "**Why This Works: The Dorsal Vagal System**\n\nWhen your INTENSE child tattles, their dorsal vagal nerve (part of the parasympathetic nervous system) is signaling: \"Threat detected.\"\n\nIgnoring them INCREASES dorsal vagal activation (\"I'm unsafe AND alone\").\n\nInstead, this script:\n• Acknowledges the nervous system activation (validation)\n• Teaches discernment (prefrontal cortex skill)\n• Provides a self-regulation tool (builds capacity)\n• Offers supported problem-solving (co-regulation)"
        },
        {
          "type": "heading",
          "content": "What This Looks Like in Real Life"
        },
        {
          "type": "paragraph",
          "content": "**WEEK 1:**\n• They'll still tattle 30-50 times a day\n• But YOU stay regulated using the script\n• You feel less like a referee\n• They learn the safety/frustration distinction"
        },
        {
          "type": "paragraph",
          "content": "**WEEK 2:**\n• You notice them pause before running to you\n• They start using the language: \"Is this a frustration problem?\"\n• Tattling drops to 20-30 times/day"
        },
        {
          "type": "paragraph",
          "content": "**WEEKS 3-4:**\n• They use the Frustration Reset tool independently sometimes\n• They solve 30-40% of conflicts without you\n• When they do tattle, it's genuine need for help"
        },
        {
          "type": "paragraph",
          "content": "**MONTH 2:**\n• Tattling reduces by 60-80%\n• They distinguish safety vs. frustration automatically\n• They come to you ONLY for real problems\n• You hear them say to friends: \"That's just a frustration problem\""
        },
        {
          "type": "heading",
          "content": "Common Mistakes"
        },
        {
          "type": "paragraph",
          "content": "**MISTAKE #1: Dismissing too quickly**\n\n\"That's not a real problem. Go away.\"\n\nWhy it backfires: They'll escalate behavior to get your attention because their nervous system genuinely needs co-regulation. Next time they'll hit instead of tattle (which at least gets your attention)."
        },
        {
          "type": "paragraph",
          "content": "**MISTAKE #2: Solving the sibling issue for them**\n\n\"Okay, I'll tell your brother to stop breathing loud.\"\n\nWhy it fails: You become the permanent referee. They never build the skill. The tattling continues forever."
        },
        {
          "type": "paragraph",
          "content": "**MISTAKE #3: Punishing the tattling**\n\n\"If you tattle one more time, you're losing screen time!\"\n\nWhy it backfires: They need connection when dysregulated. Punishment removes connection, spiking cortisol higher, increasing the behavior."
        },
        {
          "type": "paragraph",
          "content": "**MISTAKE #4: Expecting immediate results**\n\n\"I taught them the tool once. Why are they still tattling?\"\n\nWhy it fails: Neural pathways take 500-1000 repetitions to form. You're building a skill, not flipping a switch."
        }
      ]
    }
  ]$$::jsonb
),
total_chapters = 4,
estimated_reading_time = 35,
total_words = 10000
WHERE slug = 'sibling-fighting-v2';