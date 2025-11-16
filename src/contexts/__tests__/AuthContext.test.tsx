import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { User } from '@supabase/supabase-js';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

// Mock useUserProfile hook
vi.mock('@/hooks/useUserProfile', () => ({
  useUserProfile: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
}));

describe('AuthContext', () => {
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
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );

  it('should initialize with loading state', () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
  });

  it('should set user when session exists', async () => {
    const mockUser: Partial<User> = {
      id: 'test-user-id',
      email: 'test@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      created_at: '2023-01-01',
      app_metadata: {},
      user_metadata: {},
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: mockUser as User,
          access_token: 'token',
          refresh_token: 'refresh',
          expires_in: 3600,
          expires_at: Date.now() + 3600000,
          token_type: 'bearer',
        },
      },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for loading to finish
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(result.current.user).toBeTruthy();
    expect(result.current.user?.id).toBe('test-user-id');
  });

  it('should handle sign out', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.signOut();

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('should handle session errors gracefully', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: {
        message: 'Session error',
        name: 'AuthError',
        status: 401,
      } as any,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(result.current.user).toBe(null);
  });
});
