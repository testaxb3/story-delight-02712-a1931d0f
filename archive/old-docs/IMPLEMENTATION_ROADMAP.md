# NEP System - Implementation Roadmap

## ✅ COMPLETED

### 1. Quiz Redesign
- ✅ Created `/src/lib/quizQuestions.ts` with 15 scientific questions
- ✅ Weighted scoring system (1-5 points per answer)
- ✅ Confidence levels (low/medium/high)
- ✅ Secondary trait detection
- **Next**: Integrate into Quiz.tsx component

## 🚧 IN PROGRESS

### 2. Translation PT-BR → EN-US
**Priority**: HIGH
**Files to translate**:
- All page components (Dashboard, Profile, etc.)
- All UI text and labels
- Error messages
- Success messages

**Strategy**: Create `src/lib/translations.ts` with all text

### 3. Push Notifications (PWA)
**Priority**: HIGH
**Implementation**:
```typescript
// 1. Request permission
const permission = await Notification.requestPermission();

// 2. Setup service worker push
self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png'
  });
});

// 3. Schedule notifications
- Daily mission reminder (8am)
- Evening check-in (8pm)
- Streak reminder (if inactive 2+ days)
```

**Files to create**:
- `src/lib/notifications.ts` - Notification manager
- `src/hooks/useNotifications.ts` - React hook
- Update service worker for push events

### 4. Photo Upload + Brain Type Icons
**Priority**: MEDIUM
**Implementation**:
```typescript
// Supabase Storage bucket: child_photos
// Table: child_profiles.photo_url (add column)

// Brain type icons
const brainTypeIcons = {
  INTENSE: '🧠',
  DISTRACTED: '⚡',
  DEFIANT: '💪'
};

// Upload component
<input type="file" accept="image/*" />
// Compress with browser-image-compression
// Upload to Supabase storage
// Update child_profiles.photo_url
```

**Files to create**:
- `src/components/Profile/PhotoUpload.tsx`
- `src/lib/imageUtils.ts` - Compression
- Migration: Add photo_url column

### 5. Favorite Scripts
**Priority**: MEDIUM
**Implementation**:
```sql
CREATE TABLE favorite_scripts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id),
  script_id uuid REFERENCES scripts(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, script_id)
);
```

**Features**:
- Heart icon on scripts
- "My Favorites" section on Dashboard
- Quick access floating button
- Supabase RLS policies

**Files to create**:
- Migration for favorite_scripts table
- `src/hooks/useFavoriteScripts.ts`
- `src/components/Scripts/FavoriteButton.tsx`

### 6. Community Features
**Priority**: MEDIUM
**Tables already exist**:
- community_posts
- community_comments
- community_post_likes

**Missing features**:
- Create post UI
- Comment UI
- Like/Unlike
- Filter by brain type
- Image upload for posts

**Files to create**:
- `src/components/Community/CreatePost.tsx`
- `src/components/Community/PostCard.tsx`
- `src/components/Community/CommentSection.tsx`
- `src/hooks/useCommunityPosts.ts`

### 7. Error Tracking (Sentry)
**Priority**: LOW (but important)
**Implementation**:
```bash
npm install @sentry/react @sentry/vite-plugin
```

```typescript
// src/lib/sentry.ts
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_DSN",
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

**Files to create**:
- `src/lib/sentry.ts`
- Update `src/main.tsx` with Sentry wrapper
- Add Sentry DSN to env

## 📋 IMPLEMENTATION ORDER

**Session 1 (NOW)** - Critical Features:
1. ✅ Quiz enhancement
2. ⏳ Integrate new quiz into Quiz.tsx
3. ⏳ Translation PT-BR → EN-US (all pages)
4. ⏳ Basic Push Notifications setup

**Session 2** - User Features:
5. Photo Upload + Brain Type Icons
6. Favorite Scripts system
7. Enhanced Community features

**Session 3** - Polish:
8. Error tracking (Sentry)
9. Analytics improvements
10. Performance optimization

## 🔧 TECHNICAL NOTES

### Database Migrations Needed:
```sql
-- 1. Add photo_url to child_profiles
ALTER TABLE child_profiles ADD COLUMN photo_url TEXT;

-- 2. Create favorite_scripts
CREATE TABLE favorite_scripts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  script_id uuid REFERENCES scripts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, script_id)
);

ALTER TABLE favorite_scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites"
  ON favorite_scripts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Create push_subscriptions
CREATE TABLE push_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, endpoint)
);
```

### Environment Variables Needed:
```env
VITE_VAPID_PUBLIC_KEY=xxx  # For push notifications
VITE_SENTRY_DSN=xxx        # For error tracking
```

## 📊 Success Metrics

After implementation, track:
- Quiz completion rate
- Push notification opt-in rate
- Favorite scripts usage
- Community post engagement
- Error rate (via Sentry)

---

**Last Updated**: 2025-10-21
**Status**: Quiz enhanced ✅ | Translation in progress ⏳
