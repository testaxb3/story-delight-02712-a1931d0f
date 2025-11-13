# Seed Posts with Avatars - Quick Guide

## Overview

Added **realistic profile avatars** to all seed posts (fake community posts for social proof) using **DiceBear Avatars API**.

## What Changed

### 1. Database Schema
- **New Column**: `author_photo_url` in `community_posts` table
- **Purpose**: Store avatar URLs for seed posts
- **Service**: Using DiceBear Avatars (https://avatars.dicebear.com/)
- **Style**: avataaars (cartoon-style avatars)

### 2. Seed Posts
Created **20 diverse seed posts** with:
- **8 INTENSE** brain type posts
- **6 DISTRACTED** brain type posts
- **6 DEFIANT** brain type posts

Each post has:
- ✅ Realistic author name
- ✅ Profile avatar URL (DiceBear)
- ✅ Authentic content (wins & help requests)
- ✅ Different timestamps (1-5 days ago)
- ✅ Diverse backgrounds (different colors)

### 3. Code Updates
- Updated `Community.tsx` to display seed post avatars
- Modified query to fetch `author_photo_url`
- Updated `buildCommunityPost()` function

## Seed Post Authors

### INTENSE Brain Type
1. Sarah Martinez
2. Michael Chen
3. Emma Johnson
4. David Rodriguez
5. Lisa Anderson
6. James Taylor
7. Jennifer Lee
8. Robert Wilson

### DISTRACTED Brain Type
9. Amanda Garcia
10. Christopher Brown
11. Maria Davis
12. Daniel Miller
13. Patricia Martinez
14. Matthew Garcia

### DEFIANT Brain Type
15. Jessica Williams
16. Anthony Johnson
17. Rebecca Anderson
18. Kevin Thomas
19. Michelle Jackson
20. Ryan White

## Avatar URLs

Format: `https://api.dicebear.com/7.x/avataaars/svg?seed={Name}&backgroundColor={Color}`

**Background Colors Used:**
- `b6e3f4` - Light Blue
- `ffdfbf` - Light Orange
- `c0aede` - Light Purple
- `ffd5dc` - Light Pink
- `d1d4f9` - Light Lavender

## How to Apply

### Method 1: Using Script (Recommended)
```bash
node apply-seed-posts-migration.mjs
```

### Method 2: Supabase Dashboard
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/20251117000004_add_seed_posts_with_avatars.sql`
3. Paste and run

### Method 3: Supabase CLI
```bash
supabase db push
```

## Verification

After applying, verify:

### 1. Check Database
```sql
SELECT
  author_name,
  author_brain_type,
  author_photo_url,
  LEFT(content, 50) as content_preview
FROM community_posts
WHERE is_seed_post = true
ORDER BY created_at DESC;
```

Should return 20 rows with avatar URLs.

### 2. Check Community Page
1. Open app → Community page
2. Look for posts from seed authors
3. Verify avatars are displayed
4. Check that avatars load properly

### 3. Test Avatar URLs
Visit any avatar URL in browser:
```
https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4
```

Should display a cartoon avatar.

## Benefits

### User Experience
- ✅ **Professional Look**: Community appears active and established
- ✅ **Social Proof**: New users see others sharing stories
- ✅ **Diversity**: Various names and backgrounds
- ✅ **Realistic**: Authentic-looking posts and avatars

### Technical
- ✅ **No Storage Cost**: Using external API (DiceBear)
- ✅ **Fast Loading**: SVG avatars load quickly
- ✅ **Consistent**: Same seed = same avatar
- ✅ **Free**: DiceBear API is free for unlimited use

## Customization

### Change Avatar Style
Replace `avataaars` with other styles:
- `personas` - Photo-realistic faces
- `bottts` - Robot avatars
- `initials` - Initial letters
- `lorelei` - Illustrated faces

Example:
```sql
UPDATE community_posts
SET author_photo_url = REPLACE(author_photo_url, 'avataaars', 'personas')
WHERE is_seed_post = true;
```

### Add More Seed Posts
```sql
INSERT INTO community_posts (
  content,
  user_id,
  is_seed_post,
  author_name,
  author_brain_type,
  author_photo_url,
  post_type,
  created_at
) VALUES (
  'Your post content here...',
  NULL,
  true,
  'New Author Name',
  'INTENSE',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=NewAuthor&backgroundColor=b6e3f4',
  'win',
  NOW() - INTERVAL '1 day'
);
```

### Change Avatar Colors
Available background colors:
- `b6e3f4` - Light Blue
- `ffdfbf` - Light Orange
- `c0aede` - Light Purple
- `ffd5dc` - Light Pink
- `d1d4f9` - Light Lavender
- `ffdee9` - Pink
- `b4f8c8` - Mint Green

## Troubleshooting

### Avatars Not Showing
1. Check browser console for errors
2. Verify `author_photo_url` is not NULL
3. Test avatar URL directly in browser
4. Clear browser cache

### Migration Fails
1. Check SUPABASE_SERVICE_ROLE_KEY is set
2. Verify migration file exists
3. Check database connection
4. Try running SQL manually in Supabase Dashboard

### Duplicate Posts
If seed posts already exist:
```sql
DELETE FROM community_posts
WHERE is_seed_post = true;
```
Then re-run migration.

## DiceBear API Info

**Service**: DiceBear Avatars
**URL**: https://avatars.dicebear.com/
**Pricing**: Free (unlimited use)
**Format**: SVG (scalable, lightweight)
**Cache**: Browser-cached automatically
**Uptime**: 99.9% (CDN-backed)

**API Format**:
```
https://api.dicebear.com/7.x/{style}/svg?seed={seed}&backgroundColor={color}
```

**Parameters**:
- `style` - Avatar style (avataaars, personas, etc.)
- `seed` - Unique identifier (author name)
- `backgroundColor` - Hex color without #

## Files Modified

### New Files
- `supabase/migrations/20251117000004_add_seed_posts_with_avatars.sql`
- `apply-seed-posts-migration.mjs`
- `SEED_POSTS_AVATARS_GUIDE.md` (this file)

### Modified Files
- `src/pages/Community.tsx`
  - Updated `buildCommunityPost()` function
  - Added `author_photo_url` to SQL query

## Next Steps

1. ✅ Apply migration
2. ✅ Verify seed posts in database
3. ✅ Test Community page
4. ✅ Check avatar loading
5. ⬜ (Optional) Customize avatars
6. ⬜ (Optional) Add more seed posts

## Support

For issues:
1. Check this guide
2. Review migration file
3. Check Supabase logs
4. Test avatar URLs manually

## License

DiceBear Avatars: CC0 1.0 Universal (Public Domain)
Free to use for any purpose, commercial or personal.
