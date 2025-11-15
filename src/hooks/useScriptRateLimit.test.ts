import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScriptRateLimit } from './useScriptRateLimit';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    log: vi.fn(),
  },
}));

describe('useScriptRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow access when user has remaining attempts', async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: {
        canAccess: true,
        remaining: 45,
        limit: 50,
        unlimited: false,
        used: 5,
        message: 'You have 45 script accesses remaining today',
      },
      error: null,
    } as any);

    const { result } = renderHook(() => useScriptRateLimit());

    let canAccess = false;
    await act(async () => {
      canAccess = await result.current.checkRateLimit();
    });

    expect(canAccess).toBe(true);
    expect(result.current.limitInfo?.canAccess).toBe(true);
    expect(result.current.limitInfo?.remaining).toBe(45);
  });

  it('should deny access when rate limit is reached', async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: {
        canAccess: false,
        remaining: 0,
        limit: 50,
        unlimited: false,
        used: 50,
        message: 'Daily limit reached. Upgrade to premium for unlimited access.',
      },
      error: null,
    } as any);

    const { result } = renderHook(() => useScriptRateLimit());

    let canAccess = true;
    await act(async () => {
      canAccess = await result.current.checkRateLimit();
    });

    expect(canAccess).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      'Daily limit reached. Upgrade to premium for unlimited access.',
      expect.any(Object)
    );
  });

  it('should show warning when approaching limit (10 remaining)', async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: {
        canAccess: true,
        remaining: 10,
        limit: 50,
        unlimited: false,
        used: 40,
        message: 'You have 10 script accesses remaining today',
      },
      error: null,
    } as any);

    const { result } = renderHook(() => useScriptRateLimit());

    await act(async () => {
      await result.current.checkRateLimit();
    });

    expect(toast.warning).toHaveBeenCalledWith(
      'You have 10 script accesses remaining today.',
      expect.any(Object)
    );
  });

  it('should not show warning for unlimited users', async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: {
        canAccess: true,
        remaining: -1,
        limit: -1,
        unlimited: true,
        message: 'Unlimited access',
      },
      error: null,
    } as any);

    const { result } = renderHook(() => useScriptRateLimit());

    await act(async () => {
      await result.current.checkRateLimit();
    });

    expect(toast.warning).not.toHaveBeenCalled();
  });

  it('should fail open on RPC error', async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: null,
      error: { message: 'RPC error' },
    } as any);

    const { result } = renderHook(() => useScriptRateLimit());

    let canAccess = false;
    await act(async () => {
      canAccess = await result.current.checkRateLimit();
    });

    // Should allow access on error (fail open)
    expect(canAccess).toBe(true);
  });

  it('should get rate limit info without showing toasts', async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: {
        canAccess: true,
        remaining: 30,
        limit: 50,
        unlimited: false,
        used: 20,
        message: 'You have 30 script accesses remaining today',
      },
      error: null,
    } as any);

    const { result } = renderHook(() => useScriptRateLimit());

    let info = null;
    await act(async () => {
      info = await result.current.getRateLimitInfo();
    });

    expect(info).toEqual({
      canAccess: true,
      remaining: 30,
      limit: 50,
      unlimited: false,
      used: 20,
      message: 'You have 30 script accesses remaining today',
    });

    // Should not show any toasts
    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.warning).not.toHaveBeenCalled();
  });

  it('should update checking state correctly', async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: {
        canAccess: true,
        remaining: 40,
        limit: 50,
        unlimited: false,
      },
      error: null,
    } as any);

    const { result } = renderHook(() => useScriptRateLimit());

    expect(result.current.checking).toBe(false);

    await act(async () => {
      await result.current.checkRateLimit();
    });

    await waitFor(() => !result.current.checking);

    expect(result.current.checking).toBe(false);
  });

  it('should return null on getRateLimitInfo error', async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: null,
      error: { message: 'Error' },
    } as any);

    const { result } = renderHook(() => useScriptRateLimit());

    let info = undefined;
    await act(async () => {
      info = await result.current.getRateLimitInfo();
    });

    expect(info).toBe(null);
  });
});
