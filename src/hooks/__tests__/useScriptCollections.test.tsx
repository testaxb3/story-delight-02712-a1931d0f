import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useScriptCollections } from '../useScriptCollections';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: { id: 'new-collection' }, error: null }),
      delete: vi.fn().mockReturnThis(),
      match: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

// Mock Auth
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
  }),
}));

describe('useScriptCollections', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should initialize with empty collections', async () => {
    const { result } = renderHook(() => useScriptCollections(), { wrapper });

    await new Promise(resolve => setTimeout(resolve, 50));
    expect(result.current.scopedCollections).toBeDefined();
  });

  it('should provide createCollection function', () => {
    const { result } = renderHook(() => useScriptCollections(), { wrapper });

    expect(typeof result.current.createCollection).toBe('function');
  });

  it('should provide addScriptToCollection function', () => {
    const { result } = renderHook(() => useScriptCollections(), { wrapper });

    expect(typeof result.current.addScriptToCollection).toBe('function');
  });

  it('should provide removeScriptFromCollection function', () => {
    const { result } = renderHook(() => useScriptCollections(), { wrapper });

    expect(typeof result.current.removeScriptFromCollection).toBe('function');
  });

  it('should provide refresh function', () => {
    const { result } = renderHook(() => useScriptCollections(), { wrapper });

    expect(typeof result.current.refresh).toBe('function');
  });

  it('should handle collection creation', async () => {
    const { result } = renderHook(() => useScriptCollections(), { wrapper });

    await act(async () => {
      await result.current.createCollection('Test Collection', 'Test description');
    });

    // Function should execute without errors
    expect(result.current.createCollection).toBeDefined();
  });
});
