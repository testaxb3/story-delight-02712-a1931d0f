# Database Migrations

## Current Status

**CRITICAL:** The migrations in this folder were **NEVER APPLIED** to the production database.

The database was created manually (likely via Supabase Dashboard), and the schema definitions in these migration files do not match the actual database state.

---

## What Happened

1. **Database Created Manually:** The Supabase database was set up through the dashboard or direct SQL commands
2. **Migrations Created:** 49 migration files were created to document intended schema changes
3. **Never Applied:** These migrations were never run against the database using `supabase db push`
4. **Schema Drift:** The actual database schema diverged from what the migration files describe
5. **Console Errors:** This mismatch causes errors like "table not found in schema cache"

---

## Evidence

- No `supabase_migrations` table exists in the database (migrations aren't tracked)
- Tables exist with different column names than migrations expect
- Several tables exist but aren't exposed via PostgREST API
- Type definitions (in `src/integrations/supabase/types.ts`) don't match actual database

---

## Current Database State

**Tables that exist and work:**
- `profiles` (23 rows) ✅
- `scripts` (25 rows) ✅
- `tracker_days` (75 rows) ⚠ Missing `child_id` column
- `bonuses` (2 rows) ✅

**Tables that exist but have issues:**
- `scripts_usage` - Not in PostgREST cache
- `script_feedback` - Incomplete schema
- `posts` - Missing (should be view of `community_posts`)
- `user_bonuses` - Not in PostgREST cache
- `badges` - Not in PostgREST cache
- `user_badges` - Not in PostgREST cache
- `notifications` - Incomplete schema
- `comments`, `reactions` - Exist but may have incomplete schemas

---

## The Fix

### Option 1: Apply the Final Fix Migration (RECOMMENDED)

Apply only the new migration that fixes all current issues:

```bash
# In Supabase Dashboard SQL Editor, run:
supabase/migrations/20251113000000_FINAL_fix_all_console_errors.sql
```

This migration:
1. ✅ Adds `child_id` column to `tracker_days`
2. ✅ Exposes `scripts_usage` via PostgREST API
3. ✅ Creates `posts` view from `community_posts`
4. ✅ Exposes `user_bonuses`, `badges`, `user_badges`
5. ✅ Sets up proper RLS policies
6. ✅ Reloads PostgREST schema cache

After applying, **reload the schema** in Supabase Dashboard:
- Settings → API → Reload Schema

### Option 2: Apply All Old Migrations (NOT RECOMMENDED)

If you want to apply all 49 migrations:

```bash
# Link to your Supabase project
supabase link --project-ref iogceaotdodvugrmogpp

# Push all migrations
supabase db push
```

**WARNING:** This may cause conflicts with existing data and schema!

### Option 3: Start Fresh (DESTRUCTIVE - DO NOT USE IN PRODUCTION)

Only for development/staging:

```bash
supabase db reset
supabase db push
```

**THIS WILL DELETE ALL DATA!** Only use in non-production environments.

---

## Migration Files

### Essential Migrations (Keep These)

- `20251113000000_FINAL_fix_all_console_errors.sql` - **THE ONLY ONE YOU NEED**

### Old Migrations (Archived)

All other migrations have been moved to `archived_old/` because they:
- Were never applied
- Describe an idealized schema that doesn't match reality
- May conflict with the actual database state

They're preserved for reference but should NOT be applied.

---

## Verification

After applying the fix migration, verify everything works:

```sql
-- Run in Supabase SQL Editor
SELECT * FROM verify_schema_fixes();
```

This should return all "OK" statuses.

---

## Going Forward

### For Future Migrations

1. **Always use Supabase CLI:**
   ```bash
   supabase migration new your_migration_name
   # Edit the generated SQL file
   supabase db push
   ```

2. **Test in development first:**
   ```bash
   supabase start  # Local development
   supabase db push
   # Test thoroughly
   supabase db push --linked  # Push to production
   ```

3. **Keep migrations atomic:** One logical change per migration

4. **Never edit applied migrations:** Create new ones instead

5. **Document breaking changes:** Add comments explaining why/how

### Migration Best Practices

```sql
-- Good: Handles existing data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'my_table' AND column_name = 'new_column'
  ) THEN
    ALTER TABLE my_table ADD COLUMN new_column TEXT;
  END IF;
END $$;

-- Bad: Fails if column already exists
ALTER TABLE my_table ADD COLUMN new_column TEXT;
```

---

## Documentation

See these files for complete details:

- `docs/DATABASE_AUDIT_FINAL.md` - Complete audit of actual database state
- `docs/DATABASE_SCHEMA_FINAL.md` - Full schema documentation and best practices

---

## Console Errors Fixed

After applying `20251113000000_FINAL_fix_all_console_errors.sql`:

✅ **Fixed:** `tracker_days.child_id does not exist`
- Added `child_id` column synchronized with `child_profile_id`

✅ **Fixed:** `Could not find the table 'public.scripts_usage' in the schema cache`
- Configured table with proper RLS and grants

✅ **Fixed:** `Could not find the table 'public.posts' in the schema cache`
- Created view mapping to `community_posts`

✅ **Fixed:** `Could not find the table 'public.user_bonuses' in the schema cache`
- Configured table with proper RLS and grants

✅ **Fixed:** `Could not find the table 'public.badges' in the schema cache`
- Configured table with proper RLS and grants

✅ **Fixed:** `Could not find the table 'public.user_badges' in the schema cache`
- Configured table with proper RLS and grants

---

## Need Help?

If you encounter issues:

1. **Check schema cache:** Settings → API → Reload Schema in Supabase Dashboard
2. **Check RLS policies:** Ensure tables have proper policies
3. **Check grants:** Tables need `GRANT` permissions for `authenticated` role
4. **Check logs:** Supabase Dashboard → Database → Logs
5. **Run verification:** `SELECT * FROM verify_schema_fixes();`

---

## Summary

**DO THIS:**
1. Apply `20251113000000_FINAL_fix_all_console_errors.sql`
2. Reload schema in Supabase Dashboard
3. Verify with `verify_schema_fixes()`
4. Test the application

**DON'T DO THIS:**
- Don't apply old migrations blindly
- Don't run `db reset` in production
- Don't edit already-applied migrations
- Don't skip the schema reload step

---

**Last Updated:** 2025-11-13
**Database:** iogceaotdodvugrmogpp
**Status:** Migration ready for application
