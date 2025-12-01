# Multi-Product System Architecture

## Overview

The multi-product system enables flexible product management and content unlocking based on user purchases from Cartpanda. This architecture supports:

- **Main products** (e.g., The Obedience Language app)
- **Order bumps** (e.g., The Calm Mom Code)
- **Upsells** (e.g., Audio Lessons Pack)

## Database Schema

### `approved_users.products` (JSONB Array)

Stores all products a user has purchased:

```json
[
  {
    "id": "27499673",
    "name": "The Obedience Language",
    "type": "main",
    "price": 37.00,
    "purchased_at": "2025-01-15T10:30:00Z"
  },
  {
    "id": "12345678",
    "name": "The Calm Mom Code",
    "type": "order_bump",
    "price": 27.00,
    "purchased_at": "2025-01-15T10:30:00Z"
  }
]
```

### `product_config` Table

Maps product IDs to unlockable content:

| Column | Type | Description |
|--------|------|-------------|
| `product_id` | TEXT | Cartpanda product ID (unique) |
| `product_name` | TEXT | Display name |
| `product_type` | TEXT | 'main', 'order_bump', or 'upsell' |
| `unlocks` | JSONB | Array of unlock keys (e.g., `["audio_lessons"]`) |

**Example configuration:**

```sql
INSERT INTO product_config (product_id, product_name, product_type, unlocks) VALUES
('27499673', 'The Obedience Language', 'main', '["app_access", "scripts", "videos", "ebooks"]'),
('12345678', 'The Calm Mom Code', 'order_bump', '["calm_mom_ebook", "calm_mom_audios"]'),
('87654321', 'Audio Lessons Pack', 'upsell', '["audio_lessons"]');
```

### `bonuses` Table Additions

- `preview_available` (BOOLEAN): If true, content is available to all users (freemium)
- `unlock_key` (TEXT): Key required to unlock content (e.g., `'audio_lessons'`)

## Webhook Flow

### Cartpanda → `cartpanda-webhook` Edge Function

1. **Receives order payload** with `line_items` array containing all purchased products
2. **Extracts all products** (not just the first):
   ```typescript
   const purchasedProducts = lineItems.map((item, index) => ({
     id: item.product_id || '',
     name: item.name || '',
     type: index === 0 ? 'main' : 'addon',
     price: item.price ? parseFloat(item.price) : null,
     purchased_at: new Date().toISOString()
   }));
   ```
3. **Merges with existing products** to avoid duplicates
4. **Updates `approved_users.products`** JSONB array

## Frontend Usage

### `useUserProducts` Hook

```typescript
import { useUserProducts } from '@/hooks/useUserProducts';

function AudioShelf() {
  const { hasUnlock, isLoading } = useUserProducts();
  
  if (isLoading) return <Spinner />;
  
  const hasAudioPack = hasUnlock('audio_lessons');
  
  return (
    <>
      {hasAudioPack ? (
        <FullAudioList />
      ) : (
        <AudioPreview />
      )}
    </>
  );
}
```

### Hook API

| Method | Description | Example |
|--------|-------------|---------|
| `hasProduct(productId)` | Check if user purchased specific product | `hasProduct('27499673')` |
| `hasUnlock(unlockKey)` | Check if user has access to unlock key | `hasUnlock('audio_lessons')` |
| `getAllUnlocks()` | Get array of all unlock keys user has | `['app_access', 'audio_lessons']` |
| `hasAppAccess()` | Check if user has main app access | `hasAppAccess()` |
| `products` | Array of all purchased products | `products.map(p => p.name)` |

## Content Gating Pattern

### Freemium with Upsell

```typescript
import { useUserProducts } from '@/hooks/useUserProducts';
import { useQuery } from '@tanstack/react-query';

function AudioSection() {
  const { hasUnlock } = useUserProducts();
  const hasAudioPack = hasUnlock('audio_lessons');
  
  const { data: audios } = useQuery({
    queryKey: ['audios'],
    queryFn: async () => {
      const query = supabase
        .from('bonuses')
        .select('*')
        .eq('category', 'audio')
        .eq('unlock_key', 'audio_lessons');
      
      // If user doesn't have unlock, only show preview content
      if (!hasAudioPack) {
        query.eq('preview_available', true);
      }
      
      const { data } = await query;
      return data;
    }
  });
  
  return (
    <>
      <AudioList audios={audios} />
      
      {!hasAudioPack && (
        <UpsellBanner 
          title="Unlock All 15 Audio Lessons"
          cta="Get Audio Pack"
          link="/upsell/audio-pack"
        />
      )}
    </>
  );
}
```

## Storage Access (RLS)

Audio files in `audiobooks` bucket are protected by RLS:

```sql
CREATE POLICY "Audio access based on purchased products"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'audiobooks' AND (
    -- User has audio_lessons unlock
    EXISTS (
      SELECT 1 FROM approved_users au
      INNER JOIN profiles p ON p.email = au.email
      WHERE p.id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM jsonb_array_elements(au.products) AS prod
        WHERE prod->>'id' IN (
          SELECT product_id FROM product_config
          WHERE unlocks @> '["audio_lessons"]'::jsonb
        )
      )
    )
    -- OR it's a preview file
    OR (storage.foldername(name))[1] IN ('preview')
  )
);
```

## Adding New Products

### Step 1: Configure in Cartpanda
Get the `product_id` from Cartpanda dashboard.

### Step 2: Add to `product_config`
```sql
INSERT INTO product_config (product_id, product_name, product_type, unlocks)
VALUES ('NEW_PRODUCT_ID', 'New Product Name', 'upsell', '["new_unlock_key"]');
```

### Step 3: Tag Content with `unlock_key`
```sql
UPDATE bonuses 
SET unlock_key = 'new_unlock_key',
    preview_available = false
WHERE id IN ('content_id_1', 'content_id_2');
```

### Step 4: Use in Frontend
```typescript
const { hasUnlock } = useUserProducts();
const canViewContent = hasUnlock('new_unlock_key');
```

**Zero code changes required** — the system automatically handles new products via the configuration table.

## Testing

### Simulate Purchase
```sql
-- Add test product to user
UPDATE approved_users 
SET products = products || '[{
  "id": "87654321",
  "name": "Audio Lessons Pack",
  "type": "upsell",
  "price": 47.00,
  "purchased_at": "2025-01-15T10:30:00Z"
}]'::jsonb
WHERE email = 'test@example.com';
```

### Verify Unlock
Frontend should immediately reflect new access after React Query cache invalidates (~5 minutes or on page refresh).

## Benefits

✅ **Scalable**: Add unlimited products without code changes  
✅ **Flexible**: Mix freemium, order bumps, and upsells  
✅ **Performant**: Efficient JSONB queries with GIN indexes  
✅ **Secure**: RLS enforces access at database level  
✅ **Maintainable**: Centralized configuration in `product_config`  
✅ **Future-proof**: Easy to extend with new unlock types
