import React, { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { toast } from '@/components/ui/use-toast';
import { t } from '@/hooks/useTranslation';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

export interface ChildRecommendation {
  scriptId: string;
  title: string;
  category: string;
  profile: string | null;
  tags: string[];
  estimatedTimeMinutes: number | null;
  successScore: number | null;
  feedbackCount: number | null;
  lastUsedAt: string | null;
}

interface UseChildRecommendationsResult {
  recommendations: ChildRecommendation[];
  loading: boolean;
  hasPersonalizedHistory: boolean;
  refresh: () => Promise<void>;
}

export function useChildRecommendations(limit = 5): UseChildRecommendationsResult {
  const { user } = useAuth();
  const { activeChild } = useChildProfiles();
  const [recommendations, setRecommendations] = useState<ChildRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    if (!activeChild?.brain_profile || !user?.profileId) {
      setRecommendations([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Step 1: Get all scripts for this brain profile
      const { data: scriptsData, error: scriptsError } = await supabase
        .from('scripts')
        .select('id, title, category, profile, estimated_time_minutes, tags')
        .eq('profile', activeChild.brain_profile);

      if (scriptsError) throw scriptsError;

      const scripts = scriptsData || [];

      // Step 2: Get feedback stats for these scripts
      let feedbackQuery = supabase
        .from('script_feedback')
        .select('script_id, outcome, created_at')
        .eq('user_id', user.profileId);

      // Filter by child_id if available
      if (activeChild?.id) {
        feedbackQuery = feedbackQuery.eq('child_id', activeChild.id);
      }

      const { data: feedbackData, error: feedbackError } = await feedbackQuery;

      if (feedbackError) {
        console.error('Failed to load feedback data:', feedbackError);
        // Continue without feedback data
      }

      // Step 3: Calculate success scores for each script
      const feedbackMap = new Map<string, {
        successScore: number;
        feedbackCount: number;
        lastUsedAt: string | null;
      }>();

      if (feedbackData) {
        const grouped = feedbackData.reduce((acc, item) => {
          if (!acc[item.script_id]) {
            acc[item.script_id] = [];
          }
          acc[item.script_id].push(item);
          return acc;
        }, {} as Record<string, typeof feedbackData>);

        Object.entries(grouped).forEach(([scriptId, feedbacks]) => {
          const workedCount = feedbacks.filter(f => f.outcome === 'worked').length;
          const totalCount = feedbacks.length;
          const successScore = totalCount > 0 ? (workedCount / totalCount) * 100 : 0;
          const lastUsedAt = feedbacks.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0]?.created_at || null;

          feedbackMap.set(scriptId, {
            successScore,
            feedbackCount: workedCount,
            lastUsedAt,
          });
        });
      }

      // Step 4: Combine scripts with feedback data and sort
      const formatted = scripts.map((script) => {
        const feedback = feedbackMap.get(script.id) || {
          successScore: null,
          feedbackCount: null,
          lastUsedAt: null,
        };

        return {
          scriptId: script.id,
          title: script.title || 'Unknown Script',
          category: script.category || 'Uncategorized',
          profile: script.profile || null,
          tags: (script.tags as string[]) || [],
          estimatedTimeMinutes: script.estimated_time_minutes || null,
          successScore: feedback.successScore,
          feedbackCount: feedback.feedbackCount,
          lastUsedAt: feedback.lastUsedAt,
        };
      });

      // Step 5: Sort by success rate, then by feedback count
      const sorted = formatted.sort((a, b) => {
        // Prioritize scripts with feedback
        if (a.successScore !== null && b.successScore === null) return -1;
        if (a.successScore === null && b.successScore !== null) return 1;

        // If both have feedback, sort by success score
        if (a.successScore !== null && b.successScore !== null) {
          if (a.successScore !== b.successScore) {
            return b.successScore - a.successScore;
          }
          // If success scores are equal, sort by feedback count
          return (b.feedbackCount || 0) - (a.feedbackCount || 0);
        }

        // If neither has feedback, keep original order
        return 0;
      });

      setRecommendations(sorted.slice(0, limit));
    } catch (error) {
      console.error('Failed to load recommendations', error);
      toast({
        title: t().recommendations.errors.loadFailed,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [activeChild?.brain_profile, activeChild?.id, user?.profileId, limit]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const hasPersonalizedHistory = recommendations.some(r => r.successScore !== null);

  return {
    recommendations,
    loading,
    hasPersonalizedHistory,
    refresh: fetchRecommendations,
  };
}

