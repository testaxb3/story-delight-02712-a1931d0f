import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WeeklyWin {
  type: 'script' | 'streak' | 'improvement';
  title: string;
  metric: string;
  icon: string;
  color: string;
}

export function useWeeklyWins(userId: string | undefined) {
  const [wins, setWins] = useState<WeeklyWin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyWins = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Fetch scripts used this week with details
        const { data: weeklyScripts, error: scriptsError } = await supabase
          .from('script_usage')
          .select(`
            script_id,
            used_at,
            scripts (
              title,
              category,
              profile
            )
          `)
          .eq('user_id', userId)
          .gte('used_at', sevenDaysAgo.toISOString())
          .order('used_at', { ascending: false });

        if (scriptsError) throw scriptsError;

        // Fetch tracker days this week for improvements
        const { data: trackerDays, error: trackerError } = await supabase
          .from('tracker_days')
          .select('completed, stress_level, completed_at')
          .eq('user_id', userId)
          .eq('completed', true)
          .gte('date', sevenDaysAgo.toISOString().split('T')[0])
          .order('completed_at', { ascending: true });

        if (trackerError) throw trackerError;

        const newWins: WeeklyWin[] = [];

        // Win 1: Most used script
        if (weeklyScripts && weeklyScripts.length > 0) {
          const scriptCounts = weeklyScripts.reduce((acc: Record<string, { count: number; title: string }>, item: any) => {
            const scriptId = item.script_id;
            const scriptTitle = item.scripts?.title || 'Unknown Script';
            if (!acc[scriptId]) {
              acc[scriptId] = { count: 0, title: scriptTitle };
            }
            acc[scriptId].count++;
            return acc;
          }, {});

          const mostUsed = Object.entries(scriptCounts).reduce((max, [id, data]) => 
            data.count > max.count ? { id, ...data } : max
          , { id: '', count: 0, title: '' });

          if (mostUsed.count >= 2) {
            newWins.push({
              type: 'script',
              title: mostUsed.title,
              metric: `Used ${mostUsed.count}x this week`,
              icon: '✅',
              color: 'text-success'
            });
          }
        }

        // Win 2: Consecutive days streak this week
        if (trackerDays && trackerDays.length >= 3) {
          newWins.push({
            type: 'streak',
            title: `${trackerDays.length}-Day Streak`,
            metric: 'This week',
            icon: '🔥',
            color: 'text-warning'
          });
        }

        // Win 3: Stress improvement
        if (trackerDays && trackerDays.length >= 2) {
          const stressLevels = trackerDays
            .filter((d: any) => d.stress_level !== null)
            .map((d: any) => d.stress_level);

          if (stressLevels.length >= 2) {
            const firstHalf = stressLevels.slice(0, Math.floor(stressLevels.length / 2));
            const secondHalf = stressLevels.slice(Math.floor(stressLevels.length / 2));

            const avgFirst = firstHalf.reduce((a: number, b: number) => a + b, 0) / firstHalf.length;
            const avgSecond = secondHalf.reduce((a: number, b: number) => a + b, 0) / secondHalf.length;

            const improvement = Math.round(avgFirst - avgSecond);

            if (improvement > 0) {
              newWins.push({
                type: 'improvement',
                title: 'Stress Reduced',
                metric: `Down ${improvement} points`,
                icon: '📉',
                color: 'text-secondary'
              });
            }
          }
        }

        // Fallback: If no wins, show total scripts used
        if (newWins.length === 0 && weeklyScripts && weeklyScripts.length > 0) {
          newWins.push({
            type: 'script',
            title: 'Getting Started',
            metric: `${weeklyScripts.length} scripts used`,
            icon: '🎯',
            color: 'text-primary'
          });
        }

        setWins(newWins);
      } catch (error) {
        console.error('Error fetching weekly wins:', error);
        setWins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyWins();
  }, [userId]);

  return { wins, loading };
}
