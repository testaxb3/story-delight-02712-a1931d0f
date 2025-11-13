# Community Premium - Phase 1 Migration Guide

## Migration Created
✅ **File:** `supabase/migrations/20251112000000_community_premium_phase_1.sql`

## What This Migration Does

This migration implements ALL Phase 1 (MUST-HAVE) features for the premium community:

### 1. Posts with Images
- ✅ Adds `image_thumbnail_url` to `community_posts`
- ✅ Creates index for posts with images
- ⚠️ **NOTE:** `image_url` already exists (from previous migration)

### 2. Multiple Reactions (7 types)
- ✅ Creates `reaction_type` ENUM: like, love, strong, empathy, celebrate, insightful, helpful
- ✅ Adds `reaction_type` column to `post_likes` (default: 'like')
- ✅ Creates index for reaction counts by type

### 3. Nested Comments (Threads)
- ✅ Adds `parent_comment_id` to `post_comments`
- ✅ Adds `replies_count` for caching
- ✅ Creates trigger to auto-update `replies_count`

### 4. Complete User Profiles
- ✅ Adds `bio`, `badges`, `followers_count`, `following_count` to `profiles`
- ✅ Adds `posts_count`, `likes_received_count`, `comments_count` for stats
- ✅ Creates `user_followers` table
- ✅ Creates triggers to auto-update follower counts
- ✅ Creates triggers to auto-update user stats
- ✅ Creates trigger to auto-assign badges (Active Member, Helpful Parent, etc.)

### 5. Advanced Search
- ✅ Adds `search_vector` column for full-text search
- ✅ Creates GIN index for fast searching
- ✅ Creates trigger to auto-update search vector
- ✅ Updates existing posts with search vectors

### 6. Real-time Notifications
- ✅ Creates/updates `notifications` table
- ✅ Adds `type_enum`, `actor_id`, `related_post_id`, `related_comment_id`
- ✅ Creates helper function `send_notification()`
- ✅ Creates triggers for auto-notifications on:
  - Post likes
  - Comments
  - Replies
  - Follows

## How to Apply This Migration

### Option 1: Supabase CLI (Recommended)
```bash
# Make sure you're in the project root
cd "C:\Users\gabri\OneDrive\Área de Trabalho\app\brainy-child-guide"

# Apply migration
npx supabase db push
```

### Option 2: Supabase Dashboard (SQL Editor)
1. Go to https://supabase.com/dashboard/project/YOUR_PROJECT/sql
2. Open the migration file: `supabase/migrations/20251112000000_community_premium_phase_1.sql`
3. Copy the entire contents
4. Paste into SQL Editor
5. Click "RUN"

### Option 3: Migration Script
```bash
# Run the apply migration script (if you have one)
node apply-migration-via-supabase.mjs supabase/migrations/20251112000000_community_premium_phase_1.sql
```

## Verify Migration Success

After applying, run these queries in SQL Editor to verify:

```sql
-- Check new columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'community_posts'
AND column_name IN ('image_thumbnail_url', 'search_vector');

-- Check reaction_type ENUM exists
SELECT unnest(enum_range(NULL::reaction_type));

-- Check user_followers table exists
SELECT * FROM user_followers LIMIT 1;

-- Check notifications table has new columns
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'notifications';

-- Check triggers exist
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name LIKE '%notify%' OR trigger_name LIKE '%update%';
```

## Next Steps (After Migration)

Once the migration is applied successfully:

1. ✅ **Storage Bucket Setup** - Create `community-posts` bucket in Supabase Storage
2. 🚀 **Frontend Implementation** - I will implement:
   - PostImageUpload component
   - ReactionPicker component
   - Nested comments UI
   - User profiles pages
   - Search and filters
   - Notifications system

## Rollback (If Needed)

If you need to rollback this migration:

```sql
-- WARNING: This will delete data!

DROP TRIGGER IF EXISTS trigger_notify_on_follow ON public.user_followers;
DROP TRIGGER IF EXISTS trigger_notify_on_comment ON public.post_comments;
DROP TRIGGER IF EXISTS trigger_notify_on_post_like ON public.post_likes;
DROP TRIGGER IF EXISTS trigger_auto_assign_badges ON public.profiles;
DROP TRIGGER IF EXISTS trigger_update_likes_stats ON public.post_likes;
DROP TRIGGER IF EXISTS trigger_update_comments_stats ON public.post_comments;
DROP TRIGGER IF EXISTS trigger_update_posts_stats ON public.community_posts;
DROP TRIGGER IF EXISTS trigger_update_follower_counts ON public.user_followers;
DROP TRIGGER IF EXISTS trigger_update_comment_replies_count ON public.post_comments;
DROP TRIGGER IF EXISTS trigger_update_search_vector ON public.community_posts;

DROP FUNCTION IF EXISTS notify_on_follow();
DROP FUNCTION IF EXISTS notify_on_comment();
DROP FUNCTION IF EXISTS notify_on_post_like();
DROP FUNCTION IF EXISTS send_notification(UUID, notification_type, TEXT, TEXT, UUID, UUID, UUID, TEXT);
DROP FUNCTION IF EXISTS auto_assign_badges();
DROP FUNCTION IF EXISTS update_user_stats();
DROP FUNCTION IF EXISTS update_follower_counts();
DROP FUNCTION IF EXISTS update_comment_replies_count();
DROP FUNCTION IF EXISTS update_search_vector();

DROP TABLE IF EXISTS public.user_followers;

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS bio,
  DROP COLUMN IF EXISTS badges,
  DROP COLUMN IF EXISTS followers_count,
  DROP COLUMN IF EXISTS following_count,
  DROP COLUMN IF EXISTS posts_count,
  DROP COLUMN IF EXISTS likes_received_count,
  DROP COLUMN IF EXISTS comments_count;

ALTER TABLE public.post_comments
  DROP COLUMN IF EXISTS parent_comment_id,
  DROP COLUMN IF EXISTS replies_count;

ALTER TABLE public.post_likes
  DROP COLUMN IF EXISTS reaction_type;

ALTER TABLE public.community_posts
  DROP COLUMN IF EXISTS image_thumbnail_url,
  DROP COLUMN IF EXISTS search_vector;

ALTER TABLE public.notifications
  DROP COLUMN IF EXISTS type_enum,
  DROP COLUMN IF EXISTS actor_id,
  DROP COLUMN IF EXISTS related_post_id,
  DROP COLUMN IF EXISTS related_comment_id;

DROP TYPE IF EXISTS public.reaction_type;
DROP TYPE IF EXISTS public.notification_type;
```

## Questions?

If you encounter any errors during migration, let me know and I'll help troubleshoot!
