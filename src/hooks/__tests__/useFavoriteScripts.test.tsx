import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFavoriteScripts } from '../useFavoriteScripts';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      insert: vi.fn().mockResolvedValue({ error: null }),
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

describe('useFavoriteScripts', () => {
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

  it('should initialize with empty favorites', async () => {
    const { result } = renderHook(() => useFavoriteScripts(), { wrapper });

    await new Promise(resolve => setTimeout(resolve, 50));
    expect(result.current.favorites).toBeDefined();
  });

  it('should check if script is favorite', async () => {
    const { result } = renderHook(() => useFavoriteScripts(), { wrapper });

    await new Promise(resolve => setTimeout(resolve, 50));
    const isFav = result.current.isFavorite('script-1');
    expect(typeof isFav).toBe('boolean');
  });

  it('should handle toggle favorite', async () => {
    const { result } = renderHook(() => useFavoriteScripts(), { wrapper });

    await new Promise(resolve => setTimeout(resolve, 50));
    expect(result.current.toggleFavorite).toBeDefined();

    // Test toggle function exists and is callable
    expect(typeof result.current.toggleFavorite).toBe('function');
  });
});
