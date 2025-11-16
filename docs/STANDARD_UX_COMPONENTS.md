# Standard UX Components Guide

## Overview
This guide documents the standardized UX components for consistent loading and empty states across the application.

## Components

### 1. StandardLoadingState
**Location:** `src/components/common/StandardLoadingState.tsx`

**Purpose:** Consistent loading indicators across the app

**Usage:**
```tsx
import { StandardLoadingState } from '@/components/common/StandardLoadingState';

// Basic usage
<StandardLoadingState />

// With custom message
<StandardLoadingState message="Loading videos..." />

// Full screen loading
<StandardLoadingState 
  message="Initializing..."
  size="lg"
  fullScreen
/>

// Small inline loading
<StandardLoadingState 
  size="sm" 
  message="Saving..." 
  className="my-4"
/>
```

**Props:**
- `message?: string` - Loading text (default: "Loading...")
- `size?: 'sm' | 'md' | 'lg'` - Spinner size (default: 'md')
- `fullScreen?: boolean` - Full screen loading (default: false)
- `className?: string` - Additional CSS classes

**Design tokens used:**
- `text-primary` - Spinner color
- `text-muted-foreground` - Message text

---

### 2. StandardEmptyState
**Location:** `src/components/common/StandardEmptyState.tsx`

**Purpose:** Consistent empty state displays with optional actions

**Usage:**
```tsx
import { StandardEmptyState } from '@/components/common/StandardEmptyState';
import { Package } from 'lucide-react';

// With icon
<StandardEmptyState
  icon={Package}
  title="No items found"
  description="Try adjusting your filters or create a new item"
/>

// With emoji
<StandardEmptyState
  emoji="📦"
  title="No items found"
  description="Try adjusting your filters or create a new item"
/>

// With action button
<StandardEmptyState
  icon={Package}
  title="No items found"
  description="Get started by creating your first item"
  actionLabel="Create Item"
  onAction={() => handleCreate()}
/>

// Different variants
<StandardEmptyState
  variant="glass"  // default - glassmorphism effect
  // or
  variant="gradient"  // gradient background
  // or
  variant="default"   // simple card
/>
```

**Props:**
- `icon: LucideIcon` - Icon component from lucide-react
- `emoji?: string` - Alternative to icon (takes precedence)
- `title: string` - Main heading
- `description: string` - Explanatory text
- `actionLabel?: string` - Button text
- `onAction?: () => void` - Button click handler
- `className?: string` - Additional CSS classes
- `variant?: 'default' | 'glass' | 'gradient'` - Visual style (default: 'glass')

**Design tokens used:**
- `card-glass` / `card-gradient` - Background styles
- `gradient-primary` - Icon background
- `text-primary` - Icon color
- `text-muted-foreground` - Description text
- `gradient-text` - Title gradient

**Animations:**
- Floating icon/emoji animation
- Fade-in entrance
- Button slide-up entrance

---

## Migration Guide

### Replacing Old LoadingState
**Before:**
```tsx
import { LoadingState } from '@/components/common/LoadingState';
<LoadingState message="Loading..." size="md" />
```

**After:**
```tsx
import { StandardLoadingState } from '@/components/common/StandardLoadingState';
<StandardLoadingState message="Loading..." size="md" />
```

### Replacing Old EmptyState
**Before:**
```tsx
import { EmptyState } from '@/components/Dashboard/EmptyState';
<EmptyState
  icon={Package}
  title="No items"
  description="..."
  actionLabel="Add"
  onAction={handleAdd}
/>
```

**After:**
```tsx
import { StandardEmptyState } from '@/components/common/StandardEmptyState';
<StandardEmptyState
  icon={Package}
  title="No items"
  description="..."
  actionLabel="Add"
  onAction={handleAdd}
  variant="glass"
/>
```

---

## Best Practices

### Loading States
1. **Always show a message** - Help users understand what's loading
2. **Use appropriate size** - `sm` for inline, `md` for sections, `lg` for full page
3. **Consider fullScreen** - Use for initial app load or major state changes

```tsx
// ✅ Good - Clear context
<StandardLoadingState message="Loading your videos..." size="md" />

// ❌ Bad - No context
<StandardLoadingState />
```

### Empty States
1. **Be specific** - Explain why it's empty
2. **Provide action** - Give users next steps when relevant
3. **Use emojis wisely** - Emojis add personality but icons are more consistent
4. **Choose right variant** - Use `glass` for modern look, `default` for simplicity

```tsx
// ✅ Good - Specific and actionable
<StandardEmptyState
  icon={VideoIcon}
  title="No videos yet"
  description="Upload your first video to get started"
  actionLabel="Upload Video"
  onAction={handleUpload}
/>

// ❌ Bad - Vague and no action
<StandardEmptyState
  icon={VideoIcon}
  title="Empty"
  description="Nothing here"
/>
```

---

## Design System Integration

Both components fully integrate with the design system:

**Colors:** All use semantic tokens (`--primary`, `--foreground`, etc)
**Animations:** Leverage `hover-lift-strong`, `hover-glow-intense`
**Gradients:** Use `gradient-primary`, `gradient-text`
**Cards:** Use `card-glass`, `card-gradient` variants

---

## Examples in Context

### List Page
```tsx
function VideosList() {
  const { data: videos, isLoading } = useVideos();

  if (isLoading) {
    return <StandardLoadingState message="Loading videos..." />;
  }

  if (!videos || videos.length === 0) {
    return (
      <StandardEmptyState
        icon={Video}
        title="No videos found"
        description="Start by uploading your first video"
        actionLabel="Upload Video"
        onAction={() => router.push('/upload')}
      />
    );
  }

  return <VideoGrid videos={videos} />;
}
```

### Full Page Loading
```tsx
function DashboardPage() {
  const { data, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <StandardLoadingState 
        message="Loading your dashboard..."
        size="lg"
        fullScreen
      />
    );
  }

  return <DashboardContent data={data} />;
}
```

---

## Testing Checklist

When implementing these components:
- [ ] Verify dark mode appearance
- [ ] Check animation smoothness
- [ ] Test with long messages
- [ ] Validate action button works
- [ ] Ensure responsive on mobile
- [ ] Confirm accessibility (screen readers)

---

## Future Enhancements

Planned improvements:
- Skeleton loading states for specific content types
- Error state component
- Success state component
- Progress indicators for multi-step processes