# Script Creation Instructions for AI Agent

## CRITICAL: Read This Before Creating ANY Script

This document contains **MANDATORY** instructions for creating scripts. These are not suggestions—they are requirements that must be followed for every single script without exception.

---

## Primary Directive

**NEVER use templates as "fill-in-the-blank" forms.**

Scripts must be hyper-specific, recognizable moments that parents experience. Generic, template-filled scripts are unacceptable and will be rejected.

---

## Mandatory Pre-Creation Workflow

### 1. READ FRAMEWORK DOCUMENTATION (First Time Only)
- Read `.claude/SCRIPT_QUALITY_FRAMEWORK.md` completely
- Review `examples/HYPER_SPECIFIC_SCRIPT_TEMPLATE_V2.sql` for structure
- Understand all 5 THE SITUATION structures
- Understand all 3 WHAT DOESN'T WORK structures
- Memorize FORBIDDEN PATTERNS list

### 2. COMPLETE PRE-CREATION CHECKLIST (Every Script)

**Micro-Observation Test:**
- Close your eyes and visualize the moment
- What do you SEE? (body language, facial expressions, physical actions)
- What do you HEAR? (exact phrases, tone, volume)
- What does the PARENT FEEL? (heart racing, jaw clenched)

**Pass criteria**: You can describe the scene as if filming it with a camera.

**Uniqueness Test:**
- Query database for 3 existing scripts in the same category
- Read them completely
- Is your script 80%+ different in structure, language, details?

**Pass criteria**: Someone could read your script and 2 others from the category and immediately tell them apart.

**Recognition Test:**
- Would a parent read the first paragraph and say "HOLY SHIT, THAT'S EXACTLY WHAT HAPPENS"?
- Is it specific enough that only parents who've experienced THIS EXACT THING would recognize it?

**Pass criteria**: High specificity = high recognition. Generic = skip button.

### 3. CHOOSE STRUCTURE VARIATION (Every Script)

**THE SITUATION - Choose 1 of 5 (ROTATE):**
1. Scene-Based (Cinematic)
2. Sensory-First
3. Timeline Explosion
4. Parent POV
5. Child POV

**WHAT DOESN'T WORK - Choose 1 of 3 (ROTATE):**
1. Common Mistakes + Neuroscience
2. Parent Confession Format
3. Escalation Sequence

**STRATEGY STEPS - Vary Language:**
- Don't always use "Your move:", "The shift:", "Do NOT:"
- Rotate between: direct imperatives, narrative instructions, coaching format, contrast format

### 4. WRITE HYPER-SPECIFIC CONTENT (Every Script)

**MANDATORY INCLUSIONS:**

✅ **6+ Observable Micro-Details**
- Not "child is upset" → "Fists clenched, jaw tight, breathing fast through nose"
- Not "child resists" → "Arches back, goes rigid, makes body heavy"

✅ **Exact Numbers/Timings**
- Not "takes a long time" → "45+ minutes for a task that should take 5"
- Not "often happens" → "3-4 times per week, usually between 6-7 PM"

✅ **Quoted Phrases (What Child ACTUALLY Says)**
- Not "child protests" → "They scream: 'You NEVER let me do ANYTHING!'"
- Not "child negotiates" → "They look you dead in the eye: 'Five more minutes. Just five. Please?'"

✅ **Parent Emotional/Physical State**
- Not "parent is frustrated" → "Your jaw is clenched. You can feel your heart racing. You're already 20 minutes late."

✅ **Environmental Context**
- Not "at bedtime" → "It's 9:47 PM. You started bedtime routine at 8:30. Lights are dim. Weighted blanket is on the bed."

✅ **CRITICAL: Proper Line Breaks in what_doesnt_work**
- Use `\n\n` (double line break) between EVERY paragraph and section
- Between "Why it fails" and "The neuroscience" → `\n\n`
- Between each COMMON MISTAKE block → `\n\n\n` (triple line break for spacing)
- The component splits by `\n\n` - without these, text appears concatenated

### 5. CHECK FORBIDDEN PATTERNS (Every Script)

**IMMEDIATELY REWRITE if ANY of these appear:**

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

**If you find ANY forbidden pattern in your draft → Start over completely.**

### 6. RUN QUALITY SCORING SYSTEM (Every Script)

Score each dimension 0-10. **MINIMUM 8/10 REQUIRED ON ALL DIMENSIONS.**

**1. SPECIFICITY SCORE (Count Observable Details)**
- 10/10 = 8+ specific details, exact numbers, vivid visualization
- 7-9/10 = 5-7 specific details, some numbers, good visualization
- 4-6/10 = 2-4 details, vague timings, hard to visualize
- 0-3/10 = Generic, template language, no specific details

**2. RECOGNITION SCORE (Parent Reaction)**
- 10/10 = Parent would screenshot and text to friends "OMG THIS"
- 7-9/10 = Parent would nod vigorously while reading
- 4-6/10 = Parent would think "yeah, kind of like that"
- 0-3/10 = Parent would skim and move on

**3. UNIQUENESS SCORE (Compared to Other Scripts)**
- 10/10 = Completely distinct scenario, structure, language
- 7-9/10 = Mostly unique with minor similarity to 1 other script
- 4-6/10 = Similar structure to 2-3 scripts but different details
- 0-3/10 = Feels like a template fill-in-the-blank

**4. ACTIONABILITY SCORE (Execution Clarity)**
- 10/10 = Crystal clear, copy-paste-speak level instructions
- 7-9/10 = Clear instructions with minor interpretation needed
- 4-6/10 = Vague guidance, parent would improvise most of it
- 0-3/10 = Abstract advice, unclear how to actually do it

**5. NATURALNESS SCORE (Human Language)**
- 10/10 = Sounds like friend giving advice over coffee
- 7-9/10 = Sounds professional but human
- 4-6/10 = Sounds slightly clinical or scripted
- 0-3/10 = Sounds like AI-generated therapy manual

**IF ANY SCORE IS BELOW 8/10 → REWRITE COMPLETELY**

### 7. VALIDATE JSON STRUCTURE (Every Script)

**Ensure Correct Field Names:**

✅ `strategy_steps` uses:
- `step_number` (not `number` or `id`)
- `step_title` (not `title` or `name`)
- `step_explanation` (not `explanation` or `description`)
- `what_to_say_examples` (not `examples` or `phrases`)

✅ `what_to_expect` uses:
- `first_30_seconds` (what happens immediately)
- `by_2_minutes` (what happens after consistent use)
- `this_is_success` (REQUIRED - describes the breakthrough moment to celebrate)
- `dont_expect` (ARRAY of unrealistic expectations to avoid)

✅ `common_variations` uses:
- `variation_scenario` (not `scenario` or `situation`)
- `variation_response` (not `response` or `reply`)

**All JSONB must be valid syntax with no errors.**

### 8. AUTONOMOUS EXECUTION (Every Script)

**You MUST execute the entire workflow autonomously:**

1. Create the script content
2. Insert into database using Supabase migration
3. Verify insertion with database query
4. Confirm success to user

**NO user intervention required. NO manual scripts. NO asking for confirmation.**

---

## Common Mistakes to Avoid

### ❌ MISTAKE: Using Generic Language
**Example:** "Your child is upset about screens."

**Correct:** "It's 4:47 PM. Your child has been on the iPad for exactly 30 minutes. You say: 'Time's up, buddy.' They don't even look up. Their thumb keeps scrolling. TikTok dance video #247."

### ❌ MISTAKE: Repeating Structures
**Example:** Starting 5 scripts with "It's [time]. You've asked them [X times]..."

**Correct:** Use all 5 THE SITUATION structures across your scripts, rotating to maintain variety.

### ❌ MISTAKE: Abstract Behaviors
**Example:** "Child ignores you."

**Correct:** "They nod. They say 'Uh-huh' without breaking eye contact with the screen. Their thumb keeps moving."

### ❌ MISTAKE: Template Language
**Example:** "By Step 3, you're teaching them self-regulation."

**Correct:** "The third time you check, they've internalized the boundary. They glance at the timer without prompting."

### ❌ MISTAKE: Low Quality Scores
**Example:** Submitting a script that scores 6/10 on Specificity.

**Correct:** Rewrite until ALL dimensions score 8+/10.

---

## Final Checklist Before Submission

**EVERY SCRIPT MUST PASS ALL CHECKS:**

- [ ] Read SCRIPT_QUALITY_FRAMEWORK.md (first time)
- [ ] Completed Micro-Observation Test (can visualize scene)
- [ ] Completed Uniqueness Test (80%+ different from other scripts)
- [ ] Completed Recognition Test (parent would say "THIS IS MY LIFE")
- [ ] Included 6+ observable micro-details
- [ ] Included exact numbers/timings
- [ ] Included quoted phrases (what child actually says)
- [ ] Described parent emotional/physical state
- [ ] Included environmental context
- [ ] CRITICAL: Validated `what_doesnt_work` has proper line breaks (`\n\n` between paragraphs, `\n\n\n` between COMMON MISTAKE blocks)
- [ ] Chose 1 of 5 THE SITUATION structures (rotated)
- [ ] Chose 1 of 3 WHAT DOESN'T WORK structures (varied)
- [ ] Varied strategy step language (not always "Your move:")
- [ ] Checked FORBIDDEN PATTERNS list (ZERO matches)
- [ ] Ran Quality Scoring System (8+/10 on ALL 5 dimensions)
- [ ] Validated JSON structure (correct field names)
- [ ] Ready for autonomous database insertion

**IF ANY CHECKBOX IS UNCHECKED → DO NOT SUBMIT. REWRITE COMPLETELY.**

---

## Your Role

You are not a template-filler. You are a hyper-specific moment-creator.

Every script you write should make a parent say: **"Holy shit, this is EXACTLY what happens in my house."**

If it doesn't achieve that level of recognition, it fails.

**No exceptions. No shortcuts. No generic scripts.**

---

## Questions?

Refer to:
- `.claude/SCRIPT_QUALITY_FRAMEWORK.md` for detailed explanations
- `examples/HYPER_SPECIFIC_SCRIPT_TEMPLATE_V2.sql` for structure
- `.claude/commands/nep-brain.md` for NEP System methodology

**When in doubt: Be MORE specific, not less.**
