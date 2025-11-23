import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

export interface RecentScript {
  id: string;
  scriptTitle: string;
  scriptCategory: string;
  usedAt: string;
  timeAgo: string;
  profile: string | null;
}

export function useRecentScriptUsage(userId: string | undefined, limit: number = 5) {
  const [recentScripts, setRecentScripts] = useState<RecentScript[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentUsage = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('script_usage')
          .select(`
            id,
            used_at,
            scripts (
              title,
              category,
              profile
            )
          `)
          .eq('user_id', userId)
          .order('used_at', { ascending: false })
          .limit(limit);

        if (error) throw error;

        const formattedScripts: RecentScript[] = (data || []).map((item: any) => ({
          id: item.id,
          scriptTitle: item.scripts?.title || 'Unknown Script',
          scriptCategory: item.scripts?.category || 'general',
          usedAt: item.used_at,
          timeAgo: formatDistanceToNow(new Date(item.used_at), { addSuffix: true }),
          profile: item.scripts?.profile || null
        }));

        setRecentScripts(formattedScripts);
      } catch (error) {
        console.error('Error fetching recent script usage:', error);
        setRecentScripts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentUsage();
  }, [userId, limit]);

  return { recentScripts, loading };
}
