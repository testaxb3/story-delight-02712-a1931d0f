/*
=============================================================================
HYPER-SPECIFIC SCRIPT TEMPLATE V2
=============================================================================

⚠️ CRITICAL: This is NOT a fill-in-the-blank template!
This is a STRUCTURE GUIDE with QUALITY FRAMEWORK integration.

BEFORE writing ANY script:
1. Read .claude/SCRIPT_QUALITY_FRAMEWORK.md COMPLETELY
2. Complete Pre-Creation Checklist (Micro-Observation, Uniqueness, Recognition tests)
3. Choose 1 of 5 THE SITUATION structures (rotate, don't repeat recent scripts)
4. Check FORBIDDEN PATTERNS list — if ANY appear in your draft, rewrite completely
5. Run Quality Scoring System — must score 8+/10 on ALL 5 dimensions

=============================================================================
FORMATTING RULES
=============================================================================

1. **Bold text**: Wrap in double asterisks (**text**)
2. **Line breaks**: Use \n for single line break, \n\n for paragraph break
3. **Headers**: Use "### Header Text" for section headers
4. **Bullets**: Start line with "• " (bullet + space)
5. **Arrows**: Use "→" for explanations/consequences
6. **Cross marks**: Use "❌" for mistakes/what doesn't work
7. **Numbers**: Use "1.", "2.", "3." for numbered lists (JSONB array for strategy_steps)

=============================================================================
SCRIPT STRUCTURE
=============================================================================
*/

INSERT INTO scripts (
  -- CORE IDENTIFICATION
  title,                    -- Hyper-specific moment: "Opens tablet 'just to check one thing' - emerges 2 hours later"
                           -- NOT generic: "Screen time issues"
  category,                -- Exact category: "Screens", "Bedtime", "Tantrums", etc.
  profile,                 -- Brain profile: "INTENSE", "DISTRACTED", "DEFIANT", "UNIVERSAL"
  
  -- AGE TARGETING
  age_min,                 -- Minimum age (years)
  age_max,                 -- Maximum age (years)
  
  -- DIFFICULTY & DURATION
  difficulty_level,        -- "beginner", "intermediate", "advanced"
  duration_minutes,        -- Estimated time to execute (realistic)
  
  -- THE SITUATION (The Moment Itself)
  -- ⚠️ CRITICAL: Choose 1 of 5 structures from SCRIPT_QUALITY_FRAMEWORK.md
  -- ROTATE structures across scripts — don't repeat recent patterns!
  -- MUST include:
  --   • 6+ observable micro-details
  --   • Exact numbers/timings
  --   • Quoted phrases (what child ACTUALLY says)
  --   • Parent emotional/physical state
  --   • Environmental context
  the_situation,
  /* STRUCTURE OPTIONS (rotate these):
  
  1. SCENE-BASED (Cinematic):
  "It's 7:14 AM. You've asked them to brush teeth 4 times. 
  They're still in pajamas, staring at the wall, humming.
  You have to leave in 6 minutes.\n\nYour chest tightens. Here we go again."
  
  2. SENSORY-FIRST:
  "You hear the sound before you see it: the low rumbling growl 
  that means they're about to explode. Their fists are clenched. 
  Their breathing is fast and shallow through their nose.\n\nYou freeze. 
  Do you intervene now or wait?"
  
  3. TIMELINE EXPLOSION:
  "What should take 3 minutes takes 45. Here's what happens:\n\n
  • Minute 1-5: They agree to start.\n
  • Minute 6-15: They \"need\" to find the perfect socks.\n
  • Minute 16-30: Meltdown about sock seam.\n
  • Minute 31-45: You're doing it for them while they cry."
  
  4. PARENT POV:
  "You're already running late. You grab the shoes. Then you see their face — 
  that blank, distant stare. They haven't moved. They didn't hear a word you said.\n\n
  Your jaw clenches. Your phone buzzes (boss texting). You're 15 minutes late already."
  
  5. CHILD POV:
  "From their perspective, everything was fine. They were building the perfect Lego tower.
  Then YOU ruined it by demanding they \"come eat\" RIGHT NOW.\n\n
  The tower will NEVER be this good again. They're not being difficult — you destroyed their world."
  */
  
  -- WHAT DOESN'T WORK (Common Mistakes)
  -- ⚠️ CRITICAL: Choose 1 of 3 structures from SCRIPT_QUALITY_FRAMEWORK.md
  -- Explain WHY these approaches backfire (neuroscience, not just "it's bad")
  what_doesnt_work,
  /* STRUCTURE OPTIONS (rotate these):
  
  1. COMMON MISTAKES + NEUROSCIENCE:
  "❌ \"Just eat faster! We don't have all day!\"\n
  → Why this backfires: The ADHD brain can't process time pressure when hyperfocused on texture, 
  taste, and sensory input. Your urgency makes their nervous system lock up harder.\n\n
  ❌ \"If you don't finish in 10 minutes, no dessert!\"\n
  → Why this backfires: Threats activate the amygdala, which shuts down the prefrontal cortex 
  needed to speed up. Now they're anxious AND slow."
  
  2. PARENT CONFESSION FORMAT:
  "Most parents start with reminders: \"5 more minutes!\" \n
  When that doesn't work, they escalate: \"I SAID NOW!\"\n
  When that doesn't work, they physically remove the device.\n\n
  Now you have a screaming child, a broken routine, and the creeping feeling that you're the bad guy. 
  This approach fails because it treats screen time like a negotiation instead of a neurological event."
  
  3. ESCALATION SEQUENCE:
  "First you try: Calm voice, logical explanation.\n
  That fails, so you try: Louder voice, consequence warning.\n
  That fails, so you try: Removing privileges, time-outs.\n\n
  Now it's worse because: Each escalation activates their defiance reflex. 
  They're not hearing your words anymore — they're in pure opposition mode."
  */
  
  -- STRATEGY STEPS (The 3-Step Framework)
  -- ⚠️ CRITICAL: Stored as JSONB array with specific structure
  -- VARY the language — don't always use "Your move:", "The shift:", etc.
  strategy_steps,
  /* STRUCTURE (JSONB array):
  [
    {
      "step_number": 1,
      "step_title": "Step 1: [Concise Action Title]",
      "step_explanation": "**Why you're doing this:** [Explanation with neuroscience/psychology]\n\n**How to execute:**\n• [Specific instruction 1]\n• [Specific instruction 2]\n• [Specific instruction 3]",
      "what_to_say_examples": [
        "\"[Exact phrase example 1]\"",
        "\"[Exact phrase example 2]\"",
        "\"[Exact phrase example 3]\""
      ]
    },
    {
      "step_number": 2,
      "step_title": "Step 2: [Concise Action Title]",
      "step_explanation": "[Same structure as Step 1]",
      "what_to_say_examples": ["[phrases]"]
    },
    {
      "step_number": 3,
      "step_title": "Step 3: [Concise Action Title]",
      "step_explanation": "[Same structure as Step 1]",
      "what_to_say_examples": ["[phrases]"]
    }
  ]
  
  ⚠️ LANGUAGE VARIATION (rotate these across scripts):
  - Instead of "Your move:", try: "Here's what you do:", "Do this:", "The action:"
  - Instead of "The shift:", try: "Why this works:", "The change:", "What's happening:"
  - Instead of "Do NOT:", try: "Avoid:", "Don't:", "Never:", "Skip:"
  */
  
  -- WHY THIS WORKS (Neuroscience Explanation)
  -- Explain the neurobiological/psychological mechanism
  -- Use metaphors and analogies, not just clinical terms
  -- Keep it specific to THIS script, not generic brain science
  why_this_works,
  /* EXAMPLE:
  "**Dopamine Crash Management**\n\n
  Screen time floods the brain with dopamine. When it stops, there's a crash — 
  like jumping off a moving train. The DISTRACTED brain can't regulate this crash alone.\n\n
  **External Regulation Works**\n\n
  By creating physical boundaries (timer visible, parent present) you're giving their 
  brain external structure it can't create internally. It's not about willpower — 
  it's about scaffolding.\n\n
  **Why Immediate Consequences Matter**\n\n
  Time blindness means \"in 5 minutes\" = \"never\" to their brain. The consequence 
  must happen NOW (tablet goes away NOW) for the lesson to stick."
  */
  
  -- WHAT TO EXPECT (Timeline + Realistic Outcomes + Success Definition)
  -- ⚠️ CRITICAL: Stored as JSONB object with "first_30_seconds", "by_2_minutes", "this_is_success", "dont_expect"
  what_to_expect,
  /* STRUCTURE (JSONB object):
  {
    "first_30_seconds": "[What happens on first attempt - be realistic, not optimistic]",
    "by_2_minutes": "[What happens after consistent use - measurable improvement]",
    "this_is_success": "[REQUIRED - The breakthrough moment parents should celebrate. What does success actually look like?]",
    "dont_expect": [
      "[Unrealistic expectation 1]",
      "[Unrealistic expectation 2]",
      "[Unrealistic expectation 3]"
    ]
  }
  
  EXAMPLE:
  {
    "first_30_seconds": "They'll test the boundary. Expect negotiation: \"Just ONE more minute!\" or \"The timer is broken!\" They might cry, argue, or go limp. This is normal — their brain is learning a new pattern.",
    "by_2_minutes": "By day 5-7, they'll start pre-regulating. You'll see them glance at the timer without prompting. Tantrums get shorter (from 15 minutes to 5 minutes). They might even hand you the tablet before the timer beeps (rare but possible).",
    "this_is_success": "Your child puts down the tablet BEFORE the timer goes off and says: \"I''m done.\" That''s the breakthrough. Even if it takes 2 weeks to get there, that moment is the win.",
    "dont_expect": [
      "That they'll happily turn off screens without any resistance",
      "That they'll internalize time management after a few tries",
      "That this will work perfectly if you only do it occasionally"
    ]
  }
  */
  
  -- COMMON VARIATIONS (Scenario + Response Pairs)
  -- ⚠️ CRITICAL: Stored as JSONB array with "variation_scenario" and "variation_response"
  common_variations,
  /* STRUCTURE (JSONB array):
  [
    {
      "variation_scenario": "[Specific situation that might arise]",
      "variation_response": "[Exact words to say + action to take]"
    },
    {
      "variation_scenario": "[Another specific situation]",
      "variation_response": "[Exact words to say + action to take]"
    },
    {
      "variation_scenario": "[Another specific situation]",
      "variation_response": "[Exact words to say + action to take]"
    },
    {
      "variation_scenario": "[Another specific situation]",
      "variation_response": "[Exact words to say + action to take]"
    }
  ]
  
  EXAMPLE:
  [
    {
      "variation_scenario": "\"The timer didn't beep!\" (it did, they didn't notice)",
      "variation_response": "\"I heard it beep, and I was right here. The screen goes off now. We can check the timer together if you want — see, it says 0:00.\" (Show evidence, stay neutral, don't argue.)"
    },
    {
      "variation_scenario": "\"Just let me save my game first!\" (stalling tactic)",
      "variation_response": "\"You have 10 seconds to tap save. I'm counting. 10... 9... 8...\" (Give them agency within a tight boundary.)"
    },
    {
      "variation_scenario": "Mid-tantrum: throws the tablet, screams \"I hate you!\"",
      "variation_response": "\"I know you're upset. The rule doesn't change. When you're calm, we'll talk about what to do next time so this feels easier.\" (Don't engage mid-meltdown; address it after regulation.)"
    }
  ]
  */
  
  -- PARENT STATE NEEDED (Emotional/Mental Preparation)
  -- What mindset/energy level does the parent need to execute this?
  -- Be honest about the difficulty
  parent_state_needed,
  /* EXAMPLE:
  "**Energy Level Required:** Medium-High\n\n
  You need to be physically present and mentally committed. This isn't a strategy 
  you can half-ass while cooking dinner and answering work emails.\n\n
  **Emotional State Needed:**\n
  • Calm but firm (not anxious, not angry)\n
  • Prepared for resistance (they WILL test this)\n
  • Willing to follow through (if you give in once, the whole system collapses)\n\n
  **Best Time to Try:**\n
  • When you're NOT already late for something\n
  • When you have 20 minutes of buffer time\n
  • When you're rested enough to stay consistent\n\n
  **Don't Try This When:**\n
  • You're exhausted and need them occupied for 10 more minutes\n
  • You're in public and can't handle a meltdown\n
  • You're already in a fight about something else"
  */
  
  -- SEARCHABLE TAGS
  tags,
  /* ARRAY of relevant search terms:
  ARRAY['screen time', 'tablets', 'youtube', 'hyperfocus', 'transitions', 'dopamine crash', 'time blindness']
  
  Include:
  - Specific behaviors (e.g., 'meltdown', 'ignoring', 'negotiating')
  - Brain-related terms (e.g., 'adhd', 'executive function', 'sensory')
  - Location/context (e.g., 'public', 'morning', 'bedtime')
  - Emotions (e.g., 'rage', 'anxiety', 'shutdown')
  */
  
  -- EMERGENCY SUITABILITY
  emergency_suitable
  /* BOOLEAN: Can this be used in crisis/meltdown situations?
  
  TRUE if:
  - Script works during active meltdown
  - Can be executed quickly (under 5 minutes)
  - Doesn't require preparation or props
  
  FALSE if:
  - Requires calm baseline state
  - Needs pre-planning or setup
  - Takes longer than 10 minutes to execute
  */
  
) VALUES (
  -- Fill in actual values here following the structure above
  -- Remember: QUALITY OVER SPEED
  -- If it doesn't pass the Framework tests, don't submit it
);

/*
=============================================================================
QUALITY CHECKLIST (Run Before Submitting)
=============================================================================

PRE-CREATION:
☐ Completed Micro-Observation Test (can visualize the scene?)
☐ Completed Uniqueness Test (80%+ different from other scripts in category?)
☐ Completed Recognition Test (would parent say "THIS IS MY LIFE"?)

CONTENT REQUIREMENTS:
☐ Included 6+ observable micro-details
☐ Included exact numbers/timings
☐ Included quoted phrases (what child actually says)
☐ Described parent emotional/physical state
☐ Included environmental context
☐ Chose 1 of 5 THE SITUATION structures (rotated from recent scripts)
☐ Varied WHAT DOESN'T WORK structure
☐ Varied strategy step language (not always "Your move:")

QUALITY CHECKS:
☐ Checked FORBIDDEN PATTERNS list (ZERO matches)
☐ Ran Quality Scoring System (8+/10 on all 5 dimensions)
☐ Compared to 3 existing scripts in category (80%+ different)
☐ Read it out loud (sounds natural and human?)

JSON STRUCTURE:
☐ strategy_steps uses correct field names (step_number, step_title, step_explanation, what_to_say_examples)
☐ what_to_expect uses correct field names (first_time, after_week, dont_expect as array)
☐ common_variations uses correct field names (variation_scenario, variation_response)
☐ All JSONB is valid (no syntax errors)

IF ANY CHECKBOX IS UNCHECKED → DO NOT SUBMIT. REWRITE COMPLETELY.

=============================================================================
FORBIDDEN PATTERNS (Immediately Rewrite If Found)
=============================================================================

❌ "You tell your child [X]. They [Y]. You check back..."
❌ "Your child is deep into [activity]. You say [warning]. They nod and say 'okay!'"
❌ "This isn't defiance. This is [neurological explanation]."
❌ "By [step X], you're [teaching/providing/creating]..."
❌ "The [brain profile] brain [generic statement]..."
❌ "Here's what's really happening: [neuroscience]..."
❌ "Your child isn't trying to [negative]. They're [positive reframe]."
❌ Starting with "It's [time]. You've [asked/told/tried] [X times]..."
❌ "What looks like [behavior] is actually [deeper reason]."
❌ Using "co-regulation", "nervous system", "dysregulation" more than once

=============================================================================
REFERENCE: Validated Example
=============================================================================

For a complete example of a high-quality hyper-specific script that passes
all framework requirements, see:

Title: "Opens tablet 'just to check one thing' - emerges 2 hours later"
Category: Screens
Profile: DISTRACTED

This script demonstrates:
✅ Specific observable behaviors (algorithmic capture, time blindness)
✅ Exact timing (opens for "one thing", emerges 2 hours later)
✅ Realistic parent frustration (homework due, dinner needs cooking)
✅ Quoted phrases ("Just ONE thing!", "I PROMISE!")
✅ Unique structure (not template-filled)
✅ Natural language (sounds like real parent advice)
✅ Proper JSON formatting in all fields

Query to view it:
SELECT * FROM scripts WHERE title = 'Opens tablet ''just to check one thing'' - emerges 2 hours later';

=============================================================================
*/
