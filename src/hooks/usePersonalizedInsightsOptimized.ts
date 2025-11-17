import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Insight {
  type: 'pattern' | 'suggestion' | 'achievement';
  title: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * Optimized hook to generate personalized insights using React Query
 * Reduces database queries and provides caching for better performance
 */
export function usePersonalizedInsightsOptimized(userId: string | undefined, brainProfile: string | null) {
  const { data: insights = [], isLoading } = useQuery({
    queryKey: ['personalized-insights', userId, brainProfile],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // ✅ PERFORMANCE: Run queries in parallel instead of sequentially
        const [weeklyUsageResult, monthlyUsageResult, trackerDataResult] = await Promise.all([
          supabase
            .from('script_usage')
            .select('used_at, script_id, scripts(category, profile)')
            .eq('user_id', userId)
            .gte('used_at', sevenDaysAgo.toISOString()),

          supabase
            .from('script_usage')
            .select('used_at')
            .eq('user_id', userId)
            .gte('used_at', thirtyDaysAgo.toISOString()),

          supabase
            .from('tracker_days')
            .select('completed, stress_level, completed_at')
            .eq('user_id', userId)
            .eq('completed', true)
            .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        ]);

        const weeklyUsage = weeklyUsageResult.data;
        const monthlyUsage = monthlyUsageResult.data;
        const trackerData = trackerDataResult.data;

        const newInsights: Insight[] = [];

        // Insight 1: Usage consistency
        if (weeklyUsage && weeklyUsage.length >= 4) {
          const usageDays = new Set(
            weeklyUsage.map((u: any) => new Date(u.used_at).toDateString())
          );

          if (usageDays.size >= 4) {
            newInsights.push({
              type: 'achievement',
              title: 'Consistency Champion',
              description: `You've used scripts ${usageDays.size} different days this week! Consistency builds lasting change.`,
              icon: '🏆',
              color: 'text-warning'
            });
          }
        }

        // Insight 2: Category preference pattern
        if (weeklyUsage && weeklyUsage.length >= 3) {
          const categories = weeklyUsage
            .map((u: any) => u.scripts?.category)
            .filter(Boolean);

          const categoryCounts = categories.reduce((acc: Record<string, number>, cat: string) => {
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
          }, {});

          const topCategory = Object.entries(categoryCounts).reduce((max, [cat, count]) =>
            (count as number) > max.count ? { category: cat, count: count as number } : max
          , { category: '', count: 0 });

          if (topCategory.count >= 2) {
            newInsights.push({
              type: 'pattern',
              title: 'Pattern Detected',
              description: `You're focusing on ${topCategory.category} strategies. This targeted approach accelerates results.`,
              icon: '🎯',
              color: 'text-primary'
            });
          }
        }

        // Insight 3: Time-based suggestion
        const hour = now.getHours();
        if (hour >= 6 && hour < 9 && weeklyUsage && weeklyUsage.length > 0) {
          const morningScripts = weeklyUsage.filter((u: any) => {
            const usedHour = new Date(u.used_at).getHours();
            return usedHour >= 6 && usedHour < 9;
          });

          if (morningScripts.length < 2) {
            newInsights.push({
              type: 'suggestion',
              title: 'Morning Win Opportunity',
              description: 'Try a morning script today. Starting the day right prevents 70% of afternoon meltdowns.',
              icon: '☀️',
              color: 'text-accent'
            });
          }
        }

        // Insight 4: Stress improvement
        if (trackerData && trackerData.length >= 3) {
          const stressLevels = trackerData
            .filter((d: any) => d.stress_level !== null)
            .map((d: any) => d.stress_level);

          if (stressLevels.length >= 3) {
            const recent = stressLevels.slice(-2);
            const older = stressLevels.slice(0, -2);

            const avgRecent = recent.reduce((a: number, b: number) => a + b, 0) / recent.length;
            const avgOlder = older.reduce((a: number, b: number) => a + b, 0) / older.length;

            if (avgOlder - avgRecent > 0.5) {
              newInsights.push({
                type: 'achievement',
                title: 'Stress Trending Down',
                description: `Your stress levels are dropping. You're creating real change in your nervous system.`,
                icon: '📉',
                color: 'text-success'
              });
            }
          }
        }

        // Insight 5: Growth suggestion based on usage
        if (monthlyUsage && monthlyUsage.length >= 10) {
          newInsights.push({
            type: 'suggestion',
            title: 'Ready for Advanced Strategies',
            description: `You've used ${monthlyUsage.length} scripts this month. Time to explore advanced techniques in the Masterclass section.`,
            icon: '⚡',
            color: 'text-secondary'
          });
        }

        // Fallback insight if none generated
        if (newInsights.length === 0 && brainProfile) {
          const profileInsights: Record<string, Insight> = {
            INTENSE: {
              type: 'suggestion',
              title: 'Co-regulation is Key',
              description: 'INTENSE kids need your calm presence most. Practice regulating yourself first.',
              icon: '🌊',
              color: 'text-primary'
            },
            DISTRACTED: {
              type: 'suggestion',
              title: 'Shorter is Better',
              description: 'DISTRACTED kids respond best to brief, engaging interventions. Keep scripts under 2 minutes.',
              icon: '⚡',
              color: 'text-accent'
            },
            DEFIANT: {
              type: 'suggestion',
              title: 'Connection Before Correction',
              description: 'DEFIANT kids need to feel heard before they cooperate. Lead with empathy.',
              icon: '🤝',
              color: 'text-secondary'
            }
          };

          if (brainProfile in profileInsights) {
            newInsights.push(profileInsights[brainProfile as keyof typeof profileInsights]);
          }
        }

        return newInsights.slice(0, 2); // Show max 2 insights
      } catch (error) {
        console.error('Error generating insights:', error);
        return [];
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes - insights don't change frequently
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return { insights, loading: isLoading };
}
