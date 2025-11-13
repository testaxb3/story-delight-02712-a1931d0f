# Community Premium - Phase 1 - Technical Documentation

## 📚 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Component Structure](#component-structure)
3. [Database Schema](#database-schema)
4. [API Integration](#api-integration)
5. [Real-time Features](#real-time-features)
6. [State Management](#state-management)
7. [Performance Optimizations](#performance-optimizations)
8. [Testing Guidelines](#testing-guidelines)

---

## 🏗️ Architecture Overview

### Tech Stack
```
Frontend:
├── React 18+ (TypeScript)
├── React Router v6
├── TanStack Query (React Query)
├── Framer Motion (animations)
├── Tailwind CSS + shadcn/ui
└── Lucide React (icons)

Backend:
├── Supabase (PostgreSQL)
├── Supabase Realtime
├── Supabase Storage
└── Row Level Security (RLS)
```

### Folder Structure
```
src/
├── components/
│   └── Community/
│       ├── CommentItem.tsx          # Single comment with reply UI
│       ├── CommentThread.tsx        # Comments + nested replies
│       ├── UserProfileModal.tsx     # User profile dialog
│       ├── SearchBar.tsx            # Advanced search component
│       ├── NotificationBell.tsx     # Notification dropdown
│       ├── PostImageUpload.tsx      # Image upload component
│       ├── ReactionPicker.tsx       # Reaction selector
│       └── ReactionsList.tsx        # Reaction aggregator
├── pages/
│   ├── Community.tsx                # Main community feed
│   ├── Notifications.tsx            # Full notifications page
│   └── Profile/
│       └── Edit.tsx                 # Profile editor
├── hooks/
│   └── useNotifications.ts          # Notifications hook
└── integrations/
    └── supabase/
        ├── client.ts
        └── types.ts
```

---

## 🧩 Component Structure

### 1. CommentThread Component

**Purpose:** Manages the entire comment section for a post, including top-level comments and their nested replies.

**Props:**
```typescript
interface CommentThreadProps {
  postId: string;                              // Post ID to fetch comments for
  currentUserId: string | null;                // Current user ID
  userPhotoUrl?: string | null;                // User's photo URL
  userInitials: string;                        // Fallback initials
  formatTimestamp: (timestamp: string) => string; // Timestamp formatter
  getInitialsFromName: (name: string) => string; // Name to initials
  onCommentCountChange?: (newCount: number) => void; // Count callback
}
```

**Features:**
- Fetches comments with profiles via Supabase join
- Supports nested replies (1 level deep)
- Auto-expands replies when user adds one
- Real-time comment addition
- Optimistic UI updates

**Usage:**
```tsx
<CommentThread
  postId={post.id}
  currentUserId={user?.profileId ?? null}
  userPhotoUrl={user?.photo_url ?? null}
  userInitials={userInitials}
  formatTimestamp={formatTimestamp}
  getInitialsFromName={getInitialsFromName}
  onCommentCountChange={(count) => updatePostCount(count)}
/>
```

---

### 2. CommentItem Component

**Purpose:** Renders a single comment with reply functionality.

**Props:**
```typescript
interface CommentItemProps {
  comment: PostComment;                        // Comment data
  currentUserId: string | null;                // Current user ID
  onDelete: (commentId: string) => void;       // Delete handler
  onReply: (parentId: string, content: string) => void; // Reply handler
  onToggleReplies?: (commentId: string) => void; // Toggle replies
  formatTimestamp: (timestamp: string) => string;
  getInitialsFromName: (name: string) => string;
  depth?: number;                              // Nesting level (0 or 1)
  repliesCount?: number;                       // Number of replies
  showReplies?: boolean;                       // Replies visible?
}
```

**Features:**
- Inline reply input with ESC to cancel
- Visual indentation for nested replies
- "View replies" button with count
- Delete button (own comments only)
- Reply button (top-level only)

---

### 3. UserProfileModal Component

**Purpose:** Displays a user's profile in a modal dialog.

**Props:**
```typescript
interface UserProfileModalProps {
  open: boolean;                   // Modal open state
  onOpenChange: (open: boolean) => void; // Toggle handler
  userId: string;                  // User to display
  currentUserId: string | null;    // Current user
}
```

**Features:**
- Fetches user profile, stats, and recent posts
- Follow/unfollow functionality
- Badge display with icons
- Recent posts grid (6 posts)
- Edit profile button (own profile only)
- Navigation to post on click

**State Management:**
```typescript
const [profile, setProfile] = useState<UserProfile | null>(null);
const [stats, setStats] = useState<UserStats>({ ... });
const [isFollowing, setIsFollowing] = useState(false);
const [recentPosts, setRecentPosts] = useState<any[]>([]);
```

---

### 4. SearchBar Component

**Purpose:** Advanced search and filtering for community posts.

**Props:**
```typescript
interface SearchBarProps {
  onFiltersChange: (filters: SearchFilters) => void;
  placeholder?: string;
}

interface SearchFilters {
  query: string;               // Search text
  brainTypes: string[];        // Selected brain types
  postTypes: string[];         // Selected post types
  dateRange: 'all' | 'today' | 'week' | 'month';
}
```

**Features:**
- Debounced search input (300ms)
- Multi-select filters via dropdown
- Active filter chips with remove buttons
- Clear all filters button
- Filter count badge

**Implementation:**
```typescript
// Debounce logic
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(query);
  }, 300);
  return () => clearTimeout(timer);
}, [query]);

// Emit filters on change
useEffect(() => {
  onFiltersChange({
    query: debouncedQuery,
    brainTypes,
    postTypes,
    dateRange,
  });
}, [debouncedQuery, brainTypes, postTypes, dateRange]);
```

---

### 5. NotificationBell Component

**Purpose:** Displays notification dropdown with unread count.

**Props:**
```typescript
interface NotificationBellProps {
  userId: string | null;
}
```

**Features:**
- Badge with unread count (shows "9+" for 10+)
- Dropdown with last 5 notifications
- "Mark all as read" button
- Click notification to navigate
- Link to full notifications page

**Real-time Updates:**
```typescript
const { notifications, unreadCount, markAsRead, markAllAsRead } =
  useNotifications(userId);
```

---

## 🗄️ Database Schema

### Tables Used

#### 1. `post_comments`
```sql
CREATE TABLE post_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  parent_comment_id uuid REFERENCES post_comments(id) ON DELETE CASCADE,
  replies_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_post_comments_parent ON post_comments(parent_comment_id);
CREATE INDEX idx_post_comments_user ON post_comments(user_id);
```

#### 2. `profiles`
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS badges text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS followers_count integer DEFAULT 0;
```

#### 3. `user_followers`
```sql
CREATE TABLE user_followers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Prevent self-follow
ALTER TABLE user_followers ADD CONSTRAINT no_self_follow
  CHECK (follower_id != following_id);
```

#### 4. `notifications`
```sql
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('like', 'comment', 'reply', 'follow')),
  content text,
  read boolean DEFAULT false,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read);
```

---

## 🔌 API Integration

### Supabase Queries

#### Fetch Comments with Replies
```typescript
const { data, error } = await supabase
  .from('post_comments')
  .select(`
    *,
    profiles:user_id (name, email, photo_url)
  `)
  .eq('post_id', postId)
  .order('created_at', { ascending: true });
```

#### Add Nested Reply
```typescript
const { data, error } = await supabase
  .from('post_comments')
  .insert({
    post_id: postId,
    user_id: currentUserId,
    content,
    parent_comment_id: parentCommentId, // Key for nesting
  })
  .select(`
    *,
    profiles:user_id (name, email, photo_url)
  `)
  .single();

// Update parent's replies_count
await supabase.rpc('increment_comment_replies', {
  comment_id: parentCommentId
});
```

#### Follow/Unfollow User
```typescript
// Follow
const { error } = await supabase
  .from('user_followers')
  .insert({
    follower_id: currentUserId,
    following_id: userId
  });

// Unfollow
const { error } = await supabase
  .from('user_followers')
  .delete()
  .eq('follower_id', currentUserId)
  .eq('following_id', userId);
```

#### Fetch User Profile with Stats
```typescript
// Profile
const { data: profile } = await supabase
  .from('profiles')
  .select('id, name, email, photo_url, bio, badges, followers_count')
  .eq('id', userId)
  .single();

// Stats (parallel queries)
const [postsRes, likesRes, commentsRes] = await Promise.all([
  supabase.from('community_posts').select('id', { count: 'exact' }).eq('user_id', userId),
  supabase.from('post_likes').select('id', { count: 'exact' }).eq('post_id', userId),
  supabase.from('post_comments').select('id', { count: 'exact' }).eq('user_id', userId),
]);
```

---

## ⚡ Real-time Features

### Notifications Subscription

**Setup:**
```typescript
const channel = supabase
  .channel('notifications')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      const newNotification = payload.new as Notification;
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    }
  )
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      const updated = payload.new as Notification;
      setNotifications((prev) =>
        prev.map((n) => (n.id === updated.id ? updated : n))
      );
    }
  )
  .subscribe();

return () => {
  supabase.removeChannel(channel);
};
```

**Cleanup:**
Always unsubscribe when component unmounts to prevent memory leaks.

---

## 🎯 State Management

### Local State (useState)
Used for:
- UI toggles (modals, dropdowns, expanded states)
- Form inputs (comment text, search query)
- Temporary data (loading states)

### Server State (Supabase + React Query)
Used for:
- User profiles
- Posts and comments
- Notifications
- Followers

### Example: useNotifications Hook
```typescript
export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Fetch initial data
    fetchNotifications();

    // Subscribe to real-time updates
    const channel = supabase.channel('notifications')...

    return () => supabase.removeChannel(channel);
  }, [userId]);

  const markAsRead = async (id: string) => { ... };
  const markAllAsRead = async () => { ... };

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
}
```

---

## 🚀 Performance Optimizations

### 1. Debounced Search
Prevents excessive re-renders and API calls:
```typescript
const [query, setQuery] = useState('');
const [debouncedQuery, setDebouncedQuery] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(query);
  }, 300);
  return () => clearTimeout(timer);
}, [query]);
```

### 2. Memoized Computed Values
```typescript
const filteredPosts = useMemo(() => {
  return posts.filter(...).sort(...);
}, [posts, searchFilters, sortBy]);
```

### 3. Optimistic UI Updates
Update UI immediately, sync with DB in background:
```typescript
// Optimistic like
setLiked(true);
setLikeCount(prev => prev + 1);

const { error } = await supabase.from('post_likes').insert(...);

if (error) {
  // Rollback on error
  setLiked(false);
  setLikeCount(prev => prev - 1);
}
```

### 4. Pagination (Future Enhancement)
For large comment threads:
```typescript
const { data, error } = await supabase
  .from('post_comments')
  .select('*')
  .eq('post_id', postId)
  .range(offset, offset + limit);
```

---

## 🧪 Testing Guidelines

### Unit Tests (Components)

**CommentItem.tsx:**
```typescript
describe('CommentItem', () => {
  it('renders comment content', () => {
    render(<CommentItem comment={mockComment} ... />);
    expect(screen.getByText(mockComment.content)).toBeInTheDocument();
  });

  it('shows reply button for top-level comments', () => {
    render(<CommentItem depth={0} ... />);
    expect(screen.getByText('Reply')).toBeInTheDocument();
  });

  it('hides reply button for nested comments', () => {
    render(<CommentItem depth={1} ... />);
    expect(screen.queryByText('Reply')).not.toBeInTheDocument();
  });
});
```

### Integration Tests

**Comment Flow:**
```typescript
it('allows user to add and view nested replies', async () => {
  const { user } = renderWithAuth(<Community />);

  // Click comment button
  await user.click(screen.getByText('Comment'));

  // Type and submit comment
  await user.type(screen.getByPlaceholderText('Write a comment...'), 'Test');
  await user.click(screen.getByText('Send'));

  // Wait for comment to appear
  await waitFor(() => {
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  // Click reply
  await user.click(screen.getByText('Reply'));
  await user.type(screen.getByPlaceholderText('Write a reply...'), 'Reply');
  await user.click(screen.getByText('Reply'));

  // Verify nested reply
  await waitFor(() => {
    expect(screen.getByText('View replies (1)')).toBeInTheDocument();
  });
});
```

### E2E Tests (Cypress/Playwright)

```typescript
describe('Notifications', () => {
  it('shows notification when another user likes post', () => {
    // User 1 creates post
    cy.login('user1@test.com');
    cy.visit('/community');
    cy.createPost('Test post');
    cy.logout();

    // User 2 likes post
    cy.login('user2@test.com');
    cy.visit('/community');
    cy.contains('Test post').within(() => {
      cy.get('[aria-label="Like"]').click();
    });
    cy.logout();

    // User 1 sees notification
    cy.login('user1@test.com');
    cy.get('[aria-label="Notifications"]').should('contain', '1');
    cy.get('[aria-label="Notifications"]').click();
    cy.contains('liked your post');
  });
});
```

---

## 🔒 Security Considerations

### Row Level Security (RLS)

**Notifications:**
```sql
-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);
```

**User Followers:**
```sql
-- Anyone can view follower relationships
CREATE POLICY "Followers are public"
  ON user_followers FOR SELECT
  USING (true);

-- Users can only create/delete their own follows
CREATE POLICY "Users can manage own follows"
  ON user_followers FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete own follows"
  ON user_followers FOR DELETE
  USING (auth.uid() = follower_id);
```

### Input Sanitization
- All user inputs are escaped by Supabase
- Content length limits enforced:
  - Comments: 1000 characters
  - Bio: 200 characters
  - Post content: 2000 characters

---

## 📱 Mobile Responsiveness

All components are mobile-first:

```css
/* SearchBar - mobile friendly */
.search-container {
  @apply flex flex-col sm:flex-row gap-2;
}

/* Modal - full screen on mobile */
.user-profile-modal {
  @apply
    max-w-2xl
    max-h-[90vh]
    sm:rounded-lg
    rounded-none;
}

/* Comment indent - reduced on mobile */
.comment-reply {
  @apply ml-8 sm:ml-12;
}
```

---

## 🎨 Design System

### Colors
- Primary: `#667eea` (Purple gradient)
- Success: `#48bb78` (Green)
- Danger: `#f56565` (Red)
- Warning: `#f6ad55` (Orange)

### Typography
- Font: System font stack
- Sizes: 0.75rem to 3rem (Tailwind scale)

### Spacing
- Gap between elements: `gap-2` (0.5rem) to `gap-6` (1.5rem)
- Padding: `p-2` to `p-8`
- Margin: `m-2` to `m-6`

---

## 🚧 Future Enhancements

### Phase 2 Features
1. **Direct Messages** - Private chat between users
2. **Post Bookmarks** - Save favorite posts
3. **Mentions** - @mention other users
4. **Rich Text** - Markdown or WYSIWYG editor
5. **Hashtags** - Tag posts with topics
6. **Polls** - Create polls in posts
7. **Groups** - Topic-based communities
8. **Analytics** - User engagement dashboard

### Technical Improvements
1. **Infinite Scroll** - Load more posts on scroll
2. **Image Optimization** - WebP, lazy loading
3. **Service Worker** - Offline support
4. **Push Notifications** - Browser notifications
5. **Content Moderation** - AI-powered flagging
6. **Search Enhancement** - Full-text search via Postgres

---

## 📊 Metrics to Track

### User Engagement
- Posts per day
- Comments per post
- Reactions per post
- Active users daily
- Retention rate

### Feature Usage
- Search queries per day
- Notifications clicked
- Profile views
- Follow actions
- Badge distribution

### Performance
- Page load time
- Time to interactive
- API response time
- Real-time latency
- Error rate

---

## 🤝 Contributing Guidelines

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Naming: camelCase for variables, PascalCase for components
- File structure: One component per file

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/notifications-bell

# Commit with conventional commits
git commit -m "feat(community): add notification bell component"

# Push and create PR
git push origin feature/notifications-bell
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots
(if UI changes)
```

---

**Last Updated:** 2025-11-16
**Version:** 1.0.0
**Maintainer:** Development Team
