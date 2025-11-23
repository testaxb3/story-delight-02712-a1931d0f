import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import type { Database } from '@/integrations/supabase/types';

type ScriptFeedback = Database['public']['Tables']['script_feedback']['Row'];
type ScriptFeedbackInsert = Database['public']['Tables']['script_feedback']['Insert'];
type FeedbackOutcome = 'worked' | 'progress' | 'not_yet';

interface FeedbackStats {
  totalCount: number;
  workedCount: number;
  progressCount: number;
  notYetCount: number;
  successRate: number; // Percentage (0-100)
}

export function useFeedback() {
  const { user } = useAuth();
  const { activeChild } = useChildProfiles();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Submit feedback for a script
   */
  const submitFeedback = useCallback(
    async (scriptId: string, outcome: FeedbackOutcome, notes?: string) => {
      if (!user?.id) {
        throw new Error('User required to submit feedback');
      }

      setSubmitting(true);
      try {
        const payload: ScriptFeedbackInsert = {
          user_id: user.id,
          child_id: activeChild?.id || null, // Optional - can be null for backwards compatibility
          script_id: scriptId,
          outcome,
          notes: notes?.trim() || null,
        };

        const { data, error } = await supabase
          .from('script_feedback')
          .insert(payload)
          .select()
          .single();

        if (error) throw error;

        return data as ScriptFeedback;
      } catch (error) {
        console.error('Failed to submit feedback:', error);
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [user?.profileId, activeChild?.id]
  );

  /**
   * Get feedback statistics for a specific script
   */
  const getFeedbackStats = useCallback(
    async (scriptId: string): Promise<FeedbackStats> => {
      if (!user?.id) {
        return {
          totalCount: 0,
          workedCount: 0,
          progressCount: 0,
          notYetCount: 0,
          successRate: 0,
        };
      }

      setLoading(true);
      try {
        let query = supabase
          .from('script_feedback')
          .select('outcome')
          .eq('script_id', scriptId)
          .eq('user_id', user.id);

        // Filter by child_id if available
        if (activeChild?.id) {
          query = query.eq('child_id', activeChild.id);
        }

        const { data, error } = await query;

        if (error) throw error;

        const feedback = data || [];
        const totalCount = feedback.length;
        const workedCount = feedback.filter((f) => f.outcome === 'worked').length;
        const progressCount = feedback.filter((f) => f.outcome === 'progress').length;
        const notYetCount = feedback.filter((f) => f.outcome === 'not_yet').length;
        const successRate = totalCount > 0 ? (workedCount / totalCount) * 100 : 0;

        return {
          totalCount,
          workedCount,
          progressCount,
          notYetCount,
          successRate,
        };
      } catch (error) {
        console.error('Failed to get feedback stats:', error);
        return {
          totalCount: 0,
          workedCount: 0,
          progressCount: 0,
          notYetCount: 0,
          successRate: 0,
        };
      } finally {
        setLoading(false);
      }
    },
    [user?.id, activeChild?.id]
  );

  /**
   * Get user's complete feedback history for current child
   */
  const getUserFeedbackHistory = useCallback(async (): Promise<ScriptFeedback[]> => {
    if (!user?.id) {
      return [];
    }

    setLoading(true);
    try {
      let query = supabase
        .from('script_feedback')
        .select('*')
        .eq('user_id', user.id);

      // Filter by child_id if available
      if (activeChild?.id) {
        query = query.eq('child_id', activeChild.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []) as ScriptFeedback[];
    } catch (error) {
      console.error('Failed to get feedback history:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.id, activeChild?.id]);

  /**
   * Get feedback for a specific script
   */
  const getScriptFeedback = useCallback(
    async (scriptId: string): Promise<ScriptFeedback[]> => {
      if (!user?.id) {
        return [];
      }

      setLoading(true);
      try {
        let query = supabase
          .from('script_feedback')
          .select('*')
          .eq('script_id', scriptId)
          .eq('user_id', user.id);

        // Filter by child_id if available
        if (activeChild?.id) {
          query = query.eq('child_id', activeChild.id);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []) as ScriptFeedback[];
      } catch (error) {
        console.error('Failed to get script feedback:', error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [user?.id, activeChild?.id]
  );

  /**
   * Get aggregated feedback stats across all scripts for recommendations
   */
  const getAllFeedbackStats = useCallback(async () => {
    if (!user?.id) {
      return new Map<string, FeedbackStats>();
    }

    setLoading(true);
    try {
      let query = supabase
        .from('script_feedback')
        .select('script_id, outcome')
        .eq('user_id', user.id);

      // Filter by child_id if available
      if (activeChild?.id) {
        query = query.eq('child_id', activeChild.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      const statsMap = new Map<string, FeedbackStats>();
      const feedback = data || [];

      // Group by script_id
      const grouped = feedback.reduce((acc, item) => {
        if (!acc[item.script_id]) {
          acc[item.script_id] = [];
        }
        acc[item.script_id].push(item.outcome);
        return acc;
      }, {} as Record<string, string[]>);

      // Calculate stats for each script
      Object.entries(grouped).forEach(([scriptId, outcomes]) => {
        const totalCount = outcomes.length;
        const workedCount = outcomes.filter((o) => o === 'worked').length;
        const progressCount = outcomes.filter((o) => o === 'progress').length;
        const notYetCount = outcomes.filter((o) => o === 'not_yet').length;
        const successRate = totalCount > 0 ? (workedCount / totalCount) * 100 : 0;

        statsMap.set(scriptId, {
          totalCount,
          workedCount,
          progressCount,
          notYetCount,
          successRate,
        });
      });

      return statsMap;
    } catch (error) {
      console.error('Failed to get all feedback stats:', error);
      return new Map<string, FeedbackStats>();
    } finally {
      setLoading(false);
    }
  }, [user?.id, activeChild?.id]);

  return {
    submitFeedback,
    getFeedbackStats,
    getUserFeedbackHistory,
    getScriptFeedback,
    getAllFeedbackStats,
    submitting,
    loading,
  };
}
