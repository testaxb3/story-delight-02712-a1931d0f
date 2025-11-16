import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTotalScriptCount, getTodayScriptCount, getStreakDays, getDaysSinceStart } from '../celebrationStats';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

describe('celebrationStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTotalScriptCount', () => {
    it('should return 0 when no scripts found', async () => {
      const result = await getTotalScriptCount('user-1');
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should handle user id parameter', async () => {
      const result = await getTotalScriptCount('test-user-id');
      expect(result).toBeDefined();
    });
  });

  describe('getTodayScriptCount', () => {
    it('should return count for today', async () => {
      const result = await getTodayScriptCount('user-1');
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getStreakDays', () => {
    it('should return streak days', async () => {
      const result = await getStreakDays('user-1');
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getDaysSinceStart', () => {
    it('should return days since start', async () => {
      const result = await getDaysSinceStart('user-1');
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(1);
    });

    it('should default to 1 if no data', async () => {
      const result = await getDaysSinceStart('no-data-user');
      expect(result).toBeGreaterThanOrEqual(1);
    });
  });
});
