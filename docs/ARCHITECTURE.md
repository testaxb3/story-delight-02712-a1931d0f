# 🏗️ Architecture Overview

This document provides a comprehensive overview of the NEP System architecture, design patterns, and technical decisions.

---

## 📑 Table of Contents

1. [System Architecture](#system-architecture)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Data Flow](#data-flow)
5. [Security Architecture](#security-architecture)
6. [Performance Optimizations](#performance-optimizations)
7. [Design Patterns](#design-patterns)

---

## 🏛️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Client Layer                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │   React    │  │  Service   │  │    PWA     │       │
│  │    App     │  │   Worker   │  │   Shell    │       │
│  └────────────┘  └────────────┘  └────────────┘       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   API/Gateway Layer                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │  Supabase  │  │    Edge    │  │   Auth     │       │
│  │    API     │  │ Functions  │  │  Service   │       │
│  └────────────┘  └────────────┘  └────────────┘       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     Data Layer                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │ PostgreSQL │  │  Storage   │  │   Realtime │       │
│  │  Database  │  │  Buckets   │  │   Server   │       │
│  └────────────┘  └────────────┘  └────────────┘       │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
- **React 18.3** - Core framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TailwindCSS** - Utility-first styling
- **React Query** - Server state management
- **Zustand** - Client state management
- **Framer Motion** - Animations

#### Backend
- **Supabase** - BaaS platform
- **PostgreSQL 15** - Database
- **PostgREST** - Auto-generated API
- **Edge Functions** - Serverless compute

---

## 🎨 Frontend Architecture

### Component Architecture

```
src/components/
├── ui/                    # Primitives (shadcn)
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── common/                # Shared components
│   ├── LoadingState.tsx
│   ├── ErrorBoundary.tsx
│   └── ...
├── layout/                # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
└── feature/               # Feature components
    ├── scripts/
    ├── community/
    └── bonuses/
```

### State Management Strategy

#### Server State (React Query)
```typescript
// Fetching data
const { data, isLoading, error } = useQuery({
  queryKey: ['scripts', filters],
  queryFn: () => fetchScripts(filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Mutations
const mutation = useMutation({
  mutationFn: createScript,
  onSuccess: () => {
    queryClient.invalidateQueries(['scripts']);
  },
});
```

#### Client State (Zustand)
```typescript
// Global state for UI
interface UIStore {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
}

const useUIStore = create<UIStore>((set) => ({
  theme: 'light',
  sidebarOpen: true,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),
}));
```

### Routing Architecture

```typescript
// Route structure
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'scripts', element: <Scripts /> },
      { path: 'scripts/:id', element: <ScriptDetail /> },
      { path: 'community', element: <Community /> },
      {
        path: 'admin',
        element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
        children: [
          { path: 'bonuses', element: <AdminBonuses /> },
          { path: 'scripts', element: <AdminScripts /> },
        ],
      },
    ],
  },
]);
```

---

## 🗄️ Backend Architecture

### Database Schema

#### Core Tables
```sql
-- Users & Auth (Supabase Auth)
auth.users

-- User Profiles
profiles (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  brain_profile TEXT,
  premium BOOLEAN,
  is_admin BOOLEAN
)

-- Scripts
scripts (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  profile TEXT,
  difficulty TEXT,
  strategy_steps JSONB
)

-- Community
community_posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  content TEXT NOT NULL,
  created_at TIMESTAMP
)

post_comments (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES community_posts,
  user_id UUID REFERENCES profiles,
  content TEXT NOT NULL
)

-- Progress Tracking
tracker_days (
  id UUID PRIMARY KEY,
  user_id UUID,
  day_number INTEGER,
  completed BOOLEAN,
  completed_at TIMESTAMP
)
```

### Row Level Security (RLS)

#### Pattern: User-Owned Resources
```sql
-- Example: User can only see their own data
CREATE POLICY "Users can view own data"
ON table_name FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
ON table_name FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

#### Pattern: Public Read, Owner Write
```sql
-- Example: Scripts are public, admins can edit
CREATE POLICY "Anyone can view scripts"
ON scripts FOR SELECT
USING (true);

CREATE POLICY "Admins can manage scripts"
ON scripts FOR ALL
USING (is_admin());
```

### Edge Functions

```typescript
// Example: Process webhook
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Process request
  const { data, error } = await supabase
    .from('table')
    .insert({ ... });

  return new Response(
    JSON.stringify({ success: !error }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
```

---

## 🔄 Data Flow

### Read Flow (Query)

```
User Action (Click)
    │
    ▼
React Component
    │
    ▼
React Query Hook
    │
    ▼
Supabase Client
    │
    ▼
PostgreSQL (with RLS)
    │
    ▼
PostgREST API
    │
    ▼
React Query Cache
    │
    ▼
Component Re-render
```

### Write Flow (Mutation)

```
User Action (Submit)
    │
    ▼
React Component
    │
    ▼
Mutation Hook
    │
    ▼
Validation (Zod)
    │
    ▼
Supabase Client
    │
    ▼
Row Level Security Check
    │
    ▼
Database Trigger (if any)
    │
    ▼
PostgreSQL Write
    │
    ▼
Invalidate Queries
    │
    ▼
Re-fetch & Update UI
```

### Real-time Flow

```
Database Change
    │
    ▼
PostgreSQL WAL
    │
    ▼
Supabase Realtime
    │
    ▼
WebSocket Connection
    │
    ▼
React Query Subscription
    │
    ▼
Component Update
```

---

## 🔒 Security Architecture

### Authentication Flow

```
User Login
    │
    ▼
Supabase Auth
    │
    ▼
JWT Token Generated
    │
    ▼
Token Stored (localStorage)
    │
    ▼
Token in Request Headers
    │
    ▼
RLS Validates Token
    │
    ▼
Access Granted/Denied
```

### Authorization Layers

1. **Client-Side** - UI visibility
2. **API Layer** - RLS policies
3. **Database** - Constraints & triggers
4. **Edge Functions** - Service role checks

### Security Best Practices

```sql
-- 1. Enable RLS on all tables
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- 2. Default deny
-- No policy = no access

-- 3. Explicit grants
CREATE POLICY "specific_access"
ON table_name
FOR SELECT
USING (
  auth.uid() = user_id OR
  is_admin()
);

-- 4. SECURITY DEFINER only when necessary
CREATE FUNCTION sensitive_operation()
RETURNS void
SECURITY DEFINER  -- Only when needed!
SET search_path = public
AS $$
  -- Function body
$$;
```

---

## ⚡ Performance Optimizations

### Code Splitting

```typescript
// Lazy load routes
const AdminPanel = lazy(() => import('@/pages/Admin'));
const Community = lazy(() => import('@/pages/Community'));

// In router
<Route
  path="/admin"
  element={
    <Suspense fallback={<Loading />}>
      <AdminPanel />
    </Suspense>
  }
/>
```

### React Query Caching

```typescript
// Global cache config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      cacheTime: 10 * 60 * 1000,     // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Prefetch critical data
queryClient.prefetchQuery({
  queryKey: ['scripts'],
  queryFn: fetchScripts,
});
```

### Image Optimization

```tsx
// OptimizedImage component
<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  format="webp"
/>
```

### Bundle Optimization

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-*'],
          'utils': ['date-fns', 'lodash-es'],
        },
      },
    },
  },
});
```

---

## 🎯 Design Patterns

### Compound Components

```tsx
// Card compound component
export const Card = ({ children }: Props) => {
  return <div className="card">{children}</div>;
};

Card.Header = ({ children }: Props) => {
  return <div className="card-header">{children}</div>;
};

Card.Body = ({ children }: Props) => {
  return <div className="card-body">{children}</div>;
};

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

### Custom Hooks Pattern

```typescript
// Reusable data fetching hook
export function useResource<T>(
  queryKey: string[],
  fetchFn: () => Promise<T>
) {
  return useQuery({
    queryKey,
    queryFn: fetchFn,
    staleTime: 5 * 60 * 1000,
  });
}

// Usage
const { data: scripts } = useResource(
  ['scripts'],
  fetchScripts
);
```

### Provider Pattern

```tsx
// Context + Hook
const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Repository Pattern

```typescript
// Data access layer
class ScriptRepository {
  async findAll(filters?: Filters): Promise<Script[]> {
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .match(filters);
    
    if (error) throw error;
    return data;
  }

  async findById(id: string): Promise<Script | null> {
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
}

export const scriptRepository = new ScriptRepository();
```

---

## 📊 Monitoring & Analytics

### Error Tracking
- Sentry integration for error monitoring
- Custom error boundaries
- Error logs in Supabase

### Performance Monitoring
- Lighthouse CI
- Bundle analyzer
- React Query DevTools
- Network tab monitoring

### User Analytics
- PostHog integration
- Custom events
- Funnel analysis
- A/B testing ready

---

## 🚀 Deployment Architecture

```
GitHub Repository
    │
    ▼
Lovable Build System
    │
    ├─► Frontend Build → CDN (Cloudflare)
    │
    ├─► Edge Functions → Supabase Edge Runtime
    │
    └─► Migrations → PostgreSQL
```

---

## 📝 Documentation

- [README.md](../README.md) - Getting started
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [UX_COMPONENTS_GUIDE.md](UX_COMPONENTS_GUIDE.md) - Component guide

---

**Last Updated:** 2024-11-16
