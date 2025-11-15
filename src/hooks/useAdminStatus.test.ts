import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAdminStatus } from './useAdminStatus';
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
    rpc: vi.fn(),
  },
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '@/contexts/AuthContext';

describe('useAdminStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return isAdmin false and checking false when no user', async () => {
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

    const { result } = renderHook(() => useAdminStatus());

    await waitFor(() => {
      expect(result.current.checking).toBe(false);
    });

    expect(result.current.isAdmin).toBe(false);
  });

  it('should check admin status when user is present', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'admin@test.com',
      profileId: 'profile-123',
      user_metadata: {},
      premium: true,
    };

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

    vi.mocked(supabase.rpc).mockResolvedValue({
      data: true,
      error: null,
    } as any);

    const { result } = renderHook(() => useAdminStatus());

    // Initially checking
    expect(result.current.checking).toBe(true);

    await waitFor(() => {
      expect(result.current.checking).toBe(false);
    });

    expect(result.current.isAdmin).toBe(true);
    expect(supabase.rpc).toHaveBeenCalledWith('is_admin');
  });

  it('should set isAdmin false on RPC error', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'user@test.com',
      profileId: 'profile-123',
      user_metadata: {},
      premium: false,
    };

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

    vi.mocked(supabase.rpc).mockResolvedValue({
      data: null,
      error: { message: 'RPC error' },
    } as any);

    const { result } = renderHook(() => useAdminStatus());

    await waitFor(() => {
      expect(result.current.checking).toBe(false);
    });

    expect(result.current.isAdmin).toBe(false);
  });

  it('should handle non-admin user correctly', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'user@test.com',
      profileId: 'profile-123',
      user_metadata: {},
      premium: false,
    };

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

    vi.mocked(supabase.rpc).mockResolvedValue({
      data: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useAdminStatus());

    await waitFor(() => {
      expect(result.current.checking).toBe(false);
    });

    expect(result.current.isAdmin).toBe(false);
  });

  it('should cleanup on unmount', () => {
    const mockUser = {
      id: 'user-123',
      email: 'admin@test.com',
      profileId: 'profile-123',
      user_metadata: {},
      premium: true,
    };

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

    vi.mocked(supabase.rpc).mockResolvedValue({
      data: true,
      error: null,
    } as any);

    const { unmount } = renderHook(() => useAdminStatus());
    
    // Unmount should not throw error
    expect(() => unmount()).not.toThrow();
  });
});
