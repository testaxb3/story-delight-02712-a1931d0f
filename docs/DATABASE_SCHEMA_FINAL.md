# Database Schema - Complete Guide

**Database:** Brainy Child Guide (iogceaotdodvugrmogpp)
**Last Updated:** 2025-11-13

---

## Overview

The Brainy Child Guide database supports a parenting platform with:
- User authentication and profiles
- Brain-profile-based parenting scripts
- 30-day tracking challenge
- Community features (posts, comments, reactions)
- Premium content (bonuses, videos, PDFs)
- Gamification (badges, streaks, leaderboards)

---

## Core Architecture

### Authentication Layer
- Uses Supabase Auth (`auth.users`)
- Each authenticated user has a matching row in `profiles` table
- Profile created via trigger on user signup

### Data Organization
- **User-centric:** Most data belongs to specific users
- **Child-profile support:** Multiple children per user (future feature)
- **Brain profiles:** Scripts are categorized by child brain type (Thinker, Feeler, Doer)

---

## Table Catalog

### 1. User Management

#### `profiles`
**Primary user table** - Extended user information beyond auth.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Matches auth.users.id |
| `email` | TEXT | User email (from auth) |
| `name` | TEXT | Display name |
| `premium` | BOOLEAN | Premium subscription status |
| `quiz_completed` | BOOLEAN | Completed onboarding quiz |
| `role` | TEXT | User role (deprecated - use is_admin) |
| `is_admin` | BOOLEAN | Admin access flag |
| `child_name` | TEXT | Primary child's name |
| `avatar_url` | TEXT | Profile picture URL |
| `brain_profile` | TEXT | Child's brain type (Thinker/Feeler/Doer) |
| `photo_url` | TEXT | Alternate photo URL |
| `welcome_modal_shown` | BOOLEAN | Has seen welcome modal |
| `bio` | TEXT | User bio for community |
| `badges` | TEXT[] | Array of badge names |
| `followers_count` | INTEGER | Number of followers |
| `following_count` | INTEGER | Number of users following |
| `posts_count` | INTEGER | Total posts created |
| `likes_received_count` | INTEGER | Total likes received |
| `comments_count` | INTEGER | Total comments made |
| `created_at` | TIMESTAMPTZ | Account creation time |
| `updated_at` | TIMESTAMPTZ | Last updated time |

**Relationships:**
- 1:Many with `tracker_days`
- 1:Many with `script_feedback`
- 1:Many with `community_posts`
- 1:Many with `children_profiles`
- 1:1 with `user_progress`

**RLS Policies:**
- Users can read all profiles (for community features)
- Users can only update their own profile
- Admins have full access

**Common Queries:**
```sql
-- Get user with stats
SELECT * FROM profiles WHERE id = auth.uid();

-- Top contributors
SELECT * FROM profiles
ORDER BY likes_received_count DESC
LIMIT 10;

-- Premium users
SELECT * FROM profiles WHERE premium = true;
```

---

#### `children_profiles`
**Child profiles** - Support for multiple children per user (future feature).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique child identifier |
| `user_id` | UUID FK | Parent user (→ profiles.id) |
| `name` | TEXT | Child's name |
| `brain_profile` | TEXT | Thinker/Feeler/Doer |
| `created_at` | TIMESTAMPTZ | When added |

**Note:** Currently most features use `profiles.child_name` and `profiles.brain_profile`. This table is for future multi-child support.

---

#### `user_progress`
**Overall progress tracking** - High-level stats per user.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `user_id` | UUID FK | User (→ profiles.id) |
| `streak` | INTEGER | Current day streak |
| `scripts_used` | INTEGER | Total scripts used |
| `last_check_in` | TIMESTAMPTZ | Last activity date |
| `videos_watched` | INTEGER[] | Array of watched video IDs |
| `pdfs_downloaded` | INTEGER[] | Array of downloaded PDF IDs |
| `created_at` | TIMESTAMPTZ | When created |

**Purpose:** Cache frequently accessed stats to avoid expensive queries.

---

### 2. Parenting Scripts

#### `scripts`
**Core content table** - The parenting strategies/scripts.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique script identifier |
| `title` | TEXT | Script name (e.g., "Bedtime Resistance") |
| `category` | TEXT | Category (Sleep, Mealtime, etc.) |
| `profile` | TEXT | Brain profile (Thinker/Feeler/Doer/All) |
| `wrong_way` | TEXT | What doesn't work and why |
| `phrase_1` | TEXT | First phrase to say |
| `phrase_1_action` | TEXT | What to do with phrase 1 |
| `phrase_2` | TEXT | Second phrase |
| `phrase_2_action` | TEXT | What to do with phrase 2 |
| `phrase_3` | TEXT | Third phrase |
| `phrase_3_action` | TEXT | What to do with phrase 3 |
| `neurological_tip` | TEXT | Brain science explanation |
| `tags` | TEXT[] | Search tags |
| `estimated_time_minutes` | INTEGER | How long script takes |
| `difficulty_level` | TEXT | Easy/Medium/Hard |
| `age_range` | TEXT | Appropriate ages |
| `age_min` | INTEGER | Minimum age in years |
| `age_max` | INTEGER | Maximum age in years |
| `duration_minutes` | INTEGER | Expected duration |
| `situation_trigger` | TEXT | When to use this |
| `location_type` | TEXT[] | Where it works (Home, Public, etc.) |
| `time_optimal` | TEXT[] | Best time of day |
| `intensity_level` | TEXT | Child's current state |
| `success_speed` | TEXT | How quickly it works |
| `parent_state` | TEXT[] | Required parent mindset |
| `parent_state_needed` | TEXT | Detailed parent requirements |
| `backup_plan` | TEXT | What to do if it doesn't work |
| `common_mistakes` | TEXT[] | What to avoid |
| `requires_preparation` | BOOLEAN | Needs setup beforehand |
| `works_in_public` | BOOLEAN | Usable in public places |
| `emergency_suitable` | BOOLEAN | For crisis situations |
| `pause_after_phrase_1` | INTEGER | Seconds to wait |
| `pause_after_phrase_2` | INTEGER | Seconds to wait |
| `expected_time_seconds` | INTEGER | Total expected time |
| `related_script_ids` | TEXT[] | Similar scripts |
| `the_situation` | TEXT | Detailed scenario description |
| `what_doesnt_work` | TEXT | Extended wrong approach |
| `strategy_steps` | JSONB | Structured step-by-step |
| `why_this_works` | TEXT | Neuroscience explanation |
| `what_to_expect` | JSONB | Expected outcomes |
| `common_variations` | JSONB | Alternative approaches |
| `difficulty` | TEXT | Difficulty rating |
| `say_it_like_this_step1` | TEXT | Exact words for step 1 |
| `avoid_step1` | TEXT | What not to say in step 1 |
| `say_it_like_this_step2` | TEXT | Exact words for step 2 |
| `avoid_step2` | TEXT | What not to say in step 2 |
| `say_it_like_this_step3` | TEXT | Exact words for step 3 |
| `avoid_step3` | TEXT | What not to say in step 3 |
| `created_at` | TIMESTAMPTZ | When created |

**RLS Policies:**
- Everyone can read scripts
- Only admins can create/update/delete

**Common Queries:**
```sql
-- Get scripts for specific brain profile
SELECT * FROM scripts
WHERE profile IN ('Thinker', 'All')
ORDER BY title;

-- Search scripts by category and tags
SELECT * FROM scripts
WHERE category = 'Sleep'
  AND 'toddler' = ANY(tags);

-- Emergency-suitable scripts
SELECT * FROM scripts
WHERE emergency_suitable = true
  AND works_in_public = true;
```

---

#### `script_feedback`
**User feedback on scripts** - Track what works.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `user_id` | UUID FK | User who gave feedback |
| `child_id` | UUID FK | Which child (→ children_profiles) |
| `script_id` | UUID FK | Which script (→ scripts) |
| `outcome` | TEXT | 'worked', 'progress', 'not_yet' |
| `notes` | TEXT | Additional comments |
| `created_at` | TIMESTAMPTZ | When submitted |

**Purpose:** Track script effectiveness per user/child combination.

**RLS Policies:**
- Users can only see/edit their own feedback

---

#### `scripts_usage`
**Usage tracking** - Analytics and streak calculation.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `user_id` | UUID FK | User (→ auth.users) |
| `script_id` | UUID FK | Script used (→ scripts) |
| `used_at` | TIMESTAMPTZ | When used |

**Purpose:** Track every time a user views/uses a script for:
- Daily streak calculation
- Popular scripts analysis
- Usage patterns

**RLS Policies:**
- Users can only see their own usage
- Users can insert their own usage

---

#### `script_collections`
**User-created collections** - Organize favorite scripts.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `user_id` | UUID FK | Collection owner |
| `child_profile_id` | UUID FK | Associated child (optional) |
| `name` | TEXT | Collection name |
| `created_at` | TIMESTAMPTZ | When created |
| `updated_at` | TIMESTAMPTZ | Last modified |

---

#### `script_collection_items`
**Items in collections** - Many-to-many relationship.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `collection_id` | UUID FK | Parent collection |
| `script_id` | UUID FK | Script in collection |
| `created_at` | TIMESTAMPTZ | When added |

---

### 3. 30-Day Tracker

#### `tracker_days`
**Daily check-ins** - Core feature for 30-day challenge.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `user_id` | UUID FK | User (→ profiles.id) |
| `child_profile_id` | UUID FK | Child (→ children_profiles) |
| `day_number` | INTEGER | Day 1-30 |
| `date` | DATE | Actual calendar date |
| `completed` | BOOLEAN | Checked in for this day |
| `completed_at` | TIMESTAMPTZ | When checked in |
| `stress_level` | INTEGER | 1-10 parent stress |
| `meltdown_count` | TEXT | Number of meltdowns |
| `notes` | TEXT | User notes |
| `streak_freeze_used` | BOOLEAN | Used freeze on this day |
| `created_at` | TIMESTAMPTZ | Record created |
| `updated_at` | TIMESTAMPTZ | Last modified |

**KNOWN ISSUE:** Code references `child_id` but table has `child_profile_id`.

**Common Queries:**
```sql
-- Get user's current streak
SELECT COUNT(*)
FROM tracker_days
WHERE user_id = auth.uid()
  AND completed = true
  AND date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY date DESC;

-- Get specific day
SELECT * FROM tracker_days
WHERE user_id = auth.uid()
  AND day_number = 1;

-- Weekly progress
SELECT
  DATE_TRUNC('week', date) as week,
  COUNT(*) as days_completed,
  AVG(stress_level) as avg_stress
FROM tracker_days
WHERE user_id = auth.uid()
  AND completed = true
GROUP BY week;
```

---

### 4. Community Features

#### `community_posts`
**User-generated posts** - Community forum content.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `user_id` | UUID FK | Post author (→ profiles.id) |
| `content` | TEXT | Post body (markdown) |
| `created_at` | TIMESTAMPTZ | When posted |

**Related Views:**
- `posts` - Compatibility view (maps `user_id` to `author_id`)

**RLS Policies:**
- Everyone can read posts
- Only author can update/delete their posts
- Users can create new posts

---

#### `post_comments`
**Comments on posts** - Nested comment threads.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `post_id` | UUID FK | Parent post |
| `user_id` | UUID FK | Comment author |
| `parent_comment_id` | UUID FK | Parent comment (for replies) |
| `content` | TEXT | Comment text |
| `replies_count` | INTEGER | Number of replies |
| `created_at` | TIMESTAMPTZ | When posted |
| `updated_at` | TIMESTAMPTZ | Last edited |

**Features:**
- Nested comments (replies to comments)
- Auto-increments `replies_count` on parent

---

#### `post_likes`
**Reactions on posts** - Multiple reaction types.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `post_id` | UUID FK | Post being liked |
| `user_id` | UUID FK | User who reacted |
| `reaction_type` | ENUM | Type of reaction |
| `created_at` | TIMESTAMPTZ | When reacted |

**Reaction Types:**
- `like` ❤️ - General like
- `love` 💕 - Love it
- `strong` 💪 - Strength/support
- `empathy` 🤗 - Empathy/understanding
- `celebrate` 🎉 - Celebrate success
- `insightful` 💡 - Insightful comment
- `helpful` 🙌 - Helpful advice

**Constraints:**
- One reaction per user per post (can change reaction type)

---

#### `user_followers`
**Follow system** - Users can follow each other.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `follower_id` | UUID FK | User doing the following |
| `following_id` | UUID FK | User being followed |
| `created_at` | TIMESTAMPTZ | When followed |

**Constraints:**
- Cannot follow yourself
- Unique pair (follower, following)

**Triggers:**
- Auto-updates `followers_count` and `following_count` in profiles

---

#### `notifications`
**User notifications** - Activity notifications.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `user_id` | UUID FK | Recipient |
| `type` | TEXT | Notification category |
| `type_enum` | ENUM | Typed category |
| `title` | TEXT | Notification title |
| `message` | TEXT | Notification body |
| `link` | TEXT | Where to navigate |
| `actor_id` | UUID FK | Who triggered it |
| `related_post_id` | UUID FK | Related post (optional) |
| `related_comment_id` | UUID FK | Related comment (optional) |
| `read` | BOOLEAN | Has been read |
| `created_at` | TIMESTAMPTZ | When created |

**Notification Types:**
- `like` - Someone liked your post
- `comment` - Someone commented on your post
- `reply` - Someone replied to your comment
- `mention` - Someone mentioned you
- `follow` - Someone followed you

**RLS Policies:**
- Users can only see their own notifications
- Users can mark their notifications as read

---

### 5. Premium Content

#### `bonuses`
**Premium content items** - Videos, PDFs, templates, etc.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `title` | TEXT | Bonus name |
| `description` | TEXT | What it includes |
| `category` | TEXT | Type (Video, PDF, Template, etc.) |
| `thumbnail` | TEXT | Preview image URL |
| `duration` | TEXT | "15 min" or page count |
| `file_size` | TEXT | "12 MB" |
| `locked` | BOOLEAN | Requires premium |
| `completed` | BOOLEAN | User has completed (deprecated) |
| `progress` | INTEGER | Completion % (deprecated) |
| `is_new` | BOOLEAN | Show "NEW" badge |
| `tags` | TEXT[] | Search tags |
| `view_url` | TEXT | Where to view content |
| `download_url` | TEXT | Download link |
| `unlock_requirement` | TEXT | "Premium only", "Day 10", etc. |
| `created_at` | TIMESTAMPTZ | When added |
| `updated_at` | TIMESTAMPTZ | Last modified |

**Note:** `completed` and `progress` should be moved to `user_bonuses` table for per-user tracking.

---

#### `user_bonuses`
**User bonus progress** - Track which bonuses users have unlocked/completed.

**Expected Schema:**
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `user_id` | UUID FK | User |
| `bonus_id` | UUID FK | Bonus item |
| `unlocked_at` | TIMESTAMPTZ | When unlocked |
| `completed_at` | TIMESTAMPTZ | When completed |
| `progress` | INTEGER | Completion percentage |

**Status:** Table exists but schema not confirmed.

---

#### `videos`
**Video library** - Educational videos.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `title` | TEXT | Video title |
| `description` | TEXT | Video description |
| `section` | TEXT | Category/section |
| `duration` | TEXT | "12:34" |
| `video_url` | TEXT | Vimeo/YouTube URL |
| `thumbnail_url` | TEXT | Preview image |
| `premium_only` | BOOLEAN | Requires subscription |
| `order_index` | INTEGER | Display order |
| `created_at` | TIMESTAMPTZ | When added |

---

#### `pdfs`
**PDF resources** - Downloadable guides.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `title` | TEXT | PDF name |
| `description` | TEXT | What it covers |
| `category` | TEXT | Type of resource |
| `file_url` | TEXT | Download URL |
| `file_size` | TEXT | "2.5 MB" |
| `page_count` | INTEGER | Number of pages |
| `premium_only` | BOOLEAN | Requires subscription |
| `created_at` | TIMESTAMPTZ | When added |

---

### 6. Gamification

#### `badges`
**Badge definitions** - Available achievements.

**Expected Schema:**
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `name` | TEXT | Badge name |
| `description` | TEXT | How to earn it |
| `icon` | TEXT | Icon/emoji |
| `category` | TEXT | Type of achievement |
| `requirement` | TEXT | Earning criteria |

**Status:** Table exists but schema not confirmed.

**Badge Examples:**
- Active Member (10+ posts)
- Helpful Parent (20+ comments)
- Top Contributor (50+ likes received)
- Rising Star (10+ followers)
- Community Leader (100+ posts)

**Note:** Currently badges are stored as TEXT[] in `profiles.badges` table.

---

#### `user_badges`
**User achievements** - Badges earned by users.

**Expected Schema:**
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `user_id` | UUID FK | User |
| `badge_id` | UUID FK | Badge earned |
| `earned_at` | TIMESTAMPTZ | When earned |

**Status:** Table exists but schema not confirmed.

---

### 7. Content Management

#### `feed_posts`
**Admin-created content** - News, tips, announcements.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `title` | TEXT | Post title |
| `content` | TEXT | Post body (markdown) |
| `image_url` | TEXT | Featured image |
| `cta_text` | TEXT | Call-to-action button |
| `cta_link` | TEXT | CTA destination |
| `published` | BOOLEAN | Visible to users |
| `created_at` | TIMESTAMPTZ | When created |

**Purpose:** Admin-managed content feed separate from community posts.

---

#### `development_milestones`
**Age-based milestones** - Developmental expectations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Unique identifier |
| `brain_profile` | TEXT | Thinker/Feeler/Doer |
| `age_range` | TEXT | "2-3 years" |
| `milestone_title` | TEXT | What to expect |
| `milestone_description` | TEXT | Detailed explanation |
| `recommended_script_ids` | TEXT[] | Related scripts |
| `recommended_video_ids` | TEXT[] | Related videos |
| `created_at` | TIMESTAMPTZ | When added |

**Purpose:** Help parents understand developmental stages and find relevant content.

---

## Views

### `child_script_recommendations`
**Recommended scripts per child** - Smart recommendations.

**Columns:**
| Column | Type | Description |
|--------|------|-------------|
| `child_profile_id` | UUID | Child identifier |
| `script_id` | UUID | Recommended script |
| `title` | TEXT | Script title |
| `category` | TEXT | Script category |
| `profile` | TEXT | Brain profile |
| `tags` | TEXT[] | Script tags |
| `feedback_count` | INTEGER | Times used for this child |
| `success_score` | NUMERIC | Success rate |
| `last_used_at` | TIMESTAMPTZ | Last usage |
| `estimated_time_minutes` | INTEGER | Time required |

**Purpose:** Personalized script recommendations based on:
- Child's brain profile
- Past feedback/success
- Age appropriateness
- Usage patterns

---

## Functions

### `has_role(role TEXT, user_id UUID)`
Check if a user has a specific role.

**Returns:** BOOLEAN

**Example:**
```sql
SELECT has_role('admin', auth.uid());
```

---

### `is_admin()`
Check if current user is an admin.

**Returns:** BOOLEAN

**Example:**
```sql
SELECT * FROM scripts WHERE is_admin() OR published = true;
```

---

### `send_notification(...)`
Create a new notification for a user.

**Parameters:**
- `p_user_id` UUID - Recipient
- `p_type` notification_type - Type
- `p_title` TEXT - Title
- `p_message` TEXT - Message
- `p_actor_id` UUID - Who triggered it
- `p_related_post_id` UUID (optional)
- `p_related_comment_id` UUID (optional)

**Example:**
```sql
SELECT send_notification(
  author_user_id,
  'comment',
  'New comment on your post',
  'Someone commented on your post',
  auth.uid(),
  post_id,
  NULL
);
```

---

## Common Patterns

### 1. Get User's Dashboard Data
```sql
-- User profile with stats
SELECT * FROM profiles WHERE id = auth.uid();

-- Current streak
SELECT COUNT(*) as streak
FROM tracker_days
WHERE user_id = auth.uid()
  AND completed = true
  AND date >= CURRENT_DATE - INTERVAL '30 days';

-- Today's tracker
SELECT * FROM tracker_days
WHERE user_id = auth.uid()
  AND date = CURRENT_DATE;

-- Recommended scripts
SELECT * FROM child_script_recommendations
WHERE child_profile_id = (
  SELECT id FROM children_profiles
  WHERE user_id = auth.uid()
  LIMIT 1
);
```

---

### 2. Community Feed
```sql
-- Recent posts with author info
SELECT
  p.*,
  profiles.name as author_name,
  profiles.avatar_url as author_avatar,
  COUNT(DISTINCT pl.id) as likes_count,
  COUNT(DISTINCT pc.id) as comments_count
FROM community_posts p
LEFT JOIN profiles ON profiles.id = p.user_id
LEFT JOIN post_likes pl ON pl.post_id = p.id
LEFT JOIN post_comments pc ON pc.post_id = p.id
GROUP BY p.id, profiles.name, profiles.avatar_url
ORDER BY p.created_at DESC
LIMIT 20;
```

---

### 3. User's Activity
```sql
-- User's posts
SELECT * FROM community_posts
WHERE user_id = auth.uid()
ORDER BY created_at DESC;

-- User's comments
SELECT
  pc.*,
  cp.content as post_content
FROM post_comments pc
JOIN community_posts cp ON cp.id = pc.post_id
WHERE pc.user_id = auth.uid()
ORDER BY pc.created_at DESC;

-- User's script usage history
SELECT
  su.used_at,
  s.title,
  s.category
FROM scripts_usage su
JOIN scripts s ON s.id = su.script_id
WHERE su.user_id = auth.uid()
ORDER BY su.used_at DESC;
```

---

### 4. Admin Analytics
```sql
-- Most popular scripts
SELECT
  s.title,
  COUNT(su.id) as usage_count,
  COUNT(DISTINCT su.user_id) as unique_users
FROM scripts s
LEFT JOIN scripts_usage su ON su.script_id = s.id
GROUP BY s.id
ORDER BY usage_count DESC
LIMIT 10;

-- User engagement metrics
SELECT
  COUNT(DISTINCT user_id) as total_users,
  COUNT(DISTINCT CASE WHEN premium = true THEN user_id END) as premium_users,
  AVG(posts_count) as avg_posts_per_user,
  AVG(followers_count) as avg_followers
FROM profiles;

-- Daily active users
SELECT
  date,
  COUNT(DISTINCT user_id) as active_users
FROM tracker_days
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY date
ORDER BY date DESC;
```

---

## Security & RLS

### RLS Policy Patterns

#### User-owned data
```sql
CREATE POLICY "Users manage own data"
ON table_name
USING (auth.uid() = user_id);
```

#### Public read, owner write
```sql
CREATE POLICY "Public read"
ON table_name FOR SELECT
USING (true);

CREATE POLICY "Owner write"
ON table_name FOR UPDATE
USING (auth.uid() = user_id);
```

#### Admin access
```sql
CREATE POLICY "Admin full access"
ON table_name
USING (is_admin());
```

---

### Security Best Practices

1. **Always use RLS:** Enable on every table
2. **Validate inputs:** Use CHECK constraints
3. **Foreign keys:** Maintain referential integrity
4. **Indexes:** Add for frequently queried columns
5. **Soft deletes:** Consider adding `deleted_at` instead of hard deletes

---

## Performance Optimization

### Recommended Indexes

```sql
-- Tracker days
CREATE INDEX idx_tracker_days_user_date
ON tracker_days(user_id, date DESC);

-- Scripts usage
CREATE INDEX idx_scripts_usage_user_used_at
ON scripts_usage(user_id, used_at DESC);

-- Community posts
CREATE INDEX idx_community_posts_created_at
ON community_posts(created_at DESC);

-- Post likes
CREATE INDEX idx_post_likes_post_reaction
ON post_likes(post_id, reaction_type);

-- Notifications
CREATE INDEX idx_notifications_user_read
ON notifications(user_id, read, created_at DESC);
```

---

### Query Optimization Tips

1. **Use materialized views** for complex aggregations
2. **Batch insert** when creating multiple records
3. **Limit results** with `LIMIT` clause
4. **Count efficiently** using `COUNT(*) FILTER (WHERE ...)`
5. **Avoid N+1 queries** by using JOINs or batch queries

---

## Migration Strategy

### Current Situation
- Migrations folder has 49 SQL files
- **None have been applied** to production database
- Database was created manually
- Schema drift between code expectations and reality

### Recommended Approach

1. **Create baseline migration** documenting current state
2. **Apply missing features** incrementally
3. **Test thoroughly** in development first
4. **Backup before applying** to production
5. **Reload PostgREST schema** after changes

See `docs/DATABASE_AUDIT_FINAL.md` for detailed migration plan.

---

## Troubleshooting

### "Table not found in schema cache"

**Cause:** Table exists in PostgreSQL but not exposed via PostgREST API

**Fix:**
1. Ensure table has RLS policies
2. Grant proper permissions: `GRANT ALL ON table_name TO authenticated;`
3. Reload schema: `NOTIFY pgrst, 'reload schema';`
4. Or in Supabase dashboard: Settings → API → Reload Schema

---

### "Column does not exist"

**Cause:** Code references a column that doesn't exist in database

**Examples:**
- Code uses `child_id` but table has `child_profile_id`
- Migration added column but wasn't applied

**Fix:**
1. Add missing column via migration
2. Or update code to use existing column name

---

### "Permission denied"

**Cause:** RLS policy blocking access

**Fix:**
1. Check RLS policies on table
2. Ensure user has proper role/permissions
3. Test with `is_admin()` to verify admin access works

---

## Additional Resources

- **Supabase Dashboard:** https://supabase.com/dashboard/project/iogceaotdodvugrmogpp
- **PostgREST Docs:** https://postgrest.org
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

## Appendix: Full Table List

| Table | Purpose | Row Count | Status |
|-------|---------|-----------|--------|
| `profiles` | User profiles | 23 | ✅ Active |
| `children_profiles` | Child profiles | ? | ✅ Active |
| `scripts` | Parenting scripts | 25 | ✅ Active |
| `tracker_days` | Daily check-ins | 75 | ⚠ Missing `child_id` |
| `script_feedback` | Script ratings | 0 | ⚠ Incomplete schema |
| `scripts_usage` | Usage tracking | 0 | ❌ Not in API cache |
| `script_collections` | User collections | ? | ✅ Active |
| `script_collection_items` | Collection items | ? | ✅ Active |
| `community_posts` | User posts | 0 | ✅ Active |
| `post_comments` | Comments | 0 | ✅ Active |
| `post_likes` | Reactions | 0 | ✅ Active |
| `user_followers` | Follow system | ? | ✅ Active |
| `notifications` | User notifications | 0 | ⚠ Incomplete schema |
| `bonuses` | Premium content | 2 | ✅ Active |
| `user_bonuses` | Bonus progress | 0 | ❌ Not in API cache |
| `badges` | Achievement defs | 0 | ❌ Not in API cache |
| `user_badges` | User achievements | 0 | ❌ Not in API cache |
| `videos` | Video library | ? | ✅ Active |
| `pdfs` | PDF resources | ? | ✅ Active |
| `feed_posts` | Admin content | ? | ✅ Active |
| `development_milestones` | Age milestones | ? | ✅ Active |
| `user_progress` | Overall stats | ? | ✅ Active |
| `user_roles` | Role assignments | ? | ✅ Active |

**Legend:**
- ✅ Active - Working as expected
- ⚠ Issues - Has problems that need fixing
- ❌ Not in API cache - Exists but not accessible via Supabase client
- ? - Row count unknown (not tested)
