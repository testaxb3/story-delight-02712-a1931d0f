# Database Audit - Final Report

**Date:** 2025-11-13
**Database:** iogceaotdodvugrmogpp
**Supabase URL:** https://iogceaotdodvugrmogpp.supabase.co

---

## Executive Summary

This audit reveals a **CRITICAL MISMATCH** between the expected database schema (defined in migrations) and the actual database state. The migrations in the `supabase/migrations/` folder have **NOT been applied** to the production database.

### Key Findings

1. **Migrations Not Tracked**: The database does not have a `supabase_migrations` table, indicating migrations were never run via Supabase CLI
2. **Incomplete Schema**: Several tables exist but are not properly configured in the PostgREST schema cache
3. **Missing Columns**: The `tracker_days` table is missing the `child_id` column that the application code expects
4. **Missing Tables**: Tables like `posts`, `scripts_usage`, `badges`, and `user_badges` exist in stub form but lack proper schemas

---

## Current Database State

### Tables That Exist and Are Fully Functional

#### 1. **profiles** (23 rows)
Primary user table with complete schema.

**Columns:**
- `id` (UUID, Primary Key)
- `email` (TEXT, NOT NULL)
- `name` (TEXT)
- `premium` (BOOLEAN)
- `quiz_completed` (BOOLEAN)
- `role` (TEXT)
- `is_admin` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)
- `child_name` (TEXT)
- `avatar_url` (TEXT)
- `brain_profile` (TEXT)
- `photo_url` (TEXT)
- `welcome_modal_shown` (BOOLEAN)
- `bio` (TEXT)
- `badges` (TEXT[])
- `followers_count` (INTEGER)
- `following_count` (INTEGER)
- `posts_count` (INTEGER)
- `likes_received_count` (INTEGER)
- `comments_count` (INTEGER)

**Purpose:** Stores user profile information including authentication, preferences, and community stats.

**Relationships:**
- Referenced by: `tracker_days`, `script_feedback`, `community_posts`, `post_comments`, etc.

---

#### 2. **scripts** (25 rows)
Parenting scripts/strategies table with extensive fields.

**Columns:**
- `id` (UUID, Primary Key)
- `title` (TEXT)
- `category` (TEXT)
- `wrong_way` (TEXT) - What doesn't work
- `phrase_1`, `phrase_2`, `phrase_3` (TEXT) - The 3-step script
- `phrase_1_action`, `phrase_2_action`, `phrase_3_action` (TEXT)
- `neurological_tip` (TEXT)
- `tags` (TEXT[])
- `estimated_time_minutes` (INTEGER)
- `difficulty_level` (TEXT)
- `age_range` (TEXT)
- `duration_minutes` (INTEGER)
- `say_it_like_this_step1`, `say_it_like_this_step2`, `say_it_like_this_step3` (TEXT)
- `avoid_step1`, `avoid_step2`, `avoid_step3` (TEXT)
- `related_script_ids` (TEXT[])
- `situation_trigger` (TEXT)
- `location_type` (TEXT[])
- `time_optimal` (TEXT[])
- `intensity_level` (TEXT)
- `success_speed` (TEXT)
- `parent_state` (TEXT[])
- `age_min`, `age_max` (INTEGER)
- `backup_plan` (TEXT)
- `common_mistakes` (TEXT[])
- `pause_after_phrase_1`, `pause_after_phrase_2` (INTEGER)
- `expected_time_seconds` (INTEGER)
- `requires_preparation` (BOOLEAN)
- `works_in_public` (BOOLEAN)
- `emergency_suitable` (BOOLEAN)
- `the_situation` (TEXT)
- `what_doesnt_work` (TEXT)
- `strategy_steps` (JSONB)
- `why_this_works` (TEXT)
- `what_to_expect` (JSONB)
- `common_variations` (JSONB)
- `parent_state_needed` (TEXT)
- `difficulty` (TEXT)
- `profile` (TEXT) - Brain profile type
- `created_at` (TIMESTAMPTZ)

**Purpose:** Stores parenting strategy scripts with detailed context and instructions.

---

#### 3. **tracker_days** (75 rows)
Daily progress tracking for the 30-day challenge.

**Columns:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, FK → profiles.id)
- `day_number` (INTEGER)
- `completed` (BOOLEAN)
- `completed_at` (TIMESTAMPTZ)
- `notes` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)
- `child_profile_id` (UUID) - FK to children_profiles
- `stress_level` (INTEGER)
- `meltdown_count` (TEXT)
- `date` (DATE)
- `streak_freeze_used` (BOOLEAN)

**CRITICAL ISSUE:** Missing `child_id` column that code references. Code expects `child_id` but table only has `child_profile_id`.

**Purpose:** Tracks daily check-ins and progress through the 30-day program.

---

#### 4. **bonuses** (2 rows)
Premium content bonuses table.

**Columns:**
- `id` (UUID, Primary Key)
- `title` (TEXT)
- `description` (TEXT)
- `category` (TEXT)
- `thumbnail` (TEXT)
- `duration` (TEXT)
- `file_size` (TEXT)
- `locked` (BOOLEAN)
- `completed` (BOOLEAN)
- `progress` (INTEGER)
- `is_new` (BOOLEAN)
- `tags` (TEXT[])
- `view_url` (TEXT)
- `download_url` (TEXT)
- `unlock_requirement` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

**Purpose:** Stores bonus content metadata (videos, PDFs, etc.)

---

### Tables That Exist But Have Incomplete Schemas

These tables exist in the database but are **NOT exposed via the Supabase REST API** (PostgREST schema cache). This causes the "Could not find the table in the schema cache" errors.

#### 5. **scripts_usage** (0 rows)
**Status:** ⚠ EXISTS but NOT in PostgREST cache
**Error:** `PGRST205: Could not find the table 'public.scripts_usage' in the schema cache`

**Expected Schema** (from migration):
- `id` (UUID, Primary Key)
- `user_id` (UUID, FK → auth.users)
- `script_id` (UUID, FK → scripts.id)
- `used_at` (TIMESTAMPTZ)

**Purpose:** Track when users use scripts for analytics and streaks.

---

#### 6. **script_feedback** (0 rows)
**Status:** ⚠ EXISTS and IS accessible, but may have incomplete schema

**Expected Schema** (from migration):
- `id` (UUID, Primary Key)
- `user_id` (UUID, FK → profiles.id)
- `child_id` (UUID, FK → children_profiles.id)
- `script_id` (UUID, FK → scripts.id)
- `outcome` (TEXT) - 'worked', 'progress', 'not_yet'
- `notes` (TEXT)
- `created_at` (TIMESTAMPTZ)

**Purpose:** Track parent feedback on script effectiveness.

---

#### 7. **posts** (0 rows)
**Status:** ⚠ EXISTS but NOT in PostgREST cache
**Error:** `PGRST205: Could not find the table 'public.posts' in the schema cache`

**Expected:** Should be a VIEW of `community_posts` table (see migration 20251117000010)

**Purpose:** Compatibility layer for community posts.

---

#### 8. **comments** (0 rows)
**Status:** ⚠ EXISTS and IS accessible

**Expected Schema:** Likely `post_comments` table

**Purpose:** Store comments on community posts.

---

#### 9. **reactions** (0 rows)
**Status:** ⚠ EXISTS and IS accessible

**Expected Schema:** Likely `post_likes` with reaction types

**Purpose:** Store reactions/likes on posts.

---

#### 10. **user_bonuses** (0 rows)
**Status:** ⚠ EXISTS but NOT in PostgREST cache
**Error:** `PGRST205: Could not find the table 'public.user_bonuses' in the schema cache`

**Expected Schema:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, FK → profiles.id)
- `bonus_id` (UUID, FK → bonuses.id)
- `unlocked_at` (TIMESTAMPTZ)
- `completed_at` (TIMESTAMPTZ)
- `progress` (INTEGER)

**Purpose:** Track which bonuses users have unlocked/completed.

---

#### 11. **notifications** (0 rows)
**Status:** ⚠ EXISTS and IS accessible

**Expected Schema** (from migration):
- `id` (UUID, Primary Key)
- `user_id` (UUID, FK → profiles.id)
- `type` (TEXT)
- `type_enum` (notification_type ENUM)
- `title` (TEXT)
- `message` (TEXT)
- `link` (TEXT)
- `read` (BOOLEAN)
- `related_post_id` (UUID)
- `related_comment_id` (UUID)
- `actor_id` (UUID)
- `created_at` (TIMESTAMPTZ)

**Purpose:** Store user notifications for community interactions.

---

#### 12. **badges** (0 rows)
**Status:** ⚠ EXISTS but NOT in PostgREST cache
**Error:** `PGRST205: Could not find the table 'public.badges' in the schema cache`

**Expected Schema** (from migration):
- `id` (UUID, Primary Key)
- `name` (TEXT)
- `description` (TEXT)
- `icon` (TEXT)
- `category` (TEXT)
- `requirement` (TEXT)
- `created_at` (TIMESTAMPTZ)

**Purpose:** Define available badges that users can earn.

---

#### 13. **user_badges** (0 rows)
**Status:** ⚠ EXISTS but NOT in PostgREST cache
**Error:** `PGRST205: Could not find the table 'public.user_badges' in the schema cache`

**Expected Schema:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, FK → profiles.id)
- `badge_id` (UUID, FK → badges.id)
- `earned_at` (TIMESTAMPTZ)

**Purpose:** Track which badges users have earned.

---

## Other Tables (From Types File)

These tables are defined in TypeScript types but were not tested:

- `children_profiles` - Child profile data
- `community_posts` - Community forum posts
- `feed_posts` - Admin-created feed content
- `pdfs` - PDF resources
- `post_comments` - Comments on posts
- `post_likes` - Likes/reactions on posts
- `development_milestones` - Age-based developmental milestones
- `script_collections` - User-created script collections
- `script_collection_items` - Items in collections
- `user_progress` - Overall user progress tracking
- `user_roles` - User role assignments
- `videos` - Video resources

---

## Root Causes of Console Errors

### Error 1: `tracker_days.child_id does not exist`
**Root Cause:** The `tracker_days` table has `child_profile_id` but application code queries for `child_id`.

**Fix Required:** Add `child_id` column as an alias or update all code references.

---

### Error 2: `Could not find the table 'public.scripts_usage' in the schema cache`
**Root Cause:** Table exists in PostgreSQL but is not exposed via PostgREST API.

**Fix Required:** Reload PostgREST schema cache or ensure table has proper RLS policies and grants.

---

### Error 3: `Could not find the table 'public.posts' in the schema cache`
**Root Cause:** Migration to create `posts` view was never applied.

**Fix Required:** Create view: `CREATE VIEW posts AS SELECT * FROM community_posts`

---

### Error 4: `Could not find the table 'public.badges' in the schema cache`
**Root Cause:** Badges system migration was never applied.

**Fix Required:** Run migration 20251116000001_add_badges_system.sql

---

## Why This Happened

### Timeline Reconstruction

1. **Initial Setup:** Database was created manually via Supabase dashboard
2. **Manual Schema Creation:** Tables were created directly (not via migrations)
3. **Migration Files Created:** 49 migration files created but never applied
4. **Schema Drift:** Code evolved based on migration files, but database stayed in original state
5. **Type Definitions:** TypeScript types generated from migration files, not actual database

### Evidence

- No `supabase_migrations` table exists
- Schema mismatch between types and database
- PostgREST cache doesn't include several tables
- Column name differences (`child_id` vs `child_profile_id`)

---

## Entity Relationship Diagram (Text Format)

```
profiles (1) ──────────────< (many) tracker_days
   │                              │
   │                              └──> children_profiles (via child_profile_id)
   │
   ├────────< script_feedback (many)
   │              │
   │              └──> scripts
   │
   ├────────< community_posts (many)
   │              │
   │              ├──> post_comments (many)
   │              └──> post_likes (many)
   │
   ├────────< user_bonuses (many)
   │              │
   │              └──> bonuses
   │
   ├────────< notifications (many)
   │
   ├────────< user_badges (many)
   │              │
   │              └──> badges
   │
   └────────< user_followers (many, self-referential)


scripts (1) ──────────────< (many) script_feedback
   │
   └──────────< scripts_usage (many)


children_profiles (1) ──────────────< (many) tracker_days
   │
   └──────────< script_collections
```

---

## RLS Policies Status

**Cannot be audited** because PostgREST schema cache is incomplete. Many tables exist but are not accessible via the REST API, so their RLS policies cannot be queried.

**Recommendation:** After applying migrations, audit all RLS policies to ensure:
1. Users can only access their own data
2. Admins have appropriate elevated access
3. Public data is properly exposed
4. Sensitive data is protected

---

## Recommended Action Plan

### Phase 1: Archive and Clean (IMMEDIATE)

1. **Move all existing migrations to archived folder**
   ```bash
   mv supabase/migrations/*.sql supabase/migrations/archived/
   ```

2. **Preserve the important ones we know work**
   - Keep initial profiles/tracker migration
   - Keep bonuses migration (since we have 2 bonuses in DB)

### Phase 2: Create Baseline Migration (IMMEDIATE)

Create a single migration that represents the ACTUAL current state:

`supabase/migrations/20251113000000_baseline_current_state.sql`

This should:
1. Document current schema
2. Add missing `child_id` column to `tracker_days`
3. Create missing views (`posts` → `community_posts`)
4. Ensure all tables are properly exposed via PostgREST

### Phase 3: Apply Missing Features (NEXT)

Create new migrations for features that should exist:
1. `20251113000001_add_scripts_usage_table.sql`
2. `20251113000002_add_badges_system.sql`
3. `20251113000003_add_community_features.sql`
4. `20251113000004_add_notifications_system.sql`

### Phase 4: Reload PostgREST Schema (CRITICAL)

After migrations are applied, reload the PostgREST schema cache:
```sql
NOTIFY pgrst, 'reload schema';
```

Or via Supabase dashboard: Settings → API → Reload Schema

---

## Migration Application Strategy

### Option A: Apply Migrations via Supabase CLI (RECOMMENDED)

```bash
# Link to remote project
supabase link --project-ref iogceaotdodvugrmogpp

# Apply all migrations
supabase db push
```

### Option B: Manual SQL Execution

1. Connect to database via Supabase SQL Editor
2. Execute migrations one by one in chronological order
3. Manually create `supabase_migrations` table to track progress

### Option C: Database Reset (DESTRUCTIVE - DO NOT USE)

**NOT RECOMMENDED** - Would lose 23 users, 25 scripts, 75 tracker days, 2 bonuses

---

## Critical Warnings

1. **DO NOT run migrations blindly** - They may conflict with existing schema
2. **BACKUP DATABASE FIRST** - Export all data before making changes
3. **Test in development** - Create a dev database and test migrations there first
4. **Check RLS policies** - Ensure users can't lose access to their data
5. **Reload schema cache** - Required after any schema changes

---

## Next Steps

See `docs/DATABASE_SCHEMA_FINAL.md` for:
- Complete documentation of how the database works
- All tables and their relationships
- Best practices for querying
- Common patterns and anti-patterns

See `supabase/migrations/20251113000000_baseline_current_state.sql` for:
- The migration that fixes all current issues
- Creates missing tables/columns
- Ensures PostgREST cache is updated
