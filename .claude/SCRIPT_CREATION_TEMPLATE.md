# NEP Script Creation Template

## Purpose
This template ensures all NEP scripts follow the proven 3-phrase framework and include rich context for intelligent recommendations.

## CRITICAL FRAMEWORK RULES

### 1️⃣ CONNECTION (5-10 words max)
**Purpose:** Acknowledge what you see without judgment
**Tone:** Calm, curious (NOT sarcastic or annoyed)
**Neuroscience:** Signals safety to amygdala

**Structure:**
```
"I see you're [observation]..."
"I notice [what's happening]..."
"Looks like [situation]..."
```

**Examples:**
- ✅ "I see you're upset about leaving..."
- ✅ "I notice you don't want those shoes..."
- ❌ "Why are you acting like this?" (question = engages argument brain)
- ❌ "Stop crying right now" (command, not connection)

### 2️⃣ VALIDATION (15-20 words)
**Purpose:** Empathy + reality check in one phrase
**Structure:** "It's hard to [challenge], AND [reality]..."
**Tone:** Firm but empathetic (confident parent, NOT pleading)

**CRITICAL:** Must use "AND" not "BUT" (but = negates validation)

**Examples:**
- ✅ "It's hard to stop playing when you're having fun, AND we're leaving now..."
- ✅ "It's hard to eat something new, AND this is what we're having..."
- ❌ "I know you're upset BUT you need to stop" (but negates validation)
- ❌ "I understand you're frustrated, however..." (too formal, sounds fake)

### 3️⃣ COMMAND (10-15 words)
**Purpose:** Give control through choice/challenge
**Tone:** Confident, playful challenge (NOT asking permission)
**Neuroscience:** Autonomy lowers resistance, competition activates motivation

**Structure:**
```
"[Choice A] or [Choice B]. You pick."
"You're in charge of [thing]. Can you beat the timer?"
"Let's see who wins - you or [challenge]!"
```

**Examples:**
- ✅ "Walking feet or carrying feet. You pick. I'm counting to 3."
- ✅ "You're in charge of your shoes. Beat the timer?"
- ❌ "Can you please put your shoes on for mommy?" (asking permission = weak)
- ❌ "If you don't get in the car, no tablet tonight" (empty threat = teaches not to trust)

---

## FULL SCRIPT TEMPLATE

```sql
INSERT INTO scripts (
  -- Core content
  title,
  category,
  wrong_way,
  phrase_1,
  phrase_1_action,
  phrase_2,
  phrase_2_action,
  phrase_3,
  phrase_3_action,
  neurological_tip,
  profile,
  tags,

  -- Enhanced context fields
  situation_trigger,
  location_type,
  time_optimal,
  intensity_level,
  success_speed,
  parent_state,
  age_min,
  age_max,
  backup_plan,
  common_mistakes,
  pause_after_phrase_1,
  pause_after_phrase_2,
  expected_time_seconds,
  difficulty_level,
  requires_preparation,
  works_in_public,
  emergency_suitable
) VALUES (
  -- TITLE: Clear, specific to situation
  'Car Seat Cooperation',

  -- CATEGORY: One of: Bedtime, Screens, Mealtime, Transitions, Tantrums, Morning_Routines, Social, Hygiene, Emotional_Regulation, Cooperation, Chores, Connection, Problem_Solving, Evening_Routine
  'Transitions',

  -- WRONG WAY: What stressed parents ACTUALLY say (not movie parent)
  '"Get in the car seat NOW! We are SO late and you''re making this worse!"',

  -- PHRASE 1 (CONNECTION): 5-10 words, calm observation
  'I see you don''t want to get in...',

  -- PHRASE 1 ACTION: Physical thing parent does
  'Kneel to eye level, block distractions, calm voice.',

  -- PHRASE 2 (VALIDATION): 15-20 words with "It's hard... AND..."
  'It''s hard to stop playing when you''re having fun, AND our time is up...',

  -- PHRASE 2 ACTION: Physical thing parent does
  'Stand up, offer hand OR gesture to car seat.',

  -- PHRASE 3 (COMMAND): 10-15 words, choice/challenge, confident
  'Walking feet or carrying feet. You pick. I''m counting to 3.',

  -- PHRASE 3 ACTION: Physical thing parent does
  'Start walking slowly. If no movement by 3, pick up calmly and carry.',

  -- NEUROLOGICAL TIP: Why this works (1-2 sentences, practical not academic)
  'Short phrases = stressed parent brain can remember. Pause = gives their amygdala 3 seconds to process before escalating. Two clear choices = autonomy without negotiation. Your calm body = co-regulation even if they''re screaming.',

  -- PROFILE: 'INTENSE', 'DISTRACTED', 'DEFIANT', or NULL for universal
  'DEFIANT',

  -- TAGS: Array of searchable keywords
  ARRAY['car seat', 'transition', 'leaving', 'cooperation', 'public'],

  -- ===== ENHANCED CONTEXT FIELDS =====

  -- SITUATION_TRIGGER: Clear description of WHEN to use (parent language, not formal)
  'When child refuses to get in car seat and you''re already running late',

  -- LOCATION_TYPE: Where this works - Array[]
  ARRAY['public', 'car', 'parking lot'],

  -- TIME_OPTIMAL: When it works best - Array[]
  ARRAY['morning', 'anytime'],

  -- INTENSITY_LEVEL: 'mild', 'moderate', 'severe'
  'moderate',

  -- SUCCESS_SPEED: How fast it works
  '1min',

  -- PARENT_STATE: Parent emotional states this works for - Array[]
  ARRAY['frustrated', 'rushed', 'embarrassed'],

  -- AGE_MIN / AGE_MAX: Recommended ages
  3,
  8,

  -- BACKUP_PLAN: Simple action if script doesn't work (ONE sentence, ONE action)
  'Pick up calmly and carry to car. Say NOTHING (they want reaction). In car: "That was hard. Next time you can try walking feet."',

  -- COMMON_MISTAKES: What parents do WRONG in this situation - Array[]
  ARRAY[
    'Explaining WHY you have to leave (engages argument brain)',
    'Threatening "no tablet tonight" while still standing there (empty threat)',
    'Looking at other people apologetically (teaches: meltdown = I win attention)'
  ],

  -- PAUSE_AFTER_PHRASE_1: Seconds (default 3)
  3,

  -- PAUSE_AFTER_PHRASE_2: Seconds (default 2)
  2,

  -- EXPECTED_TIME_SECONDS: Total expected time for cooperation
  60,

  -- DIFFICULTY_LEVEL: 'beginner', 'intermediate', 'advanced'
  'beginner',

  -- REQUIRES_PREPARATION: Does it need advance setup?
  false,

  -- WORKS_IN_PUBLIC: Suitable for public situations?
  true,

  -- EMERGENCY_SUITABLE: Auto-calculated, but can override
  -- Script is emergency suitable if: expected_time <= 60s, works when frustrated, no prep needed
  true
);
```

---

## FIELD DEFINITIONS

### Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | TEXT | Yes | Clear, specific name (e.g., "Car Seat Cooperation" not "Cooperation") |
| `category` | TEXT | Yes | One of predefined categories (see above) |
| `wrong_way` | TEXT | Yes | What stressed parents ACTUALLY say (quote format) |
| `phrase_1` | TEXT | Yes | CONNECTION phrase (5-10 words) |
| `phrase_1_action` | TEXT | Yes | Physical action parent takes |
| `phrase_2` | TEXT | Yes | VALIDATION phrase (15-20 words with "AND") |
| `phrase_2_action` | TEXT | Yes | Physical action parent takes |
| `phrase_3` | TEXT | Yes | COMMAND phrase (10-15 words) |
| `phrase_3_action` | TEXT | Yes | Physical action parent takes |
| `neurological_tip` | TEXT | Yes | Why it works (practical, 1-2 sentences) |
| `profile` | TEXT | Yes | 'INTENSE', 'DISTRACTED', 'DEFIANT', or NULL |
| `tags` | TEXT[] | Optional | Searchable keywords |
| `estimated_time_minutes` | INTEGER | Optional | Total duration estimate |

### Enhanced Context Fields

| Field | Type | Description | Example Values |
|-------|------|-------------|----------------|
| `situation_trigger` | TEXT | WHEN to use (parent language) | "When child refuses to get in car seat and you're already late" |
| `location_type` | TEXT[] | WHERE it works | `['home', 'public', 'car', 'school']` |
| `time_optimal` | TEXT[] | WHEN it works best | `['morning', 'afternoon', 'evening', 'anytime']` |
| `intensity_level` | TEXT | Meltdown severity | 'mild', 'moderate', 'severe' |
| `success_speed` | TEXT | How fast it works | '30sec', '1min', '2min', '5min' |
| `parent_state` | TEXT[] | Parent emotional states | `['calm', 'frustrated', 'exhausted', 'rushed', 'embarrassed']` |
| `age_min` | INTEGER | Minimum age | 3 |
| `age_max` | INTEGER | Maximum age | 10 |
| `backup_plan` | TEXT | What to do if doesn't work | "Pick up and carry to car. Say nothing..." |
| `common_mistakes` | TEXT[] | What parents do WRONG | `['Explaining why...', 'Threatening...']` |
| `pause_after_phrase_1` | INTEGER | Pause seconds | 3 (default) |
| `pause_after_phrase_2` | INTEGER | Pause seconds | 2 (default) |
| `expected_time_seconds` | INTEGER | Expected cooperation time | 15-60 seconds |
| `difficulty_level` | TEXT | Parent skill needed | 'beginner', 'intermediate', 'advanced' |
| `requires_preparation` | BOOLEAN | Needs advance setup? | true/false |
| `works_in_public` | BOOLEAN | Suitable for public? | true/false |
| `emergency_suitable` | BOOLEAN | Works in crisis? | true/false |

---

## BRAIN TYPE VARIATIONS

### INTENSE (Emotional Regulation, Sensory)
**Characteristics:** Big emotions, sensory sensitive, needs co-regulation
**Script adjustments:**
- Extra validation time (feelings are REAL and BIG)
- Sensory options in command ("squeeze or space?")
- Physical touch if they allow it
- Lower voice, slower movement

**Example:**
```
CONNECTION: "I see those big feelings..."
VALIDATION: "It's hard when your body feels too much, AND we'll get through this together..."
COMMAND: "Squeeze my hands or get some space. You choose."
```

### DISTRACTED (ADHD, Executive Function)
**Characteristics:** Needs dopamine hits, forgets mid-task, needs movement
**Script adjustments:**
- Shorter phrases (attention span)
- Movement in command ("race you!")
- High-energy challenges
- Timer/music/sound = dopamine

**Example:**
```
CONNECTION: "I see you're stuck on this..."
VALIDATION: "It's hard to switch tasks, AND timer says go..."
COMMAND: "Race to the door! Ready, set, GO!"
```

### DEFIANT (ODD, Strong-Willed)
**Characteristics:** Needs control, tests authority, justice-driven
**Script adjustments:**
- Give control through choice (CRITICAL)
- "You're in charge of..." language
- Competition > cooperation
- Avoid power struggles (parent stays calm)

**Example:**
```
CONNECTION: "I hear you want control..."
VALIDATION: "It's hard when someone tells you what to do, AND this needs to happen..."
COMMAND: "Start or finish? You're in charge of which half."
```

---

## SITUATION-SPECIFIC EXAMPLES

### Morning Rush (7AM, Already Late)
```sql
-- Key features:
- emergency_suitable = true
- expected_time_seconds = 30
- parent_state = ['rushed', 'frustrated']
- time_optimal = ['morning']
- success_speed = '30sec'

-- Phrases must be FAST, NO negotiation
CONNECTION: "I see you're not ready..." (4 words)
VALIDATION: "It's hard to rush, AND we're leaving now..." (9 words)
COMMAND: "Shoes on or shoes in hands. Walking to car in 10 seconds." (12 words)
```

### Public Meltdown (Store, Restaurant)
```sql
-- Key features:
- works_in_public = true
- location_type = ['public']
- parent_state = ['embarrassed', 'frustrated']
- expected_time_seconds = 15

-- Phrases must IGNORE audience, focus on child
CONNECTION: "I see you're upset..." (4 words)
VALIDATION: "It's hard to leave, AND time is up..." (8 words)
COMMAND: "Walking feet or carrying feet. Counting to 3." (8 words)
-- Then: Pick up and carry if needed. Say NOTHING to audience.
```

### Bedtime Resistance
```sql
-- Key features:
- time_optimal = ['evening']
- intensity_level = 'mild'
- parent_state = ['exhausted', 'calm']
- requires_preparation = true (weighted stuffie, book ready)

-- Phrases must be CALM, predictable routine
CONNECTION: "I see your body's still awake..."
VALIDATION: "It's hard to stop your brain, AND sleep time is here..."
COMMAND: "Book first or breathing first? You pick."
```

---

## QUALITY CHECKLIST

Before submitting a script, verify:

**Framework Compliance:**
- [ ] Phrase 1 is 5-10 words, observation only
- [ ] Phrase 2 is 15-20 words with "It's hard... AND..."
- [ ] Phrase 3 is 10-15 words with clear choice/challenge
- [ ] All actions are physical things parent DOES
- [ ] Pauses are specified (3s and 2s)

**Context Richness:**
- [ ] situation_trigger uses parent language (not formal)
- [ ] location_type matches where script works
- [ ] parent_state includes "frustrated" if script works when stressed
- [ ] backup_plan is ONE simple action
- [ ] common_mistakes are SPECIFIC to situation

**Realistic Test:**
- [ ] Parent can say this naturally (not robotic)
- [ ] Works when parent is already upset (if emergency_suitable)
- [ ] Expected time is realistic (not wishful thinking)
- [ ] Backup plan is something parent will actually DO

**7AM Crisis Test:**
- [ ] If emergency_suitable = true:
  - Can parent remember phrases when stressed?
  - Does it work in under 60 seconds?
  - No preparation needed?
  - Works in public/car?

---

## COMMON MISTAKES TO AVOID

### ❌ Wrong Way (Don't Do This)

**1. Abstract language:**
```
❌ "Your brain needs to power down for sleep chemicals"
✅ "Your body needs rest"
```

**2. Asking permission:**
```
❌ "Can you please get in the car seat for mommy?"
✅ "Walking feet or carrying feet. You pick."
```

**3. Using "BUT" instead of "AND":**
```
❌ "I know you're upset BUT you need to stop"
✅ "I see you're upset, AND we're leaving now"
```

**4. Empty threats:**
```
❌ "If you don't listen, no tablet for a week!"
✅ "Shoes on now or shoes in hands. Timer starts."
```

**5. Assuming cooperation:**
```
❌ "Let's move to the calm corner together"
✅ "Calm corner or car. You have 5 seconds to pick."
```

**6. Too many choices:**
```
❌ "Do you want red shirt, blue shirt, or green shirt?"
✅ "Red shirt or blue shirt. You pick."
```

---

## EXAMPLE: COMPLETE SCRIPT

### "Screen Time Shutdown" (DEFIANT, 5-8 years)

**Situation:** Child won't turn off tablet, gentle parenting already failed ("5 more minutes" turned into 30)

```sql
INSERT INTO scripts VALUES (
  'Screen Time Shutdown',
  'Screens',
  '"If you don''t turn it off RIGHT NOW, no tablet tomorrow! I mean it this time!"',

  -- Phrase 1 (CONNECTION)
  'I see you want to keep watching...',
  'Kneel to eye level. Calm, firm voice (NOT apologetic).',

  -- Phrase 2 (VALIDATION)
  'It''s hard to stop when it''s fun, AND your time is up now...',
  'Hold up timer/phone showing 0:00. Firm eye contact.',

  -- Phrase 3 (COMMAND)
  'You turn it off, or I hold it while you push the button. Counting to 3.',
  'Start counting slowly. On 3, take tablet calmly. Let them push power button.',

  'Short phrases + visual proof (timer) = can''t negotiate. Offering control (they push button) while parent holds authority (tablet in your hands) = defiant child cooperates without power struggle.',

  'DEFIANT',
  ARRAY['screen time', 'tablet', 'ipad', 'devices', 'cooperation', 'power struggle'],
  5,

  -- Enhanced fields
  'When child refuses to turn off tablet/iPad after gentle parenting "5 more minutes" already failed',
  ARRAY['home', 'public'],
  ARRAY['afternoon', 'evening', 'anytime'],
  'moderate',
  '30sec',
  ARRAY['frustrated', 'exhausted', 'feeling guilty'],
  4,
  8,
  'Take device calmly. Say: "I''ll hold this. You can try again tomorrow with self-timer." Walk away. Ignore protests.',
  ARRAY[
    'Giving "one more minute" repeatedly (teaches: parent doesn''t mean what they say)',
    'Explaining why screen time is bad (engages argument)',
    'Taking device angrily then feeling guilty and giving it back (inconsistency)'
  ],
  3,
  2,
  30,
  'beginner',
  false,
  true,
  true
);
```

---

## MIGRATION INSTRUCTIONS

To apply the enhanced script structure:

1. Run migration:
```bash
# If you have supabase CLI
supabase db push

# Or apply manually via Supabase Dashboard > SQL Editor
# Copy contents of: supabase/migrations/20251114000000_enhance_scripts_structure.sql
```

2. Verify fields exist:
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'scripts'
ORDER BY ordinal_position;
```

3. Test with one script first before batch creation

---

## AGENT INSTRUCTIONS

When creating scripts:

1. **Read this template completely FIRST**
2. **Follow the 7AM Crisis Test:** Would this help an exhausted parent at 7am when their neurodivergent child is melting down and they're already late?
3. **Use parent language** in situation_trigger (how they describe it, not how textbooks do)
4. **Be SPECIFIC** in all fields (generic = useless)
5. **Test phrases out loud** - does it sound natural or robotic?
6. **Include backup plan** - parent needs to know what to do if it fails
7. **Common mistakes must be SPECIFIC** to this situation
8. **Validate with data** - check if similar scripts succeed

Remember: These parents feel like failures. Your script should build confidence, not add complexity.
