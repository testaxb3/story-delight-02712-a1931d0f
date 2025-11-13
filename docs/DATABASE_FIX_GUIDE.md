# Database Error Fix Guide

## Problem Summary

The browser console was showing multiple database errors indicating missing tables and columns:

### Errors Identified

1. **tracker_days.child_id does not exist** (400 Bad Request)
   - Code queries for `child_id` column
   - Database has `child_profile_id` column instead

2. **scripts_usage table not found** (404 Not Found)
   - Code references `scripts_usage` table
   - Migration created `script_usage` table (singular)

3. **posts table not found** (404 Not Found)
   - Code in `useUserStats.ts` queries `posts` table
   - Only `community_posts` table exists

4. **script_feedback table issues** (406 Not Acceptable)
   - Table may be missing or have incorrect schema

## Root Cause Analysis

### 1. tracker_days Column Mismatch

**Migration**: `20251021000100_normalize_child_profiles.sql`
- Created `child_profile_id` column on tracker_days (line 71-72)

**Code**: `src/pages/Dashboard.tsx` (line 116)
- Queries for `child_id` column
```typescript
.eq('child_id', activeChild.id)
```

**TypeScript Types**: `src/integrations/supabase/types.ts` (line 560)
- Shows table has `child_profile_id` not `child_id`

### 2. scripts_usage vs script_usage

**Migration**: `20251107000400_create_script_usage.sql`
- Created table named `script_usage` (singular)

**Code**: `src/hooks/useUserStats.ts` (line 46)
- Queries `scripts_usage` (plural)
```typescript
.from('scripts_usage')
```

**Code**: `src/pages/Dashboard.tsx` (line 169)
- Also queries `script_usage` (singular - correct)

**Inconsistency**: Mixed usage across codebase

### 3. posts vs community_posts

**Code**: `src/hooks/useUserStats.ts` (line 59)
- Queries `posts` table with `author_id` column
```typescript
.from('posts')
.select('*', { count: 'exact', head: true })
.eq('author_id', userId)
```

**Database**: Only `community_posts` table exists
- Has `user_id` column, not `author_id`

### 4. script_feedback

**Migration**: `20251113120000_create_script_feedback_table.sql`
- Creates table properly

**Issue**: May not have been applied to production database

## Solution

### Migration File Created

`supabase/migrations/20251117000010_fix_missing_tables_and_columns.sql`

This migration:

1. **Adds `child_id` to tracker_days**
   - Creates `child_id` column as alias for `child_profile_id`
   - Syncs data from `child_profile_id` to `child_id`
   - Creates trigger to keep both columns synchronized

2. **Creates `scripts_usage`**
   - If `script_usage` exists: Creates view `scripts_usage` → `script_usage`
   - If not: Creates `scripts_usage` table with proper schema and RLS policies

3. **Creates `posts` view**
   - Maps `community_posts` to `posts`
   - Maps `user_id` to `author_id` for compatibility

4. **Ensures `script_feedback` exists**
   - Creates table if missing with proper schema

## How to Apply the Fix

### Option 1: Apply via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the migration file: `supabase/migrations/20251117000010_fix_missing_tables_and_columns.sql`
4. Copy the entire content
5. Paste into SQL Editor
6. Click **Run**

### Option 2: Apply via Supabase CLI

```bash
# Navigate to project directory
cd "C:\Users\gabri\OneDrive\Área de Trabalho\app\brainy-child-guide"

# Apply migration
npx supabase db push

# Or apply specific migration
npx supabase migration up
```

### Option 3: Apply via Direct SQL Connection

If you have `psql` or another PostgreSQL client:

```bash
psql "postgresql://postgres:[password]@db.iogceaotdodvugrmogpp.supabase.co:5432/postgres" \
  -f supabase/migrations/20251117000010_fix_missing_tables_and_columns.sql
```

## Verification

After applying the migration, verify in SQL Editor:

```sql
-- Check if child_id column exists on tracker_days
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'tracker_days'
AND column_name IN ('child_id', 'child_profile_id');

-- Check if scripts_usage exists
SELECT * FROM information_schema.tables
WHERE table_name = 'scripts_usage';

-- Check if posts view exists
SELECT * FROM information_schema.views
WHERE table_name = 'posts';

-- Check if script_feedback table exists
SELECT * FROM information_schema.tables
WHERE table_name = 'script_feedback';

-- Use helper function to check all tables
SELECT * FROM public.check_tables_status();
```

## Expected Results After Fix

All console errors should be resolved:

- ✅ `tracker_days.child_id` queries will work
- ✅ `scripts_usage` table will be accessible
- ✅ `posts` table queries will work (via view)
- ✅ `script_feedback` POST requests will work

## Alternative Code Fixes (If Migration Cannot Be Applied)

If you cannot apply the migration immediately, you can fix the code instead:

### Fix 1: Update Dashboard.tsx (tracker_days)

```typescript
// Change line 116 from:
.eq('child_id', activeChild.id)

// To:
.eq('child_profile_id', activeChild.id)
```

### Fix 2: Update useUserStats.ts (scripts_usage)

```typescript
// Change line 46 from:
.from('scripts_usage')

// To:
.from('script_usage')
```

### Fix 3: Update useUserStats.ts (posts)

```typescript
// Change lines 58-61 from:
const { count: postsCount } = await supabase
  .from('posts')
  .select('*', { count: 'exact', head: true })
  .eq('author_id', userId);

// To:
const { count: postsCount } = await supabase
  .from('community_posts')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId);
```

## Long-term Recommendations

1. **Standardize naming conventions**
   - Decide on plural vs singular for table names
   - Use consistent column names (child_id vs child_profile_id)

2. **Update TypeScript types after schema changes**
   ```bash
   npx supabase gen types typescript --project-id iogceaotdodvugrmogpp > src/integrations/supabase/types.ts
   ```

3. **Add migration testing**
   - Test migrations in development before production
   - Use Supabase CLI for local development

4. **Document schema decisions**
   - Keep track of naming conventions
   - Document which tables/columns are canonical

## Files Affected

### Created:
- `supabase/migrations/20251117000010_fix_missing_tables_and_columns.sql`
- `docs/DATABASE_FIX_GUIDE.md`

### Need Review:
- `src/pages/Dashboard.tsx` (line 116 - child_id query)
- `src/hooks/useUserStats.ts` (lines 46, 59 - table names)

## Related Migrations

- `20251018150000_create_profiles_and_tracker.sql` - Initial tracker_days creation
- `20251021000100_normalize_child_profiles.sql` - Added child_profile_id
- `20251107000400_create_script_usage.sql` - Created script_usage table
- `20251113120000_create_script_feedback_table.sql` - Created script_feedback table
- `20251112000000_community_premium_phase_1.sql` - Community posts features

## Support

If you encounter issues after applying the migration:

1. Check Supabase logs in Dashboard → Database → Logs
2. Verify RLS policies are not blocking queries
3. Ensure user is authenticated when making requests
4. Check browser console for updated error messages
5. Verify migration was fully applied (no partial execution)

## Rollback Plan

If the migration causes issues, you can rollback:

```sql
-- Remove child_id column
ALTER TABLE public.tracker_days DROP COLUMN IF EXISTS child_id;

-- Drop scripts_usage view (if created as view)
DROP VIEW IF EXISTS public.scripts_usage;

-- Drop posts view
DROP VIEW IF EXISTS public.posts;

-- Remove helper function
DROP FUNCTION IF EXISTS public.check_tables_status();
```

Note: This only rolls back the schema changes. Use code fixes above as alternative.
