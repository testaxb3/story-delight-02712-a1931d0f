import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavoriteScripts } from './useFavoriteScripts';
import { supabase } from '@/integrations/supabase/client';

// Helper to wait for hook updates
const waitFor = async (callback: () => boolean | void, timeout = 3000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const result = callback();
      if (result !== false) return;
    } catch (e) {
      // continue
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error('waitFor timeout');
};

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    })),
  },
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

describe('useFavoriteScripts', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@test.com',
    profileId: 'profile-123',
    user_metadata: {},
    premium: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should load favorites for authenticated user', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      session: {} as any,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
      refreshProfile: vi.fn(),
    } as any);

    const mockData = [
      { script_id: 'script-1' },
      { script_id: 'script-2' },
    ];

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: mockData,
        error: null,
      }),
    } as any);

    const { result } = renderHook(() => useFavoriteScripts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.favorites).toEqual(['script-1', 'script-2']);
  });

  it('should return empty favorites for unauthenticated user', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
      refreshProfile: vi.fn(),
    } as any);

    const { result } = renderHook(() => useFavoriteScripts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.favorites).toEqual([]);
  });

  it('should add favorite successfully', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      session: {} as any,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
      refreshProfile: vi.fn(),
    } as any);

    // Mock initial load
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
      insert: vi.fn().mockResolvedValue({
        error: null,
      }),
    } as any);

    const { result } = renderHook(() => useFavoriteScripts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Add favorite
    await act(async () => {
      const success = await result.current.toggleFavorite('script-123');
      expect(success).toBe(true);
    });

    expect(result.current.favorites).toContain('script-123');
    expect(toast.success).toHaveBeenCalledWith('Added to favorites ⭐');
  });

  it('should remove favorite successfully', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      session: {} as any,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
      refreshProfile: vi.fn(),
    } as any);

    // Mock initial load with one favorite
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: [{ script_id: 'script-123' }],
        error: null,
      }),
      delete: vi.fn().mockReturnThis(),
    } as any);

    const { result } = renderHook(() => useFavoriteScripts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.favorites).toContain('script-123');

    // Remove favorite
    await act(async () => {
      const success = await result.current.toggleFavorite('script-123');
      expect(success).toBe(true);
    });

    expect(result.current.favorites).not.toContain('script-123');
    expect(toast.success).toHaveBeenCalledWith('Removed from favorites');
  });

  it('should check if script is favorite', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      session: {} as any,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
      refreshProfile: vi.fn(),
    } as any);

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: [{ script_id: 'script-123' }],
        error: null,
      }),
    } as any);

    const { result } = renderHook(() => useFavoriteScripts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isFavorite('script-123')).toBe(true);
    expect(result.current.isFavorite('script-456')).toBe(false);
  });

  it('should show error toast when toggling favorite without auth', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      session: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
      refreshProfile: vi.fn(),
    } as any);

    const { result } = renderHook(() => useFavoriteScripts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      const success = await result.current.toggleFavorite('script-123');
      expect(success).toBe(false);
    });

    expect(toast.error).toHaveBeenCalledWith('Please sign in to save favorites');
  });

  it('should fallback to localStorage on database error', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser,
      session: {} as any,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      updateProfile: vi.fn(),
      refreshProfile: vi.fn(),
    } as any);

    // Set localStorage fallback
    localStorage.setItem(`favorites_${mockUser.profileId}`, JSON.stringify(['script-789']));

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST205', message: 'Table not found' },
      }),
    } as any);

    const { result } = renderHook(() => useFavoriteScripts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.favorites).toEqual(['script-789']);
  });
});
