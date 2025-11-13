# Migration Action Plan - How to Fix All Database Errors

**Date:** 2025-11-13
**Priority:** HIGH
**Estimated Time:** 15 minutes

---

## Quick Summary

Your database has schema issues causing console errors. The migrations folder has 49 files that were **never applied** to your database. You need to apply ONE migration to fix everything.

---

## The Problem

Console shows these errors:
```
❌ tracker_days.child_id does not exist
❌ Could not find the table 'public.scripts_usage' in the schema cache
❌ Could not find the table 'public.posts' in the schema cache
❌ Could not find the table 'public.user_bonuses' in the schema cache
❌ Could not find the table 'public.badges' in the schema cache
```

**Root Cause:** Database was created manually, not via migrations. The 49 migration files in your folder were never applied.

---

## The Solution (Step-by-Step)

### Step 1: Backup Your Database (5 minutes)

**CRITICAL:** Do this first! You have real data (23 users, 25 scripts, 75 tracker days).

**In Supabase Dashboard:**
1. Go to your project: https://supabase.com/dashboard/project/iogceaotdodvugrmogpp
2. Click **Database** → **Backups**
3. Click **Create Backup** or note the latest automatic backup time
4. Wait for confirmation

### Step 2: Apply the Fix Migration (3 minutes)

**In Supabase Dashboard:**
1. Click **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of this file:
   ```
   supabase/migrations/20251113000000_FINAL_fix_all_console_errors.sql
   ```
4. Paste into the SQL Editor
5. Click **Run** (or press `Ctrl+Enter`)
6. Wait for "Success" message
7. Look for the completion summary in the results

**Expected Output:**
```
============================================================================
MIGRATION COMPLETE
============================================================================

The following fixes have been applied:
  1. Added child_id column to tracker_days
  2. Configured scripts_usage table
  3. Created posts view
  4. Configured user_bonuses table
  5. Configured badges table
  6. Configured user_badges table
  7. Reloaded PostgREST schema cache
```

### Step 3: Reload PostgREST Schema Cache (2 minutes)

**CRITICAL:** PostgREST needs to reload to see the changes.

**In Supabase Dashboard:**
1. Go to **Settings** → **API**
2. Find the **Schema** section
3. Click **Reload Schema** button
4. Wait for confirmation message

Alternative method (in SQL Editor):
```sql
NOTIFY pgrst, 'reload schema';
```

### Step 4: Verify the Fixes (2 minutes)

**In SQL Editor, run:**
```sql
SELECT * FROM verify_schema_fixes();
```

**Expected Result:**
| check_name | status | details |
|------------|--------|---------|
| tracker_days.child_id | OK | Column for child profile ID |
| scripts_usage table | OK | Script usage tracking table |
| posts view | OK | Compatibility view for community_posts |
| user_bonuses table | OK | User bonus progress tracking |
| badges table | OK | Badge definitions |
| user_badges table | OK | User badge achievements |

All should say "OK". If any say "MISSING", re-run the migration.

### Step 5: Test Your Application (3 minutes)

1. **Refresh your app** (hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`)
2. **Clear browser console** (F12 → Console → Clear)
3. **Navigate through the app:**
   - Open Dashboard
   - Click on Tracker
   - View Scripts
   - Check Community (if applicable)
   - Open Bonuses page
4. **Check console** - Should be no more table/column errors

---

## What This Migration Does

### 1. Fixes `tracker_days.child_id` Error

**Problem:** Code expects `child_id` column but table only has `child_profile_id`

**Solution:**
- Adds `child_id` column to `tracker_days` table
- Copies existing `child_profile_id` data to `child_id`
- Creates trigger to keep both columns synchronized
- Both columns now work interchangeably

### 2. Fixes `scripts_usage` Table Error

**Problem:** Table exists in PostgreSQL but not exposed via Supabase API

**Solution:**
- Enables Row Level Security (RLS)
- Creates policies: users can view/insert their own usage
- Grants proper permissions to `authenticated` role
- Table now accessible via Supabase client

### 3. Fixes `posts` Table Error

**Problem:** Code queries `posts` table but only `community_posts` exists

**Solution:**
- Creates `posts` VIEW that maps to `community_posts`
- Maps `user_id` → `author_id` for compatibility
- Grants SELECT permission
- Code can now query either `posts` or `community_posts`

### 4. Fixes `user_bonuses` Table Error

**Problem:** Table exists but not in PostgREST cache

**Solution:**
- Creates table if missing (with schema)
- Enables RLS with user-scoped policies
- Grants permissions
- Now accessible via API

### 5. Fixes `badges` Table Error

**Problem:** Table exists but not in PostgREST cache

**Solution:**
- Creates table if missing
- Public can read, admins can manage
- Grants permissions
- Now accessible via API

### 6. Fixes `user_badges` Table Error

**Problem:** Table exists but not in PostgREST cache

**Solution:**
- Creates table if missing
- Users can view all badges, manage their own
- Grants permissions
- Now accessible via API

---

## Safety Features

The migration is **safe** because:

1. ✅ **Idempotent:** Can run multiple times without breaking anything
2. ✅ **Checks existence:** Only creates/modifies if needed
3. ✅ **Preserves data:** Doesn't delete anything
4. ✅ **Non-destructive:** Only adds columns/tables/views
5. ✅ **Validates changes:** Includes verification function

---

## What If Something Goes Wrong?

### If Migration Fails

1. **Check error message:** Look at the specific error in SQL Editor
2. **Common issues:**
   - Permission denied: Run as database owner
   - Table doesn't exist: Migration will create it
   - Column already exists: Migration will skip it (safe)

### If App Still Shows Errors

1. **Hard refresh browser:** `Ctrl+Shift+R`
2. **Clear browser cache**
3. **Reload schema again:** Settings → API → Reload Schema
4. **Check verification:** Run `SELECT * FROM verify_schema_fixes();`

### If You Need to Rollback

**Option 1 - Restore from Backup:**
1. Database → Backups → Select backup → Restore

**Option 2 - Undo changes manually:**
```sql
-- Remove added column
ALTER TABLE tracker_days DROP COLUMN IF EXISTS child_id;

-- Remove trigger
DROP TRIGGER IF EXISTS trigger_sync_tracker_days_child_ids ON tracker_days;

-- Remove view
DROP VIEW IF EXISTS posts;

-- Note: Tables created will remain (safe to keep)
```

---

## After Migration is Applied

### What You Can Do Now

✅ Use `child_id` or `child_profile_id` in tracker_days queries
✅ Track script usage with `scripts_usage` table
✅ Query `posts` table (it will map to `community_posts`)
✅ Implement user bonuses system
✅ Implement badges/achievements system

### What You Should Do Next

1. **Update code to use correct column names consistently**
2. **Test all features thoroughly**
3. **Monitor for any new errors**
4. **Plan future migrations using Supabase CLI**

---

## Future Migrations

### Don't Repeat This Mistake

From now on, use Supabase CLI for all schema changes:

```bash
# Create new migration
supabase migration new add_some_feature

# Edit the generated .sql file
# Then apply it:
supabase db push
```

This ensures:
- Migrations are tracked
- Changes are versioned
- You can rollback if needed
- Development and production stay in sync

---

## Technical Details

### Why Migrations Weren't Applied

1. Database was created via Supabase Dashboard (point-and-click)
2. Tables were added manually via SQL Editor
3. Migration files were created but never run with `supabase db push`
4. No `supabase_migrations` table exists (no tracking)
5. Code evolved based on migration files, not actual database

### How We Discovered This

1. Ran database audit script connecting to live database
2. Compared actual schema to TypeScript types
3. Found mismatches (missing columns, tables not in API cache)
4. Checked for `supabase_migrations` table - doesn't exist
5. Confirmed migrations were never applied

---

## Documentation

**Full details in:**
- `docs/DATABASE_AUDIT_FINAL.md` - Complete audit findings
- `docs/DATABASE_SCHEMA_FINAL.md` - Full schema documentation
- `supabase/migrations/README.md` - Migration folder explanation

---

## Checklist

Before you start:
- [ ] Read this entire document
- [ ] Have Supabase Dashboard open
- [ ] Know your project ref: `iogceaotdodvugrmogpp`
- [ ] Have backup ready or note latest backup time

During migration:
- [ ] Create/verify backup
- [ ] Copy migration SQL file
- [ ] Run in SQL Editor
- [ ] Verify success message
- [ ] Reload schema cache
- [ ] Run verification query
- [ ] Test application

After migration:
- [ ] All console errors gone
- [ ] Application works correctly
- [ ] Document any remaining issues
- [ ] Plan next steps

---

## Need Help?

If stuck:

1. **Check Supabase logs:** Database → Logs
2. **Test table access:**
   ```sql
   SELECT * FROM scripts_usage LIMIT 1;
   SELECT * FROM posts LIMIT 1;
   SELECT * FROM tracker_days LIMIT 1;
   ```
3. **Check RLS policies:**
   ```sql
   SELECT tablename, policyname, permissive, roles, cmd, qual
   FROM pg_policies
   WHERE tablename IN ('scripts_usage', 'posts', 'user_bonuses', 'badges', 'user_badges');
   ```
4. **Verify grants:**
   ```sql
   SELECT grantee, table_name, privilege_type
   FROM information_schema.role_table_grants
   WHERE table_name IN ('scripts_usage', 'posts', 'user_bonuses', 'badges', 'user_badges');
   ```

---

## Summary

**The entire fix is:**
1. Backup database (5 min)
2. Run ONE SQL file (3 min)
3. Reload schema (2 min)
4. Verify (2 min)
5. Test (3 min)

**Total time:** ~15 minutes

**Risk level:** LOW (migration is safe and reversible)

**Impact:** Fixes ALL console errors related to database schema

---

**Status:** Ready to apply
**Next Action:** Create backup, then apply migration
**Expected Result:** Zero database-related console errors
