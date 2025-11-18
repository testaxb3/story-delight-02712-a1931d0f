/*
 * ═══════════════════════════════════════════════════════════════════
 * TEMPLATE FOR HYPER-SPECIFIC INTENSE SCRIPTS
 * ═══════════════════════════════════════════════════════════════════
 * 
 * This is the REFERENCE TEMPLATE for creating new INTENSE scripts.
 * Follow this structure EXACTLY for consistency across all scripts.
 * 
 * BASED ON: "Bedtime resistance - won't stay in bed" (validated format)
 * 
 * ═══════════════════════════════════════════════════════════════════
 * FORMATTING RULES (CRITICAL):
 * ═══════════════════════════════════════════════════════════════════
 * 
 * ✓ Use **bold** for emphasis on key concepts
 * ✓ Separate paragraphs with \n\n (double newlines)
 * ✓ Use single \n within paragraphs for intentional line breaks
 * ✓ Use ❌ for "what doesn't work" items
 * ✓ Use → for explanations under mistakes
 * ✓ Use **Title:** format for subsection headers
 * ✓ Always have EXACTLY 3 strategy steps
 * ✓ Difficulty must be: "Easy", "Moderate", or "Hard"
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

INSERT INTO scripts (
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
  'TEMPLATE - [Specific situation with concrete trigger]',
  '[Category]', -- Options: Bedtime, Tantrums, Mealtime, Social, Morning Routines, etc.
  'INTENSE',
  3,  -- age_min
  9,  -- age_max
  'Moderate',  -- Options: "Easy", "Moderate", "Hard"
  30,  -- duration_minutes
  
  /*
   * THE SITUATION
   * Describe the exact scenario with vivid details
   */
  $$It's [time/context]. [Describe the setup]. Your INTENSE child [specific trigger action]. When [consequence], they **[emotional response]**: [specific behaviors].

The INTENSE child's brain is **[neurological explanation]**—once they [want/feel something], they will **[describe intensity]**. By [timeframe], you're [parent emotional state].$$,
  
  /*
   * WHAT DOESN'T WORK
   * List 3 common mistakes with explanations
   */
  $$❌ **First common mistake approach**
→ Explanation of why this backfires and what it teaches.

❌ **Second common mistake**
→ Explanation of the neurological reason this fails.

❌ **Third common mistake**
→ Explanation of the negative outcome.

**Why these backfire:** The INTENSE brain [summary statement about why traditional approaches fail].$$,
  
  /*
   * STRATEGY STEPS
   * EXACTLY 3 steps in JSON format
   * Each step must have: step_number, step_title, step_explanation, what_to_say_examples[]
   */
  $$[
    {
      "step_number": 1,
      "step_title": "[Action verb] [specific action]",
      "step_explanation": "[Opening explanation of what this step addresses].\n\n**Your move:** [Specific instruction for parents].\n\n**The shift:** [Explain the neurological/emotional impact this creates].",
      "what_to_say_examples": [
        "First example phrase to say",
        "Second example phrase to say"
      ]
    },
    {
      "step_number": 2,
      "step_title": "[Action verb] [specific action]",
      "step_explanation": "[Explanation of this step and its purpose].\n\n**Do NOT:** [Common mistake to avoid]. [Why this matters].\n\n**Important:** [Critical detail about timing/execution]. Your [parent action] **is** the intervention.",
      "what_to_say_examples": [
        "Example phrase for this step",
        "Alternative phrase for this step"
      ]
    },
    {
      "step_number": 3,
      "step_title": "[Action verb] [outcome focus]",
      "step_explanation": "The next [timeframe], **immediately** [action]. Even if [challenge occurred], if they **eventually** [success behavior], that's progress.\n\n**The [timing] message:** [Specific praise language to use].\n\n**Why it matters:** The INTENSE brain responds powerfully to **positive reinforcement**. You're teaching that **[desired behavior] = [positive outcome]**.",
      "what_to_say_examples": [
        "Positive reinforcement example",
        "Success celebration example"
      ]
    }
  ]$$::jsonb,
  
  /*
   * WHY THIS WORKS
   * Neurological explanation with clear paragraph breaks
   */
  $$**The INTENSE brain [core neurological challenge/behavior pattern].**

By **[step 1 benefit]** (step 1), you're [neurological impact]. By **[step 2 benefit]** (step 2), you're [what you're teaching/providing]. By **[step 3 benefit]** (step 3), you're [reinforcement explanation].

**The first [timeframe] will be brutal.** They'll [escalation pattern] before they [improvement]. But by [specific timeframe], most INTENSE kids [measurable improvement] because they've learned: **[key realization].**$$,
  
  /*
   * WHAT TO EXPECT
   * Timeline-based expectations in JSON format
   */
  $$
  {
    "first_5_minutes": "Describe immediate response. Use **bold** for key behaviors to watch for.",
    "by_10_minutes": "Describe mid-phase changes. Include expected challenges like the **extinction burst**.",
    "by_week_2": "Describe longer-term improvements. Be specific about measurable changes.",
    "dont_expect": [
      "Unrealistic expectation #1 — explain why this isn't realistic",
      "Unrealistic expectation #2 — provide context about INTENSE brains"
    ],
    "this_is_success": "Define success with **specific, observable metrics** that parents can track and celebrate."
  }
  $$::jsonb,
  
  /*
   * COMMON VARIATIONS
   * 4 typical scenarios with responses (JSON array format)
   */
  $$[
    {
      "variation_scenario": "First common variation or challenge",
      "variation_response": "**Action to take.** Specific guidance with exact language if applicable."
    },
    {
      "variation_scenario": "Second common variation",
      "variation_response": "**How to handle it.** Clear instruction that addresses the specific challenge."
    },
    {
      "variation_scenario": "Third common variation (often parent emotional state)",
      "variation_response": "**Encouragement or perspective shift.** Help parent stay consistent."
    },
    {
      "variation_scenario": "Fourth common variation (edge case)",
      "variation_response": "**Specific adaptation.** How to adjust the strategy for this scenario."
    }
  ]$$::jsonb,
  
  /*
   * PARENT STATE NEEDED
   * Emotional state/mindset required for success
   */
  'Calm, [quality], [quality]. You must be **[key attitude]**—not [negative states], just **[positive quality]**. The INTENSE child needs to feel your [what they need from you].',
  
  /*
   * TAGS
   * Searchable keywords for this script
   */
  ARRAY['primary-category', 'intense', 'specific-behavior', 'key-concept', 'context'],
  
  /*
   * EMERGENCY SUITABLE
   * Is this quick enough for crisis situations?
   */
  false  -- Usually false for complex 3-step scripts
);

/*
 * ═══════════════════════════════════════════════════════════════════
 * REFERENCE EXAMPLE: Bedtime resistance script (d619a979-e495-4880-96d1-721d734c20c8)
 * ═══════════════════════════════════════════════════════════════════
 * This is a validated, working example following the template above.
 * Use it as reference when creating new scripts.
 */
