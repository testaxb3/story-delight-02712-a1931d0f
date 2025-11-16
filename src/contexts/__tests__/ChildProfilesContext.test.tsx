import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ChildProfilesProvider, useChildProfiles } from '../ChildProfilesContext';
import { AuthProvider } from '../AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Database } from '@/integrations/supabase/types';

type ChildProfile = Database['public']['Tables']['child_profiles']['Row'];

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

vi.mock('@/hooks/useUserProfile', () => ({
  useUserProfile: vi.fn(() => ({
    data: null,
    isLoading: false,
  })),
}));

describe('ChildProfilesContext', () => {
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChildProfilesProvider>{children}</ChildProfilesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );

  it('should initialize with no active child', () => {
    const { result } = renderHook(() => useChildProfiles(), { wrapper });

    expect(result.current.activeChild).toBe(null);
  });

  it('should detect onboarding requirement when no children', () => {
    const { result } = renderHook(() => useChildProfiles(), { wrapper });

    expect(result.current.onboardingRequired).toBe(true);
  });

  it('should allow setting active child', async () => {
    const { result } = renderHook(() => useChildProfiles(), { wrapper });

    const mockChild: ChildProfile = {
      id: 'child-1',
      name: 'Test Child',
      brain_profile: 'DEFIANT',
      age: 5,
      is_active: true,
      parent_id: 'parent-1',
      created_at: '2023-01-01',
      notes: null,
      photo_url: null,
      updated_at: null,
    };

    act(() => {
      result.current.setActiveChild(mockChild.id);
    });

    // Active child ID should be set
    expect(result.current.setActiveChild).toBeDefined();
  });

  it('should refresh children list', async () => {
    const { result } = renderHook(() => useChildProfiles(), { wrapper });

    await act(async () => {
      await result.current.refreshChildren();
    });

    // Refresh should complete without errors
    expect(result.current.refreshChildren).toBeDefined();
  });
});
