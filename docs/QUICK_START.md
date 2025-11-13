# Quick Start Guide - Script Modal Improvements

## 🚀 Get Started in 3 Steps

### Step 1: Apply Database Changes (5 minutes)

1. Open Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the content from:
   ```
   supabase-migrations/add-script-guidance-fields.sql
   ```
6. Click **RUN**
7. Create another new query and run:
   ```
   supabase-migrations/add-hair-brushing-example-data.sql
   ```

✅ Done! Your database now has all the new fields.

---

### Step 2: Update TypeScript Types (2 minutes)

Option A - Using Supabase CLI (recommended):
```bash
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
```

Option B - The types will auto-update when you restart your dev server.

---

### Step 3: Test It Out (2 minutes)

```bash
npm run dev
```

1. Navigate to **Scripts** page
2. Click on any script
3. You should see:
   - 💡 **Quick Context** at the top
   - **Step guidance** boxes under each NEP step
   - New sections at the bottom

4. Click **Mark as Used**, then choose:
   - **Worked** → See celebration modal 🎉
   - **Didn't Work** → See alternatives modal

---

## 📝 Populate More Scripts (Optional)

To add the new guidance to your existing scripts, update them in Supabase:

```sql
UPDATE scripts
SET
  difficulty_level = 'Moderate',
  age_range = '3-8',
  duration_minutes = 5,
  say_it_like_this_step1 = 'Your guidance here...',
  avoid_step1 = 'What to avoid...',
  what_to_expect = ARRAY[
    'First expectation',
    'Second expectation',
    'Third expectation'
  ]
WHERE title = 'Your Script Title';
```

---

## 🔗 Link Related Scripts

To enable the "IF THIS DOESN'T WORK, TRY:" section:

```sql
UPDATE scripts
SET related_script_ids = ARRAY[
  'script-id-1',
  'script-id-2',
  'script-id-3'
]
WHERE id = 'your-script-id';
```

To find script IDs:
```sql
SELECT id, title FROM scripts;
```

---

## ✅ Quick Test Checklist

- [ ] Modal opens with Quick Context section
- [ ] Difficulty shows as stars (⭐, ⭐⭐, or ⭐⭐⭐)
- [ ] Step guidance appears (blue "Say it like this" / red "Avoid")
- [ ] What to Expect shows (if data exists)
- [ ] Related Scripts shows (if IDs are populated)
- [ ] Celebration modal appears when marking "Worked"
- [ ] Alternatives modal appears when marking "Didn't Work"

---

## 🐛 Something Not Working?

### New fields don't show:
```bash
# Hard refresh browser
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### TypeScript errors:
```bash
# Regenerate types and restart
supabase gen types typescript --project-id YOUR_ID > src/integrations/supabase/types.ts
npm run dev
```

### Related scripts don't appear:
- Check that `related_script_ids` is populated in database
- Verify the script IDs exist

---

## 📚 Full Documentation

For detailed information, see: **SCRIPT_MODAL_IMPROVEMENTS.md**

---

## 🎉 You're Done!

Your script modal now has:
- ✅ Quick Context (age, duration, difficulty)
- ✅ Step-by-step guidance
- ✅ Realistic expectations
- ✅ Related scripts suggestions
- ✅ Celebration modal
- ✅ Alternatives modal

Enjoy the improved user experience! 🚀
