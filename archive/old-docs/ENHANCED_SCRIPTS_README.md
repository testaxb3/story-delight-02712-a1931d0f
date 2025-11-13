# Enhanced NEP Scripts System - Implementation Guide

## 📋 Overview

This implementation prepares the NEP System app to receive high-quality, context-rich scripts that provide real value to stressed parents. The infrastructure is now ready for you to create scripts using the 3 specialized agents.

## ✅ What Was Implemented

### 1. Database Enhancements
- **Migration**: `supabase/migrations/20251114000000_enhance_scripts_structure.sql`
- **New Fields Added to `scripts` table:**
  - `situation_trigger` - Clear description of when to use
  - `location_type[]` - Where script works (home, public, car, etc.)
  - `time_optimal[]` - Best times of day
  - `intensity_level` - Meltdown severity (mild/moderate/severe)
  - `success_speed` - How fast it works (30sec, 1min, etc.)
  - `parent_state[]` - Parent emotions this works for
  - `age_min` / `age_max` - Recommended age range
  - `backup_plan` - What to do if script doesn't work
  - `common_mistakes[]` - What parents do wrong
  - `pause_after_phrase_1/2` - Pause durations
  - `expected_time_seconds` - Expected cooperation time
  - `related_script_ids[]` - Alternative/follow-up scripts
  - `difficulty_level` - Skill level needed
  - `requires_preparation` - Needs advance setup?
  - `works_in_public` - Suitable for public?
  - `emergency_suitable` - Works in crisis?

### 2. Frontend Components

**SOS Mode** (`src/components/scripts/SOSMode.tsx`)
- Full-screen emergency mode overlay
- Shows single best script for crisis
- Triggered by: panic patterns, emergency keywords, rush hours
- Big, clear UI for stressed parents

**Enhanced Script Card** (`src/components/scripts/EnhancedScriptCard.tsx`)
- Shows all rich context (location, parent state, intensity, etc.)
- "WHEN TO USE" section with situation_trigger
- Visual badges for quick scanning
- Emergency suitable indicator

**Intelligent Search** (`src/lib/intelligentSearch.ts`)
- Understands natural language queries
- Detects urgency, intensity, location context
- Matches problem synonyms (e.g., "won't eat" = picky eater)
- Scores and ranks scripts by relevance
- Prioritizes emergency-suitable scripts when needed

**SOS Detection Hook** (`src/hooks/useSOSDetection.ts`)
- Auto-detects crisis situations:
  - 3+ scripts used in 10 minutes (panic pattern)
  - Last script marked "not_yet" (didn't work)
  - Emergency keywords in search
  - Rush hours (7-9 AM, 5-7 PM)
- Calls database function to get best SOS script

### 3. Database Functions

**`get_sos_script()`** - Intelligent SOS script selection
- Considers: user history, time of day, location, situation
- Scores scripts by relevance
- Returns best match with success rates

**`emergency_scripts` VIEW** - Pre-filtered emergency scripts with stats

**Auto-trigger** - Sets `emergency_suitable` automatically based on:
- Expected time <= 60 seconds
- Works when parent frustrated/rushed
- No preparation needed

### 4. TypeScript Types Updated
- All new fields added to `Database['public']['Tables']['scripts']`
- Fully typed for autocomplete and safety

### 5. Documentation for Agents

**Script Creation Template** (`.claude/SCRIPT_CREATION_TEMPLATE.md`)
- Complete NEP framework rules
- Field definitions and examples
- Brain type variations (INTENSE, DISTRACTED, DEFIANT)
- Quality checklist
- Common mistakes to avoid
- Full SQL template with all fields

## 🚀 Setup Instructions

### Step 1: Apply Database Migration

#### Option A: Using Supabase CLI (Recommended)
```bash
# Navigate to project directory
cd "C:\Users\gabri\OneDrive\Área de Trabalho\app\brainy-child-guide"

# Apply migration
supabase db push
```

#### Option B: Manual Application via Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open `supabase/migrations/20251114000000_enhance_scripts_structure.sql`
4. Copy entire content
5. Paste into SQL Editor
6. Click **Run**
7. Verify success (should see "Success. No rows returned")

### Step 2: Verify Migration

Run this query in SQL Editor to verify fields exist:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'scripts'
  AND column_name IN (
    'situation_trigger',
    'location_type',
    'time_optimal',
    'intensity_level',
    'success_speed',
    'parent_state',
    'backup_plan',
    'emergency_suitable'
  )
ORDER BY column_name;
```

Should return 8 rows showing all new fields.

### Step 3: Test Database Function

```sql
-- Test get_sos_script function
SELECT *
FROM get_sos_script(
  'your-user-id-here'::uuid,
  NULL,
  'car seat',
  'public'
);
```

### Step 4: Build and Test Frontend

```bash
# Install any new dependencies (if needed)
npm install

# Run dev server
npm run dev
```

### Step 5: Test SOS Mode

**Trigger SOS Mode by:**
1. Searching "emergency meltdown" or "help screaming"
2. Using 3+ scripts within 10 minutes
3. Opening app during rush hours (7-9 AM or 5-7 PM)
4. Marking last script as "didn't work"

**You should see:**
- Full-screen red/orange gradient overlay
- Single script recommended
- Large "USE THIS NOW" button
- Clear explanation of why this script

### Step 6: Test Intelligent Search

**Try these queries:**
- "won't get in car seat late" → Should prioritize fast, public-suitable scripts
- "screaming in store" → Should show public meltdown scripts
- "bedtime fight" → Should show evening routine scripts
- "hitting sibling again" → Should show scripts for repeated issues

### Step 7: Test Enhanced Script Cards

**Verify cards show:**
- "WHEN TO USE" section with clear situation
- Context badges (⚡ speed, 😤 parent state, 📍 location)
- Emergency "SOS READY" badge if applicable
- Age range and difficulty level

## 📝 Creating Scripts with Agents

Now that the infrastructure is ready, create scripts using the template:

### Agent Instructions

**For each agent, provide this prompt:**

```
You are a NEP script creation expert. Your task is to create high-quality NEP scripts following the framework defined in .claude/SCRIPT_CREATION_TEMPLATE.md.

Read the template completely before creating any scripts. Pay special attention to:
1. The 3-phrase NEP framework (CONNECTION, VALIDATION, COMMAND)
2. All enhanced context fields
3. Brain type variations
4. The 7AM Crisis Test
5. Quality checklist

Create scripts for these situations:
[List specific situations here based on market research]

Ensure each script:
- Follows NEP framework exactly
- Uses parent language (not academic)
- Includes rich context (location, parent state, etc.)
- Has backup plan and common mistakes
- Passes the 7AM Crisis Test

Output as SQL INSERT statements ready to run.
```

### Recommended Script Priorities

Based on market research pain points:

**Tier 1 (Create First):**
1. Car seat refusal (morning rush)
2. Won't turn off tablet (gentle parenting failed)
3. Public meltdown at store
4. Won't get dressed (already late)
5. Bedtime resistance (exhausted parent)
6. Hitting sibling (repeated issue)
7. Won't eat dinner (picky eater)
8. Morning routine chaos (ADHD child)

**Tier 2:**
9. Homework battle
10. Bath/hygiene refusal
11. Sibling fighting (constant)
12. Leaving playground tantrum
13. Restaurant meltdown
14. Won't brush teeth
15. Screen time boundary setting

## 🧪 Testing Checklist

Before deploying to production:

- [ ] Migration applied successfully
- [ ] All new columns exist in scripts table
- [ ] get_sos_script() function works
- [ ] TypeScript types compile without errors
- [ ] Frontend builds successfully
- [ ] SOS Mode triggers correctly
- [ ] Intelligent search returns relevant results
- [ ] Enhanced cards display all context
- [ ] At least 5 test scripts created with full fields
- [ ] Scripts show in SOS Mode when appropriate
- [ ] Search finds scripts by problem keywords
- [ ] Mobile responsive (test on phone)

## 🐛 Troubleshooting

### Migration Fails

**Error: "column already exists"**
- Solution: Fields already added, skip migration

**Error: "permission denied"**
- Solution: Use SERVICE_ROLE_KEY from .env.local

### SOS Mode Doesn't Appear

**Check:**
1. Are there scripts with `emergency_suitable = true`?
```sql
SELECT count(*) FROM scripts WHERE emergency_suitable = true;
```

2. Is user ID valid?
```sql
SELECT id FROM auth.users LIMIT 1;
```

3. Check browser console for errors

### Intelligent Search Not Working

**Check:**
1. Is `intelligentSearch` imported correctly?
2. Are scripts being passed as ScriptRow[] (not ScriptItem[])?
3. Check browser console for TypeScript errors

### Enhanced Cards Not Showing Context

**Check:**
1. Do scripts have new fields populated?
```sql
SELECT id, title, situation_trigger, parent_state, emergency_suitable
FROM scripts
LIMIT 5;
```

2. Is EnhancedScriptCard imported correctly?

## 📊 Database Query Examples

### Find all emergency-suitable scripts
```sql
SELECT title, category, expected_time_seconds, parent_state
FROM scripts
WHERE emergency_suitable = true
ORDER BY expected_time_seconds ASC;
```

### Scripts for specific situation
```sql
SELECT title, situation_trigger, success_speed
FROM scripts
WHERE situation_trigger ILIKE '%car seat%'
   OR ARRAY['car seat'] && tags;
```

### Scripts that work when parent is frustrated
```sql
SELECT title, parent_state, emergency_suitable
FROM scripts
WHERE 'frustrated' = ANY(parent_state);
```

### Scripts by location type
```sql
SELECT title, location_type, works_in_public
FROM scripts
WHERE 'public' = ANY(location_type);
```

## 🎯 Success Metrics

Track these to measure impact:

### User Engagement
- SOS Mode trigger rate
- SOS Mode → Script Use conversion
- Search success rate (query → script selection)
- Time to script selection (should decrease)

### Script Effectiveness
- Scripts marked "worked" (target: 70%+)
- Emergency scripts success rate
- Backup plan usage rate

### Parent Satisfaction
- Return rate within 24 hours
- Scripts favorited per user
- Feedback sentiment in notes

## 📁 File Structure

```
brainy-child-guide/
├── supabase/
│   └── migrations/
│       └── 20251114000000_enhance_scripts_structure.sql
├── src/
│   ├── components/
│   │   └── scripts/
│   │       ├── SOSMode.tsx
│   │       └── EnhancedScriptCard.tsx
│   ├── hooks/
│   │   └── useSOSDetection.ts
│   ├── lib/
│   │   └── intelligentSearch.ts
│   ├── integrations/
│   │   └── supabase/
│   │       └── types.ts (updated)
│   └── pages/
│       └── Scripts.tsx (updated)
├── .claude/
│   └── SCRIPT_CREATION_TEMPLATE.md
└── ENHANCED_SCRIPTS_README.md (this file)
```

## 🔄 Next Steps

1. **Apply migration** to database
2. **Test all features** using checklist above
3. **Create 3 agent tasks** to generate scripts:
   - Agent 1: Tier 1 scripts (1-4)
   - Agent 2: Tier 1 scripts (5-8)
   - Agent 3: Tier 2 scripts (9-15)
4. **Review generated scripts** for quality
5. **Insert scripts** into database
6. **Test with real users** (family/friends first)
7. **Iterate based on feedback**

## 💡 Tips for Script Creation Agents

**Do's:**
- ✅ Use parent language ("won't eat" not "food refusal disorder")
- ✅ Be specific in situation_trigger
- ✅ Test phrases out loud (do they sound natural?)
- ✅ Include backup plans (parent needs Plan B)
- ✅ Make emergency_suitable = true for fast scripts
- ✅ Use arrays for multi-value fields (location_type, parent_state)

**Don'ts:**
- ❌ Don't use abstract language ("power down brain chemicals")
- ❌ Don't assume cooperation ("let's move to calm corner")
- ❌ Don't use "BUT" in validation phrase (use "AND")
- ❌ Don't create scripts without backup plans
- ❌ Don't forget common_mistakes (critical for learning)
- ❌ Don't make phrases too long (stressed brain can't remember)

## 🎓 Framework Reminder

Every script MUST follow:

**1️⃣ CONNECTION (5-10 words)**
"I see you're [observation]..."
⏱️ Pause 3 seconds

**2️⃣ VALIDATION (15-20 words with "AND")**
"It's hard to [challenge], AND [reality]..."
⏱️ Pause 2 seconds

**3️⃣ COMMAND (10-15 words with choice)**
"[Option A] or [Option B]. You pick."
⏱️ Expected: 15-60 seconds

---

## 📞 Support

If you encounter issues:
1. Check troubleshooting section above
2. Verify migration applied correctly
3. Check browser console for errors
4. Test with simple query first
5. Review SQL logs in Supabase dashboard

## 🎉 Ready to Go!

Your NEP System is now ready to receive high-quality scripts. The infrastructure supports:
- ✅ Emergency/SOS mode for crisis situations
- ✅ Intelligent search that understands context
- ✅ Rich script metadata for better recommendations
- ✅ Parent-friendly UI for stressed moments
- ✅ Complete documentation for script creation

**Next action:** Apply the migration and start creating scripts with your 3 agents! 🚀
